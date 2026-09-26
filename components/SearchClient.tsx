"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { formatTape } from "@/lib/format";
import type { SearchHit } from "@/lib/types";

function SearchInner() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [hits, setHits] = useState<SearchHit[]>([]);

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setHits([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/search/?q=${encodeURIComponent(query)}`, { signal: controller.signal, cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("search failed"))))
      .then((data: { hits: SearchHit[] }) => setHits(data.hits ?? []))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setHits([]);
      });
    return () => controller.abort();
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="border-l-4 border-tide pl-3 font-serif text-[34px] leading-tight">Search the library</h1>
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Try pricing hold, Northwind bots, Helio promises…"
        aria-label="Search the library"
        className="mt-6 w-full rounded-full border border-line bg-[#1a1f27] px-4 py-2 text-[15px] text-paper placeholder:text-graphite"
      />
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {["pricing hold", "October 7", "bots", "Helio", "contractors"].map((chip) => (
          <button
            key={chip}
            onClick={() => setQ(chip)}
            className="rounded-full bg-[#1a1f27] px-3 py-1 text-[13px] text-graphite hover:text-paper"
          >
            {chip}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[13px] text-graphite">
        {q ? `${hits.length} hits` : "Type to search meetings, quotes, actions, and clips."}
      </p>
      <div className="mt-2 border-t border-line">
        {hits.map((hit, index) => (
          <Link
            key={`${hit.meeting.id}-${hit.kind}-${index}`}
            href={`/meetings/${hit.meeting.id}/${hit.start != null ? `?t=${hit.start}` : ""}`}
            className="block border-b border-line px-2 py-3 hover:bg-[#1c2430]"
          >
            <div className="flex items-center gap-3 text-[13px] text-graphite">
              <span>{hit.kind}</span>
              {hit.start != null && <span className="font-mono text-[12px]">{formatTape(hit.start)}</span>}
            </div>
            <p className="mt-1 font-serif text-[18px]">{hit.meeting.title}</p>
            <p className="mt-1 text-[13px] leading-6 text-graphite">{hit.snippet}</p>
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
