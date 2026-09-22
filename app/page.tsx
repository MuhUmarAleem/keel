import Link from "next/link";
import { AvatarStack } from "@/components/Avatars";
import { formatDuration, formatWhen, platformLabel } from "@/lib/format";
import { meetings, upcoming } from "@/lib/meetings";
import { getPerson } from "@/lib/people";

const sorted = [...meetings].sort(
  (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
);

export default function HomePage() {
  const featured = sorted.find((meeting) => meeting.id === "q3-launch-review") ?? sorted[0];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-[#243041] bg-[#10151d] p-6 sm:p-8">
        <p className="text-[12px] uppercase tracking-[0.16em] text-[#8b97a8]">
          Northwind Labs workspace · no login required
        </p>
        <h1 className="mt-2 max-w-2xl text-[34px] font-semibold leading-[1.1] tracking-tight">
          The meeting is over. The work is still in the room.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#8b97a8]">
          Keel is a Fathom rebuild aimed at the case that actually matters: eight people, an hour,
          decisions with names on them. Capture is stubbed. Playback, transcript, templates,
          actions, clips, and Ask are not.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/meetings/${featured.id}/`}
            className="rounded-full bg-[#4aa3ff] px-4 py-2 text-[13px] font-medium text-[#07080b]"
          >
            Open the 8-person launch review
          </Link>
          <Link
            href="/ask/"
            className="rounded-full border border-[#243041] px-4 py-2 text-[13px]"
          >
            Ask the library
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-[16px] font-semibold">Upcoming</h2>
          <Link href="/calendar/" className="text-[13px] text-[#4aa3ff]">
            Calendar
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {upcoming.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-[#243041] bg-[#12171f] p-4"
            >
              <div className="flex items-center justify-between text-[12px] text-[#8b97a8]">
                <span>{platformLabel(event.platform)}</span>
                <span>
                  {event.autoJoin ? "Keel will join" : "Join off"}
                </span>
              </div>
              <p className="mt-2 text-[15px] font-medium">{event.title}</p>
              <p className="mt-1 text-[12px] text-[#8b97a8]">
                {formatWhen(event.startsAt)} · {formatDuration(event.duration)}
              </p>
              <div className="mt-3">
                <AvatarStack ids={event.attendees} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[16px] font-semibold">Library</h2>
        <div className="grid gap-3">
          {sorted.map((meeting) => (
            <Link
              key={meeting.id}
              href={`/meetings/${meeting.id}/`}
              className="grid gap-4 rounded-2xl border border-[#243041] bg-[#12171f] p-4 transition hover:border-[#4aa3ff] sm:grid-cols-[1.2fr_2fr]"
            >
              <div className="flex items-center justify-center rounded-xl bg-[#0c1016] py-6">
                <AvatarStack ids={meeting.attendees} limit={8} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#8b97a8]">
                  <span>{platformLabel(meeting.platform)}</span>
                  <span>{formatWhen(meeting.startedAt)}</span>
                  <span>{formatDuration(meeting.duration)}</span>
                  {meeting.id === "q3-launch-review" && (
                    <span className="rounded-full bg-[#f5c16c] px-2 py-0.5 text-[11px] text-[#2a1d07]">
                      The hour that matters
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-[18px] font-semibold">{meeting.title}</h3>
                <p className="mt-1 text-[13px] leading-6 text-[#8b97a8]">{meeting.overview}</p>
                <p className="mt-2 text-[12px] text-[#8b97a8]">
                  {meeting.attendees.map((id) => getPerson(id).name.split(" ")[0]).join(", ")}
                  {" · "}
                  {meeting.actionItems.length} actions
                  {" · "}
                  {meeting.highlights.length} highlights
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
