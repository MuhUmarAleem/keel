"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "./Avatars";
import { formatClock, formatDuration, formatWhen, platformLabel } from "@/lib/format";
import { askMeetings, suggestedAsks } from "@/lib/query";
import { getPerson } from "@/lib/people";
import type { Highlight, Meeting } from "@/lib/types";

type Tab = "summary" | "transcript" | "actions" | "highlights" | "ask";

function MeetingWorkspaceInner({ meeting }: { meeting: Meeting }) {
  const params = useSearchParams();
  const [time, setTime] = useState(() => {
    const raw = Number(params.get("t") ?? 0);
    return Number.isFinite(raw) ? raw : 0;
  });
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tab, setTab] = useState<Tab>("summary");
  const [templateId, setTemplateId] = useState(meeting.defaultTemplate);
  const [speaker, setSpeaker] = useState<string>("all");
  const [done, setDone] = useState<Record<string, boolean>>(
    Object.fromEntries(meeting.actionItems.map((item) => [item.id, item.done]))
  );
  const [highlights, setHighlights] = useState(meeting.highlights);
  const [copied, setCopied] = useState<string | null>(null);
  const [ask, setAsk] = useState("");
  const [answer, setAnswer] = useState(() => askMeetings(suggestedAsks[0], meeting.id));
  const lineRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const currentLine = useMemo(
    () =>
      meeting.transcript.find((line) => time >= line.start && time < line.end) ??
      meeting.transcript.reduce((best, line) => (line.start <= time ? line : best), meeting.transcript[0]),
    [meeting.transcript, time]
  );

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
    node?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentLine]);

  function seek(next: number) {
    setTime(Math.max(0, Math.min(meeting.duration, next)));
  }

  function copy(path: string, id: string) {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url).catch(() => undefined);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1600);
  }

  function markHighlight() {
    const start = Math.max(0, time - 8);
    const created: Highlight = {
      id: `live-${Date.now()}`,
      title: currentLine?.text.slice(0, 72) || "Highlighted moment",
      note: "Marked in the workspace.",
      start,
      end: Math.min(meeting.duration, time + 12),
      createdBy: "alex",
      shareId: `clip-live-${Date.now()}`,
    };
    setHighlights((list) => [created, ...list]);
    setTab("highlights");
  }

  const template =
    meeting.templates.find((item) => item.id === templateId) ?? meeting.templates[0];
  const lines =
    speaker === "all"
      ? meeting.transcript
      : meeting.transcript.filter((line) => line.speakerId === speaker);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[12px] text-[#8b97a8]">
            <Link href="/" className="hover:text-white">
              Library
            </Link>
            <span>/</span>
            <span>{platformLabel(meeting.platform)}</span>
            <span className="rounded-full bg-[#181f2a] px-2 py-0.5 text-[11px] text-[#f5c16c]">
              Capture stubbed
            </span>
          </div>
          <h1 className="text-[26px] font-semibold tracking-tight">{meeting.title}</h1>
          <p className="mt-1 text-[13px] text-[#8b97a8]">
            {formatWhen(meeting.startedAt)} · {formatDuration(meeting.duration)} ·{" "}
            {meeting.attendees.length} people
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => copy(`/share/meeting/${meeting.id}/`, "meeting")}
            className="rounded-full border border-[#243041] bg-[#12171f] px-3 py-1.5 text-[13px] hover:border-[#4aa3ff]"
          >
            {copied === "meeting" ? "Link copied" : "Share meeting"}
          </button>
          <button
            onClick={markHighlight}
            className="rounded-full bg-[#f5c16c] px-3 py-1.5 text-[13px] font-medium text-[#2a1d07]"
          >
            Highlight this moment
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="overflow-hidden rounded-2xl border border-[#243041] bg-[#0c1016]">
          <div className="grid grid-cols-2 gap-px bg-[#243041] sm:grid-cols-4">
            {meeting.attendees.map((id) => {
              const person = getPerson(id);
              const speaking = currentLine?.speakerId === id && playing;
              return (
                <div
                  key={id}
                  className={`relative flex aspect-video flex-col items-center justify-center bg-[#10151d] ${
                    speaking ? "ring-1 ring-[#4aa3ff]" : ""
                  }`}
                >
                  <Avatar id={id} size={48} speaking={speaking} />
                  <div className="mt-2 text-[12px] font-medium">{person.name.split(" ")[0]}</div>
                  <div className="text-[10px] text-[#8b97a8]">{person.role}</div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 border-t border-[#243041] p-4">
            <div className="flex items-center justify-between text-[12px] text-[#8b97a8]">
              <span>
                {formatClock(time)} / {formatClock(meeting.duration)}
              </span>
              <span>
                {chapter?.title}
                {currentLine ? ` · ${getPerson(currentLine.speakerId).name}` : ""}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={meeting.duration}
              value={time}
              onChange={(event) => seek(Number(event.target.value))}
              className="w-full accent-[#4aa3ff]"
            />
            <div className="relative h-8">
              {meeting.chapters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => seek(item.start)}
                  className="absolute top-0 -translate-x-1/2 text-[10px] text-[#8b97a8] hover:text-white"
                  style={{ left: `${(item.start / meeting.duration) * 100}%` }}
                >
                  {item.title}
                </button>
              ))}
              {highlights.map((item) => (
                <button
                  key={item.id}
                  onClick={() => seek(item.start)}
                  className="absolute bottom-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#f5c16c]"
                  style={{ left: `${(item.start / meeting.duration) * 100}%` }}
                  title={item.title}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setPlaying((value) => !value)}
                className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-[#07080b]"
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                onClick={() => seek(time - 15)}
                className="rounded-full border border-[#243041] px-3 py-1.5 text-[13px]"
              >
                −15s
              </button>
              <button
                onClick={() => seek(time + 15)}
                className="rounded-full border border-[#243041] px-3 py-1.5 text-[13px]"
              >
                +15s
              </button>
              {[1, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setSpeed(rate)}
                  className={`rounded-full px-3 py-1.5 text-[13px] ${
                    speed === rate ? "bg-[#181f2a] text-white" : "text-[#8b97a8]"
                  }`}
                >
                  {rate}×
                </button>
              ))}
            </div>
            <p className="text-[12px] leading-5 text-[#8b97a8]">
              Playback is a reconstructed grid, not a Zoom file. The capture bot is stubbed on
              purpose so the hour-long room — chapters, speakers, citations — could get the time.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#243041] bg-[#12171f]">
          <div className="flex flex-wrap gap-1 border-b border-[#243041] p-2">
            {(
              [
                ["summary", "Summary"],
                ["transcript", "Transcript"],
                ["actions", "Actions"],
                ["highlights", "Highlights"],
                ["ask", "Ask"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-full px-3 py-1.5 text-[13px] ${
                  tab === id ? "bg-[#181f2a] text-white" : "text-[#8b97a8]"
                }`}
              >
                {label}
                {id === "actions"
                  ? ` (${meeting.actionItems.filter((item) => !done[item.id]).length})`
                  : ""}
                {id === "highlights" ? ` (${highlights.length})` : ""}
              </button>
            ))}
          </div>

          <div className="max-h-[640px] overflow-y-auto p-4">
            {tab === "summary" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {meeting.templates.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTemplateId(item.id)}
                      className={`rounded-full px-3 py-1 text-[12px] ${
                        templateId === item.id
                          ? "bg-[#4aa3ff] text-[#07080b]"
                          : "bg-[#181f2a] text-[#8b97a8]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <p className="text-[13px] text-[#8b97a8]">{template.blurb}</p>
                {template.sections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8b97a8]">
                      {section.heading}
                    </h3>
                    <ul className="space-y-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet.text}>
                          <button
                            onClick={() => {
                              seek(bullet.start);
                              setTab("transcript");
                            }}
                            className="w-full rounded-xl border border-[#243041] bg-[#0c1016] px-3 py-2.5 text-left text-[14px] leading-6 hover:border-[#4aa3ff]"
                          >
                            <span className="mr-2 text-[11px] text-[#4aa3ff]">
                              {formatClock(bullet.start)}
                            </span>
                            {bullet.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {tab === "transcript" && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSpeaker("all")}
                    className={`rounded-full px-3 py-1 text-[12px] ${
                      speaker === "all" ? "bg-white text-[#07080b]" : "bg-[#181f2a] text-[#8b97a8]"
                    }`}
                  >
                    Everyone
                  </button>
                  {meeting.attendees.map((id) => (
                    <button
                      key={id}
                      onClick={() => setSpeaker(id)}
                      className={`rounded-full px-3 py-1 text-[12px] ${
                        speaker === id ? "bg-white text-[#07080b]" : "bg-[#181f2a] text-[#8b97a8]"
                      }`}
                    >
                      {getPerson(id).name.split(" ")[0]}
                    </button>
                  ))}
                </div>
                {lines.map((line) => {
                  const active = currentLine?.id === line.id;
                  return (
                    <button
                      key={line.id}
                      ref={(node) => {
                        lineRefs.current[line.id] = node;
                      }}
                      onClick={() => seek(line.start)}
                      className={`flex w-full gap-3 rounded-xl px-2 py-2 text-left ${
                        active ? "bg-[#182433]" : "hover:bg-[#181f2a]"
                      }`}
                    >
                      <Avatar id={line.speakerId} size={28} speaking={active && playing} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-[11px] text-[#8b97a8]">
                          <span>{getPerson(line.speakerId).name}</span>
                          <span>{formatClock(line.start)}</span>
                        </span>
                        <span className="block text-[14px] leading-6">{line.text}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {tab === "actions" && (
              <ul className="space-y-2">
                {meeting.actionItems.map((item) => {
                  const owner = getPerson(item.ownerId);
                  return (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl border border-[#243041] bg-[#0c1016] p-3"
                    >
                      <button
                        onClick={() =>
                          setDone((state) => ({ ...state, [item.id]: !state[item.id] }))
                        }
                        className={`mt-0.5 grid h-5 w-5 place-items-center rounded-md border ${
                          done[item.id]
                            ? "border-[#5ee0a8] bg-[#5ee0a8] text-[#072117]"
                            : "border-[#243041]"
                        }`}
                      >
                        {done[item.id] ? "✓" : ""}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[14px] leading-6 ${
                            done[item.id] ? "text-[#8b97a8] line-through" : ""
                          }`}
                        >
                          {item.text}
                        </p>
                        <p className="mt-1 text-[12px] text-[#8b97a8]">
                          {owner.name}
                          {item.due ? ` · due ${item.due}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          seek(item.start);
                          setTab("transcript");
                        }}
                        className="text-[12px] text-[#4aa3ff]"
                      >
                        {formatClock(item.start)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {tab === "highlights" && (
              <div className="space-y-2">
                {highlights.length === 0 && (
                  <p className="text-[13px] text-[#8b97a8]">
                    Nothing marked yet. Hit “Highlight this moment” while you play.
                  </p>
                )}
                {highlights.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#243041] bg-[#0c1016] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[14px] font-medium">{item.title}</p>
                        {item.note && (
                          <p className="mt-1 text-[12px] text-[#8b97a8]">{item.note}</p>
                        )}
                        <p className="mt-2 text-[12px] text-[#8b97a8]">
                          {formatClock(item.start)}–{formatClock(item.end)} ·{" "}
                          {getPerson(item.createdBy).name}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            seek(item.start);
                            setPlaying(true);
                          }}
                          className="rounded-full bg-white px-3 py-1 text-[12px] text-[#07080b]"
                        >
                          Play
                        </button>
                        <button
                          onClick={() =>
                            copy(`/share/clip/${item.shareId}/`, item.shareId)
                          }
                          className="rounded-full border border-[#243041] px-3 py-1 text-[12px]"
                        >
                          {copied === item.shareId ? "Copied" : "Share clip"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "ask" && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {suggestedAsks.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setAsk(item);
                        setAnswer(askMeetings(item, meeting.id));
                      }}
                      className="rounded-full bg-[#181f2a] px-3 py-1 text-[12px] text-[#8b97a8] hover:text-white"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setAnswer(askMeetings(ask || suggestedAsks[0], meeting.id));
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={ask}
                    onChange={(event) => setAsk(event.target.value)}
                    placeholder="Ask this meeting…"
                    className="flex-1 rounded-full border border-[#243041] bg-[#0c1016] px-4 py-2 text-[13px] outline-none focus:border-[#4aa3ff]"
                  />
                  <button className="rounded-full bg-[#4aa3ff] px-4 py-2 text-[13px] font-medium text-[#07080b]">
                    Ask
                  </button>
                </form>
                <div className="rounded-xl border border-[#243041] bg-[#0c1016] p-3">
                  <p className="text-[14px] leading-6">{answer.answer}</p>
                </div>
                {answer.citations.map((cite) => (
                  <button
                    key={`${cite.meetingId}-${cite.start}-${cite.quote}`}
                    onClick={() => {
                      seek(cite.start);
                      setTab("transcript");
                    }}
                    className="block w-full rounded-xl border border-[#243041] px-3 py-2 text-left hover:border-[#4aa3ff]"
                  >
                    <span className="text-[11px] text-[#4aa3ff]">
                      {cite.speaker} · {formatClock(cite.start)}
                    </span>
                    <span className="mt-1 block text-[13px] leading-6 text-[#c5cdd8]">
                      “{cite.quote}”
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export function MeetingWorkspace({ meeting }: { meeting: Meeting }) {
  return (
    <Suspense>
      <MeetingWorkspaceInner meeting={meeting} />
    </Suspense>
  );
}
