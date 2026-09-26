import { execute, getDb, queryAll, queryOne } from "./db";
import { MeetingNotFoundError } from "./errors";
import { completeJson } from "./llm";
import { replaceActionItems } from "./store";
import type { Chapter, SummaryTemplate } from "./types";

export type CachedSummary = {
  meetingId: string;
  overview: string;
  defaultTemplate: string;
  chapters: Chapter[];
  templates: SummaryTemplate[];
  model: string;
  createdAt: string;
  cached: boolean;
};

type Row = Record<string, string | number | bigint | null>;

const inflight = new Map<string, Promise<CachedSummary>>();

const SYSTEM = `You are Keel's meeting analyst. Write only from the transcript the user gives you. Do not invent decisions, numbers, owners, or quotes that the transcript does not support.

Return one JSON object:
{
  "overview": string,
  "defaultTemplate": string,
  "chapters": [{"title": string, "start": number}],
  "actionItems": [{"text": string, "ownerId": string, "due": string | null, "start": number}],
  "templates": [{
    "id": string,
    "label": string,
    "blurb": string,
    "sections": [{"heading": string, "bullets": [{"text": string, "start": number}]}]
  }]
}

Rules:
- Include a template whose id is "general", plus 1 to 3 other templates that fit this meeting. Use ids such as exec, sales, cs, oneonone, interview, or standup when they fit. defaultTemplate must be one of those ids.
- ownerId must be an attendee id from the roster, and only when that person owns the follow-up in the transcript.
- Every start value must be one of the transcript start times. Use the line that supports the bullet, action, or chapter.
- due is YYYY-MM-DD only when the transcript states or clearly implies a deadline. Otherwise null.
- Chapters are in time order and cover the meeting.
- No markdown. JSON only.`;

function str(row: Row, key: string) {
  const value = row[key];
  return value == null ? "" : String(value);
}

function readCached(meetingId: string): CachedSummary | null {
  const row = queryOne("SELECT * FROM summaries WHERE meeting_id = ?", meetingId);
  if (!row) return null;
  return {
    meetingId,
    overview: str(row, "overview"),
    defaultTemplate: str(row, "default_template"),
    chapters: JSON.parse(str(row, "chapters_json")) as Chapter[],
    templates: JSON.parse(str(row, "templates_json")) as SummaryTemplate[],
    model: str(row, "model"),
    createdAt: str(row, "created_at"),
    cached: true,
  };
}

function snapStart(start: number, starts: number[]) {
  if (starts.includes(start)) return start;
  let best = starts[0] ?? 0;
  let distance = Infinity;
  for (const candidate of starts) {
    const delta = Math.abs(candidate - start);
    if (delta < distance) {
      distance = delta;
      best = candidate;
    }
  }
  return distance <= 45 ? best : null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function ownerId(value: unknown, attendees: Array<{ id: string; name: string }>) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return null;
  const byId = attendees.find((person) => person.id.toLowerCase() === raw);
  if (byId) return byId.id;
  const byName = attendees.find((person) => person.name.toLowerCase() === raw);
  return byName?.id ?? null;
}

function validate(
  value: unknown,
  attendees: Array<{ id: string; name: string }>,
  starts: number[]
) {
  const record = asRecord(value);
  if (!record) throw new Error("LLM summary was not an object");
  const overview = String(record.overview ?? "").trim();
  if (!overview) throw new Error("LLM summary did not include an overview");

  const chapters: Chapter[] = [];
  for (const [index, item] of (Array.isArray(record.chapters) ? record.chapters : []).entries()) {
    const chapter = asRecord(item);
    if (!chapter) continue;
    const title = String(chapter.title ?? "").trim();
    const start = snapStart(Number(chapter.start), starts);
    if (!title || start == null) continue;
    chapters.push({ id: `c${index + 1}`, title: title.slice(0, 80), start });
  }
  chapters.sort((a, b) => a.start - b.start);
  if (!chapters.length) chapters.push({ id: "c1", title: "Full meeting", start: starts[0] ?? 0 });

  const templates: SummaryTemplate[] = [];
  for (const item of Array.isArray(record.templates) ? record.templates : []) {
    const template = asRecord(item);
    if (!template) continue;
    const sections = [];
    for (const sectionItem of Array.isArray(template.sections) ? template.sections : []) {
      const section = asRecord(sectionItem);
      if (!section) continue;
      const heading = String(section.heading ?? "").trim();
      const bullets = [];
      for (const bulletItem of Array.isArray(section.bullets) ? section.bullets : []) {
        const bullet = asRecord(bulletItem);
        if (!bullet) continue;
        const text = String(bullet.text ?? "").trim();
        const start = snapStart(Number(bullet.start), starts);
        if (!text || start == null) continue;
        bullets.push({ text: text.slice(0, 500), start });
        if (bullets.length >= 8) break;
      }
      if (heading && bullets.length) sections.push({ heading: heading.slice(0, 80), bullets });
      if (sections.length >= 6) break;
    }
    const label = String(template.label ?? "").trim();
    const id = String(template.id ?? label)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 24);
    if (!id || !label || !sections.length) continue;
    templates.push({
      id,
      label: label.slice(0, 40),
      blurb: String(template.blurb ?? "").trim().slice(0, 240),
      sections,
    });
    if (templates.length >= 5) break;
  }
  if (!templates.length) throw new Error("LLM summary did not include a usable template");

  const defaultRaw = String(record.defaultTemplate ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  const defaultTemplate = templates.some((template) => template.id === defaultRaw) ? defaultRaw : templates[0].id;

  const actionItems = [];
  for (const item of Array.isArray(record.actionItems) ? record.actionItems : []) {
    const action = asRecord(item);
    if (!action) continue;
    const text = String(action.text ?? "").trim();
    const owner = ownerId(action.ownerId, attendees);
    const start = snapStart(Number(action.start), starts);
    if (!text || !owner || start == null) continue;
    const due = typeof action.due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(action.due) ? action.due : null;
    actionItems.push({ text: text.slice(0, 500), ownerId: owner, due, start });
    if (actionItems.length >= 12) break;
  }

  return { overview: overview.slice(0, 800), defaultTemplate, chapters, templates, actionItems };
}

async function generate(meetingId: string): Promise<CachedSummary> {
  const existing = readCached(meetingId);
  if (existing) return existing;

  const meeting = queryOne("SELECT id, title FROM meetings WHERE id = ?", meetingId);
  if (!meeting) throw new MeetingNotFoundError(meetingId);

  const attendees = queryAll(
    `SELECT p.id, p.name, p.role FROM meeting_attendees a
     JOIN people p ON p.id = a.person_id
     WHERE a.meeting_id = ? ORDER BY a.position`,
    meetingId
  ).map((row) => ({ id: str(row, "id"), name: str(row, "name"), role: str(row, "role") }));

  const lines = queryAll(
    "SELECT speaker_id, start_sec, text FROM transcripts WHERE meeting_id = ? ORDER BY seq",
    meetingId
  );
  if (!lines.length) throw new Error(`Meeting ${meetingId} has no transcript`);
  const starts = lines.map((row) => Number(row.start_sec));
  const transcript = lines
    .map((row) => `[start=${row.start_sec} speaker=${row.speaker_id}] ${row.text}`)
    .join("\n");
  const roster = attendees.map((person) => `${person.id} (${person.name}, ${person.role})`).join("\n");

  const prompt = `Meeting: ${str(meeting, "title")}\n\nAttendees:\n${roster}\n\nTranscript:\n${transcript}`;
  let model = "";
  let validated: ReturnType<typeof validate> | null = null;
  let lastError = "Summary validation failed";
  for (let attempt = 0; attempt < 2 && !validated; attempt++) {
    const result = await completeJson(SYSTEM, prompt, 3500);
    model = result.model;
    try {
      validated = validate(result.value, attendees, starts);
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }
  if (!validated) throw new Error(lastError);
  const createdAt = new Date().toISOString();

  const db = getDb();
  let storedByUs = false;
  db.exec("BEGIN");
  try {
    const raced = queryOne("SELECT meeting_id FROM summaries WHERE meeting_id = ?", meetingId);
    if (!raced) {
      execute(
        `INSERT INTO summaries (meeting_id, overview, default_template, templates_json, chapters_json, model, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        meetingId,
        validated.overview,
        validated.defaultTemplate,
        JSON.stringify(validated.templates),
        JSON.stringify(validated.chapters),
        model,
        createdAt
      );
      replaceActionItems(meetingId, validated.actionItems);
      storedByUs = true;
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  const saved = readCached(meetingId);
  if (!saved) throw new Error("Summary was not stored");
  return { ...saved, cached: !storedByUs };
}

export function ensureSummary(meetingId: string) {
  const pending = inflight.get(meetingId);
  if (pending) return pending;
  const job = generate(meetingId).finally(() => inflight.delete(meetingId));
  inflight.set(meetingId, job);
  return job;
}
