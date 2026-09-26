import { json } from "@/lib/http";
import { LlmNotConfiguredError } from "@/lib/llm";
import { ensureSummary } from "@/lib/summary";
import { getMeeting, meetingExists } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!meetingExists(id)) return json({ error: `Meeting not found: ${id}` }, 404);
  try {
    await ensureSummary(id);
  } catch (error) {
    if (!(error instanceof LlmNotConfiguredError)) console.error(error);
  }
  const meeting = getMeeting(id);
  return meeting ? json(meeting) : json({ error: `Meeting not found: ${id}` }, 404);
}
