# Nuvo Circle — Cursor build brief (prototype v0)

## 0. How to use this with Cursor

1. Create an empty folder and open it in Cursor.
2. Add `PROJECT_BRIEF.md` (this file) and `reference/nuvo_web_wireframe.html`. Optional: screenshot each wireframe tab and drop the images into `reference/` too, so the agent can see them.
3. Add the rules file from the appendix as `.cursor/rules/nuvo.mdc`.
4. Open a new Agent chat, paste **Prompt 0**, review the plan, say "go". Then use **one phase per chat**. Long chats drift; fresh chats with `@PROJECT_BRIEF.md` stay accurate.
5. After each phase, run the app yourself and click through the acceptance criteria before moving on.

If the brief and the wireframe disagree, **the brief wins**. The wireframe's numbers (Level 4, 1,240 GC) are illustrative demo values.

---

## 1. What we're building

**Nuvo Circle** is a gamified "Green Passport" for children. They complete real-world sustainability missions, earn non-cash **Green Credits (GC)**, and spend them on content, workshops and experiences. Schools and parents sit alongside the child. A pangolin mascot called **Chiku** guides the whole experience.

Core loop: **Learn → Do → Prove → Reflect → Earn → Unlock an experience.**

The interaction style is inspired by Duolingo (a winding path of nodes, streaks, daily quests, leagues, chunky buttons). It is inspired by the patterns only. **Do not copy Duolingo's branding, owl, fonts, copy or assets.**

**Platform decision: build a mobile-first responsive web app (PWA) first.** One codebase, runs on phones and school computers, no app-store review, easy to share a link with pilot families. Keep all game logic in framework-free TypeScript (`lib/game`) so it can be reused in an Expo/React Native app later.

**Prototype scope:** a front-end-only prototype with seeded demo data and local persistence. No real backend, no real accounts, no real payments, no real child data.

---

## 2. Hard rules and non-goals

- No real money anywhere. **Green Credits can never be bought.** There is no purchase UI at all.
- No backend, auth service, database server or third-party analytics SDKs in v0.
- Demo data only. Never collect real children's personal data in the prototype.
- No public profiles, no real names, no face photos shown to other users. Children appear as **nickname + avatar** only.
- Never use guilt, shame, doom or fear messaging anywhere in copy or in Chiku's behaviour. Tone: warm, curious, encouraging, short sentences.
- Outdoor missions must show an "adult-supervised" label for children under 14. Distances stay small (500 m or 1 km options).
- Do not invent statistics. Where content needs a number or a fact, write the sentence without the number and add `// TODO(verify): source needed`.
- Out of scope for v0: real video hosting, payments, push notifications, real photo upload to a server, multi-language UI (just make strings i18n-ready), native apps.

---

## 3. Tech stack and setup

| Concern | Choice |
|---|---|
| Framework | Next.js (current stable, App Router), TypeScript `strict` |
| Styling | Tailwind CSS with the design tokens in section 4 |
| Fonts | `next/font/google`: **Baloo 2** (headings, buttons, numbers) and **Nunito** (body) |
| Icons | `lucide-react` |
| State | Zustand with `persist` middleware (localStorage key `nuvo-v0`) |
| Evidence images | Stored locally via `idb-keyval` (IndexedDB), compressed client-side to about 800px max edge. Never uploaded. |
| Motion | Framer Motion, subtle only, respect `prefers-reduced-motion` |
| Tests | Vitest for everything in `lib/game` |
| Hosting | Vercel (final step) |

Project rules:
- Keep `lib/game/*` **pure TypeScript with no React imports**. UI calls into it.
- Server components by default; add `"use client"` only where needed. Guard against hydration mismatch with the persisted store (use a `useHasHydrated` hook before rendering persisted values).
- Content lives in `data/*.ts` (typed), not hard-coded in components.
- All user-facing strings go through a tiny `t()` helper reading `data/strings.en.ts`, so Hindi and Kannada can be added later.

Suggested structure:

```text
app/
  (child)/learn/page.tsx            # Path
  (child)/mission/[id]/page.tsx
  (child)/league/page.tsx
  (child)/quizzes/page.tsx
  (child)/quizzes/[id]/page.tsx
  (child)/stories/page.tsx
  (child)/stories/[id]/page.tsx
  (child)/shop/page.tsx
  (child)/me/page.tsx               # Passport: badges, level, Chiku
  parent/page.tsx
  parent/settings/page.tsx
  teacher/page.tsx
  teacher/review/page.tsx
  welcome/page.tsx                  # onboarding + consent (mock)
  dev/page.tsx                      # role switch, reset demo data, export events
components/
  ui/ (Button, Card, ProgressBar, Pill, Tabs, Modal, Toast)
  Chiku.tsx, ChikuSprite.tsx
  PathNode.tsx, WorldBanner.tsx, QuestCard.tsx, LeagueRow.tsx ...
data/
  worlds.ts, missions.ts, quizzes.ts, stories.ts, rewards.ts, peers.ts, strings.en.ts
lib/
  game/ (gc.ts, levels.ts, streak.ts, unlocks.ts, league.ts, quests.ts, rewards.ts)  # pure TS + tests
  store.ts, analytics.ts, evidence.ts, hydrate.ts
reference/
  nuvo_web_wireframe.html
```

---

## 4. Design system

Match `/reference/nuvo_web_wireframe.html`. Playful, bright, rounded, chunky.

**Colour tokens** (define as CSS variables and map into Tailwind):

| Token | Value | Use |
|---|---|---|
| `green` / `green-dark` / `green-deep` / `green-pale` | `#58CC02` / `#3C8C0A` / `#2B7A0B` / `#EAF9D8` | Primary actions, done nodes, brand |
| `blue` / `blue-dark` / `blue-pale` | `#1CB0F6` / `#1594CC` / `#E1F5FE` | Water world, secondary actions |
| `purple` / `purple-dark` / `purple-pale` | `#CE82FF` / `#A557D6` / `#F5E9FF` | Waste world, quizzes |
| `gold` / `gold-dark` / `gold-pale` | `#FFC800` / `#E0A800` / `#FFF6D9` | Current node, GC, "you" row |
| `orange` / `orange-dark` | `#FF9600` / `#DB7F00` | Streak flame, mobility world |
| `pink` / `pink-dark` | `#FF86D0` / `#D65AA8` | Community world |
| `ink` / `ink-soft` / `ink-mute` | `#3C3C3C` / `#6B6B6B` / `#AFAFAF` | Text |
| `line` / `bg` / `bg-soft` | `#E5E5E5` / `#FFFFFF` / `#F7F7F7` | Borders, surfaces |
| `cream` | `#FFF3D6` | Mascot belly and snout, soft highlights |

World colours: Water = blue, Waste = purple, Nature = green, Mobility = orange, Community = pink.

**Shape and depth**
- Cards: 2px `line` border, 16px radius, white background. **No box-shadows** except focus rings and the pulse on the current node.
- Chunky buttons: solid fill plus a **4px solid darker bottom border** (not a shadow). On press: `translateY(2px)` and bottom border becomes 2px. Radius 13px.
- Path nodes: circles with a 6px darker bottom border. States: `done` (green, check icon), `current` (gold, larger, gentle pulse), `locked` (white, grey lock).
- The path trail is a dotted SVG S-curve between nodes (light tint of the world colour; grey for locked worlds). Node positions alternate about 25% and 75% across the column.

**Typography:** Baloo 2 for headings, buttons, nav, numbers. Nunito for body. Sentence case. World banners may use title case.

**Layout**
- Desktop (above 900px): top bar (logo, streak, GC, level), then 3 columns: left nav (196px), centre content, right rail (296px: Daily quests, League preview, Shop teaser). The right rail stays visible on every tab, like Duolingo.
- Mobile (900px and below): top bar plus **bottom tab bar** (Path, Quizzes, Stories, League, Shop). Profile opens from the avatar in the top bar. The right rail collapses into a "Today" card at the top of the Path page.

**Accessibility:** WCAG AA contrast, real `<button>`/`<a>` elements, visible `:focus-visible` outlines, full keyboard use, `aria-valuenow` on progress bars, `prefers-reduced-motion` turns off the pulse and bounces, never rely on colour alone (locked nodes also show a lock icon).

---

## 5. Mascot: Chiku the pangolin

Chiku is a young Indian pangolin: curious, encouraging, never guilt-trippy. The base art below is final enough to build from. It is a scaled green back, cream face, snout and belly, a big eye with a highlight, blush, and a curled tail.

**Implementation**
- Render a hidden SVG sprite once in the root layout (`ChikuSprite`) containing the `<pattern>`, `<clipPath>`s and groups. Components then use `<use href="#chiku-body"/>` plus a face group.
- Split the art into `chiku-body` and one face group per mood (the face parts are marked in the SVG comments).
- Level theming through CSS variables on the wrapper: `--chiku-scale` and `--chiku-scale-dark`.

| Level | `--chiku-scale` | `--chiku-scale-dark` | Extra |
|---|---|---|---|
| 1 to 2 | `#A9D98A` | `#86BD64` | none (muted scales) |
| 3 to 4 | `#6CCB2C` | `#3F9A0C` | none |
| 5 and up | `#58CC02` | `#2F8F00` | small gold scarf |

**Moods** (`<Chiku mood="idle" level={4} size={64} />`)

| Mood | When | Art |
|---|---|---|
| `idle` | default | as drawn |
| `happy` | mission approved, quiz passed | eye becomes a happy arc, bigger smile |
| `thinking` | quiz question shown, mission step 1 | pupil up and right, small "o" mouth |
| `celebrate` | level up, story unlocked | happy face plus a short confetti burst and a bounce |
| `curled` | **streak shield** used, mission looks hard | scaled ball, snout tucked in |
| `sleepy` | evening reminder | closed eyes, small "z" |

**Behaviour rules**
- Chiku reacts to the child's progress. It is never a nag. Wrong quiz answers get a gentle "good try, here's why" with the `thinking` mood, never a sad face.
- **Streak shield:** once per rolling 7 days, if a day is missed, Chiku "curls up" and protects the streak automatically, with a friendly message.
- Chiku appears on: the logo, the Path callout ("Chiku says…"), quiz host, story host ("Hosted by Chiku"), shop teaser, empty states, and level-up screens.

**Base art** (viewBox `0 0 110 110`). Use this as the starting point and split as described:

```html
<defs>
  <pattern id="chk-scales" width="12" height="10" patternUnits="userSpaceOnUse">
    <path d="M0,10 Q6,2 12,10" fill="none" stroke="var(--chiku-scale-dark,#2F8F00)" stroke-width="1.8"/>
    <path d="M-6,5 Q0,-3 6,5" fill="none" stroke="var(--chiku-scale-dark,#2F8F00)" stroke-width="1.8"/>
    <path d="M6,5 Q12,-3 18,5" fill="none" stroke="var(--chiku-scale-dark,#2F8F00)" stroke-width="1.8"/>
  </pattern>
  <clipPath id="chk-body"><ellipse cx="54" cy="72" rx="30" ry="31"/></clipPath>
  <clipPath id="chk-head"><circle cx="62" cy="34" r="19"/></clipPath>
  <clipPath id="chk-tail"><path d="M38,84 C18,100 0,88 6,68 C9,58 18,58 18,64 C14,74 24,80 44,72 Z"/></clipPath>

  <g id="chiku">
    <!-- BODY GROUP (becomes chiku-body) -->
    <path d="M38,84 C18,100 0,88 6,68 C9,58 18,58 18,64 C14,74 24,80 44,72 Z" fill="var(--chiku-scale,#58CC02)"/>
    <rect x="0" y="55" width="48" height="50" fill="url(#chk-scales)" clip-path="url(#chk-tail)"/>
    <ellipse cx="46" cy="101" rx="11" ry="5.5" fill="#F4DDB0"/>
    <ellipse cx="68" cy="101" rx="11" ry="5.5" fill="#F4DDB0"/>
    <ellipse cx="54" cy="72" rx="30" ry="31" fill="var(--chiku-scale,#58CC02)"/>
    <rect x="22" y="40" width="64" height="64" fill="url(#chk-scales)" clip-path="url(#chk-body)"/>
    <ellipse cx="66" cy="78" rx="14" ry="22" fill="#F4DDB0"/>
    <circle cx="62" cy="34" r="19" fill="var(--chiku-scale,#58CC02)"/>
    <rect x="40" y="12" width="44" height="44" fill="url(#chk-scales)" clip-path="url(#chk-head)"/>
    <path d="M58,40 C58,28 74,26 82,33 L99,42 C100,47 92,50 84,50 C70,52 58,50 58,40 Z" fill="#F4DDB0"/>
    <circle cx="98" cy="43" r="3" fill="#5C4326"/>
    <!-- FACE GROUP: idle (becomes chiku-face-idle) -->
    <circle cx="73" cy="35" r="4.6" fill="#2B2B2B"/>
    <circle cx="74.6" cy="33.4" r="1.6" fill="#fff"/>
    <ellipse cx="71" cy="45" rx="3.6" ry="2.4" fill="#FFB4A0"/>
    <path d="M83,47 Q88,50.5 93,47" stroke="#8A6A3A" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  </g>
</defs>
```

---

## 6. Routes and information architecture

| Route | Who | Purpose |
|---|---|---|
| `/welcome` | new user | Onboarding: pick nickname + avatar, parent consent (mock) |
| `/learn` | child | **Path**: worlds, mission nodes, Chiku callout |
| `/mission/[id]` | child | Mission flow (Learn, Do, Prove, Reflect) |
| `/quizzes`, `/quizzes/[id]` | child | Quiz categories and the quiz player |
| `/stories`, `/stories/[id]` | child | Story and video library, story player |
| `/league` | child | Weekly league (class / school / city tabs) |
| `/shop` | child | Rewards: experiences, workshops, products, badges |
| `/me` | child | Passport: level, badges, GC history, Chiku |
| `/parent`, `/parent/settings` | parent | Dashboard, approvals, privacy and consent |
| `/teacher`, `/teacher/review` | teacher | Class overview, assign missions, evidence review |
| `/dev` | you | Role switcher (Child / Parent / Teacher), reset demo data, export event log as CSV |

Roles are a **dev-time switcher only** (no auth). Show a small "Switch role" item in the profile menu that links to `/dev`.

---

## 7. Data models and config

```ts
type Category = 'water' | 'waste' | 'nature' | 'mobility' | 'community';
type Evidence = 'photo' | 'checklist' | 'log' | 'adult';

interface World { id: string; title: string; category: Category; order: number; missionIds: string[]; unlockedBy?: string /* worldId completed */; }

interface Mission {
  id: string; worldId: string; title: string; category: Category;
  gc: number;                       // base reward
  learn: { text: string; storyId?: string };
  do: { instruction: string; supervised?: boolean; options?: string[] };
  prove: { evidence: Evidence; prompt: string };
  reflect: { prompt: string };
  repeatable: boolean;
  needsApproval: boolean;           // true for photo/adult evidence; false for checklist
}

type SubmissionStatus = 'draft' | 'pending' | 'approved' | 'redo';
interface Submission {
  id: string; missionId: string; childId: string; status: SubmissionStatus;
  evidenceKey?: string;             // idb-keyval key; image never leaves the device
  note?: string; reflection?: string;
  submittedAt?: string; reviewedAt?: string; reviewedBy?: 'parent' | 'teacher';
  reviewSeconds?: number;           // time the reviewer spent (pilot metric)
}

interface Child {
  id: string; nickname: string; avatarId: string;
  gcBalance: number;                // spendable
  gcLifetime: number;               // drives level
  streak: number; lastActiveDate: string; shieldUsedAt?: string;
  weeklyGc: number;                 // league score, resets Sunday
  settings: { showOnLeague: boolean };   // default FALSE at onboarding
  consent: { given: boolean; givenAt?: string; parentEmail?: string /* mock, never sent */ };
}

interface Quiz { id: string; title: string; category: Category; gcReward: number; questions: { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string }[]; }

interface Story {
  id: string; title: string; durationSec: number; category: Category;
  kind: 'cards' | 'video';          // 'cards' = illustrated slides with narration text (v0 default)
  cards?: { text: string; mood?: string }[];
  videoSrc?: string;                // optional mp4 or embed URL later
  unlock: { type: 'missions' | 'gc' | 'level'; value: number; worldId?: string };
}

interface Reward {
  id: string; kind: 'experience' | 'workshop' | 'product' | 'badge';
  title: string; gcCost: number; minLevel?: number; hostedBy?: string; description: string;
}
```

**Config (`lib/game/config.ts`, all tunable):**

- Level thresholds by `gcLifetime`: `[0, 250, 500, 1000, 1500, 2500, 4000]` → levels 1 to 7.
- Level titles: Seedling, Sprout, Trail finder, Nature explorer, Guardian, Champion, Banyan keeper.
- Reward tiers (for shop grouping): 0 to 250 recognition, 250 to 750 small experiences, 750 to 1,500 local experiences, 1,500 to 3,000 premium, 3,000+ special access.
- Leagues in order: Sprout, Sapling, **Banyan**, Canopy. Weekly reset Sunday 23:59 IST. Top 5 of each group of up to 30 are promoted.
- Age band for copy and difficulty: **10 to 14** (config constant, not hard-coded in copy).

---

## 8. Screens (build to the wireframe, with these behaviours)

### 8.1 Welcome and consent (mock)
Three steps: nickname + avatar (no real name field at all), a "grown-up step" (parent email field, plain-language list of what the app stores and why, checkbox), and a leaderboard-visibility choice that **defaults to off**. Finish seeds the demo state.
Label the consent step clearly in code comments: *this mocks the UX of verifiable parental consent; it does not implement it.*

### 8.2 Path (`/learn`)
Chiku callout, then world sections. Each world: banner (title, "x of y missions complete"), then absolutely positioned nodes with an SVG S-curve trail. Locked worlds use a grey banner and grey trail. Tapping a `current` or `done` node opens a bottom sheet / popover with title, GC reward and a **Start** button; locked nodes show what unlocks them. A pulse on the current node only. Below the last unlocked world, show "More worlds unlock as you progress".

### 8.3 Mission flow (`/mission/[id]`)
A four-step stepper: **Learn** (text plus optional story link) → **Do** (instruction, supervised label, option chips e.g. 500 m or 1 km) → **Prove** (evidence: photo via `<input type="file" accept="image/*" capture>`, checklist, or journey log; show "stays on this device") → **Reflect** (one prompt, short text, 140 chars). On submit:
- `needsApproval: false` → auto-approved, GC awarded immediately, Chiku `celebrate`.
- `needsApproval: true` → status `pending`, UI shows "+80 GC pending a grown-up's check". Parent or teacher approves in their view, then GC lands and the node completes.
Redo requests show a kind note from the reviewer and let the child resubmit.

### 8.4 Quizzes
Category cards (Myth or fact, Water wise, Waste sorting, Climate basics). Player: one question per screen, big tappable options, Chiku `thinking`, instant feedback with the one-line explanation, progress bar, result screen with GC. Wrong answers are always framed as learning.

### 8.5 Stories and video
Tabs: Stories, Mini-games (stub card, "coming soon"), How-to. Hero story card plus a grid; locked stories show a lock badge and the unlock rule ("Unlocks at 1,500 GC", "Unlocks at Level 5"). Story player: for `kind: 'cards'`, a full-screen swipeable slide show with narration text, Chiku host, progress dots and a Next button; for `kind: 'video'`, a `<video controls>` with poster and captions-ready `<track>`. First completion awards a small GC bonus and offers the linked mission.

### 8.6 League
Banyan league header, scope tabs (Class / School / City: only Class has data in v0), ranked list by **weekly GC**, a "promotion zone ends here" divider after rank 5, the current child highlighted. Nickname + avatar only. If `showOnLeague` is false, show a friendly empty state ("Ask a grown-up to turn on the class league") and a personal "your week vs last week" card instead.

### 8.7 Shop
Tabs: Experiences, Workshops, Products, Badges. Cards show cost in GC and a state: Unlock, Not enough GC (with how many more), or Level required. **Unlock** opens a confirm modal, spends `gcBalance`, creates a local voucher, and shows "Unlocked. A grown-up will be asked to confirm the booking." Experiences are hosted by friends/partners, so booking is manual in v0.

### 8.8 Me (Passport)
Large Chiku at the current level theme, level title and progress to next level, badge grid (earned and locked), world completion rings, GC history list.

### 8.9 Parent dashboard
Summary row (level, streak, GC), **pending approvals** (thumbnail, mission, Approve / Ask to redo, with a visible timer that records `reviewSeconds`), suggested family mission of the week, upcoming experience, and a **Privacy and data** panel: what is stored, leaderboard visibility toggle, "Manage consent", and mock "Export data" and "Delete data" buttons.

### 8.10 Teacher
Class overview (students, % active this week, missions completed), an **Assign mission** picker, and the same review queue as the parent view across students, with a CSV export of the weekly summary.

### 8.11 Right rail (desktop)
- **Daily quests** (3 per day, e.g. finish 2 missions, score 80% on a quiz, keep your streak) with progress bars and GC chips.
- **League preview**: top 2 plus "you", and a ghost button to the League tab.
- **Chiku's shop**: one featured reward and a "Visit shop" button.

---

## 9. Game logic (pure TS in `lib/game`, with unit tests)

- **GC award:** mission GC is paid on approval. `gcBalance` and `gcLifetime` both increase; `weeklyGc` increases; spending only reduces `gcBalance`.
- **Level:** derived from `gcLifetime` using the thresholds, so spending never lowers a level.
- **Streak:** a day counts when the child completes at least one mission submission, quiz or story. Day boundary uses IST. A missed day uses the **streak shield** if available (once per rolling 7 days), otherwise the streak resets to 0 with a gentle message.
- **Anti-gaming (missions are the product):**
  - Repeating the same mission within 7 days pays 25% and is limited to once per day.
  - Quizzes pay on the first attempt scoring 60% or more; replays are allowed but pay 0. Maximum 3 paid quizzes per day.
  - Quizzes + stories + quests together may contribute at most **30%** of GC in any rolling 7 days; beyond that they pay 0 and Chiku explains kindly that missions are where the big rewards are.
- **Unlocks:** worlds unlock when the previous world is fully complete. Stories unlock by missions completed, GC or level. Rewards can require a minimum level.
- **League:** rank by `weeklyGc` within the group, tie-break by earliest to reach the score. Seed 29 fake peers (first names only) for demo.
- **Daily quests:** generate 3 per day deterministically from the date so they are testable.

Write Vitest tests for: level from GC, streak with and without shield, repeat-mission reduction, the 30% non-mission cap, reward affordability, league ranking and promotion.

---

## 10. Seed content

Write all child-facing copy yourself in the voice described in section 2. Reading level about Grade 6. Keep every mission safe, free and doable at home or school.

**Worlds and missions** (the demo child starts with the first three Water missions done and *Water detective* as the current node):

| World | # | Mission | GC | Evidence |
|---|---|---|---|---|
| Water (blue) | 1 | Tap-off challenge: brush teeth with the tap off for 3 days | 60 | checklist |
| | 2 | Leak hunt: check taps for drips with a grown-up | 70 | photo |
| | 3 | Rain watcher: spot where rainwater could be collected | 70 | photo |
| | 4 | **Water detective**: find 3 places water is wasted at home | 80 | photo |
| | 5 | Water map: trace where your home's water comes from | 90 | log |
| Waste (purple) | 1 | Sort it right: sort one day of household waste | 70 | photo |
| | 2 | Waste remix: turn a discarded item into something useful | 100 | photo |
| | 3 | Bag-free errand: shop with a cloth bag | 60 | adult |
| | 4 | Compost starter: set up a small compost jar | 90 | photo |
| | 5 | Swap shop: swap or pass on 3 things you no longer use | 80 | adult |
| Nature (green) | 1 | Nature spotter: identify 3 local plants, insects or birds | 70 | photo |
| | 2 | Sapling care: plant a seed and water it for a week | 100 | log |
| | 3 | Urban bird watch: 10 quiet minutes, list the birds | 70 | log |
| Mobility (orange) | 1 | Walk one journey: replace a short trip with a walk (500 m or 1 km, adult-supervised) | 80 | adult |
| | 2 | Ride-share chat: ask your family about sharing a ride | 60 | log |
| Community (pink) | 1 | Teach one person: explain one thing you learned to a family member | 70 | log |
| | 2 | Neighbourhood tidy: supervised litter pick | 120 | adult |

**Quizzes:** Myth or fact (10), Water wise (8), Waste sorting (8), Climate basics (12). For the prototype write **5 questions each**, with a one-line explanation. Facts must be accurate and India-relevant, with no invented statistics (`TODO(verify)` where a number would help).

**Stories** (`kind: 'cards'`, 5 to 8 slides each):
1. *Why does Bengaluru run out of water?* (hero, unlocked by 3 Water missions)
2. *What happens to a plastic bottle?* (unlocked)
3. *Meet the pollinators* (unlocked)
4. *Build a rain garden* (unlocks at 1,500 GC)
5. *Climate mysteries: the missing lake* (unlocks at Level 5)

**Rewards:** Urban bird walk (900 GC), Climate lab (700 GC), Grow-at-home kit (450 GC), Nature adventure (2,000 GC, min level 4), plus 8 badges (e.g. Water guardian, Waste warrior, 7-day streak, first quiz).

**League peers:** 29 fake first-name-only peers with weekly GC scores spread from about 800 to 2,400; the demo child ("Ishaan") sits around rank 7 in the wireframe.

---

## 11. Privacy and safety requirements for the prototype

- Children are **nickname + avatar only**, in the UI and in the data model. No surname, no school name on a child profile, no photo of the child.
- Evidence images stay on the device (IndexedDB) and are only visible to the child, parent role and teacher role *of the same demo class*.
- Leaderboard visibility is **opt-in and defaults to off**. Class-level only by default.
- The consent screen is a **UX mock**. India's DPDP Act (2023) treats under-18s as children and requires verifiable parental consent for processing their data. Before any pilot with real children, the consent flow, data handling and storage must be properly designed and reviewed. Until then, demo data only.
- No ads, no behavioural tracking, no external analytics.
- `lib/analytics.ts` logs events locally only: `session_start`, `mission_started`, `mission_submitted`, `mission_approved`, `quiz_completed`, `story_completed`, `reward_unlocked`. Include timestamps, role and `reviewSeconds`. `/dev` can export them as CSV. These map to the pilot KPIs: first-mission activation, week-4 retention, mission completion and reviewer time per mission.

---

## 12. Build phases and acceptance criteria

**Phase 0: foundation**
Scaffold, Tailwind tokens, fonts, root layout with the responsive shell (top bar, left nav, right rail, mobile bottom nav), `ChikuSprite` + `Chiku` component with all moods and level theming, UI primitives, typed seed data, Zustand store with hydration guard, `/dev` page (role switch, reset, export).
*Done when:* the shell matches the wireframe at desktop and mobile widths, Chiku renders at 24px to 160px in every mood and level theme, and `/dev` resets the demo data.

**Phase 1: the child core loop**
Welcome flow, Path with winding trail and node states, mission flow with the four steps, evidence capture, GC / level / streak logic with tests, daily quests, Chiku callout, Me page.
*Done when:* a new user completes onboarding, opens Water detective, finishes all four steps with a photo, sees "pending" status, switches to the Parent role in `/dev`, approves it, switches back, and sees GC increase, the node become done, the next node unlock, the streak update and Chiku celebrate. Unit tests for `lib/game` pass.

**Phase 2: engagement surfaces**
Quizzes (list and player), Stories (library and card/video player, lock rules), League (ranking, promotion divider, opt-in empty state), Shop (unlock flow with vouchers).
*Done when:* a quiz awards GC once and then 0 on replay, the 30% non-mission cap works, a locked story unlocks when its rule is met, the league re-ranks after the child earns GC, and unlocking a reward spends `gcBalance` but never lowers the level.

**Phase 3: grown-ups**
Parent dashboard and settings, approval queue with review timer, teacher dashboard, assign mission, review queue, CSV export.
*Done when:* turning off leaderboard visibility in Parent settings instantly changes the child's League tab, and the exported CSV includes mission, status and `reviewSeconds`.

**Phase 4: polish and ship**
PWA manifest and icons (use Chiku), offline shell, reduced-motion pass, accessibility pass (axe or Lighthouse above 90), empty and error states, deploy to Vercel, short README with run and reset instructions.
*Done when:* the deployed link works on a phone, installs to the home screen, and Lighthouse accessibility is at least 90.

---

## 13. Working agreement for Cursor

- Read this brief and the wireframe fully before writing code.
- Before coding, reply with a plan: file tree, dependency list with one-line reasons, ambiguities or conflicts in the brief, and phase breakdown. Wait for "go".
- Build **only the phase requested**. Do not start the next one.
- TypeScript `strict`, no `any`. Small components. Typed data in `data/`.
- No new dependency without listing it and why.
- After each phase run typecheck, lint and tests, then summarise what changed and how to verify it.
- Make small, descriptive commits.
- If something is unclear, ask one concise question rather than guessing.
- Never add features outside the brief (no auth, no payments, no backend).

---

## 14. Copy-paste prompts

**Prompt 0: kickoff (plan only)**
```text
You are my senior full-stack engineer. Read @PROJECT_BRIEF.md and @reference/nuvo_web_wireframe.html fully before doing anything.

We are building the Nuvo Circle prototype as a mobile-first Next.js PWA. Do not write code yet. Reply with:
1. the proposed file tree,
2. the dependency list with a one-line reason for each,
3. anything in the brief that is ambiguous or conflicting,
4. your plan for Phases 0 to 4.

Wait for me to say "go".
```

**Prompt 1: Phase 0 and 1**
```text
go. Implement Phase 0, run typecheck and lint, then implement Phase 1 exactly as described in @PROJECT_BRIEF.md sections 4 to 9 and 12. Match the visual design of @reference/nuvo_web_wireframe.html, including the winding SVG trail and the Chiku mascot (use the base art in section 5). Write Vitest tests for lib/game. Stop after Phase 1 and give me a checklist to verify the Phase 1 acceptance criteria. Do not start Phase 2.
```

**Prompt 2: Phase 2**
```text
Implement Phase 2 from @PROJECT_BRIEF.md: Quizzes, Stories (cards and video), League, Shop. Follow section 8 and 9 rules, including the 30% non-mission GC cap and the opt-in leaderboard empty state. Add tests for the new game logic. Stop after Phase 2 with a verification checklist.
```

**Prompt 3: Phase 3**
```text
Implement Phase 3 from @PROJECT_BRIEF.md: Parent dashboard and settings, approval queue with a review timer that records reviewSeconds, Teacher dashboard with assign-mission and CSV export. Stop with a verification checklist.
```

**Prompt 4: Phase 4**
```text
Implement Phase 4 from @PROJECT_BRIEF.md: PWA manifest and icons, offline shell, reduced-motion and accessibility pass (target Lighthouse accessibility 90+), empty and error states, README, and Vercel deploy instructions. Then do a final review of the whole app against sections 2, 8 and 11 of the brief and list any gaps.
```

**Useful follow-ups**
```text
Review the code you just wrote against @PROJECT_BRIEF.md and list every place it deviates, then fix the deviations.
```
```text
The UI does not match @reference/nuvo_web_wireframe.html in [screen]. Compare them, list the differences, and fix them.
```

---

## Appendix: `.cursor/rules/nuvo.mdc`

```text
---
description: Nuvo Circle project conventions
alwaysApply: true
---
- Source of truth is PROJECT_BRIEF.md. If code and brief disagree, the brief wins.
- Next.js App Router, TypeScript strict, Tailwind, Zustand (persist), Framer Motion, lucide-react.
- lib/game must stay pure TypeScript with no React imports, and every function there has a unit test.
- All copy goes through t() and data/strings.en.ts. Content lives in data/*.ts.
- Design: 2px borders, 16px radius, no box-shadows except focus rings, chunky buttons use a 4px darker bottom border.
- Never add real money, auth, backend or third-party analytics. Children appear as nickname + avatar only.
- Tone: warm and encouraging. No guilt, shame or doom messaging.
- Do not invent statistics. Add // TODO(verify) where a fact needs a source.
- Respect prefers-reduced-motion. Keep everything keyboard accessible.
- Build only the phase requested.
```
