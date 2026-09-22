import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatars";
import { formatClock, formatWhen } from "@/lib/format";
import { allHighlights, getHighlightByShareId } from "@/lib/meetings";
import { getPerson } from "@/lib/people";

export function generateStaticParams() {
  return allHighlights().map(({ highlight }) => ({ id: highlight.shareId }));
}

export default async function ClipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const found = getHighlightByShareId(id);
  if (!found) notFound();
  const { meeting, highlight } = found;
  const snippet = meeting.transcript.filter(
    (line) => line.start >= highlight.start - 8 && line.start <= highlight.end + 8
  );

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#4aa3ff] text-[#07080b] font-semibold">
            K
          </span>
          <span className="font-semibold">Keel</span>
        </Link>
        <span className="text-[12px] text-[#8b97a8]">Shared clip · no login</span>
      </div>
      <p className="text-[12px] uppercase tracking-[0.14em] text-[#8b97a8]">
        {meeting.title} · {formatWhen(meeting.startedAt)}
      </p>
      <h1 className="mt-2 text-[32px] font-semibold tracking-tight">{highlight.title}</h1>
      {highlight.note && (
        <p className="mt-2 text-[15px] text-[#8b97a8]">{highlight.note}</p>
      )}
      <p className="mt-2 text-[13px] text-[#8b97a8]">
        {formatClock(highlight.start)}–{formatClock(highlight.end)} · marked by{" "}
        {getPerson(highlight.createdBy).name}
      </p>
      <div className="mt-6 space-y-3 rounded-3xl border border-[#243041] bg-[#12171f] p-5">
        {snippet.map((line) => (
          <div key={line.id} className="flex gap-3">
            <Avatar id={line.speakerId} />
            <div>
              <p className="text-[12px] text-[#8b97a8]">
                {getPerson(line.speakerId).name} · {formatClock(line.start)}
              </p>
              <p className="text-[15px] leading-7">{line.text}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        href={`/meetings/${meeting.id}/`}
        className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#07080b]"
      >
        Open the full meeting
      </Link>
    </div>
  );
}
