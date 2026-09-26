export type Platform = "zoom" | "meet" | "teams";

export type Person = {
  id: string;
  name: string;
  role: string;
  company?: string;
  color: string;
  you?: boolean;
};

export type TranscriptLine = {
  id: string;
  speakerId: string;
  start: number;
  end: number;
  text: string;
};

export type ActionItem = {
  id: string;
  text: string;
  ownerId: string;
  due?: string;
  done: boolean;
  start: number;
};

export type Highlight = {
  id: string;
  title: string;
  note?: string;
  start: number;
  end: number;
  createdBy: string;
  shareId: string;
};

export type Chapter = {
  id: string;
  title: string;
  start: number;
};

export type SummaryBullet = {
  text: string;
  start: number;
};

export type SummarySection = {
  heading: string;
  bullets: SummaryBullet[];
};

export type SummaryTemplate = {
  id: string;
  label: string;
  blurb: string;
  sections: SummarySection[];
};

export type Meeting = {
  id: string;
  title: string;
  startedAt: string;
  duration: number;
  platform: Platform;
  capture: "stubbed";
  hostId: string;
  attendees: string[];
  tags: string[];
  overview: string;
  chapters: Chapter[];
  transcript: TranscriptLine[];
  highlights: Highlight[];
  actionItems: ActionItem[];
  templates: SummaryTemplate[];
  defaultTemplate: string;
};

export type UpcomingEvent = {
  id: string;
  title: string;
  startsAt: string;
  duration: number;
  platform: Platform;
  attendees: string[];
  autoJoin: boolean;
};

export type SearchHit = {
  meeting: Meeting;
  score: number;
  kind: "meeting" | "quote" | "action" | "highlight";
  snippet: string;
  start?: number;
};

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
