"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, postJson } from "@/lib/client-api";
import { formatDuration, formatTape, formatWhen, platformLabel } from "@/lib/format";
import { getPerson, hydratePeople } from "@/lib/people";
import { suggestedAsks } from "@/lib/suggestions";
import type { AskAnswer, Highlight, Meeting, Person } from "@/lib/types";

function MeetingWorkspaceInner({ meeting, people }: { meeting: Meeting; people: Person[] }) {
  const params = useSearchParams();
  const [time, setTime] = useState(() => {
    const raw = Number(params.get("t") ?? 0);
    return Number.isFinite(raw) ? raw : 0;
  });
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [askOpen, setAskOpen] = useState(false);
  const [pane, setPane] = useState<"read" | "notes">("read");
  const [templateId, setTemplateId] = useState(meeting.defaultTemplate);
  const [speaker, setSpeaker] = useState<string>("all");
  const [done, setDone] = useState<Record<string, boolean>>(
    Object.fromEntries(meeting.actionItems.map((item) => [item.id, item.done]))
  );
  const [highlights, setHighlights] = useState(meeting.highlights);
  const [copied, setCopied] = useState<string | null>(null);
  const [ask, setAsk] = useState("");
  const [answer, setAnswer] = useState<AskAnswer>({ question: "", answer: "", citations: [] });
  const lineRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const askSeq = useRef(0);
  const primedAsk = useRef<string | null>(null);

  const currentLine = useMemo(() => {
    if (!meeting.transcript.length) return undefined;
    return (
      meeting.transcript.find((line) => time >= line.start && time < line.end) ??
      meeting.transcript.reduce((best, line) => (line.start <= time ? line : best), meeting.transcript[0])
    );
  }, [meeting.transcript, time]);

  const chapter =
    [...meeting.chapters].reverse().find((item) => time >= item.start) ?? meeting.chapters[0];

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setTime((value) => {
        const next = value + speed;
        if (next >= meeting.duration) {
          setPlaying(false);
          return meeting.duration;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, speed, meeting.duration]);

  useEffect(() => {
    const node = currentLine ? lineRefs.current[currentLine.id] : null;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [currentLine]);

  function seek(next: number) {
    setTime(Math.max(0, Math.min(meeting.duration, next)));
    setPane("read");
  }

  const runAsk = useCallback(async (question: string) => {
    const q = question.trim() || suggestedAsks[0];
    const seq = ++askSeq.current;
    try {
      const next = await postJson<AskAnswer>("/api/ask/", { question: q, meetingId: meeting.id });
      if (seq === askSeq.current) setAnswer(next);
    } catch (error) {
      if (seq !== askSeq.current) return;
      setAnswer({
        question: q,
        answer: error instanceof ApiError ? error.message : "Ask failed.",
        citations: [],
      });
    }
  }, [meeting.id]);

  useEffect(() => {
    if (!askOpen || primedAsk.current === meeting.id) return;
    primedAsk.current = meeting.id;
    void runAsk(suggestedAsks[0]);
  }, [askOpen, meeting.id, runAsk]);

  async function copy(path: string, id: string) {
    try {
      const share = await postJson<{ url: string }>("/api/shares/", { path });
      await navigator.clipboard.writeText(share.url);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      return;
    }
  }

  async function markHighlight() {
    const start = Math.max(0, time - 8);
    try {
      const created = await postJson<Highlight>("/api/highlights/", {
        meetingId: meeting.id,
        title: currentLine?.text.slice(0, 72) || "Highlighted moment",
        note: "Marked in the workspace.",
        start,
        end: Math.min(meeting.duration, time + 12),
        createdBy: "alex",
      });
      setHighlights((list) => [created, ...list]);
    } catch {
      return;
    }
  }

  hydratePeople(people);

  const template =
    meeting.templates.find((item) => item.id === templateId) ?? meeting.templates[0];
  const lines =
    speaker === "all"
      ? meeting.transcript
      : meeting.transcript.filter((line) => line.speakerId === speaker);
  const summaryReady =
    Boolean(meeting.overview?.trim()) ||
    Boolean(template?.sections.some((section) => section.bullets.length > 0));
  const openActions = meeting.actionItems.filter((item) => !done[item.id]).length;
  const platformTone =
    meeting.platform === "zoom" ? "#5B8CFF" : meeting.platform === "meet" ? "#3C9A6A" : "#7B6BD6";

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex flex-wrap items-center gap-2 text-[13px] text-graphite">
            <Link href="/" className="hover:text-paper">
              Library
            </Link>
            <span
              className="rounded-full px-2 py-0.5 text-[12px] text-ink"
              style={{ background: platformTone }}
            >
              {platformLabel(meeting.platform)}
            </span>
          </p>
          <h1 className="mt-2 font-serif text-[34px] leading-tight tracking-tight">{meeting.title}</h1>
          <p className="mt-2 text-[13px] text-graphite">
            {formatWhen(meeting.startedAt)} · {formatDuration(meeting.duration)} ·{" "}
            {meeting.attendees.length} people
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {meeting.attendees.map((id) => {
              const person = getPerson(id);
              return (
                <span
                  key={id}
                  title={person.name}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1c2128] px-2 py-1 text-[12px]"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: person.color }} aria-hidden />
                  {person.name.split(" ")[0]}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => copy(`/share/meeting/${meeting.id}/`, "meeting")}
            className="rounded-full border border-line px-3 py-1.5 text-[13px] text-paper hover:border-tide hover:text-tide"
          >
            {copied === "meeting" ? "Link copied" : "Share meeting"}
          </button>
          <button
            type="button"
            onClick={markHighlight}
            className="rounded-full bg-coral px-3 py-1.5 text-[13px] font-medium text-paper"
          >
            Highlight this moment
          </button>
        </div>
      </div>

      <section className="sticky top-14 z-20 mt-5 rounded-2xl border border-line bg-[#1a1f27] px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="rounded-full bg-cue px-4 py-1.5 text-[13px] font-medium text-ink"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <span className="rounded-md bg-ink px-2 py-1 font-mono text-[13px] text-cue">
            {formatTape(time)}
            <span className="text-graphite"> / {formatTape(meeting.duration)}</span>
          </span>
          <span className="text-[13px] text-paper">
            {chapter?.title}
            {currentLine ? (
              <span style={{ color: getPerson(currentLine.speakerId).color }}>
                {" · "}
                {getPerson(currentLine.speakerId).name}
              </span>
            ) : null}
          </span>
          <span className="ml-auto flex gap-1">
            <button type="button" onClick={() => seek(time - 15)} className="rounded-full px-2 py-1 text-[13px] text-graphite hover:bg-ink hover:text-paper">
              −15s
            </button>
            <button type="button" onClick={() => seek(time + 15)} className="rounded-full px-2 py-1 text-[13px] text-graphite hover:bg-ink hover:text-paper">
              +15s
            </button>
            {[1, 1.5, 2].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setSpeed(rate)}
                className={`rounded-full px-2 py-1 text-[13px] ${
                  speed === rate ? "bg-tide text-paper" : "text-graphite hover:text-paper"
                }`}
              >
                {rate}×
              </button>
            ))}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={meeting.duration}
          value={time}
          aria-label="Playback position"
          onChange={(event) => seek(Number(event.target.value))}
          className="mt-3 w-full accent-cue"
        />
        {meeting.chapters.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {meeting.chapters.map((item) => {
              const here = chapter?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => seek(item.start)}
                  className={`rounded-full px-2.5 py-1 text-[12px] ${
                    here ? "bg-cue text-ink" : "bg-ink text-graphite hover:text-paper"
                  }`}
                >
                  <span className="font-mono">{formatTape(item.start)}</span> {item.title}
                </button>
              );
            })}
          </div>
        )}
        {highlights.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => seek(item.start)}
                title={item.title}
                aria-label={`Jump to ${item.title}`}
                className="h-2 w-2 rounded-full bg-coral"
              />
            ))}
          </div>
        )}
        <p className="mt-2 text-[12px] leading-5 text-graphite">
          Playback walks the transcript. Capture is stubbed, so there is no recording file behind the counter.
        </p>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-2 lg:hidden" role="tablist" aria-label="Session view">
        <button
          type="button"
          role="tab"
          aria-selected={pane === "read"}
          onClick={() => setPane("read")}
          className={`rounded-full py-2 text-[13px] ${pane === "read" ? "bg-paper text-ink" : "bg-[#1a1f27] text-graphite"}`}
        >
          Transcript
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pane === "notes"}
          onClick={() => setPane("notes")}
          className={`rounded-full py-2 text-[13px] ${pane === "notes" ? "bg-cue text-ink" : "bg-[#1a1f27] text-graphite"}`}
        >
          Summary & actions
        </button>
      </div>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,1fr)]">
        <section className={`rounded-2xl bg-paper px-4 py-6 text-ink shadow-[0_18px_50px_rgba(0,0,0,0.28)] sm:px-8 ${pane === "notes" ? "max-lg:hidden" : ""}`}>
          <div className="mb-5 flex flex-wrap gap-1.5 border-b border-rule pb-4">
            <button
              type="button"
              onClick={() => setSpeaker("all")}
              className={`rounded-full px-3 py-1 text-[13px] ${
                speaker === "all" ? "bg-ink text-paper" : "bg-[#efeae0] text-ink"
              }`}
            >
              Everyone
            </button>
            {meeting.attendees.map((id) => {
              const person = getPerson(id);
              const on = speaker === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSpeaker(id)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px]"
                  style={{
                    background: on ? person.color : "#efeae0",
                    color: on ? "#14171C" : "#14171C",
                  }}
                >
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: person.color }} aria-hidden />
                  {person.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
          {lines.length === 0 ? (
            <p className="max-w-[75ch] text-[15px] leading-[1.6] text-graphite">
              No lines for this speaker.
            </p>
          ) : (
            <div>
              {lines.map((line) => {
                const person = getPerson(line.speakerId);
                const active = currentLine?.id === line.id;
                return (
                  <button
                    key={line.id}
                    type="button"
                    ref={(node) => {
                      lineRefs.current[line.id] = node;
                    }}
                    onClick={() => seek(line.start)}
                    data-active={active ? "true" : "false"}
                    style={{ ["--speaker" as string]: person.color }}
                    className="tape-line mb-1 grid w-full grid-cols-[4.8rem_minmax(0,1fr)] gap-3 px-2 py-3 text-left sm:grid-cols-[5.6rem_minmax(0,1fr)]"
                  >
                    <span className="pt-1 font-mono text-[12px] text-[#6d6458]">{formatTape(line.start)}</span>
                    <span className="min-w-0 max-w-[75ch]">
                      <span className="mb-1 flex items-center gap-2 text-[13px] font-medium text-ink">
                        <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: person.color }} aria-hidden />
                        {person.name}
                      </span>
                      <span className="block text-[16px] leading-[1.6] text-ink">{line.text}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <aside id="session-output" className={`rounded-2xl border border-line bg-[#1a1f27] p-4 lg:sticky lg:top-16 lg:max-h-[calc(100vh-4.5rem)] lg:overflow-y-auto ${pane === "read" ? "max-lg:hidden" : ""}`}>
          <h2 className="border-l-4 border-cue pl-3 font-serif text-[26px]">Summary</h2>
          {template && meeting.templates.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {meeting.templates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTemplateId(item.id)}
                  className={`rounded-full px-3 py-1 text-[13px] ${
                    templateId === item.id ? "bg-cue text-ink" : "bg-ink text-graphite"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          {!summaryReady || !template ? (
            <p className="mt-4 flex items-center gap-2 text-[14px] leading-6 text-graphite">
              <span className="inline-block h-1.5 w-1.5 bg-cue" aria-hidden />
              Writing the summary from the transcript.
            </p>
          ) : (
            <div className="mt-4">
              {meeting.overview && (
                <p className="text-[15px] leading-[1.6]">{meeting.overview}</p>
              )}
              {template.blurb && (
                <p className="mt-3 text-[13px] leading-6 text-graphite">{template.blurb}</p>
              )}
              {template.sections.map((section) => (
                <div key={section.heading} className="mt-6">
                  <h3 className="font-serif text-[20px]">{section.heading}</h3>
                  <ul className="mt-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet.text}>
                        <button
                          type="button"
                          onClick={() => seek(bullet.start)}
                          className="w-full rounded-lg px-2 py-2 text-left hover:bg-ink"
                        >
                          <span className="font-mono text-[12px] text-cue">
                            {formatTape(bullet.start)}
                          </span>
                          <span className="mt-1 block text-[14px] leading-[1.6]">{bullet.text}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <h2 className="mt-8 border-l-4 border-tide pl-3 font-serif text-[26px]">
            Actions
            <span className="ml-2 rounded-full bg-[#163330] px-2 py-0.5 align-middle font-sans text-[12px] text-[#7dccc9]">
              {openActions} open
            </span>
          </h2>
          {meeting.actionItems.length === 0 ? (
            <p className="mt-3 text-[14px] leading-6 text-graphite">
              No actions on this session yet.
            </p>
          ) : (
            <ul className="mt-3">
              {meeting.actionItems.map((item) => {
                const owner = getPerson(item.ownerId);
                const checked = Boolean(done[item.id]);
                return (
                  <li key={item.id} className="mt-2 flex items-start gap-3 rounded-xl bg-ink px-3 py-3">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      aria-label={checked ? "Mark not done" : "Mark done"}
                      data-checked={checked ? "true" : "false"}
                      onClick={() => setDone((state) => ({ ...state, [item.id]: !state[item.id] }))}
                      className="check-box mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-line text-[12px]"
                    >
                      {checked ? "✓" : ""}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[14px] leading-[1.6] ${checked ? "text-graphite line-through" : ""}`}>
                        {item.text}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-graphite">
                        <span className="h-2 w-2 rounded-full" style={{ background: owner.color }} aria-hidden />
                        {owner.name}
                        {item.due ? ` · due ${item.due}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => seek(item.start)}
                      className="rounded-full bg-[#1a1f27] px-2 py-1 font-mono text-[12px] text-cue hover:bg-cue hover:text-ink"
                    >
                      {formatTape(item.start)}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <h2 className="mt-8 border-l-4 border-coral pl-3 font-serif text-[26px]">Highlights</h2>
          {highlights.length === 0 ? (
            <p className="mt-3 text-[14px] leading-6 text-graphite">
              Nothing marked yet. Highlight this moment while the counter is running.
            </p>
          ) : (
            <ul className="mt-3">
              {highlights.map((item) => (
                <li key={item.id} className="mt-2 rounded-xl border-l-4 border-coral bg-ink px-3 py-3">
                  <p className="text-[14px] leading-6">{item.title}</p>
                  {item.note && <p className="mt-1 text-[12px] text-graphite">{item.note}</p>}
                  <p className="mt-1 text-[12px] text-graphite">
                    <span className="font-mono">
                      {formatTape(item.start)}–{formatTape(item.end)}
                    </span>
                    {" · "}
                    {getPerson(item.createdBy).name}
                  </p>
                  <div className="mt-2 flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        seek(item.start);
                        setPlaying(true);
                      }}
                      className="rounded-full bg-cue px-3 py-1 text-[13px] font-medium text-ink"
                    >
                      Play
                    </button>
                    <button
                      type="button"
                      onClick={() => copy(`/share/clip/${item.shareId}/`, item.shareId)}
                      className="rounded-full px-3 py-1 text-[13px] text-graphite hover:text-paper"
                    >
                      {copied === item.shareId ? "Copied" : "Share clip"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-8 border-l-4 border-[#7B6BD6] pl-3 font-serif text-[26px]">Ask</h2>
          <details
            className="mt-3"
            onToggle={(event) => setAskOpen(event.currentTarget.open)}
          >
            <summary className="cursor-pointer rounded-full bg-ink px-3 py-1.5 text-[14px] text-paper">
              Ask this meeting
            </summary>
            <div className="mt-3 space-y-3">
              <div className="flex flex-col gap-1">
                {suggestedAsks.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setAsk(item);
                      void runAsk(item);
                    }}
                    className="rounded-lg px-2 py-1.5 text-left text-[13px] text-graphite hover:bg-ink hover:text-paper"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void runAsk(ask || suggestedAsks[0]);
                }}
                className="flex gap-2"
              >
                <input
                  value={ask}
                  onChange={(event) => setAsk(event.target.value)}
                  placeholder="Ask this meeting…"
                  aria-label="Ask this meeting"
                  className="min-w-0 flex-1 rounded-full border border-line bg-ink px-3 py-1.5 text-[13px] text-paper placeholder:text-graphite"
                />
                <button className="rounded-full bg-[#7B6BD6] px-3 py-1.5 text-[13px] font-medium text-paper">Ask</button>
              </form>
              {answer.answer && <p className="text-[14px] leading-[1.6]">{answer.answer}</p>}
              {answer.citations.map((cite) => (
                <button
                  key={`${cite.meetingId}-${cite.start}-${cite.quote}`}
                  type="button"
                  onClick={() => seek(cite.start)}
                  className="block w-full border-b border-line py-2 text-left"
                >
                  <span className="font-mono text-[12px] text-graphite">
                    {cite.speaker} · {formatTape(cite.start)}
                  </span>
                  <span className="mt-1 block text-[13px] leading-6 text-graphite">“{cite.quote}”</span>
                </button>
              ))}
            </div>
          </details>
        </aside>
      </div>
    </div>
  );
}

export function MeetingWorkspace({ meeting, people }: { meeting: Meeting; people: Person[] }) {
  return (
    <Suspense>
      <MeetingWorkspaceInner meeting={meeting} people={people} />
    </Suspense>
  );
}
