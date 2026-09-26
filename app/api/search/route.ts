import { json } from "@/lib/http";
import { searchMeetings } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  return json({ hits: searchMeetings(q) });
}
