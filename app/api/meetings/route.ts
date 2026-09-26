import { json } from "@/lib/http";
import { listMeetings } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return json(listMeetings());
}
