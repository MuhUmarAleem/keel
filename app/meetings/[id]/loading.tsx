export default function MeetingLoading() {
  return (
    <div>
      <p className="font-serif text-[32px] leading-tight">Opening the session</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,1fr)]">
        <div className="min-h-[320px] rounded-2xl bg-paper" />
        <div className="rounded-2xl border border-line bg-[#1a1f27] p-4 lg:sticky lg:top-16">
          <p className="flex items-center gap-2 text-[14px] leading-6 text-paper">
            <span className="inline-block h-2 w-2 rounded-full bg-cue" aria-hidden />
            Writing the summary from the transcript.
          </p>
          <p className="mt-3 text-[13px] leading-6 text-graphite">
            The transcript page is ready to read as soon as this finishes.
          </p>
        </div>
      </div>
    </div>
  );
}
