import Link from "next/link";
import { formatDuration, formatTape, formatWhen, platformLabel } from "@/lib/format";
import { hydratePeople, getPerson } from "@/lib/people";
import { listMeetings, listPeople, listUpcoming } from "@/lib/store";
import type { Platform } from "@/lib/types";

export const dynamic = "force-dynamic";

const wave = ["#C99A3C", "#3E8C8A", "#D4654A", "#5B8CFF", "#C4B5FD", "#F59E6C"];

function platformTone(platform: Platform) {
  if (platform === "zoom") return "#5B8CFF";
  if (platform === "meet") return "#3C9A6A";
  return "#7B6BD6";
}

function Spark({ id }: { id: string }) {
  const bars = Array.from({ length: 28 }, (_, index) => {
    const code = id.charCodeAt(index % id.length) + index * 13;
    return 4 + (code % 16);
  });
  return (
    <svg viewBox="0 0 84 22" className="h-6 w-[84px] shrink-0" aria-hidden>
      {bars.map((height, index) => (
        <rect
          key={index}
          x={index * 3}
          y={22 - height}
          width="2"
          height={height}
          rx="1"
          fill={wave[(id.charCodeAt(index % id.length) + index) % wave.length]}
        />
      ))}
    </svg>
  );
}

export default function HomePage() {
  hydratePeople(listPeople());
  const meetings = listMeetings();
  const upcoming = listUpcoming();
  const sorted = [...meetings].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[40px] leading-none tracking-tight">Session log</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-6 text-graphite">
            Open a session to read the transcript. The summary and the work sit beside it.
          </p>
        </div>
        <p className="rounded-full bg-[#2a2418] px-3 py-1 text-[13px] text-cue">
          {sorted.length} on tape
        </p>
      </header>

      {upcoming.length > 0 && (
        <section className="mb-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-[24px]">Coming up</h2>
            <Link href="/calendar/" className="text-[14px] text-tide hover:underline">
              Calendar
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {upcoming.map((event) => (
              <li
                key={event.id}
                className="rounded-2xl border border-line bg-[#1a1f27] p-4"
                style={{ boxShadow: `inset 3px 0 0 ${platformTone(event.platform)}` }}
              >
                <p className="text-[12px]" style={{ color: platformTone(event.platform) }}>
                  {platformLabel(event.platform)}
                </p>
                <p className="mt-1 font-serif text-[18px] leading-snug">{event.title}</p>
                <p className="mt-2 text-[13px] text-graphite">
                  {formatWhen(event.startsAt)} · {formatDuration(event.duration)}
                </p>
                <p className="mt-2 text-[13px]">
                  <span className={event.autoJoin ? "text-[#7dccc9]" : "text-graphite"}>
                    {event.autoJoin ? "Keel will join" : "Join off"}
                  </span>
                  <span className="text-graphite"> · {event.attendees.length} people</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-serif text-[24px]">Recorded</h2>
        {sorted.length === 0 ? (
          <p className="mt-4 max-w-lg rounded-2xl border border-cue/40 bg-[#2a2418] px-4 py-6 text-[15px] leading-7 text-paper">
            Nothing is on the tape yet. Seed the library, or record a session, then open it here to
            read the transcript.
          </p>
        ) : (
          <ul className="mt-3 overflow-hidden rounded-2xl border border-line">
            {sorted.map((meeting) => (
              <li key={meeting.id}>
                <Link
                  href={`/meetings/${meeting.id}/`}
                  className="flex items-center gap-4 border-b border-line bg-ink px-3 py-4 last:border-b-0 hover:bg-[#1c2430]"
                  style={{ boxShadow: `inset 3px 0 0 ${platformTone(meeting.platform)}` }}
                >
                  <Spark id={meeting.id} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-serif text-[22px] leading-tight">
                      {meeting.title}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-graphite">
                      <span
                        className="rounded-full px-2 py-0.5 text-[12px] text-ink"
                        style={{ background: platformTone(meeting.platform) }}
                      >
                        {platformLabel(meeting.platform)}
                      </span>
                      <span>{formatWhen(meeting.startedAt)}</span>
                      <span className="font-mono text-[12px] text-cue">{formatTape(meeting.duration)}</span>
                      <span>{meeting.attendees.length} people</span>
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {meeting.attendees.map((id) => {
                        const person = getPerson(id);
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 rounded-full bg-[#1c2128] px-2 py-0.5 text-[12px] text-paper"
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: person.color }} />
                            {person.name.split(" ")[0]}
                          </span>
                        );
                      })}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
