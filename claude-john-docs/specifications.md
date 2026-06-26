# The Alchemist's Laboratory — Design Specifications

## Overview

A browser-based idle (incremental) game with an alchemical theme.
The player clicks a bubbling cauldron to gather **Essentia**, then spends
Essentia on buildings that generate it automatically. One-time upgrades
permanently boost production. Play continues indefinitely with increasing
numbers — the classic idle-game loop.

---

## Theme & Aesthetic

| Element | Decision | Reason |
|---|---|---|
| Theme | Alchemy / medieval magic | Universally understood, rich in visual imagery, timeless |
| Color palette | Dark purple/navy background, gold accents, green cauldron glow | Feels mystical and premium without being garish |
| Font | Georgia (serif) | Fits the "ancient tome" aesthetic; widely available |
| Resource name | Essentia | Latin word for "essence" — fits alchemy; sounds important |

---

## Layout (three-column)

```
┌──────────────────────────────────────────────────────────┐
│  HEADER: Title  ───────────────  Essentia count + rate   │
├────────────┬──────────────────────┬──────────────────────┤
│  LEFT      │  MIDDLE              │  RIGHT               │
│  Cauldron  │  Buildings           │  Upgrades            │
│  clicker   │  (Apparatus)         │  (Formulae)          │
│            │                      │                      │
│  Discovers │                      │                      │
│  log       │                      │                      │
├────────────┴──────────────────────┴──────────────────────┤
│  FOOTER: Scrolling news ticker                           │
└──────────────────────────────────────────────────────────┘
```

---

## Resource & Economy

- **Essentia** is the single currency. Earned by clicking and by buildings.
- Essentia is spent to buy buildings and upgrades. It cannot go below zero.
- `totalEssentia` tracks lifetime earnings — never decreases. Used for
  milestones and upgrade unlock conditions.

---

## Buildings (Apparatus)

| # | Name | Base Cost | Base PPS | Flavor |
|---|---|---|---|---|
| 1 | Candle | 10 | 0.1/s | Draws wisps from the ether |
| 2 | Alembic | 100 | 0.5/s | Distills matter into Essentia |
| 3 | Athanor | 1,100 | 4/s | Ancient alchemical furnace |
| 4 | Philosopher's Still | 12,000 | 20/s | Self-perpetuating engine |
| 5 | Celestial Orrery | 130,000 | 100/s | Channels cosmic energies |
| 6 | Grand Arcanum | 1,400,000 | 500/s | Pinnacle of alchemical art |

**Cost curve:** Each purchased copy of a building costs 15% more than the last
(`cost = baseCost × 1.15^count`). This is the standard idle-game formula.

**Production formula:**
`building_PPS = basePPS × count × buildingMultiplier × globalMultiplier`

---

## Upgrades (Formulae)

One-time purchases. Unlocked when a condition is met (e.g., own 1 Candle,
have clicked 25 times). Applied permanently to the game state.

**Click upgrades:**
- Practiced Hands — ×2 click power (25 clicks)
- Alchemist's Touch — ×2 click power (100 clicks)
- Golden Fingers — ×5 click power (500 clicks)

**Building multipliers (per building type):**
- Candle ×2, ×3
- Alembic ×2, ×3
- Athanor ×2, ×3
- Still ×2
- Orrery ×2

**Global multipliers:**
- Philosopher's Insight — all production ×1.5 (at 5,000 total Essentia)
- Transmutation Mastery — all production ×2 (at 100,000 total Essentia)

---

## Milestones

Fire once when `totalEssentia` crosses a threshold. Displayed in the
Discoveries log (newest at top).

| Threshold | Message |
|---|---|
| 10 | The Great Work begins... |
| 100 | You have grasped the basics of Essentia. |
| 1,000 | An apprentice alchemist emerges! |
| 10,000 | The art of transmutation is taking shape. |
| 100,000 | A true alchemist walks among us! |
| 1,000,000 | The Philosopher's Stone is within reach! |
| 10,000,000 | You have transcended mortal alchemy! |
| 1,000,000,000 | The Grand Arcanum is complete. You are legend. |

---

## Click Power

`clickPower = (1 + buildingBonus) × clickMultiplier`

Where `buildingBonus` = sum of (count × basePPS × buildingMultiplier × 0.1)
across all buildings. This means owning buildings also boosts clicking slightly.

---

## Visual Interactions

- **Floating label** — "+N Essentia" floats upward from click point, fades out.
- **Cauldron glow** — green radial glow pulses continuously.
- **Bubbles** — three bubbles rise inside the cauldron on a loop.
- **Cauldron press** — scales down to 93% on `:active`.
- **Building cards** — gold border glow when affordable; dimmed when not.
- **Upgrade cards** — purple glow on hover; grey when purchased.
- **News ticker** — scrolls continuously left-to-right, rotates every 24s.
- **Milestone entries** — slide in from left with a brief animation.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and layout |
| `style.css` | All visual styling and animations |
| `game.js` | All game logic, data, and UI rendering |

No external dependencies. Runs in any modern browser from the local filesystem.
