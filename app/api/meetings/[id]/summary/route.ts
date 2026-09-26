import { errorResponse, json } from "@/lib/http";
import { ensureSummary } from "@/lib/summary";
import { meetingExists } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!meetingExists(id)) return json({ error: `Meeting not found: ${id}` }, 404);
  try {
    return json(await ensureSummary(id));
  } catch (error) {
    return errorResponse(error);
  }
}
