import { notFound } from "next/navigation";
import { MeetingWorkspace } from "@/components/MeetingWorkspace";
import { LlmNotConfiguredError } from "@/lib/llm";
import { hydratePeople } from "@/lib/people";
import { ensureSummary } from "@/lib/summary";
import { getMeeting, listPeople, meetingExists } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!meetingExists(id)) notFound();
  const people = listPeople();
  hydratePeople(people);
  try {
    await ensureSummary(id);
  } catch (error) {
    if (!(error instanceof LlmNotConfiguredError)) console.error(error);
  }
  const meeting = getMeeting(id);
  if (!meeting) notFound();
  return <MeetingWorkspace meeting={meeting} people={people} />;
}
