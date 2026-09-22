import { AvatarStack } from "@/components/Avatars";
import { formatDay, formatDuration, formatWhen, platformLabel } from "@/lib/format";
import { upcoming } from "@/lib/meetings";

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">Calendar</h1>
          <p className="mt-2 text-[14px] leading-6 text-[#8b97a8]">
            Google Calendar is connected on this workspace. Auto-join is on for customer calls.
            Capture still does not spin up a real bot — upcoming rows show the rule, not a Zoom
            participant.
          </p>
        </div>
        <span className="rounded-full border border-[#243041] bg-[#12171f] px-3 py-1 text-[12px] text-[#5ee0a8]">
          Connected
        </span>
      </div>
      <div className="space-y-3">
        {upcoming.map((event) => (
          <article
            key={event.id}
            className="rounded-2xl border border-[#243041] bg-[#12171f] p-4"
          >
            <p className="text-[12px] text-[#8b97a8]">{formatDay(event.startsAt)}</p>
            <h2 className="mt-1 text-[18px] font-semibold">{event.title}</h2>
            <p className="mt-1 text-[13px] text-[#8b97a8]">
              {formatWhen(event.startsAt)} · {formatDuration(event.duration)} ·{" "}
              {platformLabel(event.platform)}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <AvatarStack ids={event.attendees} />
              <span className="text-[12px] text-[#8b97a8]">
                {event.autoJoin ? "Keel will join" : "Auto-join off"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
