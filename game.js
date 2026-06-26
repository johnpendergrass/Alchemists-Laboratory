// ============================================================
// THE ALCHEMIST'S LABORATORY  —  game.js
//
// A browser-based idle / incremental game.
//
// HOW IT WORKS:
//   1. The player clicks the cauldron to earn Essentia.
//   2. Essentia is spent on Buildings that auto-generate more Essentia.
//   3. Upgrades are one-time purchases that permanently boost output.
//   4. Milestones fire flavor-text notifications as lifetime Essentia grows.
//   5. A game loop runs every 100ms, adding passive income from buildings.
//
// FILE STRUCTURE:
//   SECTION 1 — Static data  (buildings, upgrades, milestones, news)
//   SECTION 2 — Game state   (the single mutable object)
//   SECTION 3 — Calculations (pure functions: cost, PPS, click power)
//   SECTION 4 — Actions      (click, buy building, buy upgrade)
//   SECTION 5 — Game loop    (tick + milestone check)
//   SECTION 6 — UI rendering (full render + lightweight per-tick updates)
//   SECTION 7 — Init         (wires everything up on page load)
// ============================================================


// ============================================================
// SECTION 1 — STATIC DATA
// ============================================================

// Each building is an apparatus that generates Essentia automatically.
// Cost grows by costMultiplier with each purchase (exponential curve).
const BUILDINGS = [
    {
        id: 'candle',
        name: 'Candle',
        icon: '&#x1F56F;&#xFE0F;',   // 🕯️
        description: 'A flickering flame draws wisps of essentia from the ether.',
        baseCost: 10,
        costMultiplier: 1.15,   // next copy costs 15% more
        basePPS: 0.1,           // essentia per second, per copy owned
    },
    {
        id: 'alembic',
        name: 'Alembic',
        icon: '&#x2697;&#xFE0F;',   // ⚗️
        description: 'Distills raw matter into pure, concentrated essentia.',
        baseCost: 100,
        costMultiplier: 1.15,
        basePPS: 0.5,
    },
    {
        id: 'athanor',
        name: 'Athanor',
        icon: '&#x1F525;',           // 🔥
        description: 'An ancient alchemical furnace that smolders with primordial fire.',
        baseCost: 1100,
        costMultiplier: 1.15,
        basePPS: 4,
    },
    {
        id: 'still',
        name: "Philosopher's Still",
        icon: '&#x1F300;',           // 🌀
        description: 'A self-perpetuating distillation engine of extraordinary complexity.',
        baseCost: 12000,
        costMultiplier: 1.15,
        basePPS: 20,
    },
    {
        id: 'orrery',
        name: 'Celestial Orrery',
        icon: '&#x1F30C;',           // 🌌
        description: 'Channels the vast energies of the cosmos through crystalline lenses.',
        baseCost: 130000,
        costMultiplier: 1.15,
        basePPS: 100,
    },
    {
        id: 'arcanum',
        name: 'Grand Arcanum',
        icon: '&#x2728;',            // ✨
        description: 'The pinnacle of alchemical art, resonating with the essence of creation itself.',
        baseCost: 1400000,
        costMultiplier: 1.15,
        basePPS: 500,
    },
];

// Each upgrade is a one-time purchase that permanently boosts something.
// condition(state) => true/false   — whether the upgrade is visible yet
// effect(state)                    — mutates state when purchased
const UPGRADES = [
    // ---- Click power upgrades ----
    {
        id: 'practiced_hands',
        name: 'Practiced Hands',
        icon: '&#x1F450;',           // 👐
        description: 'Years of stirring cauldrons have refined your technique. Click power x2.',
        cost: 100,
        condition: (s) => s.stats.totalClicks >= 25,
        effect:    (s) => { s.clickMultiplier *= 2; },
    },
    {
        id: 'alchemists_touch',
        name: "Alchemist's Touch",
        icon: '&#x1F91C;',           // 🤜
        description: 'Your hands now channel raw essentia directly. Click power x2.',
        cost: 2000,
        condition: (s) => s.stats.totalClicks >= 100,
        effect:    (s) => { s.clickMultiplier *= 2; },
    },
    {
        id: 'golden_fingers',
        name: 'Golden Fingers',
        icon: '&#x270B;',            // ✋
        description: 'Every touch transmutes the surrounding air. Click power x5.',
        cost: 50000,
        condition: (s) => s.stats.totalClicks >= 500,
        effect:    (s) => { s.clickMultiplier *= 5; },
    },

    // ---- Candle upgrades ----
    {
        id: 'tallow_candles',
        name: 'Tallow Candles',
        icon: '&#x1F56F;&#xFE0F;',
        description: 'Rendered from purified animal fat — these candles burn twice as bright. Candles x2.',
        cost: 50,
        condition: (s) => s.buildings.candle.count >= 1,
        effect:    (s) => { s.buildings.candle.multiplier *= 2; },
    },
    {
        id: 'essence_wicks',
        name: 'Essence Wicks',
        icon: '&#x1F56F;&#xFE0F;',
        description: 'Woven from crystallized essentia, these wicks never burn out. Candles x3.',
        cost: 5000,
        condition: (s) => s.buildings.candle.count >= 10,
        effect:    (s) => { s.buildings.candle.multiplier *= 3; },
    },

    // ---- Alembic upgrades ----
    {
        id: 'copper_coils',
        name: 'Copper Coils',
        icon: '&#x1F527;',           // 🔧
        description: 'Refined copper conducts essentia far more efficiently. Alembics x2.',
        cost: 500,
        condition: (s) => s.buildings.alembic.count >= 1,
        effect:    (s) => { s.buildings.alembic.multiplier *= 2; },
    },
    {
        id: 'silver_distillation',
        name: 'Silver Distillation',
        icon: '&#x1F529;',           // 🔩
        description: 'Silver is the quintessential conductor of alchemical forces. Alembics x3.',
        cost: 50000,
        condition: (s) => s.buildings.alembic.count >= 10,
        effect:    (s) => { s.buildings.alembic.multiplier *= 3; },
    },

    // ---- Athanor upgrades ----
    {
        id: 'salamander_oil',
        name: 'Salamander Oil',
        icon: '&#x1F98E;',           // 🦎
        description: 'Oil from fire salamanders makes the Athanor burn five times hotter. Athanors x2.',
        cost: 5000,
        condition: (s) => s.buildings.athanor.count >= 1,
        effect:    (s) => { s.buildings.athanor.multiplier *= 2; },
    },
    {
        id: 'sulphur_fumes',
        name: 'Sulphur Fumes',
        icon: '&#x1F7E1;',           // 🟡
        description: 'Controlled sulphur vapours catalyse the alchemical reaction. Athanors x3.',
        cost: 100000,
        condition: (s) => s.buildings.athanor.count >= 10,
        effect:    (s) => { s.buildings.athanor.multiplier *= 3; },
    },

    // ---- Still upgrades ----
    {
        id: 'mercury_catalyst',
        name: 'Mercury Catalyst',
        icon: '&#x263F;',            // ☿
        description: 'Mercury — the universal solvent — turbocharges your Stills. Stills x2.',
        cost: 60000,
        condition: (s) => s.buildings.still.count >= 1,
        effect:    (s) => { s.buildings.still.multiplier *= 2; },
    },

    // ---- Orrery upgrades ----
    {
        id: 'star_charts',
        name: 'Stellar Cartography',
        icon: '&#x2B50;',            // ⭐
        description: 'Align your Orreries to the most potent star formations. Orreries x2.',
        cost: 650000,
        condition: (s) => s.buildings.orrery.count >= 1,
        effect:    (s) => { s.buildings.orrery.multiplier *= 2; },
    },

    // ---- Global multiplier upgrades (unlocked at Essentia milestones) ----
    {
        id: 'philosophers_insight',
        name: "Philosopher's Insight",
        icon: '&#x1F4DC;',           // 📜
        description: 'Ancient texts reveal hidden truths. All production x1.5.',
        cost: 10000,
        condition: (s) => s.stats.totalEssentia >= 5000,
        effect:    (s) => { s.globalMultiplier *= 1.5; },
    },
    {
        id: 'transmutation_mastery',
        name: 'Transmutation Mastery',
        icon: '&#x1F947;',           // 🥇
        description: 'You have mastered the core principles. All production x2.',
        cost: 500000,
        condition: (s) => s.stats.totalEssentia >= 100000,
        effect:    (s) => { s.globalMultiplier *= 2; },
    },
];

// Milestones fire when lifetime Essentia (totalEssentia) crosses a threshold.
// They append a line to the Discoveries log.
const MILESTONES = [
    { threshold: 10,          text: 'The Great Work begins...' },
    { threshold: 100,         text: 'You have grasped the basics of Essentia.' },
    { threshold: 1000,        text: 'An apprentice alchemist emerges!' },
    { threshold: 10000,       text: 'The art of transmutation is taking shape.' },
    { threshold: 100000,      text: 'A true alchemist walks among us!' },
    { threshold: 1000000,     text: "The Philosopher's Stone is within reach!" },
    { threshold: 10000000,    text: 'You have transcended mortal alchemy!' },
    { threshold: 1000000000,  text: 'The Grand Arcanum is complete. You are legend.' },
];

// The news ticker cycles through these flavor-text lines.
const NEWS_ITEMS = [
    'Local alchemist discovers that lead and gold are, in fact, very different metals.',
    'Academy of Alchemy announces generous new research grants for essentia studies.',
    'Shortage of star charts reported; astrologers blamed.',
    "Philosopher's Still produces unusual green smoke — officials remain unconcerned.",
    'Mercury prices up 300% following unprecedented alchemical demand.',
    'Grand Orrery alignment predicted for next solstice; preparations well underway.',
    'Rival alchemist found to be using counterfeit candles — scandal ensues.',
    'New species of fire salamander discovered in volcanic highlands; alchemists ecstatic.',
    'Municipal council bans late-night athanor operations due to noise complaints.',
    'Celestial convergence accelerates essentia production across the known world.',
    'The ancient texts speak of an Arcanum beyond all others... could it be real?',
    'Guild of Alchemists reports record membership — many seeking the Great Work.',
    'Essentia futures market experiences unprecedented volatility.',
    'Renowned sage claims to have glimpsed the formula for infinite essentia — details sketchy.',
];


// ============================================================
// SECTION 2 — GAME STATE
// ============================================================

// This is the single source of truth for everything in the game.
// It is an ordinary JS object — no classes, no proxies.
// All changes happen through the action functions in Section 4.

function createInitialState() {
    // Build per-building state from the BUILDINGS definitions
    const buildingsState = {};
    BUILDINGS.forEach(b => {
        buildingsState[b.id] = {
            count:      0,   // how many the player owns
            multiplier: 1,   // starts at 1×; upgrades multiply this
        };
    });

    // Build per-upgrade state from the UPGRADES definitions
    const upgradesState = {};
    UPGRADES.forEach(u => {
        upgradesState[u.id] = {
            purchased: false,
        };
    });

    return {
        essentia:        0,   // current spendable Essentia
        clickMultiplier: 1,   // multiplied by upgrades; applied to every click
        globalMultiplier: 1,  // applied to all building output
        buildings:       buildingsState,
        upgrades:        upgradesState,
        stats: {
            totalEssentia: 0,   // lifetime total — only ever increases
            totalClicks:   0,
        },
        milestonesReached: new Set(),   // tracks which thresholds have fired
        newsIndex: 0,
    };
}

let state = createInitialState();


// ============================================================
// SECTION 3 — CALCULATIONS (pure functions — no side effects)
// ============================================================

// How much the Nth copy of a building costs.
// Uses the standard idle-game formula: baseCost * multiplier ^ currentCount
function getBuildingCost(buildingDef, currentCount) {
    return Math.floor(buildingDef.baseCost * Math.pow(buildingDef.costMultiplier, currentCount));
}

// How much Essentia one click generates.
// Base is 1, boosted by clickMultiplier from upgrades,
// plus a small bonus (10% of PPS) for every building owned.
function getClickPower() {
    const buildingBonus = BUILDINGS.reduce((sum, b) => {
        const bState = state.buildings[b.id];
        return sum + bState.count * b.basePPS * bState.multiplier * 0.1;
    }, 0);
    return (1 + buildingBonus) * state.clickMultiplier;
}

// Total Essentia per second from all buildings combined.
function getEssentiaPerSecond() {
    return BUILDINGS.reduce((total, b) => {
        const bState = state.buildings[b.id];
        return total + b.basePPS * bState.count * bState.multiplier * state.globalMultiplier;
    }, 0);
}

// Human-readable number formatter.
// Keeps small numbers as integers; abbreviates large ones.
function formatNumber(n) {
    if (n < 1000)    return Math.floor(n).toLocaleString();
    if (n < 1e6)     return (n / 1e3).toFixed(1)  + 'K';
    if (n < 1e9)     return (n / 1e6).toFixed(2)  + ' million';
    if (n < 1e12)    return (n / 1e9).toFixed(2)  + ' billion';
    if (n < 1e15)    return (n / 1e12).toFixed(2) + ' trillion';
    return n.toExponential(2);
}


// ============================================================
// SECTION 4 — ACTIONS
// ============================================================

// Player clicks the cauldron.
// event is passed in so we can position the floating "+N" label.
function clickCauldron(event) {
    const power = getClickPower();
    state.essentia              += power;
    state.stats.totalEssentia   += power;
    state.stats.totalClicks     += 1;

    showClickFloat(power, event);
    checkMilestones();
    updateResourceDisplay();     // instant feedback for click
    checkUpgradeVisibility();    // an upgrade might just have unlocked
}

// Player clicks a building card to purchase one copy.
function buyBuilding(buildingId) {
    const def = BUILDINGS.find(b => b.id === buildingId);
    if (!def) return;

    const count = state.buildings[buildingId].count;
    const cost  = getBuildingCost(def, count);
    if (state.essentia < cost) return;   // can't afford it — do nothing

    state.essentia                -= cost;
    state.buildings[buildingId].count += 1;

    // Full re-render so costs, owned counts, and PPS labels update
    renderAll();
}

// Player clicks an upgrade card to purchase it.
function buyUpgrade(upgradeId) {
    const def         = UPGRADES.find(u => u.id === upgradeId);
    const upgradeState = state.upgrades[upgradeId];
    if (!def || !upgradeState) return;
    if (upgradeState.purchased)         return;   // already bought
    if (!def.condition(state))          return;   // condition not met
    if (state.essentia < def.cost)      return;   // can't afford

    state.essentia          -= def.cost;
    upgradeState.purchased   = true;
    def.effect(state);   // apply the upgrade's permanent effect

    renderAll();   // rebuild everything so multipliers are reflected
}


// ============================================================
// SECTION 5 — GAME LOOP
// ============================================================

let lastTickTime = Date.now();

// Called 10 times per second by setInterval.
// Adds passive Essentia from buildings, then does lightweight UI updates.
function gameTick() {
    const now     = Date.now();
    const elapsed = (now - lastTickTime) / 1000;   // seconds since last tick
    lastTickTime  = now;

    const gained = getEssentiaPerSecond() * elapsed;
    if (gained > 0) {
        state.essentia            += gained;
        state.stats.totalEssentia += gained;
        checkMilestones();
    }

    // Lightweight per-tick updates (no full DOM rebuild)
    updateResourceDisplay();
    updateBuildingAffordability();
    checkUpgradeVisibility();
}

// Check if any new milestone thresholds have just been crossed.
function checkMilestones() {
    MILESTONES.forEach(m => {
        if (!state.milestonesReached.has(m.threshold) &&
             state.stats.totalEssentia >= m.threshold) {
            state.milestonesReached.add(m.threshold);
            addMilestoneEntry(m.text);
        }
    });
}


// ============================================================
// SECTION 6 — UI RENDERING
// ============================================================

// --- Floating "+N" label on cauldron click ---

function showClickFloat(power, event) {
    const label = document.createElement('div');
    label.className   = 'click-float';
    label.textContent = '+' + formatNumber(power);

    // Position near where the mouse is, with a little random horizontal drift
    const x = event ? event.clientX + (Math.random() * 36 - 18) : 105;
    const y = event ? event.clientY - 10 : 200;
    label.style.left = x + 'px';
    label.style.top  = y + 'px';

    document.body.appendChild(label);
    // Remove from DOM after the CSS animation finishes (0.9s)
    setTimeout(() => label.remove(), 950);
}

// --- Header resource display ---

function updateResourceDisplay() {
    const pps = getEssentiaPerSecond();
    document.getElementById('essentia-count').textContent =
        formatNumber(state.essentia) + ' Essentia';
    document.getElementById('essentia-rate').textContent =
        formatNumber(pps) + ' per second';
    document.getElementById('click-power').textContent =
        formatNumber(getClickPower());
}

// --- Milestone log entry ---

function addMilestoneEntry(text) {
    const list = document.getElementById('milestones-list');
    const item = document.createElement('li');
    item.textContent = text;
    // Insert newest at the top so most recent is always visible
    list.insertBefore(item, list.firstChild);
}

// --- Buildings: lightweight per-tick affordability update ---
// Updates cost label and adds/removes the 'affordable' / 'locked' CSS classes
// without rebuilding the entire card DOM.

function updateBuildingAffordability() {
    BUILDINGS.forEach(def => {
        const card = document.getElementById('building-' + def.id);
        if (!card) return;

        const count = state.buildings[def.id].count;
        const cost  = getBuildingCost(def, count);

        // Update cost label and owned count
        card.querySelector('.cost-number').textContent =
            formatNumber(cost) + ' Essentia';
        card.querySelector('.building-owned').textContent =
            'Owned: ' + count;

        // Toggle affordability classes
        if (state.essentia >= cost) {
            card.classList.add('affordable');
            card.classList.remove('locked');
        } else {
            card.classList.remove('affordable');
            card.classList.add('locked');
        }
    });
}

// --- Upgrades: check if any newly-unlocked upgrades should appear ---
// Only re-renders the upgrades panel if something changed.

let lastUpgradeRenderKey = '';

function checkUpgradeVisibility() {
    // Build a short string that encodes what should be visible
    // If this string hasn't changed since last render, skip the rebuild.
    const key = UPGRADES.map(u =>
        (u.condition(state) ? '1' : '0') + (state.upgrades[u.id].purchased ? 'p' : '')
    ).join('');

    if (key !== lastUpgradeRenderKey) {
        lastUpgradeRenderKey = key;
        renderUpgrades();
    }
}

// --- Full render: rebuilds buildings AND upgrades panels ---
// Called on purchase events, and once on init.

function renderAll() {
    renderBuildings();
    renderUpgrades();
    updateResourceDisplay();
}

// Builds all building cards from scratch.
function renderBuildings() {
    const container = document.getElementById('buildings-list');
    container.innerHTML = '';

    BUILDINGS.forEach(def => {
        const bState = state.buildings[def.id];
        const cost   = getBuildingCost(def, bState.count);
        const pps    = def.basePPS * bState.multiplier * state.globalMultiplier;

        const canAfford = state.essentia >= cost;

        const card = document.createElement('div');
        card.className = 'building-card' +
            (canAfford ? ' affordable' : ' locked');
        card.id      = 'building-' + def.id;
        card.onclick = () => buyBuilding(def.id);

        // innerHTML is safe here — all values come from our own static data
        card.innerHTML =
            '<div class="building-icon">' + def.icon + '</div>' +
            '<div class="building-info">' +
                '<div class="building-name">'  + def.name        + '</div>' +
                '<div class="building-desc">'  + def.description + '</div>' +
                '<div class="building-owned">Owned: ' + bState.count + '</div>' +
            '</div>' +
            '<div class="building-cost">' +
                '<div class="cost-number">' + formatNumber(cost) + ' Essentia</div>' +
                '<div class="production">'  + formatNumber(pps)  + '/sec each</div>' +
            '</div>';

        container.appendChild(card);
    });
}

// Builds upgrade cards. Only shows upgrades whose condition is met (or already purchased).
function renderUpgrades() {
    const container = document.getElementById('upgrades-list');
    container.innerHTML = '';

    let anyVisible = false;

    UPGRADES.forEach(def => {
        const uState    = state.upgrades[def.id];
        const conditionMet = def.condition(state);

        // Only show if the condition is met, or already purchased
        if (!conditionMet && !uState.purchased) return;
        anyVisible = true;

        const canAfford = state.essentia >= def.cost;

        let extraClass = '';
        if (uState.purchased) extraClass = ' purchased';
        else if (!canAfford)  extraClass = ' too-costly';

        const card = document.createElement('div');
        card.className = 'upgrade-card' + extraClass;
        card.onclick   = () => buyUpgrade(def.id);

        const costLabel = uState.purchased
            ? '<span class="upgrade-cost purchased-label">&#x2713; Learned</span>'
            : '<span class="upgrade-cost">' + formatNumber(def.cost) + ' Essentia</span>';

        card.innerHTML =
            '<div class="upgrade-header">' +
                '<span class="upgrade-icon">' + def.icon + '</span>' +
                '<span class="upgrade-name">' + def.name + '</span>' +
            '</div>' +
            '<div class="upgrade-desc">' + def.description + '</div>' +
            costLabel;

        container.appendChild(card);
    });

    // Show a placeholder message if nothing is unlocked yet
    if (!anyVisible) {
        const msg = document.createElement('p');
        msg.className   = 'empty-msg';
        msg.textContent = 'Formulae will reveal themselves as you progress...';
        container.appendChild(msg);
    }
}

// --- News ticker rotation ---

function rotateNews() {
    state.newsIndex = (state.newsIndex + 1) % NEWS_ITEMS.length;
    const el = document.getElementById('news-text');
    el.textContent = NEWS_ITEMS[state.newsIndex];

    // Restart the CSS scroll animation so the new text scrolls from the right
    el.style.animation = 'none';
    el.offsetHeight;   // force a reflow so the browser resets the animation
    el.style.animation = '';
}


// ============================================================
// SECTION 7 — INIT
// ============================================================

function init() {
    // Do an initial full render so buildings/upgrades appear immediately
    renderAll();

    // Main game loop — runs 10 times per second
    setInterval(gameTick, 100);

    // Rotate the news ticker every 24 seconds
    setInterval(rotateNews, 24000);

    console.log('%c The Alchemist\'s Laboratory', 'color: #f0c040; font-size: 18px; font-weight: bold;');
    console.log('%c The Great Work begins. Good luck, alchemist.', 'color: #9080b0; font-style: italic;');
}

// Start the game once the page is fully loaded
window.addEventListener('DOMContentLoaded', init);
