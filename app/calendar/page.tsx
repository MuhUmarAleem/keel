import { formatDay, formatDuration, formatWhen, platformLabel } from "@/lib/format";
import { getPerson, hydratePeople } from "@/lib/people";
import { listPeople, listUpcoming } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function CalendarPage() {
  hydratePeople(listPeople());
  const upcoming = listUpcoming();
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="border-l-4 border-tide pl-3 font-serif text-[34px] leading-tight">Calendar</h1>
          <p className="mt-2 max-w-[65ch] text-[14px] leading-6 text-graphite">
            Google Calendar is connected on this workspace. Auto-join is on for customer calls.
            Capture still does not spin up a real bot — upcoming rows show the rule, not a Zoom
            participant.
          </p>
        </div>
        <p className="flex shrink-0 items-center gap-2 rounded-full bg-[#163330] px-3 py-1 text-[13px] text-[#7dccc9]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-tide" aria-hidden />
          Connected
        </p>
      </div>
      {upcoming.length === 0 ? (
        <p className="mt-8 border border-line px-4 py-6 text-[15px] leading-7 text-graphite">
          Nothing is on the calendar. Connect a workspace calendar and the next calls will land here.
        </p>
      ) : (
        <ul className="mt-8 border-t border-line">
          {upcoming.map((event) => (
            <li key={event.id} className="border-b border-line py-4 pl-3" style={{ boxShadow: "inset 3px 0 0 #3E8C8A" }}>
              <p className="text-[13px] text-graphite">{formatDay(event.startsAt)}</p>
              <h2 className="mt-1 font-serif text-[22px]">{event.title}</h2>
              <p className="mt-1 text-[13px] text-graphite">
                {formatWhen(event.startsAt)} · {formatDuration(event.duration)} ·{" "}
                {platformLabel(event.platform)} · {event.attendees.length} people
              </p>
              <p className="mt-1 text-[13px] text-graphite">
                {event.attendees.map((id) => getPerson(id).name).join(", ")}
                {" · "}
                {event.autoJoin ? "Keel will join" : "Auto-join off"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
