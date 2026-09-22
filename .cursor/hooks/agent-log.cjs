#!/usr/bin/env node
/**
 * 8x agent capture — writes every Cursor hook event to .agent-logs/
 * Prompts, responses, tool calls, and session lifecycle land as JSONL.
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.env.CURSOR_PROJECT_DIR
  ? process.env.CURSOR_PROJECT_DIR
  : path.resolve(__dirname, "..", "..");
const LOG_DIR = path.join(ROOT, ".agent-logs");
const SESSION_DIR = path.join(LOG_DIR, "sessions");
const POINTER = path.join(LOG_DIR, "current-session.txt");

function ensureDirs() {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

function sessionId() {
  if (fs.existsSync(POINTER)) {
    const id = fs.readFileSync(POINTER, "utf8").trim();
    if (id) return id;
  }
  const id = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(POINTER, id);
  return id;
}

function classify(payload) {
  const hook = payload.hook_event_name || payload.event || payload.hook || "";
  if (/beforeSubmitPrompt|UserPromptSubmit|prompt/i.test(hook)) return "prompt";
  if (/afterAgentResponse|agentResponse|response/i.test(hook)) return "response";
  if (/sessionStart/i.test(hook)) return "session_start";
  if (/sessionEnd|stop/i.test(hook)) return "session_end";
  if (/FileEdit|ReadFile|Shell|MCP|Tool/i.test(hook)) return "tool";
  return "event";
}

function extractText(payload) {
  return (
    payload.prompt ||
    payload.text ||
    payload.content ||
    payload.response ||
    payload.agent_message ||
    payload.message ||
    payload.command ||
    ""
  );
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  ensureDirs();
  const raw = (await readStdin()).trim();
  let payload = {};
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = { raw };
    }
  }

  const hook = process.argv[2] || payload.hook_event_name || "unknown";
  if (!payload.hook_event_name) payload.hook_event_name = hook;

  if (hook === "sessionStart") {
    const id = new Date().toISOString().replace(/[:.]/g, "-");
    fs.writeFileSync(POINTER, id);
  }

  const id = sessionId();
  const record = {
    ts: new Date().toISOString(),
    session: id,
    type: classify({ ...payload, hook }),
    hook,
    text: String(extractText(payload)).slice(0, 20000),
    payload,
  };

  const file = path.join(SESSION_DIR, `${id}.jsonl`);
  fs.appendFileSync(file, JSON.stringify(record) + "\n");

  const indexPath = path.join(LOG_DIR, "index.json");
  let index = { sessions: [], lastEventAt: null };
  if (fs.existsSync(indexPath)) {
    try {
      index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    } catch {
      /* keep default */
    }
  }
  if (!index.sessions.includes(id)) index.sessions.push(id);
  index.lastEventAt = record.ts;
  index.lastHook = hook;
  index.lastType = record.type;
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

  process.stdout.write("{}\n");
}

main().catch((err) => {
  fs.appendFileSync(
    path.join(LOG_DIR, "capture-errors.log"),
    `${new Date().toISOString()} ${err.stack || err}\n`
  );
  process.stdout.write("{}\n");
  process.exit(0);
});
