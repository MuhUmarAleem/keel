import { HighlightNotFoundError, MeetingNotFoundError, BadRequestError } from "./errors";
import { LlmNotConfiguredError } from "./llm";

export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function errorResponse(error: unknown) {
  if (error instanceof BadRequestError) return json({ error: error.message }, 400);
  if (error instanceof MeetingNotFoundError || error instanceof HighlightNotFoundError) {
    return json({ error: error.message }, 404);
  }
  if (error instanceof LlmNotConfiguredError) return json({ error: error.message }, 503);
  const message = error instanceof Error ? error.message : "Request failed";
  return json({ error: message.slice(0, 400) }, 502);
}
