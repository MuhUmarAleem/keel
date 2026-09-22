import { notFound } from "next/navigation";
import { MeetingWorkspace } from "@/components/MeetingWorkspace";
import { getMeeting, meetings } from "@/lib/meetings";

export function generateStaticParams() {
  return meetings.map((meeting) => ({ id: meeting.id }));
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = getMeeting(id);
  if (!meeting) notFound();
  return <MeetingWorkspace meeting={meeting} />;
}
