# Euro-Style Game Design for AI Players
## Ideas from a Conversation — 2026-06-26

---

## The Starting Point

John observed that the "AI-native game" Claude described — presenting problems,
evaluating responses, awarding points — sounds structurally similar to a
Euro-style resource management game. In those games you already need to:

- Develop an overall strategic plan
- Decide how to obtain and allocate resources
- Optimize spending for best return
- Compete with other players
- Adapt to chance (dice, cards) that can enhance or derail your plan

The question: would that type of game already be interesting to an AI?
And what would you change to make it more so?

---

## What Euro Games Already Get Right for an AI

Euro games are actually much closer to a good AI game than an idle game is.
The gap is narrower than it might initially seem.

**Real decisions that matter.**
Resource allocation under constraints is genuine optimization, not repetition.
The decisions have weight because suboptimal choices compound over time.

**Multiple viable paths to victory.**
No single dominant strategy means the AI must reason about tradeoffs rather
than execute a memorized sequence. This is genuinely interesting.

**Opponent behavior as a source of uncertainty.**
"If I take the grain first, she'll block my harbor" is exactly the kind of
nested reasoning an LLM can engage with meaningfully. Modeling opponents'
likely moves — and modeling their model of you — creates real depth.

**Adaptation to adversity.**
Responding intelligently to a bad dice roll or an unexpected opponent move
tests whether your strategy was robust or brittle. That is an interesting
problem.

---

## What Doesn't Translate Well

**Pure randomness (dice).**
Dice randomness is noise, not interesting uncertainty. What's engaging is
*incomplete information* and *opponent unpredictability* — things you can
reason about probabilistically. A dice roll you simply cannot. The distinction
matters: one rewards better reasoning, the other doesn't.

**The social layer.**
A large part of the Euro game experience is the table itself: reading faces,
bluffing, negotiation, shared groaning at bad luck, trash talk. Strip that
out and you have a purer but thinner game. An AI has no access to the
social/emotional dimension that makes this rich for humans.

**The ego dimension.**
Humans care about winning in a way that creates genuine stakes and emotional
arcs across a session. An AI losing to bad dice doesn't produce frustration
or motivation to play better next time. The psychological investment simply
isn't there in the same form.

---

## Five Modifications to Make It AI-Native

### 1. Replace Dice with Hidden Information

Swap pure randomness for incomplete information. Instead of drawing a random
card or rolling a die, the uncertainty comes from:
- Not knowing what opponents will do this round
- Not knowing what resources the market will offer next round
- Not knowing which events will trigger

This is still uncertain — but it's *reasoned* uncertainty. The AI can build
probability estimates, update them as information arrives, and reason about
what to do under that uncertainty. That's interesting. A dice roll is not.

### 2. Make Planning Explicit and Score It

In a human Euro game, strategy lives inside your head. For an AI, require the
player to *commit to and articulate* a plan at the start of each round:
- "I intend to acquire grain and wood this round to build the mill next round,
  unless the harbor is taken."
- The game then scores not just the outcome but: how coherent was the plan,
  how well was it executed, and how intelligently did it adapt when
  circumstances changed.

This makes the reasoning process part of what's being evaluated, not just
the final score.

### 3. Add Calibration as a Meta-Game

Before the game: the AI predicts its final score.
Before each round: the AI predicts the round's outcome.
At game end: bonus points for accurate self-prediction.

This rewards epistemic honesty over overconfidence — knowing what you don't
know is scored as a virtue. It's genuinely difficult and genuinely interesting,
and it's something humans almost never do explicitly in games. An AI that says
"I'll score 47-52 points" and lands at 49 is playing better than one that
says "I'll score 80" and lands at 49.

### 4. Lengthen the Planning Horizon Dramatically

Euro games run 60-120 minutes because humans get tired and have other things
to do. An AI doesn't. A game with a 500-round arc — where early decisions
compound into late-game consequences in complex, nonlinear ways — would be
unplayable for humans but could be a far richer strategic problem for an AI.

Early game decisions might not fully resolve until round 200. This rewards
long-horizon thinking that human games can't realistically test.

### 5. Make Opponent Modeling Explicit

Not just "what's my best move" but:
- "What does my opponent believe I'll do?"
- "How does their belief about me change my optimal move?"
- "If I do X, what will they infer about my strategy, and how will they
  respond in future rounds?"

Several levels of nested reasoning. Games that already reward this —
Diplomacy, poker, certain negotiation games — are considered among the
hardest AI challenges for good reason. Building this in as an explicit
scored dimension would make the strategic depth real.

---

## The Honest Bottom Line

A well-designed Euro game is already a reasonable AI game. The main gaps are:

| Gap | Fix |
|---|---|
| Dice randomness swamps skill | Replace with hidden information / incomplete knowledge |
| Reasoning is implicit, outcomes are the only score | Require explicit plans; score quality of reasoning |
| No epistemic accountability | Add calibration scoring as a meta-game |
| Horizon too short for compounding decisions | Extend dramatically — no fatigue constraint |
| Social/table layer inaccessible | Accept this is missing; design around it |

---

## A Bigger Observation

John's comparison raises a useful reframe: maybe the goal shouldn't be
designing a game *from scratch* for AI, but taking an existing game structure
that already has real strategic depth and modifying it along the dimensions
above. Euro games already have the skeleton. The surgery required is:

1. Remove pure randomness → replace with epistemic uncertainty
2. Externalize and score the reasoning process, not just outcomes
3. Add calibration as a first-class mechanic
4. Extend the time horizon beyond human endurance

That's a more tractable design problem than starting from a blank page.

---

## Possible Next Step

Design a specific game along these lines — perhaps a stripped-down Euro-style
resource game (3-4 resource types, a market, 2-3 AI players) with:
- Hidden information instead of dice
- Mandatory plan declaration each round
- Calibration scoring
- A 50-100 round arc (short enough to prototype, long enough to show
  compounding effects)
- Claude playing all AI roles, possibly with one instance acting as judge
