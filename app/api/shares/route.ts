import { errorResponse, json } from "@/lib/http";
import { createShare } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Expected JSON" }, 400);
  }
  const path = body && typeof body === "object" ? String((body as { path?: unknown }).path ?? "") : "";
  try {
    const share = createShare(path);
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") ?? "http";
    const url = host ? `${proto}://${host}${share.path}` : share.path;
    return json({ ...share, url }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
