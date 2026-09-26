import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDuration, formatTape, formatWhen } from "@/lib/format";
import { LlmNotConfiguredError } from "@/lib/llm";
import { hydratePeople } from "@/lib/people";
import { ensureSummary } from "@/lib/summary";
import { getMeeting, listPeople, meetingExists } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SharedMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!meetingExists(id)) notFound();
  hydratePeople(listPeople());
  try {
    await ensureSummary(id);
  } catch (error) {
    if (!(error instanceof LlmNotConfiguredError)) console.error(error);
  }
  const meeting = getMeeting(id);
  if (!meeting) notFound();
  const template =
    meeting.templates.find((item) => item.id === meeting.defaultTemplate) ??
    meeting.templates[0];

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="font-serif text-[22px] leading-none">
          Keel
        </Link>
        <span className="text-[13px] text-graphite">Shared meeting · no login</span>
      </div>
      <h1 className="font-serif text-[34px] leading-tight">{meeting.title}</h1>
      <p className="mt-2 text-[13px] text-graphite">
        {formatWhen(meeting.startedAt)} · {formatDuration(meeting.duration)} · {meeting.attendees.length}{" "}
        people
      </p>
      <div className="mt-6 bg-paper px-6 py-8 text-ink">
        <p className="max-w-[65ch] text-[16px] leading-[1.6]">{meeting.overview}</p>
        <div className="mt-6">
          {template.sections.map((section) => (
            <section key={section.heading} className="mt-6">
              <h2 className="font-serif text-[22px]">{section.heading}</h2>
              <ul className="mt-2">
                {section.bullets.map((bullet) => (
                  <li key={bullet.text} className="border-b border-rule py-2 text-[15px] leading-[1.6]">
                    <span className="font-mono text-[12px] text-graphite">{formatTape(bullet.start)}</span>
                    <span className="mt-1 block">{bullet.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <Link href={`/meetings/${meeting.id}/`} className="mt-6 inline-flex bg-cue px-4 py-2 text-[13px] font-medium text-ink">
        Open with transcript
      </Link>
    </div>
  );
}
