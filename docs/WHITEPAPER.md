# Padel Club — Whitepaper & Execution Plan

*Building the default app every padel player keeps on their phone.*

**Status:** Living document · v1 · last updated 2026-06-23
**Current build:** React PWA + Supabase, live on Vercel. Verified golf-style handicap engine, match-confirmation flow, friends system, premium court-inspired UI.

---

## 0. Executive Summary

Padel is the fastest-growing racket sport in the world, but the digital ecosystem around it is **fragmented and booking-centric**. Players' competitive identity — who they've beaten, how they're improving, where they rank among friends — lives nowhere. Booking apps own the *transaction*; nobody owns the *player's record and social rivalry*.

**Padel Club is the competitive and social layer for padel.** Every match a player plays produces a verified result and an honest, transparent handicap that moves like a golf handicap — down when you play well, up when you don't. It is club-agnostic (works on any court, with any friends), socially viral (your rivals must confirm scores, which pulls them in), and built to scale from a friend group to a global ladder.

We win not by competing head-on with booking giants, but by owning the **identity + integrity + social graph** they neglect — then expanding into matchmaking, club tools, and bookings from a position of player loyalty.

**The wedge:** a handicap players actually trust, because results are confirmed by opponents, not self-reported.

**The business:** freemium consumer subscriptions + B2B club/league tooling + booking & gear affiliate + sponsored competition. Not banner ads.

---

## 1. Product Vision

### What this becomes
The **player's padel home**: a single identity that carries your handicap, match history, rivalries, achievements, and rank everywhere you play. The Strava-for-padel meets the official-handicap-of-padel. Over time, the place you also *find* games, *book* courts, and *join* competitions — but identity and the social ledger come first because they create lock-in.

### Why each audience needs it
- **Players** want to know: *Am I getting better? Am I better than my friends? Who do I play next?* Today there's no trusted answer. A confirmed, transparent handicap answers all three and turns every casual game into something that "counts."
- **Clubs** want retention, full courts, and active members. A club leaderboard, internal ladders, and member activity data give them a reason to promote us — and we ride their existing communities for distribution.
- **Communities/friend groups** want bragging rights and easy organization. Rivalries, group leaderboards, and challenge mechanics make the app the default group chat companion for "who's playing this week and who's actually winning."

### The biggest pain points today
1. **No trusted skill rating across contexts.** Booking-app "levels" are opaque, self-assigned or club-locked, and gameable. Players argue about who's better with no source of truth.
2. **Score integrity.** Self-reported results mean nothing. There's no "confirmed by both teams" standard.
3. **Fragmentation.** Booking, ranking, social, and stats live in different silos (or nowhere). Your record doesn't follow you between clubs.
4. **Casual players are ignored.** Existing tools optimize for booking and organized competition. The 80% who just play friends weekly have no product built for them.
5. **Weak social/identity layer.** No profiles worth having, no rivalries, no reason to open the app daily.

### Positioning: the must-have
> *"Padel Club is your padel record. Every match, confirmed by your opponents, becomes a handicap you can trust and a rivalry you can settle."*

Must-have status comes from **network-locked identity**: once your friends and club are on it and your handicap reflects real games, leaving means losing your record and your rank. That is the moat.

---

## 2. Core Features (MVP → Future)

Features are grouped by job-to-be-done and tagged: **[Built]**, **[MVP]** (next launch), **[Edge]** (competitive advantage), **[Engage]** (daily retention), **[Future]**.

### Identity & Rating
- **[Built]** Player profile, golf-style handicap (0–50, lower = better), match history.
- **[Built]** Opponent-confirmed results — handicaps only move when all registered players accept. *This is the integrity differentiator.*
- **[MVP]** Handicap trend chart, win/loss record, current form (last 5).
- **[Edge]** Transparent rating explainer ("why did my handicap move?") — trust through transparency.
- **[Edge]** Verified badge / provisional vs established status (calibration period).
- **[Future]** Multi-dimensional rating (offense/defense/consistency), position-aware (left/right side).

### Social Graph
- **[Built]** Friends (request / accept), club-wide leaderboard.
- **[MVP]** Rivalries (head-to-head record vs each friend), activity feed.
- **[Engage]** Group/club leaderboards, "you moved up 2 places" notifications.
- **[Future]** Clubs as first-class entities, follow players, comments/reactions on matches.

### Match Lifecycle
- **[Built]** Create match (1v1 / 2v2), guests + registered players, set scores, live win-probability preview.
- **[MVP]** Edit/cancel a pending match; rematch button; match notes/photos.
- **[Edge]** **Find a game / find players** at your level nearby — the matchmaking flywheel.
- **[Future]** Open matches (post a slot, others join), waiting lists, no-show tracking.

### Competition & Gamification
- **[Engage]** Achievements/badges (first win, giant-killer, 10-match streak), weekly challenges.
- **[Edge]** Ladders & seasons (resettable competitive ranking with promotion/relegation).
- **[Future]** Tournaments (creation, brackets, check-in), sponsored events, prizes.

### Discovery & Logistics
- **[Future]** Court booking integration (partner APIs / affiliate).
- **[Future]** Club directory, court availability, "book your rematch here."

### Intelligence
- **[Edge]** AI partner/opponent recommendations ("play X to climb fastest", "balanced match suggestion").
- **[Future]** AI coaching insights from match patterns; video/highlight tagging.

### Coaching & Training
- **[Future]** Drill library, coach profiles, lesson booking, progress tracking — a later marketplace.

**Launch priority (the 20% that delivers 80%):** confirmed results (done), handicap + trends, rivalries/head-to-head, find-a-game, notifications, achievements. These create trust, daily reasons to open, and viral pull.

---

## 3. Monetization Strategy

### Verdict on ads — **No programmatic banner ads.**
Banner/programmatic ads are wrong for this product: they cheapen a premium brand, generate negligible revenue until you have hundreds of thousands of DAU, and degrade the exact UX that drives retention. **Sponsorship ≠ ads:** brand-sponsored tournaments, challenges, and "powered by" placements are welcome and lucrative; programmatic banners are not. Use brand integration, not ad networks.

### Revenue model (ranked by long-term value)

| Stream | Model | When | Notes |
|---|---|---|---|
| **Pro subscription (B2C)** | Freemium, ~€4.99/mo or €39/yr | Phase 2 | Analytics, unlimited history, advanced rivalries, custom profile, early features. Core recurring revenue. |
| **Club / league tools (B2B)** | Per-club SaaS, €30–150/mo tiers | Phase 3 | Branded leaderboards, ladder & tournament management, member analytics. Highest ARPU; clubs have budgets. |
| **Booking affiliate** | Commission per booking | Phase 3 | Integrate partner booking platforms; earn on "book your rematch." Passive, high intent. |
| **Sponsored competition** | Brand pays per event/season | Phase 3+ | Padel brands (Bullpadel, Head, Babolat, adidas, Nox) sponsor ladders/challenges/giveaways. |
| **Gear marketplace / affiliate** | Commission | Phase 3+ | Level-based racket recommendations → retailer commission; later a marketplace. |
| **Tournament service fee** | % of paid entries | Phase 4 | Stripe Connect for payouts. Community + revenue. |
| **Coaching marketplace** | Take rate on lessons | Phase 4+ | Connect coaches and players; transaction fee. |

### Free vs Premium split (designed so free stays genuinely useful — that's what grows the network)
- **Free forever:** unlimited match logging, handicap, friends, club leaderboard, basic profile, achievements. The network effect *requires* free to be great.
- **Pro:** handicap analytics & projections, full history & filters, head-to-head deep stats, partner-optimizer AI, custom themes/verified badge, priority in find-a-game.

### Why this is a better business than ads
Subscriptions + B2B compound and retain; affiliate monetizes intent at the moment of value; sponsorship scales with audience without harming UX. Ads would extract pennies while eroding the trust and polish that make the product defensible.

---

## 4. Technical Architecture & Scalability

### Current stack (validated, keep it)
- **Frontend:** React + Vite **PWA**, Tailwind. Installable, cross-platform, instant updates, one codebase.
- **Backend:** **Supabase** — Postgres, Auth, Row-Level Security, Realtime, Edge Functions, Storage.
- **Hosting:** Vercel (edge CDN, auto-deploy from GitHub).
- **Integrity logic:** server-side `SECURITY DEFINER` Postgres functions (`create_match`, `respond_to_match`) so ratings can't be tampered with client-side.

This stack is correct for speed-to-market **and** scale. Supabase/Postgres comfortably serves millions of users with the right indexing, pooling, and caching.

### Recommended evolution
- **Mobile presence:** keep PWA-first; wrap with **Capacitor** for App Store / Play Store listings + native push notifications. "On every phone" needs store presence and push, not a separate native rebuild.
- **Notifications:** push (Web Push + Capacitor) — the retention backbone (confirm requests, rivalry updates, "your turn"). Add early.
- **Payments:** **Stripe** (subscriptions) and **Stripe Connect** (tournament/coach payouts) when monetizing.
- **Search/discovery:** Postgres + PostGIS for "players/courts near me"; add a search service only if needed.

### Data model (current + planned)
- **Now:** `profiles`, `matches`, `match_players`, `friendships`. Ratings written only via secured functions; RLS on every table.
- **Planned additions:** `clubs`, `club_members`, `courts/venues` (with geo), `match` gains optional `club_id`/`venue_id`, `seasons`/`ladders`, `achievements`, `notifications`, `subscriptions`. **Add the optional club/venue reference to matches early** — cheap now, painful to retrofit; unlocks B2B and booking.

### Scaling 1K → 1M+
- **1K:** current setup is plenty. Focus on indexes (already on hot foreign keys) and correctness.
- **10K–100K:** connection pooling (Supavisor), read replicas for leaderboards/feeds, cache leaderboards (materialized views refreshed on a schedule), move heavy aggregations to scheduled jobs/edge functions, CDN everything static.
- **100K–1M+:** partition `matches`/`match_players` by time, denormalize rating snapshots for fast history, event-driven recompute, rate limiting, regional read replicas. Keep the rating computation authoritative and idempotent (already is).
- **Reliability:** treat rating writes as transactional and replayable; nightly integrity checks; backups + point-in-time recovery (Supabase provides).

### Security & privacy
- RLS-first (done). Secrets server-side; publishable keys only client-side (done).
- **GDPR/EU-ready** (likely core market): explicit consent, data export & delete, minimal PII, clear privacy policy. Bake in before scale.
- Anti-abuse: confirmation flow already blocks fake results; add anomaly detection (impossible scores, collusion patterns) as ladders introduce stakes.

---

## 5. Growth Strategy

The product *is* the growth engine: **you cannot have a handicap without opponents, and opponents must confirm your matches** — every match invites 1–3 other people in.

### Viral loops (build these in)
1. **Confirm-to-join:** logging a match against a non-user sends them an invite to confirm the result → they sign up to accept/dispute. Highest-intent invite possible.
2. **Rivalry pull:** "X just took the lead in your head-to-head" notifications drag lapsed players back.
3. **Leaderboard envy:** group/club rankings make non-members want in.
4. **Shareable identity:** a clean, branded match/handicap card to post in WhatsApp groups and Instagram stories.

### First 100 → 1,000 → 10,000
- **First 100 (your courts):** seed your own padel circle and 1–2 local clubs. Hand-onboard whole friend groups (the network only works in clusters). Be physically present at courts.
- **To 1,000 (club-by-club):** partner with local clubs — free branded leaderboard in exchange for promoting the app to members. Run a launch "club ladder" with a small sponsored prize. Land clusters, not scattered individuals.
- **To 10,000 (replicable playbook + referrals):** referral rewards (Pro time for inviting friends who play a match), city-by-city expansion using the club playbook, ambassador program (coaches, club managers, competitive players), content/UGC (handicap cards, rivalry stories).

### Channels
- **Clubs first** (highest leverage distribution in padel). A signed club = dozens-to-hundreds of clustered users.
- **Community/WhatsApp groups** — where padel is actually organized; design shares for that surface.
- **Social** (Instagram/TikTok): handicap glow-ups, rivalry beefs, "giant killer" moments — padel content performs.
- **Local ambassadors & coaches** as multipliers.

### Retention (matters more than acquisition)
Weekly play cadence + push notifications (confirm requests, rivalry shifts, weekly challenge, "your group leaderboard updated") + achievements + seasons. North-star: **confirmed matches per weekly active user.**

---

## 6. Competitive Analysis

| Player | Strength | Gap we exploit |
|---|---|---|
| **Playtomic** | Dominant booking + matchmaking; large user base; a "level" system | Booking-first; level is opaque, club/booking-locked, feels gameable; weak social/rivalry identity; built around paid court transactions, not casual friend play |
| **Club booking SaaS** (Matchi, MatchPoint, Playtomic-for-clubs, etc.) | Deep club operations & scheduling | B2B/admin-focused; no cross-club player identity, no social ledger, nothing for the casual player |
| **Generic sports/score apps & spreadsheets** | Simple logging | No padel-specific rating, no confirmation/integrity, no network, no polish |
| **National federation rankings** | Official for licensed competitors | Tiny addressable base; bureaucratic; irrelevant to the casual majority |

### How we differentiate (defensible)
1. **Trusted, transparent, confirmed handicap** — the integrity standard no one else offers.
2. **Club-agnostic identity** that follows the player everywhere (not locked to one club's booking system).
3. **Built for the casual majority**, not just bookers and licensed competitors.
4. **Social/rivalry layer** that creates daily engagement and viral pull.
5. **Premium brand & UX** that feels like a product players are proud to show.

**Coexistence, not collision:** we are the player's *record and rivalry*; booking platforms are the *transaction*. We can integrate their bookings later — but they can't easily replicate a trusted social rating ledger, because that requires the player social graph we own.

---

## 7. Development Roadmap

Speed to market, but no dead-ends. Each phase ships something usable and is built on the scalable foundation above. Sequencing assumes ongoing iteration with you.

### Week 1 — Foundation & first usable loop *(largely DONE)*
- ✅ Schema, secured rating engine, confirmation flow, friends, premium UI, deployed.
- ▶ Remaining: push-notification groundwork, edit/cancel match, basic handicap trend, polish onboarding.

### Weeks 2–4 — Core engagement & first real users
- **Notifications** (confirm requests, rivalry/leaderboard updates) — retention backbone.
- **Rivalries / head-to-head** + activity feed.
- **Handicap analytics v1** (trend chart, form, win rate) — first Pro hook.
- **Achievements + weekly challenge** — daily reasons to return.
- **Shareable match/handicap card** — viral surface.
- **Onboarding** that lands whole friend groups.
- **Goal:** first 100 real users via your own courts + 1 partner club; measure confirmed-matches/WAU.

### Months 2–3 — Find-a-game & clubs
- **Find a game / players near your level** (geo + handicap matching) — matchmaking flywheel.
- **Clubs as entities** + club leaderboards (B2B beachhead, club distribution).
- **Capacitor wrap** → App Store/Play Store presence + native push.
- **Pro subscription launch** (Stripe) once analytics depth justifies it.
- **Referral system.**
- **Goal:** 1,000 users across several clubs; first paying Pro users; first club pilot.

### Months 4–6 — Competition & monetization depth
- **Seasons & ladders** (promotion/relegation, resets) — competitive retention.
- **Club tooling** (tournament/ladder management) → first B2B revenue.
- **Booking affiliate** integration; **gear affiliate**.
- **Sponsored challenge/tournament** with a padel brand.
- **Goal:** 10,000 users; multiple paying clubs; first sponsorship/affiliate revenue.

### Months 6–12 — Platform & scale
- AI recommendations, coaching marketplace, tournament platform with payouts, deeper integrations, multi-region scaling, city/country expansion playbook.
- **Goal:** establish the city-by-city expansion engine; sustainable multi-stream revenue.

---

## 8. Metrics That Matter
- **North star:** confirmed matches per weekly active user.
- **Growth:** viral coefficient (invites per match → activated users), club partnerships signed, weekly new clusters.
- **Retention:** W1/W4 retention, weekly play cadence, notification opt-in & CTR.
- **Revenue:** free→Pro conversion, Pro MRR, B2B MRR, affiliate/sponsorship revenue.

## 9. Key Risks & Mitigations
- **Cold-start / network effect:** mitigate by onboarding *clusters* (friend groups, clubs), not individuals; confirm-to-join loop.
- **Incumbent (Playtomic) enters social/rating harder:** move fast on trusted-rating + social identity; partner with clubs they underserve; integrate rather than fight on booking.
- **Rating gaming/collusion:** confirmation flow + anomaly detection + provisional periods.
- **Monetizing too early:** keep free great until the network is sticky; monetize depth and clubs, not the core loop.
- **Single-founder velocity:** ruthless prioritization (the launch-priority list), scalable foundation so you don't rebuild.

## 10. Immediate Next Steps (this week)
1. Edit/cancel a pending match + rematch.
2. Handicap trend chart on profile (first analytics hook).
3. Push-notification groundwork (confirm requests).
4. Shareable match/handicap card.
5. Add optional `club_id`/`venue_id` to the match model (cheap future-proofing).
6. Line up one local club for a pilot leaderboard.

---

*This is a living document. As we build and learn from real users, revisit vision, priorities, and monetization here.*
