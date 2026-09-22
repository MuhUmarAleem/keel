"use client";

import Link from "next/link";
import { useState } from "react";
import { formatClock } from "@/lib/format";
import { askMeetings, suggestedAsks } from "@/lib/query";

export function AskClient() {
  const [q, setQ] = useState(suggestedAsks[0]);
  const [answer, setAnswer] = useState(() => askMeetings(suggestedAsks[0]));

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <p className="text-[12px] uppercase tracking-[0.16em] text-[#8b97a8]">Across every call</p>
      <h1 className="text-[32px] font-semibold tracking-tight">Ask the library. Get a timestamp back.</h1>
      <p className="text-[15px] leading-7 text-[#8b97a8]">
        Fathom’s best idea is Ask. Keel makes it the front door. Answers cite the line, the speaker,
        and the meeting — then jump you there.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setAnswer(askMeetings(q));
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          className="flex-1 rounded-2xl border border-[#243041] bg-[#12171f] px-4 py-3 text-[15px] outline-none focus:border-[#4aa3ff]"
        />
        <button className="rounded-2xl bg-[#4aa3ff] px-5 py-3 text-[14px] font-medium text-[#07080b]">
          Ask Keel
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {suggestedAsks.map((item) => (
          <button
            key={item}
            onClick={() => {
              setQ(item);
              setAnswer(askMeetings(item));
            }}
            className="rounded-full bg-[#181f2a] px-3 py-1.5 text-[12px] text-[#8b97a8] hover:text-white"
          >
            {item}
          </button>
        ))}
      </div>
      <article className="rounded-3xl border border-[#243041] bg-[#12171f] p-5">
        <p className="text-[16px] leading-7">{answer.answer}</p>
      </article>
      <div className="space-y-2">
        {answer.citations.map((cite) => (
          <Link
            key={`${cite.meetingId}-${cite.start}-${cite.quote}`}
            href={`/meetings/${cite.meetingId}/`}
            className="block rounded-2xl border border-[#243041] bg-[#0c1016] p-4 hover:border-[#4aa3ff]"
          >
            <p className="text-[12px] text-[#4aa3ff]">
              {cite.speaker} · {cite.meetingTitle} · {formatClock(cite.start)}
            </p>
            <p className="mt-1 text-[14px] leading-6">“{cite.quote}”</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
