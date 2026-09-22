import { meetings } from "./meetings";
import { getPerson } from "./people";
import type { Meeting, TranscriptLine } from "./types";

function tokens(q: string) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((part) => part.length > 1);
}

function haystack(meeting: Meeting) {
  return [
    meeting.title,
    meeting.overview,
    meeting.tags.join(" "),
    meeting.transcript.map((line) => line.text).join(" "),
    meeting.actionItems.map((item) => item.text).join(" "),
    meeting.highlights.map((item) => `${item.title} ${item.note ?? ""}`).join(" "),
    meeting.attendees.map((id) => getPerson(id).name).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export type SearchHit = {
  meeting: Meeting;
  score: number;
  line?: TranscriptLine;
  kind: "meeting" | "quote" | "action" | "highlight";
  snippet: string;
  start?: number;
};

export function searchMeetings(q: string): SearchHit[] {
  const words = tokens(q);
  if (!words.length) return [];

  const hits: SearchHit[] = [];

  for (const meeting of meetings) {
    const blob = haystack(meeting);
    const matched = words.filter((word) => blob.includes(word)).length;
    if (!matched) continue;

    const line = meeting.transcript.find((entry) =>
      words.some((word) => entry.text.toLowerCase().includes(word))
    );
    const action = meeting.actionItems.find((item) =>
      words.some((word) => item.text.toLowerCase().includes(word))
    );
    const highlight = meeting.highlights.find((item) =>
      words.some((word) => `${item.title} ${item.note ?? ""}`.toLowerCase().includes(word))
    );

    if (line) {
      hits.push({
        meeting,
        score: matched + 2,
        line,
        kind: "quote",
        snippet: line.text,
        start: line.start,
      });
    }
    if (action) {
      hits.push({
        meeting,
        score: matched + 1,
        kind: "action",
        snippet: action.text,
        start: action.start,
      });
    }
    if (highlight) {
      hits.push({
        meeting,
        score: matched + 2,
        kind: "highlight",
        snippet: highlight.title,
        start: highlight.start,
      });
    }
    hits.push({
      meeting,
      score: matched,
      kind: "meeting",
      snippet: meeting.overview,
    });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, 24);
}

export type AskCitation = {
  meetingId: string;
  meetingTitle: string;
  start: number;
  quote: string;
  speaker: string;
};

export type AskAnswer = {
  question: string;
  answer: string;
  citations: AskCitation[];
};

const canned: { match: string[]; question: string; answer: string; pick: (line: TranscriptLine, meeting: Meeting) => boolean }[] = [
  {
    match: ["price", "pricing", "16", "hold"],
    question: "What did we decide about pricing?",
    answer:
      "Team stays at $16 through October 31. Northwind’s verbal is written at that number, so a raise now reopens every deal out. Finance will remodel in November.",
    pick: (line) => /\$16|price|pricing|hold/i.test(line.text),
  },
  {
    match: ["october", "ship", "launch", "date"],
    question: "Do we ship October 7?",
    answer:
      "Yes. Harbor 2.0 ships October 7. Playlists are out of GA, Ask with citations is in, and Teams capture may land on the tenth without slipping the date.",
    pick: (line) => /October 7|ship|playlists|GA/i.test(line.text),
  },
  {
    match: ["bot", "northwind", "legal"],
    question: "Why did Northwind almost walk?",
    answer:
      "A Fireflies bot joined a carrier call and their counsel sent a letter. Bots are a hard no. They will do a six-seat October pilot if we prove bot-free capture and send the DPA.",
    pick: (line) => /bot|Fireflies|legal|pilot/i.test(line.text),
  },
  {
    match: ["promise", "helio", "on-prem", "renew"],
    question: "What did we promise Helio?",
    answer:
      "A CSM promised on-prem retention on a call that nobody could find for three weeks. Ben will fight to renew if Ask can recover promises with citations. He will not stay for another recap email.",
    pick: (line) => /on-prem|promise|renew|Ask/i.test(line.text),
  },
  {
    match: ["support", "contractor", "sla"],
    question: "What is the support plan for launch?",
    answer:
      "Volume is already up 40% with a 14-hour first response. Priya approved two contractors for six weeks, ramped by October 3. Marcus records a loom on Ask citations so they do not invent answers.",
    pick: (line) => /support|contractor|SLA|volume/i.test(line.text),
  },
];

export function askMeetings(question: string, meetingId?: string): AskAnswer {
  const words = tokens(question);
  const pool = meetingId ? meetings.filter((meeting) => meeting.id === meetingId) : meetings;

  const cannedHit = canned.find((item) => item.match.some((word) => words.includes(word)));
  const citations: AskCitation[] = [];

  for (const meeting of pool) {
    for (const entry of meeting.transcript) {
      const relevant = cannedHit
        ? cannedHit.pick(entry, meeting)
        : words.some((word) => entry.text.toLowerCase().includes(word));
      if (!relevant) continue;
      citations.push({
        meetingId: meeting.id,
        meetingTitle: meeting.title,
        start: entry.start,
        quote: entry.text,
        speaker: getPerson(entry.speakerId).name,
      });
      if (citations.length >= 4) break;
    }
    if (citations.length >= 4) break;
  }

  if (cannedHit) {
    return { question, answer: cannedHit.answer, citations };
  }

  if (!citations.length) {
    return {
      question,
      answer:
        "Nothing in the library matches that closely. Try pricing, October 7, Northwind bots, Helio promises, or support contractors.",
      citations: [],
    };
  }

  return {
    question,
    answer: `The closest thread in the library is this: ${citations[0].speaker} said “${citations[0].quote}” in ${citations[0].meetingTitle}.`,
    citations,
  };
}

export const suggestedAsks = [
  "What did we decide about pricing?",
  "Do we ship October 7?",
  "Why did Northwind almost walk?",
  "What did we promise Helio?",
  "What is the support plan for launch?",
];
