# Keel

A rebuild of [Fathom](https://fathom.video) — the AI meeting notetaker — pointed at the case that actually matters: eight people, an hour, decisions with names on them.

## Live

The deployed URL goes here after ship.

## What is real
- Meeting library seeded with eight calls, including a 58-minute eight-person launch review
- Reconstructed playback locked to the transcript
- Summary templates (General, Exec, Sales, CS, 1:1, Interview, Standup)
- Action items with owners
- Mid-call highlights and public clip pages (no login)
- Search across meetings
- Ask Keel with citations
- Calendar view with a connected Google Calendar (stubbed join rules)

## What is stubbed
The recording bot. There is no Zoom/Meet/Teams participant. Playback is a participant grid plus a playhead. That is stated in the meeting workspace.

## Capture logs
`.agent-logs/` is committed. Cursor hooks write prompts and responses as JSONL.

```
node scripts/test-agent-capture.cjs
```

## Run

```
npm install
npm run dev
```

Static export:

```
npm run build
```
