import { json } from "@/lib/http";
import { getSharedClip } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await context.params;
  const found = getSharedClip(shareId);
  if (!found) return json({ error: `Highlight not found: ${shareId}` }, 404);
  return json(found);
}
