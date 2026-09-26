import { BadRequestError } from "@/lib/errors";
import { errorResponse, json } from "@/lib/http";
import { createHighlight } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Expected JSON" }, 400);
  }
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  try {
    if (typeof record.meetingId !== "string" || typeof record.createdBy !== "string") {
      throw new BadRequestError("meetingId and createdBy are required");
    }
    const highlight = createHighlight({
      meetingId: record.meetingId,
      title: String(record.title ?? ""),
      note: typeof record.note === "string" ? record.note : undefined,
      start: Number(record.start),
      end: Number(record.end),
      createdBy: record.createdBy,
    });
    return json(highlight, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
