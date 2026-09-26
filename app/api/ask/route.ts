import { BadRequestError } from "@/lib/errors";
import { askMeetings } from "@/lib/ask";
import { errorResponse, json } from "@/lib/http";

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
  const question = typeof record.question === "string" ? record.question : "";
  const meetingId = typeof record.meetingId === "string" ? record.meetingId : undefined;
  try {
    if (!question.trim()) throw new BadRequestError("Question is required");
    return json(await askMeetings(question, meetingId));
  } catch (error) {
    return errorResponse(error);
  }
}
