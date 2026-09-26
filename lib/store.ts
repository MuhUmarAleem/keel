import { randomUUID } from "node:crypto";
import { execute, queryAll, queryOne } from "./db";
import { BadRequestError, HighlightNotFoundError, MeetingNotFoundError } from "./errors";
import type {
  ActionItem,
  Chapter,
  Highlight,
  Meeting,
  Person,
  Platform,
  SearchHit,
  SummaryTemplate,
  TranscriptLine,
  UpcomingEvent,
} from "./types";

type Row = Record<string, string | number | bigint | null>;

function str(row: Row, key: string) {
  const value = row[key];
  return value == null ? "" : String(value);
}

function num(row: Row, key: string) {
  return Number(row[key] ?? 0);
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

const emptyTemplates: SummaryTemplate[] = [
  { id: "general", label: "General", blurb: "", sections: [] },
];

function mapPerson(row: Row): Person {
  const company = str(row, "company");
  return {
    id: str(row, "id"),
    name: str(row, "name"),
    role: str(row, "role"),
    ...(company ? { company } : {}),
    color: str(row, "color"),
    ...(num(row, "is_you") === 1 ? { you: true } : {}),
  };
}

function mapLine(row: Row): TranscriptLine {
  return {
    id: str(row, "id"),
    speakerId: str(row, "speaker_id"),
    start: num(row, "start_sec"),
    end: num(row, "end_sec"),
    text: str(row, "text"),
  };
}

function mapAction(row: Row): ActionItem {
  const due = str(row, "due");
  return {
    id: str(row, "id"),
    text: str(row, "text"),
    ownerId: str(row, "owner_id"),
    ...(due ? { due } : {}),
    done: num(row, "done") === 1,
    start: num(row, "start_sec"),
  };
}

function mapHighlight(row: Row): Highlight {
  const note = str(row, "note");
  return {
    id: str(row, "id"),
    title: str(row, "title"),
    ...(note ? { note } : {}),
    start: num(row, "start_sec"),
    end: num(row, "end_sec"),
    createdBy: str(row, "created_by"),
    shareId: str(row, "share_id"),
  };
}

export function listPeople(): Person[] {
  return queryAll("SELECT * FROM people ORDER BY name").map(mapPerson);
}

export function listUpcoming(): UpcomingEvent[] {
  return queryAll("SELECT * FROM upcoming_events ORDER BY starts_at").map((row) => ({
    id: str(row, "id"),
    title: str(row, "title"),
    startsAt: str(row, "starts_at"),
    duration: num(row, "duration"),
    platform: str(row, "platform") as Platform,
    attendees: parseJson<string[]>(str(row, "attendees_json"), []),
    autoJoin: num(row, "auto_join") === 1,
  }));
}

function attendeesOf(meetingId: string) {
  return queryAll(
    "SELECT person_id FROM meeting_attendees WHERE meeting_id = ? ORDER BY position",
    meetingId
  ).map((row) => str(row, "person_id"));
}

function linesOf(meetingId: string) {
  return queryAll(
    "SELECT * FROM transcripts WHERE meeting_id = ? ORDER BY seq",
    meetingId
  ).map(mapLine);
}

export function listActionItems(meetingId: string) {
  return queryAll(
    "SELECT * FROM action_items WHERE meeting_id = ? ORDER BY start_sec, id",
    meetingId
  ).map(mapAction);
}

function highlightsOf(meetingId: string) {
  return queryAll(
    "SELECT * FROM highlights WHERE meeting_id = ? ORDER BY created_at DESC",
    meetingId
  ).map(mapHighlight);
}

function assemble(row: Row, withTranscript: boolean): Meeting {
  const id = str(row, "id");
  const summary = queryOne("SELECT * FROM summaries WHERE meeting_id = ?", id);
  const templates = summary
    ? parseJson<SummaryTemplate[]>(str(summary, "templates_json"), emptyTemplates)
    : emptyTemplates;
  const chapters = summary ? parseJson<Chapter[]>(str(summary, "chapters_json"), []) : [];
  return {
    id,
    title: str(row, "title"),
    startedAt: str(row, "started_at"),
    duration: num(row, "duration"),
    platform: str(row, "platform") as Platform,
    capture: "stubbed",
    hostId: str(row, "host_id"),
    attendees: attendeesOf(id),
    tags: parseJson<string[]>(str(row, "tags_json"), []),
    overview: summary ? str(summary, "overview") : "",
    chapters,
    transcript: withTranscript ? linesOf(id) : [],
    highlights: highlightsOf(id),
    actionItems: listActionItems(id),
    templates: templates.length ? templates : emptyTemplates,
    defaultTemplate: summary ? str(summary, "default_template") : "general",
  };
}

export function meetingExists(id: string) {
  return Boolean(queryOne("SELECT id FROM meetings WHERE id = ?", id));
}

export function listMeetings() {
  return queryAll("SELECT * FROM meetings ORDER BY started_at DESC").map((row) => assemble(row, false));
}

export function getMeeting(id: string) {
  const row = queryOne("SELECT * FROM meetings WHERE id = ?", id);
  return row ? assemble(row, true) : null;
}

export function getSharedClip(shareId: string) {
  const row = queryOne("SELECT * FROM highlights WHERE share_id = ?", shareId);
  if (!row) return null;
  const meeting = getMeeting(str(row, "meeting_id"));
  if (!meeting) return null;
  return { meeting, highlight: mapHighlight(row) };
}

export function transcriptCorpus(meetingId?: string) {
  const meetings = meetingId
    ? queryAll("SELECT * FROM meetings WHERE id = ?", meetingId)
    : queryAll("SELECT * FROM meetings ORDER BY started_at");
  return meetings.map((row) => {
    const id = str(row, "id");
    return {
      id,
      title: str(row, "title"),
      lines: linesOf(id),
    };
  });
}

function personName(id: string) {
  return str(queryOne("SELECT name FROM people WHERE id = ?", id) ?? { name: id }, "name");
}

function tokens(q: string) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((part) => part.length > 1);
}

export function searchMeetings(q: string): SearchHit[] {
  const words = tokens(q);
  if (!words.length) return [];
  const hits: SearchHit[] = [];

  for (const meeting of listMeetings().map((item) => getMeeting(item.id)).filter((item): item is Meeting => Boolean(item))) {
    const blob = [
      meeting.title,
      meeting.overview,
      meeting.tags.join(" "),
      meeting.transcript.map((line) => line.text).join(" "),
      meeting.actionItems.map((item) => item.text).join(" "),
      meeting.highlights.map((item) => `${item.title} ${item.note ?? ""}`).join(" "),
      meeting.attendees.map((id) => personName(id)).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    const matched = words.filter((word) => blob.includes(word)).length;
    if (!matched) continue;

    const line = meeting.transcript.find((entry) => words.some((word) => entry.text.toLowerCase().includes(word)));
    const action = meeting.actionItems.find((item) => words.some((word) => item.text.toLowerCase().includes(word)));
    const highlight = meeting.highlights.find((item) =>
      words.some((word) => `${item.title} ${item.note ?? ""}`.toLowerCase().includes(word))
    );
    const card = { ...meeting, transcript: [] };

    if (line) {
      hits.push({ meeting: card, score: matched + 2, kind: "quote", snippet: line.text, start: line.start });
    }
    if (action) {
      hits.push({ meeting: card, score: matched + 1, kind: "action", snippet: action.text, start: action.start });
    }
    if (highlight) {
      hits.push({
        meeting: card,
        score: matched + 2,
        kind: "highlight",
        snippet: highlight.title,
        start: highlight.start,
      });
    }
    hits.push({ meeting: card, score: matched, kind: "meeting", snippet: meeting.overview });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, 24);
}

export function createHighlight(input: {
  meetingId: string;
  title: string;
  note?: string;
  start: number;
  end: number;
  createdBy: string;
}): Highlight {
  const meeting = queryOne("SELECT duration FROM meetings WHERE id = ?", input.meetingId);
  if (!meeting) throw new MeetingNotFoundError(input.meetingId);
  const title = input.title.trim();
  if (!title) throw new BadRequestError("Highlight title is required");
  if (!queryOne("SELECT id FROM people WHERE id = ?", input.createdBy)) {
    throw new BadRequestError("Unknown highlight author");
  }
  const duration = num(meeting, "duration");
  const start = Math.max(0, Math.floor(input.start));
  const end = Math.min(duration, Math.floor(input.end));
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    throw new BadRequestError("Highlight range is invalid");
  }

  const id = randomUUID();
  const shareId = `clip-${randomUUID()}`;
  const createdAt = new Date().toISOString();
  execute(
    `INSERT INTO highlights (id, meeting_id, title, note, start_sec, end_sec, created_by, share_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.meetingId,
    title.slice(0, 200),
    input.note?.trim() || null,
    start,
    end,
    input.createdBy,
    shareId,
    createdAt
  );
  const row = queryOne("SELECT * FROM highlights WHERE id = ?", id);
  if (!row) throw new Error("Highlight insert failed");
  return mapHighlight(row);
}

export function createShare(path: string) {
  const meetingMatch = path.match(/\/share\/meeting\/([^/]+)\/?/);
  const clipMatch = path.match(/\/share\/clip\/([^/]+)\/?/);
  const createdAt = new Date().toISOString();
  const id = randomUUID();

  if (meetingMatch) {
    const meetingId = decodeURIComponent(meetingMatch[1]);
    if (!meetingExists(meetingId)) throw new MeetingNotFoundError(meetingId);
    execute(
      "INSERT INTO shares (id, kind, meeting_id, highlight_id, created_at) VALUES (?, 'meeting', ?, NULL, ?)",
      id,
      meetingId,
      createdAt
    );
    return { id, kind: "meeting" as const, meetingId, highlightId: null, path: `/share/meeting/${meetingId}/` };
  }

  if (clipMatch) {
    const shareId = decodeURIComponent(clipMatch[1]);
    const highlight = queryOne("SELECT id, meeting_id, share_id FROM highlights WHERE share_id = ?", shareId);
    if (!highlight) throw new HighlightNotFoundError(shareId);
    const meetingId = str(highlight, "meeting_id");
    execute(
      "INSERT INTO shares (id, kind, meeting_id, highlight_id, created_at) VALUES (?, 'highlight', ?, ?, ?)",
      id,
      meetingId,
      str(highlight, "id"),
      createdAt
    );
    return {
      id,
      kind: "highlight" as const,
      meetingId,
      highlightId: str(highlight, "id"),
      path: `/share/clip/${str(highlight, "share_id")}/`,
    };
  }

  throw new BadRequestError("Share path must be a meeting or clip URL");
}

export function replaceActionItems(
  meetingId: string,
  items: Array<{ text: string; ownerId: string; due: string | null; start: number }>
) {
  execute("DELETE FROM action_items WHERE meeting_id = ?", meetingId);
  items.forEach((item, index) => {
    execute(
      `INSERT INTO action_items (id, meeting_id, text, owner_id, due, done, start_sec)
       VALUES (?, ?, ?, ?, ?, 0, ?)`,
      `act-${meetingId}-${index + 1}`,
      meetingId,
      item.text,
      item.ownerId,
      item.due,
      item.start
    );
  });
}
