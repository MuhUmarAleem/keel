import { queryAll, queryOne } from "./db";
import { MeetingNotFoundError } from "./errors";
import { completeJson } from "./llm";
import type { AskAnswer } from "./types";

type Row = Record<string, string | number | bigint | null>;

const SYSTEM = `You answer questions about meeting transcripts. Use only the transcripts in the user message. If they do not contain the answer, say that plainly.

Return JSON:
{"answer": string, "citations": [{"meetingId": string, "start": number, "quote": string}]}

Each quote must be copied from a transcript line. start is that line's start time. meetingId is that line's meeting. Return 1 to 4 citations when the transcript supports the answer, otherwise an empty array. No markdown.`;

function str(row: Row, key: string) {
  const value = row[key];
  return value == null ? "" : String(value);
}

export async function askMeetings(question: string, meetingId?: string): Promise<AskAnswer> {
  const asked = question.trim();
  if (!asked) throw new Error("Question is required");
  if (meetingId && !queryOne("SELECT id FROM meetings WHERE id = ?", meetingId)) {
    throw new MeetingNotFoundError(meetingId);
  }

  const meetings = meetingId
    ? queryAll("SELECT id, title FROM meetings WHERE id = ?", meetingId)
    : queryAll("SELECT id, title FROM meetings ORDER BY started_at");

  const corpus = meetings.map((meeting) => {
    const id = str(meeting, "id");
    const lines = queryAll(
      `SELECT t.start_sec, t.text, p.name AS speaker
       FROM transcripts t JOIN people p ON p.id = t.speaker_id
       WHERE t.meeting_id = ? ORDER BY t.seq`,
      id
    );
    const body = lines
      .map((line) => `[start=${line.start_sec}] ${line.speaker}: ${line.text}`)
      .join("\n");
    return { id, title: str(meeting, "title"), lines, body };
  });

  const packed = corpus.map((meeting) => `# ${meeting.id} — ${meeting.title}\n${meeting.body}`).join("\n\n");
  const { value } = await completeJson(SYSTEM, `Question: ${asked}\n\nTranscripts:\n${packed}`, 1200);
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const answer = String(record.answer ?? "").trim() || "The transcript does not answer that.";
  const citations = [];

  for (const item of Array.isArray(record.citations) ? record.citations : []) {
    if (!item || typeof item !== "object") continue;
    const citation = item as Record<string, unknown>;
    const citedMeeting = corpus.find((meeting) => meeting.id === String(citation.meetingId ?? ""));
    if (!citedMeeting) continue;
    const quote = String(citation.quote ?? "").trim();
    const start = Number(citation.start);
    const line =
      citedMeeting.lines.find((entry) => Number(entry.start_sec) === start) ??
      citedMeeting.lines.find((entry) => quote && str(entry, "text") === quote) ??
      citedMeeting.lines.find((entry) => quote.length > 24 && str(entry, "text").includes(quote));
    if (!line) continue;
    citations.push({
      meetingId: citedMeeting.id,
      meetingTitle: citedMeeting.title,
      start: Number(line.start_sec),
      quote: str(line, "text"),
      speaker: str(line, "speaker"),
    });
    if (citations.length >= 4) break;
  }

  return { question: asked, answer, citations };
}
