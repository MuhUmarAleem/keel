import Link from "next/link";
import { notFound } from "next/navigation";
import { formatTape, formatWhen } from "@/lib/format";
import { getPerson, hydratePeople } from "@/lib/people";
import { getSharedClip, listPeople } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ClipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const found = getSharedClip(id);
  if (!found) notFound();
  hydratePeople(listPeople());
  const { meeting, highlight } = found;
  const snippet = meeting.transcript.filter(
    (line) => line.start >= highlight.start - 8 && line.start <= highlight.end + 8
  );

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="font-serif text-[22px] leading-none">
          Keel
        </Link>
        <span className="text-[13px] text-graphite">Shared clip · no login</span>
      </div>
      <p className="text-[13px] text-graphite">
        {meeting.title} · {formatWhen(meeting.startedAt)}
      </p>
      <h1 className="mt-2 font-serif text-[34px] leading-tight">{highlight.title}</h1>
      {highlight.note && <p className="mt-2 text-[15px] text-graphite">{highlight.note}</p>}
      <p className="mt-2 text-[13px] text-graphite">
        <span className="font-mono">
          {formatTape(highlight.start)}–{formatTape(highlight.end)}
        </span>
        {" · marked by "}
        {getPerson(highlight.createdBy).name}
      </p>
      <div className="mt-6 bg-paper px-6 py-8 text-ink">
        {snippet.map((line) => {
          const person = getPerson(line.speakerId);
          return (
            <div key={line.id} className="grid grid-cols-[5.2rem_minmax(0,1fr)] gap-3 border-b border-rule py-3">
              <span className="font-mono text-[12px] text-graphite">{formatTape(line.start)}</span>
              <div className="max-w-[65ch]">
                <p className="mb-1 flex items-center gap-2 text-[13px]">
                  <span className="inline-block h-1.5 w-1.5" style={{ background: person.color }} aria-hidden />
                  {person.name}
                </p>
                <p className="text-[16px] leading-[1.6]">{line.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Link href={`/meetings/${meeting.id}/`} className="mt-6 inline-flex bg-cue px-4 py-2 text-[13px] font-medium text-ink">
        Open the full meeting
      </Link>
    </div>
  );
}
