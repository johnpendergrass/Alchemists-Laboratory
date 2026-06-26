# The Alchemist's Laboratory — Technical Specifications

## Architecture Philosophy

The game is intentionally simple and self-contained:
- **No framework** — vanilla HTML/CSS/JS only
- **No build step** — open index.html directly in a browser
- **No external libraries** — zero dependencies
- **No backend** — pure client-side
- **Single source of truth** — one `state` object owns all game data

The code is organized into clearly labeled sections within `game.js` so it
reads top-to-bottom like a story rather than requiring you to jump around.

---

## game.js Sections

```
SECTION 1 — Static data         (BUILDINGS, UPGRADES, MILESTONES, NEWS_ITEMS)
SECTION 2 — Game state          (createInitialState, the live `state` object)
SECTION 3 — Calculations        (pure functions: cost, PPS, click power, format)
SECTION 4 — Actions             (clickCauldron, buyBuilding, buyUpgrade)
SECTION 5 — Game loop           (gameTick, checkMilestones)
SECTION 6 — UI rendering        (renderAll, renderBuildings, renderUpgrades,
                                 updateResourceDisplay, updateBuildingAffordability,
                                 checkUpgradeVisibility, showClickFloat, rotateNews)
SECTION 7 — Init                (init, DOMContentLoaded listener)
```

---

## State Object Shape

```js
state = {
    essentia:          number,   // current spendable Essentia
    clickMultiplier:   number,   // starts 1; doubled/quintupled by upgrades
    globalMultiplier:  number,   // starts 1; multiplied by global upgrades
    buildings: {
        [buildingId]: {
            count:      number,  // copies owned
            multiplier: number,  // starts 1; boosted by building-specific upgrades
        }
    },
    upgrades: {
        [upgradeId]: {
            purchased: boolean
        }
    },
    stats: {
        totalEssentia: number,   // lifetime total — never decreases
        totalClicks:   number,
    },
    milestonesReached: Set,      // Set of threshold numbers already triggered
    newsIndex:         number,   // index into NEWS_ITEMS array
}
```

---

## Cost Formula

Standard idle-game exponential cost curve:

```
cost = floor( baseCost × costMultiplier ^ currentCount )
```

With costMultiplier = 1.15 and baseCost = 10 (Candle), the first few costs are:
- 0 owned → 10
- 1 owned → 11
- 2 owned → 13
- 5 owned → 20
- 10 owned → 40
- 25 owned → 329
- 50 owned → 10,839

This is deliberately generous early on to give the player a sense of momentum.

---

## Production Formula

```
building_PPS  = basePPS × count × buildingMultiplier × globalMultiplier
total_PPS     = sum of all building_PPS values
```

Click power:
```
buildingBonus = sum of (count × basePPS × buildingMultiplier × 0.1)
clickPower    = (1 + buildingBonus) × clickMultiplier
```

The 0.1 factor means each building contributes 10% of its per-second value
to a single click. This keeps clicking relevant as buildings scale up.

---

## Game Loop

```js
setInterval(gameTick, 100)   // 10 ticks per second
```

Each tick:
1. Compute elapsed seconds since last tick (handles tab focus loss gracefully)
2. Gain `totalPPS × elapsed` Essentia
3. Check milestones
4. Update resource display (header numbers)
5. Update building card affordability classes
6. Check if any upgrade cards need to appear/disappear

Full DOM rebuilds (`renderAll`) only happen on purchase events, not every tick.
This avoids performance issues as the building list grows.

---

## Upgrade Visibility Optimization

`checkUpgradeVisibility()` builds a short string key encoding which upgrades
are visible and which are purchased. It only calls `renderUpgrades()` when
this key changes. This means the upgrades panel isn't rebuilt every tick —
only when something actually changes.

```js
const key = UPGRADES.map(u =>
    (u.condition(state) ? '1' : '0') + (state.upgrades[u.id].purchased ? 'p' : '')
).join('');
```

---

## CSS Animation Notes

- **Cauldron glow** — `@keyframes pulse-glow` uses `scaleX` + `opacity` on a
  pseudo-element with a radial gradient. Runs with `alternate` direction for a
  natural breathing effect.
- **Bubbles** — three `<div>` elements each with a different `animation-delay`
  and `animation-duration` so they don't move in sync.
- **Click float** — created dynamically, removed after 950ms via `setTimeout`.
  Positioned at `event.clientX / clientY` with a small random horizontal offset.
- **News ticker** — `translateX(100vw)` to `translateX(-100%)`. The text is
  reset by toggling `animation: none`, forcing a reflow, then restoring it.
- **Milestone slide-in** — `@keyframes slide-in` on the `<li>` element.
  New entries are inserted at the top (`insertBefore(item, list.firstChild)`).

---

## Potential Future Enhancements

| Feature | Notes |
|---|---|
| Save/Load (localStorage) | Serialize `state` to JSON on save, parse on load. Need to handle `Set` (convert to Array). |
| Prestige / rebirth | Reset buildings, keep a "rebirth multiplier" — standard idle-game meta-loop. |
| Achievements | Similar to milestones but with icons; could track e.g. "own 100 candles". |
| Offline progress | On load, compute how much time has passed and apply passive income for that period. |
| Sound effects | Short chime on milestone, bubble pops, click sound via Web Audio API. |
| Mobile / touch | Layout already uses flex; would need smaller font sizes and a stacked single-column view. |
| Animated numbers | CSS counter animation or a tweened number library for the Essentia display. |
| More buildings | Tier 7+ could be "Philosopher's Engine", "Void Siphon", "Time Loop" etc. |

---

## Browser Compatibility

Tested on Chrome/Edge (Chromium). Should work on Firefox and Safari.
Requires no polyfills — uses only:
- `Set`, `Array.reduce`, `Math.pow`, `Math.floor` (ES6, universal)
- CSS custom properties (variables) — IE11 not supported, but that's fine
- CSS animations and `animation: none` reflow trick — universally supported

---

## No Save System (v1)

The first version deliberately has no save/load. State resets on page refresh.
This keeps the code simple and lets John experience the early game cleanly
before deciding what features to add next.
