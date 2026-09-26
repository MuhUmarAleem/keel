import { json } from "@/lib/http";
import { listPeople } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return json(listPeople());
}
