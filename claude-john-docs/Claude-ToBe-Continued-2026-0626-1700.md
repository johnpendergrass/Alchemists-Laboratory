# Claude-ToBe-Continued — The Alchemist's Laboratory / AI Game Design
**Date:** 2026-06-26  |  **Session:** 1 (design discussion wrap-up)

---

## What Happened This Segment

A short but substantive design discussion about AI-native game design.
No code was written. One new document was produced and pushed to GitHub.

**New file:**
`claude-john-docs/claude-designed-euro-game-ideas.md`

---

## The Discussion

John observed that the AI-native game Claude had described earlier —
present a problem, AI responds, evaluate the response, award points —
sounds structurally similar to a Euro-style resource management game.
He asked: is that already a good AI game? What would you change?

**Short answer:** Euro games are already much closer to a good AI game
than an idle game is. The strategic depth is real. The main problems are:

1. **Dice randomness** — noise, not interesting uncertainty. Replace with
   hidden information that rewards probabilistic reasoning.
2. **The social/table layer** — bluffing, reading faces, negotiation.
   An AI has no access to this. Design around it rather than pretending it exists.
3. **The ego dimension** — humans care about winning in a way that creates
   stakes. An AI doesn't have the same emotional investment.

**Five modifications to make a Euro game AI-native:**
1. Replace dice with hidden information / epistemic uncertainty
2. Require explicit plan declaration each round; score the reasoning quality
3. Add calibration scoring — the AI predicts its own performance; accuracy is rewarded
4. Extend the planning horizon dramatically (50-500 rounds vs. 90 minutes)
5. Make opponent modeling an explicit, scored mechanic

**The reframe John's question produced:** Rather than designing an AI game
from scratch, it may be more productive to take an existing Euro structure
and surgically modify it along those five dimensions. The skeleton already
exists.

Full write-up: `claude-john-docs/claude-designed-euro-game-ideas.md`

---

## Where This Leaves the Two Projects

### Project 1: The Alchemist's Laboratory (existing)
Status unchanged from the 1600 ToBe-Continued. Playable, live on GitHub
Pages, no save system yet.
- Repo: https://github.com/johnpendergrass/Alchemists-Laboratory
- Live: https://johnpendergrass.github.io/Alchemists-Laboratory/

### Project 2: AI-Native Euro Game (conceptual only)
No code, no repo, no name. Ideas only. The design doc sketches a prototype:
- 3-4 resource types
- A market with hidden information instead of dice
- 2-3 AI players (Claude playing all roles)
- Mandatory plan declaration + calibration scoring each round
- 50-100 round arc to start
- One Claude instance potentially acting as judge/evaluator

This has not been approved or started — it's a possible next project.

---

## Suggested Next Steps

**For The Alchemist's Laboratory:**
- localStorage save/load (most impactful missing feature)
- Second upgrade tiers for Still and Orrery
- Visual milestone toast popup

**For the AI-native Euro game (if John wants to pursue it):**
- Name the game and define the theme/world
- Specify the resource types and market mechanics
- Decide: does Claude play in the terminal, or does it need a browser UI?
- Decide: is there one Claude instance or multiple (player + judge)?
- Build a minimal prototype — one round, one resource, two players —
  before designing the full system

---

## ToBe-Continued File Status

Per the retention rule (keep 3 most recent + the very first):
- `Claude-ToBe-Continued-2026-0626-1200.md` — first ever (keep as baseline)
- `Claude-ToBe-Continued-2026-0626-1500.md` — 2nd (keep, within 3 most recent)
- `Claude-ToBe-Continued-2026-0626-1600.md` — 3rd (keep, within 3 most recent)
- `Claude-ToBe-Continued-2026-0626-1700.md` — this file (most recent)

Four files total. The 1500 file is now the oldest non-baseline and should be
deleted at the start of the next session when a new ToBe-Continued is written.
