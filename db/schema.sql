-- Keel application schema (SQLite).
-- Meetings are the root. Transcript lines, the cached LLM summary,
-- action items, highlights, and share links all belong to a meeting.

CREATE TABLE IF NOT EXISTS people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  color TEXT NOT NULL,
  is_you INTEGER NOT NULL DEFAULT 0 CHECK (is_you IN (0, 1))
);

CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  started_at TEXT NOT NULL,
  duration INTEGER NOT NULL CHECK (duration >= 0),
  platform TEXT NOT NULL CHECK (platform IN ('zoom', 'meet', 'teams')),
  capture TEXT NOT NULL DEFAULT 'stubbed' CHECK (capture IN ('stubbed')),
  host_id TEXT NOT NULL REFERENCES people(id),
  tags_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS meeting_attendees (
  meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  person_id TEXT NOT NULL REFERENCES people(id),
  position INTEGER NOT NULL,
  PRIMARY KEY (meeting_id, person_id)
);

CREATE TABLE IF NOT EXISTS transcripts (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  speaker_id TEXT NOT NULL REFERENCES people(id),
  start_sec INTEGER NOT NULL CHECK (start_sec >= 0),
  end_sec INTEGER NOT NULL CHECK (end_sec >= start_sec),
  text TEXT NOT NULL,
  seq INTEGER NOT NULL,
  UNIQUE (meeting_id, seq)
);

CREATE INDEX IF NOT EXISTS idx_transcripts_meeting ON transcripts (meeting_id, seq);

CREATE TABLE IF NOT EXISTS summaries (
  meeting_id TEXT PRIMARY KEY REFERENCES meetings(id) ON DELETE CASCADE,
  overview TEXT NOT NULL,
  default_template TEXT NOT NULL,
  templates_json TEXT NOT NULL,
  chapters_json TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS action_items (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES people(id),
  due TEXT,
  done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
  start_sec INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_action_items_meeting ON action_items (meeting_id);

CREATE TABLE IF NOT EXISTS highlights (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  note TEXT,
  start_sec INTEGER NOT NULL CHECK (start_sec >= 0),
  end_sec INTEGER NOT NULL CHECK (end_sec >= start_sec),
  created_by TEXT NOT NULL REFERENCES people(id),
  share_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_highlights_meeting ON highlights (meeting_id);

CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('meeting', 'highlight')),
  meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  highlight_id TEXT REFERENCES highlights(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_shares_meeting ON shares (meeting_id);

CREATE TABLE IF NOT EXISTS upcoming_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  duration INTEGER NOT NULL CHECK (duration > 0),
  platform TEXT NOT NULL CHECK (platform IN ('zoom', 'meet', 'teams')),
  auto_join INTEGER NOT NULL CHECK (auto_join IN (0, 1)),
  attendees_json TEXT NOT NULL
);
