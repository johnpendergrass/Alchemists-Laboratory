# Claude-ToBe-Continued — The Alchemist's Laboratory
**Date:** 2026-06-26  |  **Session:** 1 (initial build)

---

## What Was Built This Session

This was the first session. The project started as an empty folder.
Claude chose the theme (alchemy), designed the full game, and built it
from scratch in one session.

**Files created:**
```
D:\Dev\Projects\claude-IDLEgame\
├── index.html                  — page structure (3-column layout)
├── style.css                   — dark mystical theme, all animations
├── game.js                     — complete game logic (7 clearly labeled sections)
└── claude-john-docs\
    ├── specifications.md
    ├── specifications-technical.md
    └── Claude-ToBe-Continued-2026-0626-1200.md  (this file)
```

---

## Current State of the Game

The game is **fully playable**. It has:

- A clickable cauldron that generates Essentia with floating "+N" labels
- **6 buildings** (Candle → Alembic → Athanor → Philosopher's Still →
  Celestial Orrery → Grand Arcanum) with exponential cost scaling
- **14 upgrades** spread across click power, per-building multipliers,
  and global multipliers — they appear gradually as conditions are met
- **8 milestones** that fire as lifetime Essentia grows
- **14 news ticker messages** that rotate every 24 seconds
- Animated bubbling cauldron, gold/purple color scheme, dark background
- Lightweight game loop (10 ticks/sec) that separates full rebuilds from
  per-tick lightweight updates for performance

---

## What Was NOT Built (Intentional for v1)

- **No save/load** — state resets on page refresh
- **No offline progress** — passive income only accrues while the tab is open
- **No prestige/rebirth system**
- **No achievements beyond milestones**
- **No sound**
- **No mobile layout** (works on desktop, may be cramped on small screens)

---

## Immediate Next Steps (If John Wants to Continue)

These are natural "next feature" candidates, roughly in order of fun/impact:

1. **Save / Load via localStorage** — most impactful QoL feature. The state
   object is already well-structured; just need `JSON.stringify` / `JSON.parse`
   with `Set` converted to Array. Auto-save every 30 seconds.

2. **Animated/tweened number display** — the Essentia counter jumps; a smooth
   count-up animation would feel more satisfying.

3. **Prestige system** — "Transmute Everything" button that resets buildings
   but grants a permanent multiplier. Classic idle-game meta-loop.

4. **More upgrades** — the Still and Orrery only have one upgrade each;
   adding a second tier would extend mid-game longevity.

5. **Achievement badges** — "Own 100 Candles", "Click 1000 times", etc.
   Displayed as a row of icons, unlocking with a pop animation.

6. **Offline earnings** — on page load, check `Date.now()` vs a saved
   timestamp, award a fraction of what would have been earned offline.

7. **Visual milestone popups** — instead of just a log entry, show a
   brief centered toast notification when a milestone fires.

---

## Known Issues / Things to Watch

- The news ticker animation restart (`animation: none` + forced reflow) works
  in Chromium but could theoretically glitch in some browsers. Low priority.
- The `Set` in `milestonesReached` will need to be serialized as an Array
  if/when localStorage save is added.
- Building production labels in the cards don't update when globalMultiplier
  changes (they update correctly in the PPS total, just not the "per sec each"
  label on the card). Minor cosmetic issue.

---

## Design Decisions Made This Session

| Decision | Chosen | Why |
|---|---|---|
| Theme | Alchemy | Universal, visually rich, timeless |
| Resource name | Essentia | Latin for "essence" — fits alchemy perfectly |
| Cost curve | 1.15× multiplier | Standard idle-game; gentle early, steep late |
| Click bonus | 10% of building PPS | Keeps clicking relevant at any stage |
| Game loop | 10 ticks/sec (100ms) | Smooth enough; not CPU-heavy |
| Upgrade reveal | condition-based | More engaging than all-visible-upfront |
| Save system | None (v1) | Simplicity; can add later |
| Number format | K / million / billion | Familiar, readable |
