#!/usr/bin/env node
/**
 * 8x agent capture test.
 * Pipes a prompt and a response through the hook and asserts .agent-logs/ received both.
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const HOOK = path.join(ROOT, ".cursor", "hooks", "agent-log.cjs");
const LOG_DIR = path.join(ROOT, ".agent-logs");
const POINTER = path.join(LOG_DIR, "current-session.txt");

function runHook(event, payload) {
  const result = spawnSync(process.execPath, [HOOK, event], {
    cwd: ROOT,
    input: JSON.stringify({ hook_event_name: event, ...payload }),
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`hook ${event} exited ${result.status}: ${result.stderr}`);
  }
  return result.stdout;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const promptText =
  "CAPTURE TEST: rebuild fathom.video — record this prompt into .agent-logs/";
const responseText =
  "CAPTURE TEST: agent response captured. Capture layer is writing prompts and responses.";

runHook("sessionStart", { text: "capture-test session" });
runHook("beforeSubmitPrompt", { prompt: promptText });
runHook("afterAgentResponse", { response: responseText });

assert(fs.existsSync(POINTER), "current-session.txt missing");
const session = fs.readFileSync(POINTER, "utf8").trim();
const file = path.join(LOG_DIR, "sessions", `${session}.jsonl`);
assert(fs.existsSync(file), `session log missing: ${file}`);

const lines = fs
  .readFileSync(file, "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line));

const hasPrompt = lines.some(
  (row) => row.type === "prompt" && String(row.text).includes("CAPTURE TEST")
);
const hasResponse = lines.some(
  (row) => row.type === "response" && String(row.text).includes("CAPTURE TEST")
);

assert(hasPrompt, "prompt was not captured");
assert(hasResponse, "response was not captured");

const result = {
  ok: true,
  session,
  file: path.relative(ROOT, file).replace(/\\/g, "/"),
  events: lines.length,
  types: lines.map((row) => row.type),
  testedAt: new Date().toISOString(),
};

fs.writeFileSync(
  path.join(LOG_DIR, "capture-test.json"),
  JSON.stringify(result, null, 2)
);

console.log("CAPTURE TEST PASSED");
console.log(JSON.stringify(result, null, 2));
