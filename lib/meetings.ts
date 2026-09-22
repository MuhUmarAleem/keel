import type { Meeting, UpcomingEvent } from "./types";
import { line } from "./transcript";

const q3: Meeting = {
  id: "q3-launch-review",
  title: "Q3 launch review — Harbor 2.0",
  startedAt: "2026-09-18T16:00:00.000Z",
  duration: 58 * 60,
  platform: "zoom",
  capture: "stubbed",
  hostId: "alex",
  attendees: ["alex", "priya", "marcus", "elena", "jordan", "sam", "riley", "dana"],
  tags: ["launch", "pricing", "support", "gtm"],
  overview:
    "Eight people spent an hour deciding whether Harbor 2.0 ships October 7. The room said yes, with a two-week pricing hold, a support hiring freeze-break, and a narrower GA feature set.",
  chapters: [
    { id: "c1", title: "Kickoff", start: 0 },
    { id: "c2", title: "Q2 recap", start: 260 },
    { id: "c3", title: "Launch readiness", start: 665 },
    { id: "c4", title: "Pricing debate", start: 1360 },
    { id: "c5", title: "Support load", start: 2050 },
    { id: "c6", title: "Go-to-market", start: 2460 },
    { id: "c7", title: "Decisions", start: 2960 },
    { id: "c8", title: "Wrap", start: 3240 },
  ],
  transcript: [
    line("alex", 8, "Alright — eight of us, fifty-eight minutes, one question: do we ship Harbor 2.0 on October 7 or do we slip."),
    line("priya", 28, "I want a yes or a no with names on the work. We are not leaving with a vibe."),
    line("marcus", 44, "Engineering can hit the seventh if we cut the shared playlists rewrite. That is the only honest version."),
    line("elena", 68, "If playlists slip, the empty states on the new home still need a pass. I will not ship the gray boxes we showed last week."),
    line("alex", 92, "Noted. Let's recap Q2 so we are arguing from the same numbers, then readiness, then pricing, then support."),
    line("dana", 268, "Q2: net new ARR $1.14M against $1.05M plan. Gross retention 93. Expansion was light — people bought seats, not the team pack."),
    line("jordan", 302, "That tracks. I lost two deals in August because legal saw a notetaker bot and walked. Northwind almost did the same."),
    line("sam", 338, "Support volume is up 40 percent since the June release. Average first response is fourteen hours. That is the number I care about."),
    line("riley", 372, "Marketing can fill a launch week. We cannot fill a week if CS is drowning on day two."),
    line("priya", 404, "So the product is wanted, the bot is a liability in regulated rooms, and support is already thin. Keep going."),
    line("alex", 680, "Readiness. Marcus, what is actually done."),
    line("marcus", 698, "Bot-free capture is in for Meet and Zoom. Teams is a week behind. Transcript attribution on eight-person calls is at 94 percent in the last fifty recordings."),
    line("elena", 742, "The meeting workspace is the thing I would show a customer. Player, chapters, transcript lock. Ask is still a second-class tab and it should not be."),
    line("alex", 788, "I agree. Ask should sit next to the summary, not behind it. We can do that without the playlists rewrite."),
    line("marcus", 824, "If Ask is in, playlists are out of GA. I will not pretend we can do both."),
    line("priya", 852, "Playlists out. Ask in. Say it clearly in the changelog so sales does not promise both."),
    line("jordan", 880, "I can sell Ask. I cannot sell another 'coming soon' playlist."),
    line("sam", 910, "Please do not launch Ask without a 'this came from a meeting' citation. Customers will not trust a paragraph with no timestamp."),
    line("alex", 946, "Citations are required. Elena, can design lock the citation chip this week."),
    line("elena", 968, "Yes. I will have a spec by Friday and a prototype Monday."),
    line("dana", 1368, "Pricing. Team plan is $16. We modeled $20 and $24. At $20, we clear the Q4 number if we hold the free plan as-is."),
    line("jordan", 1410, "If we raise to $20 before launch we will reopen every verbal we have out. Northwind is on $16 in writing."),
    line("priya", 1454, "We are not yanking a verbal two weeks out. Hold $16 through October. Revisit in November with usage data."),
    line("dana", 1492, "Then I need a written hold. Finance will otherwise keep modeling $20 in the board deck."),
    line("alex", 1524, "I will write the hold today. $16 through October 31. No grandfathering language until November."),
    line("riley", 1560, "Launch site still says 'free forever for individuals.' That stays true. Team pricing page I can swap in an hour once Dana confirms the hold."),
    line("dana", 1594, "Confirmed. I will send the one-pager after this call."),
    line("sam", 2062, "Support. If we ship on the seventh we will take a two-week spike. I need two contractors or we drop the SLA in the launch email."),
    line("priya", 2104, "Hire the contractors. I would rather spend the money than publish a weaker SLA."),
    line("dana", 2130, "I can fund two contractors for six weeks from the launch reserve. After that it has to convert or die."),
    line("sam", 2164, "I will have them ramped by October 3. They need a loom on the new Ask citations or they will make it worse."),
    line("marcus", 2200, "I can record that Friday. Thirty minutes. No slides."),
    line("jordan", 2472, "GTM. I want one clip I can send to a champion who was not on a call. Not a full recording. A forty-second moment with the transcript under it."),
    line("elena", 2514, "That is the share page. It works without a login. That is the one thing we are better at than Fathom today."),
    line("riley", 2550, "I will cut three launch clips from the Northwind discovery and the Helio interview. One objection, one 'we would pay for this,' one demo fail we fixed."),
    line("alex", 2592, "Good. Also search has to work on an hour-long eight-person call. If I type 'pricing hold' I should land on Dana, not a wall of transcript."),
    line("marcus", 2634, "It does. Chapters plus speaker filter. I will show it in the Friday recording."),
    line("priya", 2972, "Decisions, then we leave. October 7 ship. Playlists out of GA. Ask with citations in. Price held at $16 through October. Two support contractors. Jordan gets shareable clips. Alex writes the hold. Elena specs citations. Riley owns the site and three clips. Sam ramps contractors. Marcus records the loom."),
    line("alex", 3048, "I will put that in the recap in the next half hour. Anyone objecting, say it now."),
    line("jordan", 3080, "No objection. I need the clip page URL in the enablement doc."),
    line("elena", 3104, "No objection. Do not let anyone add playlists back in Slack tonight."),
    line("marcus", 3128, "No objection. Teams capture may land the tenth, not the seventh. I will flag it Friday."),
    line("priya", 3154, "Teams on the tenth is fine. Do not slip the seventh for it."),
    line("alex", 3252, "That is the meeting. Recap, actions, and the three clips will be in Keel in a few minutes. Thanks everyone."),
    line("sam", 3288, "I will highlight the contractor decision so I can send it to recruiting without the whole hour."),
    line("riley", 3314, "Same for the pricing hold. Marketing should not freelance that."),
  ],
  highlights: [
    {
      id: "h-playlists",
      title: "Playlists out of GA",
      note: "Priya, on the record.",
      start: 852,
      end: 878,
      createdBy: "alex",
      shareId: "clip-playlists-out",
    },
    {
      id: "h-price",
      title: "Price held at $16 through October",
      note: "Do not let the board deck drift.",
      start: 1454,
      end: 1524,
      createdBy: "dana",
      shareId: "clip-price-hold",
    },
    {
      id: "h-contractors",
      title: "Hire two support contractors",
      note: "Funded for six weeks.",
      start: 2104,
      end: 2164,
      createdBy: "sam",
      shareId: "clip-support-hire",
    },
    {
      id: "h-clips",
      title: "Shareable clip is the GTM motion",
      note: "Champion who was not on the call.",
      start: 2472,
      end: 2550,
      createdBy: "jordan",
      shareId: "clip-share-page",
    },
  ],
  actionItems: [
    { id: "a1", text: "Write the $16 pricing hold through October 31 and send it to Dana and the board deck owners.", ownerId: "alex", due: "2026-09-18", done: true, start: 1524 },
    { id: "a2", text: "Lock citation chip spec by Friday, prototype Monday.", ownerId: "elena", due: "2026-09-20", done: false, start: 968 },
    { id: "a3", text: "Send the pricing one-pager confirming the hold.", ownerId: "dana", due: "2026-09-18", done: false, start: 1594 },
    { id: "a4", text: "Hire and ramp two support contractors by October 3.", ownerId: "sam", due: "2026-10-03", done: false, start: 2164 },
    { id: "a5", text: "Record a 30-minute loom for the contractors on Ask citations.", ownerId: "marcus", due: "2026-09-20", done: false, start: 2200 },
    { id: "a6", text: "Cut three launch clips from Northwind and Helio.", ownerId: "riley", due: "2026-09-22", done: false, start: 2550 },
    { id: "a7", text: "Swap the team pricing page once the hold is confirmed.", ownerId: "riley", due: "2026-09-19", done: false, start: 1560 },
    { id: "a8", text: "Put the share-clip URL in the sales enablement doc.", ownerId: "jordan", due: "2026-09-19", done: false, start: 3080 },
    { id: "a9", text: "Flag Teams capture slip (tenth, not seventh) on Friday.", ownerId: "marcus", due: "2026-09-20", done: false, start: 3128 },
  ],
  defaultTemplate: "general",
  templates: [
    {
      id: "general",
      label: "General",
      blurb: "What an hour with eight people actually decided.",
      sections: [
        {
          heading: "Overview",
          bullets: [
            { text: "Harbor 2.0 ships October 7. Playlists are out of GA. Ask with citations is in.", start: 2972 },
            { text: "Team price stays $16 through October. Two support contractors are funded for six weeks.", start: 1454 },
          ],
        },
        {
          heading: "Decisions",
          bullets: [
            { text: "Ship date holds: October 7.", start: 2972 },
            { text: "Shared playlists rewrite is cut from GA.", start: 852 },
            { text: "Ask Fathom ships with timestamp citations, not as a buried tab.", start: 788 },
            { text: "No price change before November.", start: 1454 },
            { text: "Teams capture may land October 10 without slipping the launch.", start: 3154 },
          ],
        },
        {
          heading: "Risks",
          bullets: [
            { text: "Support is already +40% volume and a 14-hour first response.", start: 338 },
            { text: "A visible notetaker bot lost deals in August, including a near-miss with Northwind.", start: 302 },
            { text: "Sales verbals are written at $16 — a raise now reopens them.", start: 1410 },
          ],
        },
      ],
    },
    {
      id: "exec",
      label: "Exec recap",
      blurb: "For Priya and the board packet.",
      sections: [
        {
          heading: "Ask",
          bullets: [{ text: "Approve October 7 GA with a narrower surface: Ask in, playlists out, price unchanged.", start: 2972 }],
        },
        {
          heading: "Money",
          bullets: [
            { text: "Q2 beat plan: $1.14M net new vs $1.05M.", start: 268 },
            { text: "Hold Team at $16 through October 31; remodel in November.", start: 1454 },
            { text: "Launch reserve covers two contractors for six weeks.", start: 2130 },
          ],
        },
        {
          heading: "Watch",
          bullets: [
            { text: "Support SLA is the launch risk, not engineering.", start: 338 },
            { text: "Regulated buyers flinch at bots — bot-free capture is the story.", start: 698 },
          ],
        },
      ],
    },
    {
      id: "sales",
      label: "Sales",
      blurb: "What Jordan can say on Monday.",
      sections: [
        {
          heading: "What we can promise",
          bullets: [
            { text: "October 7: Ask with citations, chapters, shareable clips, bot-free Zoom/Meet.", start: 698 },
            { text: "Team pricing remains $16 through October. Northwind verbal stands.", start: 1410 },
            { text: "Playlists are not in GA. Do not demo them.", start: 852 },
          ],
        },
        {
          heading: "Objections already in the wild",
          bullets: [
            { text: "Legal walks when they see a notetaker bot. Lead with bot-free.", start: 302 },
            { text: "Champions who missed the call need a 40-second clip, not an hour.", start: 2472 },
          ],
        },
      ],
    },
    {
      id: "cs",
      label: "Customer success",
      blurb: "What Sam has to staff.",
      sections: [
        {
          heading: "Load",
          bullets: [
            { text: "Volume +40% since June. First response 14 hours.", start: 338 },
            { text: "Launch week will spike for two weeks.", start: 2062 },
          ],
        },
        {
          heading: "Plan",
          bullets: [
            { text: "Two contractors, ramped by October 3, funded six weeks.", start: 2164 },
            { text: "Marcus records a loom on Ask citations Friday so they do not invent answers.", start: 2200 },
          ],
        },
      ],
    },
  ],
};

const northwind: Meeting = {
  id: "northwind-discovery",
  title: "Northwind discovery — bot-free capture",
  startedAt: "2026-09-16T18:30:00.000Z",
  duration: 34 * 60,
  platform: "meet",
  capture: "stubbed",
  hostId: "jordan",
  attendees: ["jordan", "theo", "noah", "claire"],
  tags: ["sales", "discovery", "security"],
  overview:
    "Northwind will pay for Harbor if the notetaker never appears as a participant. Legal already killed two other vendors for that.",
  chapters: [
    { id: "n1", title: "Intro", start: 0 },
    { id: "n2", title: "Today's pain", start: 180 },
    { id: "n3", title: "Bot objection", start: 720 },
    { id: "n4", title: "Security", start: 1200 },
    { id: "n5", title: "Next steps", start: 1800 },
  ],
  transcript: [
    line("jordan", 12, "Noah, Claire — thanks for the thirty minutes. I want to hear how you handle notes today before I show anything."),
    line("noah", 188, "We run about sixty customer calls a week. Reps paste a paragraph into Salesforce and half of it is wrong."),
    line("claire", 230, "Ops then spends Friday reconstructing what was actually promised. It is a tax."),
    line("theo", 280, "We can push a summary to the opportunity. The part I care about is whether legal lets us in the room."),
    line("noah", 740, "Last quarter Fireflies joined as a bot on a carrier call. Their counsel sent us a letter. We are done with bots."),
    line("jordan", 790, "We can capture without a participant on Meet and Zoom. Nothing named Keel sits in the roster."),
    line("claire", 840, "If that is true, I will take this to legal this week. If it is a bot with a nicer name, do not waste the meeting."),
    line("theo", 890, "It is local capture plus a transcript. I can send the architecture one-pager after this."),
    line("noah", 1220, "We also need SSO and a retention knob. Ninety days is our default. Some deals need thirty."),
    line("jordan", 1280, "SSO is on the team plan. Retention is per workspace. I will put both in the follow-up."),
    line("claire", 1820, "Send the bot-free brief, a two-minute clip of a real call, and the DPA. If those land, we will do a six-seat pilot in October."),
    line("noah", 1880, "If the pilot works I will pay. I am not shopping five tools again."),
  ],
  highlights: [
    {
      id: "h-nw-bot",
      title: "We are done with bots",
      note: "Carrier counsel letter last quarter.",
      start: 740,
      end: 790,
      createdBy: "jordan",
      shareId: "clip-northwind-bots",
    },
    {
      id: "h-nw-pilot",
      title: "Six-seat October pilot",
      note: "Contingent on brief, clip, DPA.",
      start: 1820,
      end: 1880,
      createdBy: "jordan",
      shareId: "clip-northwind-pilot",
    },
  ],
  actionItems: [
    { id: "nw1", text: "Send bot-free architecture brief and DPA to Claire.", ownerId: "theo", due: "2026-09-17", done: true, start: 890 },
    { id: "nw2", text: "Send a two-minute clip of a real bot-free call.", ownerId: "jordan", due: "2026-09-17", done: false, start: 1820 },
    { id: "nw3", text: "Confirm SSO and 30/90-day retention in writing.", ownerId: "jordan", due: "2026-09-17", done: false, start: 1280 },
  ],
  defaultTemplate: "sales",
  templates: [
    {
      id: "sales",
      label: "Sales",
      blurb: "MEDDIC-ish without the cosplay.",
      sections: [
        {
          heading: "Pain",
          bullets: [
            { text: "Sixty customer calls a week. Salesforce notes are wrong. Ops reconstructs promises on Fridays.", start: 188 },
          ],
        },
        {
          heading: "Objection",
          bullets: [
            { text: "A Fireflies bot triggered a letter from carrier counsel. Bots are a hard no.", start: 740 },
          ],
        },
        {
          heading: "Next",
          bullets: [
            { text: "Pilot: six seats in October if brief, clip, and DPA land this week.", start: 1820 },
          ],
        },
      ],
    },
    {
      id: "general",
      label: "General",
      blurb: "Short version.",
      sections: [
        {
          heading: "Overview",
          bullets: [
            { text: "Northwind will pilot six seats if we prove bot-free capture and send the DPA.", start: 1820 },
            { text: "SSO and a 30/90-day retention control are required.", start: 1220 },
          ],
        },
      ],
    },
  ],
};

const oneOnOne: Meeting = {
  id: "maya-1on1",
  title: "Alex / Maya 1:1",
  startedAt: "2026-09-17T14:00:00.000Z",
  duration: 25 * 60,
  platform: "meet",
  capture: "stubbed",
  hostId: "alex",
  attendees: ["alex", "maya"],
  tags: ["1:1", "design", "career"],
  overview: "Maya wants ownership of the share-clip surface. Alex said yes, and moved her off the marketing site leftovers.",
  chapters: [
    { id: "o1", title: "Check-in", start: 0 },
    { id: "o2", title: "Work", start: 180 },
    { id: "o3", title: "Career", start: 900 },
    { id: "o4", title: "Commitments", start: 1320 },
  ],
  transcript: [
    line("alex", 10, "How is the week actually going, not the standup version."),
    line("maya", 40, "Fine, except I am still ticket-taking on the marketing site. I did not take this job to ship banner tweaks."),
    line("alex", 200, "Fair. The share-clip page is the launch motion. I want you on that, not Riley's leftover cards."),
    line("maya", 250, "I already have a version where the clip plays and the transcript sits under it. No login. I can finish it Thursday."),
    line("alex", 920, "If this lands I want you as the owner of share surfaces, not a helper on them."),
    line("maya", 970, "That is the job I thought I took. I will take it."),
    line("alex", 1340, "I will tell Riley today. You are off the site. Clip page Thursday. We review Friday before Marcus records."),
  ],
  highlights: [
    {
      id: "h-maya",
      title: "Maya owns share clips",
      start: 920,
      end: 980,
      createdBy: "alex",
      shareId: "clip-maya-owns-share",
    },
  ],
  actionItems: [
    { id: "m1", text: "Finish the no-login share-clip page by Thursday.", ownerId: "maya", due: "2026-09-19", done: false, start: 250 },
    { id: "m2", text: "Tell Riley Maya is off marketing-site tickets.", ownerId: "alex", due: "2026-09-17", done: true, start: 1340 },
  ],
  defaultTemplate: "oneonone",
  templates: [
    {
      id: "oneonone",
      label: "1:1",
      blurb: "Person first, then the work.",
      sections: [
        {
          heading: "Person",
          bullets: [{ text: "Maya is tired of marketing-site tickets and said so.", start: 40 }],
        },
        {
          heading: "Work",
          bullets: [{ text: "She owns the no-login share-clip page. Review Friday.", start: 200 }],
        },
        {
          heading: "Career",
          bullets: [{ text: "Alex named her owner of share surfaces, not a helper.", start: 920 }],
        },
      ],
    },
    {
      id: "general",
      label: "General",
      blurb: "Two people, twenty-five minutes.",
      sections: [
        {
          heading: "Overview",
          bullets: [{ text: "Maya takes share clips. Alex pulls her off the marketing site.", start: 200 }],
        },
      ],
    },
  ],
};

const selfTest: Meeting = {
  id: "self-test-zoom",
  title: "Self-test — two minutes on Zoom",
  startedAt: "2026-09-22T06:10:00.000Z",
  duration: 128,
  platform: "zoom",
  capture: "stubbed",
  hostId: "alex",
  attendees: ["alex"],
  tags: ["test"],
  overview: "A two-minute call with myself to see what the other side of capture looks like. Capture is stubbed; the workspace is real.",
  chapters: [{ id: "s1", title: "Test", start: 0 }],
  transcript: [
    line("alex", 4, "This is the two-minute call. I am talking to myself so I can watch playback against a transcript."),
    line("alex", 28, "Highlight this sentence — I want to see where a mid-call highlight lands after the meeting."),
    line("alex", 58, "Action item: send the recap to nobody, because nobody else was here."),
    line("alex", 88, "If search can find 'two-minute call' later, the library is doing its job."),
    line("alex", 112, "That is enough. Ending the test."),
  ],
  highlights: [
    {
      id: "h-self",
      title: "Highlight this sentence",
      note: "Marked live at 0:28.",
      start: 28,
      end: 56,
      createdBy: "alex",
      shareId: "clip-self-highlight",
    },
  ],
  actionItems: [
    { id: "st1", text: "Confirm the mid-call highlight appears on the meeting and as a shareable clip.", ownerId: "alex", due: "2026-09-22", done: true, start: 28 },
  ],
  defaultTemplate: "general",
  templates: [
    {
      id: "general",
      label: "General",
      blurb: "Proof the loop works.",
      sections: [
        {
          heading: "Overview",
          bullets: [
            { text: "Two-minute solo Zoom. One highlight at 0:28. One action to verify the clip.", start: 4 },
          ],
        },
      ],
    },
  ],
};

const helio: Meeting = {
  id: "helio-interview",
  title: "Helio Health — customer interview",
  startedAt: "2026-09-15T17:00:00.000Z",
  duration: 41 * 60,
  platform: "teams",
  capture: "stubbed",
  hostId: "alex",
  attendees: ["alex", "elena", "ben", "sam"],
  tags: ["research", "cs"],
  overview:
    "Ben would pay today if Ask could answer 'what did we promise this health system last month' with a citation. He will not pay for another transcript dump.",
  chapters: [
    { id: "he1", title: "Context", start: 0 },
    { id: "he2", title: "Promise tracking", start: 480 },
    { id: "he3", title: "Ask", start: 1100 },
    { id: "he4", title: "Would pay", start: 1980 },
  ],
  transcript: [
    line("alex", 14, "Ben, we are here to hear how Helio handles promises made on calls, not to demo."),
    line("ben", 500, "Last month a CSM told a health system we would support on-prem retention. It was not in writing. I found it in a recording three weeks later."),
    line("sam", 560, "That is the nightmare case. Did you have a search that could have caught 'on-prem'."),
    line("ben", 610, "We have Otter. Search returns forty meetings. I do not have forty meetings."),
    line("elena", 1120, "If you could ask 'what did we promise this account' and get three quotes with times, is that the product."),
    line("ben", 1180, "That is the product. A transcript is a filing cabinet. I need the promise."),
    line("ben", 2000, "I would pay for that this week. I will not pay for another tool that gives me a PDF."),
    line("alex", 2060, "We will send a clip of Ask with citations on an eight-person call. If that is real enough, we can do a design partner."),
  ],
  highlights: [
    {
      id: "h-helio-pay",
      title: "I would pay for that this week",
      start: 2000,
      end: 2060,
      createdBy: "alex",
      shareId: "clip-helio-would-pay",
    },
  ],
  actionItems: [
    { id: "he1", text: "Send Ben a clip of Ask with citations on the Q3 launch call.", ownerId: "alex", due: "2026-09-16", done: false, start: 2060 },
    { id: "he2", text: "Draft a design-partner note for Helio.", ownerId: "sam", due: "2026-09-18", done: false, start: 2060 },
  ],
  defaultTemplate: "research",
  templates: [
    {
      id: "research",
      label: "Interview",
      blurb: "Jobs, not compliments.",
      sections: [
        {
          heading: "Job to be done",
          bullets: [{ text: "Find promises made on calls before they become incidents.", start: 500 }],
        },
        {
          heading: "Current tools fail",
          bullets: [{ text: "Otter search returns forty meetings. He does not have forty meetings.", start: 610 }],
        },
        {
          heading: "Willingness to pay",
          bullets: [{ text: "He would pay this week for Ask-with-citations. Not for a PDF.", start: 2000 }],
        },
      ],
    },
    {
      id: "general",
      label: "General",
      blurb: "The short version.",
      sections: [
        {
          heading: "Overview",
          bullets: [{ text: "Helio will design-partner if Ask can recover promises with timestamps.", start: 2060 }],
        },
      ],
    },
  ],
};

const standup: Meeting = {
  id: "eng-standup",
  title: "Engineering standup",
  startedAt: "2026-09-19T13:15:00.000Z",
  duration: 12 * 60,
  platform: "zoom",
  capture: "stubbed",
  hostId: "marcus",
  attendees: ["marcus", "alex", "elena", "maya", "theo", "riley"],
  tags: ["standup", "eng"],
  overview: "Teams capture is still late. Citation chip is unblocked. No other fires.",
  chapters: [{ id: "u1", title: "Standup", start: 0 }],
  transcript: [
    line("marcus", 6, "Blockers only. I do not want status theater."),
    line("theo", 24, "Teams capture is still slipping. I need a cert from IT before I can test in their tenant."),
    line("elena", 48, "Citation chip is unblocked. Spec today."),
    line("maya", 66, "Share page is on Thursday. I need the Q3 clip IDs from Riley."),
    line("riley", 84, "I will drop them in the channel after this."),
    line("alex", 102, "No new scope. If it is not on the October 7 list it waits."),
  ],
  highlights: [],
  actionItems: [
    { id: "u1", text: "Get the Teams tenant cert from IT.", ownerId: "theo", due: "2026-09-19", done: false, start: 24 },
    { id: "u2", text: "Drop Q3 clip IDs in the channel for Maya.", ownerId: "riley", due: "2026-09-19", done: false, start: 84 },
  ],
  defaultTemplate: "standup",
  templates: [
    {
      id: "standup",
      label: "Standup",
      blurb: "Blockers, then sit down.",
      sections: [
        {
          heading: "Blockers",
          bullets: [{ text: "Teams capture waiting on an IT cert.", start: 24 }],
        },
        {
          heading: "Moving",
          bullets: [
            { text: "Citation spec today. Share page Thursday.", start: 48 },
            { text: "No new scope before October 7.", start: 102 },
          ],
        },
      ],
    },
  ],
};

const renewal: Meeting = {
  id: "acme-renewal",
  title: "Helio renewal risk",
  startedAt: "2026-09-12T19:00:00.000Z",
  duration: 42 * 60,
  platform: "zoom",
  capture: "stubbed",
  hostId: "lea",
  attendees: ["lea", "sam", "ben", "alex"],
  tags: ["cs", "renewal"],
  overview: "Helio is a renewal risk because promises from a CSM are not searchable. They will stay if Ask ships in October.",
  chapters: [
    { id: "r1", title: "Health", start: 0 },
    { id: "r2", title: "The incident", start: 400 },
    { id: "r3", title: "What keeps them", start: 1400 },
  ],
  transcript: [
    line("lea", 12, "I asked for this because the renewal is in November and the score went yellow after the on-prem incident."),
    line("ben", 420, "Someone on your CS team promised on-prem retention on a call. We planned around it. Then it was not a thing."),
    line("sam", 480, "That should never have been said. I own that. I also own that we could not find it for three weeks."),
    line("alex", 1420, "Ask with citations is in the October 7 cut. If we cannot show it on your own calls, you should not renew."),
    line("ben", 1480, "Show me that and I will fight to keep you. Show me another summary email and I will not."),
  ],
  highlights: [
    {
      id: "h-renew",
      title: "Show me Ask or we do not renew",
      start: 1420,
      end: 1500,
      createdBy: "lea",
      shareId: "clip-helio-renewal",
    },
  ],
  actionItems: [
    { id: "r1", text: "Schedule a Helio review of Ask on their own October calls.", ownerId: "lea", due: "2026-10-08", done: false, start: 1420 },
    { id: "r2", text: "Write the incident note into the account and train CS on over-promising.", ownerId: "sam", due: "2026-09-13", done: true, start: 480 },
  ],
  defaultTemplate: "cs",
  templates: [
    {
      id: "cs",
      label: "Customer success",
      blurb: "Save the account or say we cannot.",
      sections: [
        {
          heading: "Risk",
          bullets: [{ text: "Yellow renewal after an unsearchable on-prem promise.", start: 12 }],
        },
        {
          heading: "Save path",
          bullets: [{ text: "Show Ask with citations on their calls after October 7.", start: 1420 }],
        },
      ],
    },
    {
      id: "general",
      label: "General",
      blurb: "One incident, one save.",
      sections: [
        {
          heading: "Overview",
          bullets: [{ text: "Helio stays if Ask can find promises. They leave if we send another recap email.", start: 1480 }],
        },
      ],
    },
  ],
};

const interview: Meeting = {
  id: "pm-interview",
  title: "Interview — Iris Kim, PM",
  startedAt: "2026-09-11T15:30:00.000Z",
  duration: 46 * 60,
  platform: "meet",
  capture: "stubbed",
  hostId: "alex",
  attendees: ["alex", "priya", "iris"],
  tags: ["hiring"],
  overview: "Iris is strong on judgment, thin on shipping through a messy eight-person room. Second interview only if she can walk a launch cut.",
  chapters: [
    { id: "i1", title: "Story", start: 0 },
    { id: "i2", title: "Judgment", start: 600 },
    { id: "i3", title: "Pushback", start: 1500 },
    { id: "i4", title: "Debrief", start: 2400 },
  ],
  transcript: [
    line("alex", 16, "Iris, walk me through a time you cut scope the week before a launch."),
    line("iris", 80, "We cut a reporting suite four days out. I wrote the changelog before I told engineering so sales could not freelance."),
    line("priya", 640, "What did you get wrong."),
    line("iris", 680, "I cut it without sitting in the customer call where they had asked for it. I looked like I had not listened."),
    line("alex", 1520, "How would you run an eight-person launch review that is going sideways."),
    line("iris", 1580, "I would put decisions on a clock and names on work. I would not let the loudest person own the recap."),
    line("priya", 2420, "I want a second loop where she walks our actual October cut. Not another hypothetical."),
    line("alex", 2460, "Agreed. I will send her the Q3 tape and ask her to write the recap we should have sent."),
  ],
  highlights: [
    {
      id: "h-iris",
      title: "Cut the changelog before sales freelanced",
      start: 80,
      end: 140,
      createdBy: "priya",
      shareId: "clip-iris-changelog",
    },
  ],
  actionItems: [
    { id: "i1", text: "Send Iris the Q3 launch tape and ask for a written recap.", ownerId: "alex", due: "2026-09-12", done: false, start: 2460 },
  ],
  defaultTemplate: "interview",
  templates: [
    {
      id: "interview",
      label: "Interview",
      blurb: "Signal, not vibes.",
      sections: [
        {
          heading: "Signal",
          bullets: [
            { text: "Has cut scope late and protected the changelog from sales.", start: 80 },
            { text: "Admitted she skipped the customer call that justified the cut.", start: 680 },
          ],
        },
        {
          heading: "Next",
          bullets: [{ text: "Second loop: write the recap for our real Q3 tape.", start: 2460 }],
        },
      ],
    },
  ],
};

export const meetings: Meeting[] = [selfTest, q3, northwind, oneOnOne, helio, standup, renewal, interview];

export const upcoming: UpcomingEvent[] = [
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

export function getMeeting(id: string) {
  return meetings.find((meeting) => meeting.id === id);
}

export function getHighlightByShareId(shareId: string) {
  for (const meeting of meetings) {
    const highlight = meeting.highlights.find((item) => item.shareId === shareId);
    if (highlight) return { meeting, highlight };
  }
  return null;
}

export function allHighlights() {
  return meetings.flatMap((meeting) =>
    meeting.highlights.map((highlight) => ({ meeting, highlight }))
  );
}
