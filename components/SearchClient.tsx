"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { formatClock } from "@/lib/format";
import { searchMeetings } from "@/lib/query";

function SearchInner() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const hits = useMemo(() => searchMeetings(q), [q]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-[28px] font-semibold tracking-tight">Search the library</h1>
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Try pricing hold, Northwind bots, Helio promises…"
        className="w-full rounded-2xl border border-[#243041] bg-[#12171f] px-4 py-3 text-[15px] outline-none focus:border-[#4aa3ff]"
      />
      <div className="flex flex-wrap gap-2 text-[12px]">
        {["pricing hold", "October 7", "bots", "Helio", "contractors"].map((chip) => (
          <button
            key={chip}
            onClick={() => setQ(chip)}
            className="rounded-full bg-[#181f2a] px-3 py-1 text-[#8b97a8] hover:text-white"
          >
            {chip}
          </button>
        ))}
      </div>
      <p className="text-[13px] text-[#8b97a8]">
        {q ? `${hits.length} hits` : "Type to search meetings, quotes, actions, and clips."}
      </p>
      <div className="space-y-2">
        {hits.map((hit, index) => (
          <Link
            key={`${hit.meeting.id}-${hit.kind}-${index}`}
            href={`/meetings/${hit.meeting.id}/${hit.start != null ? `?t=${hit.start}` : ""}`}
            className="block rounded-2xl border border-[#243041] bg-[#12171f] p-4 hover:border-[#4aa3ff]"
          >
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#8b97a8]">
              <span>{hit.kind}</span>
              {hit.start != null && <span>{formatClock(hit.start)}</span>}
            </div>
            <p className="mt-1 text-[15px] font-medium">{hit.meeting.title}</p>
            <p className="mt-1 text-[13px] leading-6 text-[#8b97a8]">{hit.snippet}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SearchClient() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  );
}
