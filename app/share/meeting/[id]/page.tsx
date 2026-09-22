import Link from "next/link";
import { notFound } from "next/navigation";
import { AvatarStack } from "@/components/Avatars";
import { formatDuration, formatWhen } from "@/lib/format";
import { getMeeting, meetings } from "@/lib/meetings";

export function generateStaticParams() {
  return meetings.map((meeting) => ({ id: meeting.id }));
}

export default async function SharedMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = getMeeting(id);
  if (!meeting) notFound();
  const template =
    meeting.templates.find((item) => item.id === meeting.defaultTemplate) ??
    meeting.templates[0];

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#4aa3ff] text-[#07080b] font-semibold">
            K
          </span>
          <span className="font-semibold">Keel</span>
        </Link>
        <span className="text-[12px] text-[#8b97a8]">Shared meeting · no login</span>
      </div>
      <AvatarStack ids={meeting.attendees} limit={8} />
      <h1 className="mt-4 text-[32px] font-semibold tracking-tight">{meeting.title}</h1>
      <p className="mt-2 text-[14px] text-[#8b97a8]">
        {formatWhen(meeting.startedAt)} · {formatDuration(meeting.duration)}
      </p>
      <p className="mt-4 text-[16px] leading-7">{meeting.overview}</p>
      <div className="mt-6 space-y-4">
        {template.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8b97a8]">
              {section.heading}
            </h2>
            <ul className="mt-2 space-y-2">
              {section.bullets.map((bullet) => (
                <li key={bullet.text} className="text-[14px] leading-6">
                  {bullet.text}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <Link
        href={`/meetings/${meeting.id}/`}
        className="mt-8 inline-flex rounded-full bg-[#4aa3ff] px-4 py-2 text-[13px] font-medium text-[#07080b]"
      >
        Watch with transcript
      </Link>
    </div>
  );
}
