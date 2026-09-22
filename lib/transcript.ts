import type { TranscriptLine } from "./types";

export function line(
  speakerId: string,
  start: number,
  text: string,
  hold = 11
): TranscriptLine {
  return {
    id: `${speakerId}-${start}`,
    speakerId,
    start,
    end: start + hold,
    text,
  };
}
