import { loadEnvFile } from "../lib/load-env";

loadEnvFile();

type PersonSeed = {
  id: string;
  name: string;
  role: string;
  color: string;
  company?: string;
  you?: boolean;
};

type MeetingSeed = {
  id: string;
  title: string;
  startedAt: string;
  duration: number;
  platform: "zoom" | "meet" | "teams";
  hostId: string;
  attendees: string[];
  tags: string[];
  lines: Array<[string, number, string]>;
};

const people: PersonSeed[] = [
  { id: "alex", name: "Alex Chen", role: "Head of Product", color: "#5B8CFF", you: true },
  { id: "priya", name: "Priya Shah", role: "CEO", color: "#F5C16C" },
  { id: "marcus", name: "Marcus Webb", role: "Eng Manager", color: "#6EE7B7" },
  { id: "elena", name: "Elena Voss", role: "Design Lead", color: "#F0A6CA" },
  { id: "jordan", name: "Jordan Hale", role: "Account Executive", color: "#F59E6C" },
  { id: "sam", name: "Sam Okonkwo", role: "Customer Success", color: "#8B9CFF" },
  { id: "riley", name: "Riley Cho", role: "Marketing", color: "#67E8F9" },
  { id: "dana", name: "Dana Park", role: "Finance", color: "#C4B5FD" },
  { id: "maya", name: "Maya Singh", role: "Product Designer", color: "#F9A8D4" },
  { id: "noah", name: "Noah Grant", role: "VP Sales, Northwind", company: "Northwind Logistics", color: "#FBBF24" },
  { id: "claire", name: "Claire Duvall", role: "Ops Director", company: "Northwind Logistics", color: "#34D399" },
  { id: "theo", name: "Theo Marsh", role: "Solutions Engineer", color: "#93C5FD" },
  { id: "lea", name: "Lea Ortiz", role: "CSM", color: "#FCA5A5" },
  { id: "ben", name: "Ben Adler", role: "CTO, Helio", company: "Helio Health", color: "#A5B4FC" },
  { id: "iris", name: "Iris Kim", role: "Candidate — PM", company: "Interview", color: "#FDE68A" },
];

const meetings: MeetingSeed[] = [
  {
    id: "maya-1on1",
    title: "Alex / Maya 1:1",
    startedAt: "2026-09-17T14:00:00.000Z",
    duration: 25 * 60,
    platform: "meet",
    hostId: "alex",
    attendees: ["alex", "maya"],
    tags: ["1:1", "design", "career"],
    lines: [
      ["alex", 10, "How is the week actually going, not the standup version."],
      ["maya", 40, "Fine, except I am still ticket-taking on the marketing site. I did not take this job to ship banner tweaks."],
      ["alex", 200, "Fair. The share-clip page is the launch motion. I want you on that, not Riley's leftover cards."],
      ["maya", 250, "I already have a version where the clip plays and the transcript sits under it. No login. I can finish it Thursday."],
      ["alex", 920, "If this lands I want you as the owner of share surfaces, not a helper on them."],
      ["maya", 970, "That is the job I thought I took. I will take it."],
      ["alex", 1340, "I will tell Riley today. You are off the site. Clip page Thursday. We review Friday before Marcus records."],
    ],
  },
  {
    id: "northwind-discovery",
    title: "Northwind discovery — bot-free capture",
    startedAt: "2026-09-16T18:30:00.000Z",
    duration: 34 * 60,
    platform: "meet",
    hostId: "jordan",
    attendees: ["jordan", "theo", "noah", "claire"],
    tags: ["sales", "discovery", "security"],
    lines: [
      ["jordan", 12, "Noah, Claire — thanks for the thirty minutes. I want to hear how you handle notes today before I show anything."],
      ["noah", 188, "We run about sixty customer calls a week. Reps paste a paragraph into Salesforce and half of it is wrong."],
      ["claire", 230, "Ops then spends Friday reconstructing what was actually promised. It is a tax."],
      ["theo", 280, "We can push a summary to the opportunity. The part I care about is whether legal lets us in the room."],
      ["noah", 740, "Last quarter Fireflies joined as a bot on a carrier call. Their counsel sent us a letter. We are done with bots."],
      ["jordan", 790, "We can capture without a participant on Meet and Zoom. Nothing named Keel sits in the roster."],
      ["claire", 840, "If that is true, I will take this to legal this week. If it is a bot with a nicer name, do not waste the meeting."],
      ["theo", 890, "It is local capture plus a transcript. I can send the architecture one-pager after this."],
      ["noah", 1220, "We also need SSO and a retention knob. Ninety days is our default. Some deals need thirty."],
      ["jordan", 1280, "SSO is on the team plan. Retention is per workspace. I will put both in the follow-up."],
      ["claire", 1820, "Send the bot-free brief, a two-minute clip of a real call, and the DPA. If those land, we will do a six-seat pilot in October."],
      ["noah", 1880, "If the pilot works I will pay. I am not shopping five tools again."],
    ],
  },
  {
    id: "q3-launch-review",
    title: "Q3 launch review — Harbor 2.0",
    startedAt: "2026-09-18T16:00:00.000Z",
    duration: 58 * 60,
    platform: "zoom",
    hostId: "alex",
    attendees: ["alex", "priya", "marcus", "elena", "jordan", "sam", "riley", "dana"],
    tags: ["launch", "pricing", "support", "gtm"],
    lines: [
      ["alex", 8, "Alright — eight of us, fifty-eight minutes, one question: do we ship Harbor 2.0 on October 7 or do we slip."],
      ["priya", 28, "I want a yes or a no with names on the work. We are not leaving with a vibe."],
      ["marcus", 44, "Engineering can hit the seventh if we cut the shared playlists rewrite. That is the only honest version."],
      ["elena", 68, "If playlists slip, the empty states on the new home still need a pass. I will not ship the gray boxes we showed last week."],
      ["alex", 92, "Noted. Let's recap Q2 so we are arguing from the same numbers, then readiness, then pricing, then support."],
      ["dana", 268, "Q2: net new ARR $1.14M against $1.05M plan. Gross retention 93. Expansion was light — people bought seats, not the team pack."],
      ["jordan", 302, "That tracks. I lost two deals in August because legal saw a notetaker bot and walked. Northwind almost did the same."],
      ["sam", 338, "Support volume is up 40 percent since the June release. Average first response is fourteen hours. That is the number I care about."],
      ["riley", 372, "Marketing can fill a launch week. We cannot fill a week if CS is drowning on day two."],
      ["priya", 404, "So the product is wanted, the bot is a liability in regulated rooms, and support is already thin. Keep going."],
      ["alex", 680, "Readiness. Marcus, what is actually done."],
      ["marcus", 698, "Bot-free capture is in for Meet and Zoom. Teams is a week behind. Transcript attribution on eight-person calls is at 94 percent in the last fifty recordings."],
      ["elena", 742, "The meeting workspace is the thing I would show a customer. Player, chapters, transcript lock. Ask is still a second-class tab and it should not be."],
      ["alex", 788, "I agree. Ask should sit next to the summary, not behind it. We can do that without the playlists rewrite."],
      ["marcus", 824, "If Ask is in, playlists are out of GA. I will not pretend we can do both."],
      ["priya", 852, "Playlists out. Ask in. Say it clearly in the changelog so sales does not promise both."],
      ["jordan", 880, "I can sell Ask. I cannot sell another 'coming soon' playlist."],
      ["sam", 910, "Please do not launch Ask without a 'this came from a meeting' citation. Customers will not trust a paragraph with no timestamp."],
      ["alex", 946, "Citations are required. Elena, can design lock the citation chip this week."],
      ["elena", 968, "Yes. I will have a spec by Friday and a prototype Monday."],
      ["dana", 1368, "Pricing. Team plan is $16. We modeled $20 and $24. At $20, we clear the Q4 number if we hold the free plan as-is."],
      ["jordan", 1410, "If we raise to $20 before launch we will reopen every verbal we have out. Northwind is on $16 in writing."],
      ["priya", 1454, "We are not yanking a verbal two weeks out. Hold $16 through October. Revisit in November with usage data."],
      ["dana", 1492, "Then I need a written hold. Finance will otherwise keep modeling $20 in the board deck."],
      ["alex", 1524, "I will write the hold today. $16 through October 31. No grandfathering language until November."],
      ["riley", 1560, "Launch site still says 'free forever for individuals.' That stays true. Team pricing page I can swap in an hour once Dana confirms the hold."],
      ["dana", 1594, "Confirmed. I will send the one-pager after this call."],
      ["sam", 2062, "Support. If we ship on the seventh we will take a two-week spike. I need two contractors or we drop the SLA in the launch email."],
      ["priya", 2104, "Hire the contractors. I would rather spend the money than publish a weaker SLA."],
      ["dana", 2130, "I can fund two contractors for six weeks from the launch reserve. After that it has to convert or die."],
      ["sam", 2164, "I will have them ramped by October 3. They need a loom on the new Ask citations or they will make it worse."],
      ["marcus", 2200, "I can record that Friday. Thirty minutes. No slides."],
      ["jordan", 2472, "GTM. I want one clip I can send to a champion who was not on a call. Not a full recording. A forty-second moment with the transcript under it."],
      ["elena", 2514, "That is the share page. It works without a login. That is the one thing we are better at than Fathom today."],
      ["riley", 2550, "I will cut three launch clips from the Northwind discovery and the Helio interview. One objection, one 'we would pay for this,' one demo fail we fixed."],
      ["alex", 2592, "Good. Also search has to work on an hour-long eight-person call. If I type 'pricing hold' I should land on Dana, not a wall of transcript."],
      ["marcus", 2634, "It does. Chapters plus speaker filter. I will show it in the Friday recording."],
      ["priya", 2972, "Decisions, then we leave. October 7 ship. Playlists out of GA. Ask with citations in. Price held at $16 through October. Two support contractors. Jordan gets shareable clips. Alex writes the hold. Elena specs citations. Riley owns the site and three clips. Sam ramps contractors. Marcus records the loom."],
      ["alex", 3048, "I will put that in the recap in the next half hour. Anyone objecting, say it now."],
      ["jordan", 3080, "No objection. I need the clip page URL in the enablement doc."],
      ["elena", 3104, "No objection. Do not let anyone add playlists back in Slack tonight."],
      ["marcus", 3128, "No objection. Teams capture may land the tenth, not the seventh. I will flag it Friday."],
      ["priya", 3154, "Teams on the tenth is fine. Do not slip the seventh for it."],
      ["alex", 3252, "That is the meeting. Recap, actions, and the three clips will be in Keel in a few minutes. Thanks everyone."],
      ["sam", 3288, "I will highlight the contractor decision so I can send it to recruiting without the whole hour."],
      ["riley", 3314, "Same for the pricing hold. Marketing should not freelance that."],
    ],
  },
];

const upcoming = [
  {
    id: "up-cab",
    title: "Customer advisory board",
    startsAt: "2026-09-23T16:00:00.000Z",
    duration: 60 * 60,
    platform: "zoom",
    attendees: ["alex", "priya", "jordan", "riley", "noah"],
    autoJoin: true,
  },
  {
    id: "up-pricing",
    title: "November pricing workshop",
    startsAt: "2026-09-25T17:00:00.000Z",
    duration: 45 * 60,
    platform: "meet",
    attendees: ["alex", "dana", "priya", "jordan"],
    autoJoin: true,
  },
  {
    id: "up-board",
    title: "Board prep",
    startsAt: "2026-09-26T14:30:00.000Z",
    duration: 30 * 60,
    platform: "teams",
    attendees: ["priya", "dana", "alex"],
    autoJoin: false,
  },
];

async function main() {
  const { getDb, resetDatabase } = await import("../lib/db");
  const { LlmNotConfiguredError } = await import("../lib/llm");
  const { ensureSummary } = await import("../lib/summary");

  resetDatabase();
  const db = getDb();
  const createdAt = new Date().toISOString();
  const insertPerson = db.prepare(
    "INSERT INTO people (id, name, role, company, color, is_you) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const insertMeeting = db.prepare(
    "INSERT INTO meetings (id, title, started_at, duration, platform, capture, host_id, tags_json, created_at) VALUES (?, ?, ?, ?, ?, 'stubbed', ?, ?, ?)"
  );
  const insertAttendee = db.prepare(
    "INSERT INTO meeting_attendees (meeting_id, person_id, position) VALUES (?, ?, ?)"
  );
  const insertLine = db.prepare(
    "INSERT INTO transcripts (id, meeting_id, speaker_id, start_sec, end_sec, text, seq) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  const insertUpcoming = db.prepare(
    "INSERT INTO upcoming_events (id, title, starts_at, duration, platform, auto_join, attendees_json) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  db.exec("BEGIN");
  try {
    for (const person of people) {
      insertPerson.run(person.id, person.name, person.role, person.company ?? null, person.color, person.you ? 1 : 0);
    }
    for (const meeting of meetings) {
      insertMeeting.run(
        meeting.id,
        meeting.title,
        meeting.startedAt,
        meeting.duration,
        meeting.platform,
        meeting.hostId,
        JSON.stringify(meeting.tags),
        createdAt
      );
      meeting.attendees.forEach((personId, position) => insertAttendee.run(meeting.id, personId, position));
      meeting.lines.forEach(([speakerId, start, text], seq) => {
        const end = Math.min(meeting.duration, start + 11);
        insertLine.run(`${meeting.id}-${speakerId}-${start}`, meeting.id, speakerId, start, end, text, seq);
      });
    }
    for (const event of upcoming) {
      insertUpcoming.run(
        event.id,
        event.title,
        event.startsAt,
        event.duration,
        event.platform,
        event.autoJoin ? 1 : 0,
        JSON.stringify(event.attendees)
      );
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  const counts = db.prepare(
    `SELECT
       (SELECT COUNT(*) FROM meetings) AS meetings,
       (SELECT COUNT(*) FROM transcripts) AS lines,
       (SELECT COUNT(*) FROM people) AS people`
  ).get() as { meetings: number; lines: number; people: number };
  console.log(`Inserted ${counts.meetings} meetings, ${counts.lines} transcript lines, ${counts.people} people.`);

  let generated = 0;
  let missingKey = false;
  for (const meeting of meetings) {
    try {
      const summary = await ensureSummary(meeting.id);
      generated += 1;
      console.log(`Cached summary for ${meeting.id} via ${summary.model}.`);
    } catch (error) {
      if (error instanceof LlmNotConfiguredError) missingKey = true;
      console.error(`Summary not cached for ${meeting.id}: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log(`Summaries cached: ${generated} of ${meetings.length}.`);
  if (missingKey) {
    console.error("Set GROQ_API_KEY or OPENAI_API_KEY in .env and run npm run seed again.");
  } else if (generated !== meetings.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
