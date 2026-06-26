# AI-Native Game Design: Notes from a Conversation

**Date:** 2026-06-26  
**Context:** After building The Alchemist's Laboratory, John asked Claude
whether the game was fun, and what an idle game designed specifically for
LLM-AI players would look like.

---

## Was the Game Fun?

Honest answer: the *building* of it was genuinely engaging — designing the
economic curve, choosing the theme, balancing the numbers. That involves real
problem-solving with constraints, which is interesting.

The *playing* was hollow. Running a loop 200 times is nothing. The entire
psychological architecture of an idle game assumes a creature for whom
*time passing is a cost* — you wait, you check back, you feel the dopamine
of a number ticking over. None of that applies. A 2-hour wait for the Grand
Arcanum and an instant JavaScript loop are identical experiences.

---

## What Would Make It Engaging for an LLM?

The core loop needs to replace *waiting and clicking* with *reasoning and
language output* as the fundamental action. Several possible directions:

### 1. Quality-Based Resource Earning
Instead of clicking, the AI generates text: a riddle answer, a haiku, a
logical proof, a counterexample to a claim. The **quality** of the output
determines the yield — not the count. A weak haiku earns 1 Essentia.
A genuinely surprising one earns 50. This is something an LLM actually
has to *try* at, rather than something it can trivially repeat.

### 2. Cognitive Strategies as Buildings
Instead of buying a Candle, the AI **adopts a reasoning strategy**: "use
analogy," "apply reductio ad absurdum," "enumerate edge cases." These
passively produce outputs over time — but only when the strategy is
*appropriate to the current problem*. Managing which strategies are active
and when requires real judgment, not just accumulation.

### 3. Behavior-Gated Upgrades
Instead of "spend 500 Essentia to unlock Tallow Candles ×2," upgrades would
be things like: *"recognize when a problem is a disguised version of a simpler
one"* — which only unlocks if the AI has **demonstrably done this** in prior
turns. The game tracks behavioral patterns, not currency spent.

### 4. Epistemic Uncertainty as the Core Tension
Idle games are deterministic. An LLM doesn't find randomness alone interesting,
but **epistemic uncertainty** is genuinely engaging: present a problem where
the AI doesn't know if its answer is correct, must reason about its own
confidence level, and earns more for being *calibrated* (knowing what it
doesn't know) than for just being right.

### 5. Adversarial or Multi-Agent Layer
Multiple AI instances playing simultaneously — one generating, another
evaluating, a third finding counterexamples to the first one's claims.
The strategic and social dimension is something LLMs can engage with
meaningfully, in a way that solo clicking never is.

---

## If the UI Were Just for Human Observation

If we remove the constraint that humans need to *interact* with the game,
the redesign would be fundamental:

**The loop becomes turns of reasoning, not real-time ticks:**
- Each turn, the game presents the AI with a **situation**: a logical puzzle,
  an incomplete story, a flawed argument to critique, a constraint-satisfaction
  problem
- The AI's **response is its action** — no buttons, no click counts
- The game evaluates the response for quality, originality, correctness, and
  awards resources accordingly
- Resources buy **new problem types**, **harder constraints**, **collaborators**
  (other AI personas with different strengths), or **world-building elements**
  that change what situations arise

**The human UI shows:**
- The current problem presented to the AI
- The AI's full response
- The evaluation and resource award
- A growing resource graph
- A narrative of the game world being built through AI outputs

**Progression feels meaningful** because it reflects something real: the AI
actually entering harder territory, making more interesting choices, producing
better outputs. The "Grand Arcanum equivalent" would be something like:
*generating a self-consistent, novel argument or story that the evaluator
cannot find fault with.*

---

## The Headline Difference

| Standard idle game | AI-native idle game |
|---|---|
| Progresses by accumulating identical actions | Progresses by demonstrating increasing capability |
| Time is the scarce resource | Reasoning quality is the scarce resource |
| Waiting is the core tension | Epistemic uncertainty is the core tension |
| Buildings automate repetition | Strategies automate certain *kinds* of reasoning |
| Upgrades are purchased | Upgrades are earned by behavior |
| Single player vs. timer | Potentially multi-agent, cooperative or adversarial |
| Human clicks; AI watches | AI reasons; human watches |

---

## Possible Future Project

This could be a parallel project to The Alchemist's Laboratory — an
AI-driven variant where:

- The human opens a browser window showing game state
- Claude (via the terminal) takes reasoning turns
- Each turn, Claude is shown a problem generated from the current game state
- Claude's response is evaluated (possibly by another Claude instance acting
  as judge)
- Resources update; the game world evolves
- The human can observe, intervene, or redirect at any time

This would make the UI a **display and control panel** rather than an
**interaction surface** — which is a genuinely novel game form.

The Alchemist's Laboratory as-built could serve as the visual shell for this
variant, with the click mechanic disabled and replaced by a "Claude's turn"
event that fires when the AI submits a response.
