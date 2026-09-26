"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, postJson } from "@/lib/client-api";
import { formatTape } from "@/lib/format";
import { suggestedAsks } from "@/lib/suggestions";
import type { AskAnswer } from "@/lib/types";

export function AskClient() {
  const [q, setQ] = useState(suggestedAsks[0]);
  const [answer, setAnswer] = useState<AskAnswer>({ question: "", answer: "", citations: [] });

  async function load(question: string) {
    const asked = question.trim() || suggestedAsks[0];
    try {
      setAnswer(await postJson<AskAnswer>("/api/ask/", { question: asked }));
    } catch (error) {
      setAnswer({
        question: asked,
        answer: error instanceof ApiError ? error.message : "Ask failed.",
        citations: [],
      });
    }
  }

  useEffect(() => {
    void load(suggestedAsks[0]);
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="border-l-4 border-[#7B6BD6] pl-3 font-serif text-[34px] leading-tight">Ask the library</h1>
      <p className="mt-2 max-w-[65ch] text-[15px] leading-[1.6] text-graphite">
        Answers cite the line, the speaker, and the meeting, then jump you there.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void load(q);
        }}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          aria-label="Question"
          className="flex-1 rounded-full border border-line bg-[#1a1f27] px-4 py-2 text-[15px] text-paper"
        />
        <button className="rounded-full bg-[#7B6BD6] px-5 py-2 text-[14px] font-medium text-paper">Ask Keel</button>
      </form>
      <div className="mt-4 flex flex-col gap-1">
        {suggestedAsks.map((item) => (
          <button
            key={item}
            onClick={() => {
              setQ(item);
              void load(item);
            }}
            className="rounded-full bg-[#1a1f27] px-3 py-1.5 text-left text-[13px] text-graphite hover:text-paper"
          >
            {item}
          </button>
        ))}
      </div>
      <article className="mt-8 border-t border-line pt-4">
        <p className="text-[16px] leading-[1.6]">{answer.answer}</p>
      </article>
      <div className="mt-4">
        {answer.citations.map((cite) => (
          <Link
            key={`${cite.meetingId}-${cite.start}-${cite.quote}`}
            href={`/meetings/${cite.meetingId}/?t=${cite.start}`}
            className="mt-2 block rounded-xl border border-line bg-[#1a1f27] px-4 py-3 hover:border-cue"
          >
            <p className="text-[13px] text-graphite">
              {cite.speaker} · {cite.meetingTitle} ·{" "}
              <span className="font-mono text-[12px]">{formatTape(cite.start)}</span>
            </p>
            <p className="mt-1 text-[14px] leading-6">“{cite.quote}”</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
