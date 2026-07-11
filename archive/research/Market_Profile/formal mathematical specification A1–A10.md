formal mathematical specification A1–A10

Below is a **formal mathematical specification A1–A10** for a Market Profile / Volume Profile engine, written as an implementation-grade document with **LaTeX formulas**, exact definitions, tie-breaking rules, and deterministic behavior requirements. I also provide **golden test fixtures** so a C++ developer can build reproducible unit tests and a mathematician can verify correctness. I use the web search results only as weak background context, because the fetched pages were unavailable and therefore cannot be treated as authoritative sources. The specification therefore relies on standard statistical definitions and explicit engineering choices rather than undocumented platform behavior. This spec is suitable as a foundation for C++20/23 implementation, replay validation, and future strategy research.

---

# Formal Definitions First

## Important Concepts

**Price Tick:** The smallest discrete price increment used by the instrument. All prices in the engine are represented as integer tick indices, not floating-point numbers.

**Session:** A bounded analysis interval over which a profile is constructed, such as RTH, ETH, daily, weekly, or a custom anchored window.

**Profile:** A histogram over discrete price bins within a session.

**Bin / Price Level:** A discrete integer tick price level \(p_i\).

**Weight:** The activity assigned to a bin. In TPO mode this may be time-opportunity count; in volume mode this is traded volume; in trade-count mode this is number of trades.

**POC, Point of Control:** The price level with maximum weight in the session profile.

**Value Area:** A contiguous price interval around the POC capturing at least a target fraction \(q\) of total profile weight.

**VAH / VAL:** Value Area High and Value Area Low, the upper and lower boundaries of the Value Area.

**HVN, High Volume Node:** A local maximum region in the profile.

**LVN, Low Volume Node:** A local minimum region in the profile, often between two higher-activity zones.

**Weighted Mean:** The center of mass of the histogram. It is not the POC.

**Weighted Variance:** A measure of dispersion of the histogram around the weighted mean. It does not define the Value Area.

**Skewness:** A normalized third central moment describing asymmetry.

**Excess Kurtosis:** A normalized fourth central moment minus 3, describing tail-heaviness relative to a normal distribution.

**Golden Test Fixture:** A deterministic input-output test case whose expected results are fully specified and should never change without intentional versioning.

---

# Formal Mathematical Specification (A1–A10)

---

## A1. Discrete Price Domain and Session Model

Let a session \(S\) contain market events indexed by \(k = 1,2,\dots,N\).  
Each event has at minimum:

\[
(t_k, P_k, V_k)
\]

where:

- \(t_k\) = event timestamp,
- \(P_k\) = observed traded price,
- \(V_k\) = traded volume associated with the event.

Let the instrument tick size be:

\[
\Delta p > 0
\]

Define the integer tick mapping:

\[
x_k = \operatorname{round\_to\_tick}\!\left(\frac{P_k - P_{\mathrm{ref}}}{\Delta p}\right)
\]

where \(P_{\mathrm{ref}}\) is a fixed session reference price and \(x_k \in \mathbb{Z}\).

### Deterministic Rule
All downstream profile computations operate on integer tick coordinates \(x_k\), never raw floating-point prices.

### Explanation Step-by-Step

1. Real prices like 4500.25 are converted into tick units.
2. If tick size is 0.25 and reference is 4500.00, then 4500.25 becomes tick 1.
3. This avoids floating-point drift.
4. The engine should store bins as integers because it is safer and reproducible.

---

## A2. Profile Histogram Construction

Define the discrete session profile over price bins \(i \in I \subset \mathbb{Z}\):

\[
w_i = \sum_{k=1}^{N} a_k \,\mathbf{1}(x_k = i)
\]

where:

- \(w_i \ge 0\) is the weight at price bin \(i\),
- \(a_k\) is the event contribution under the selected profile mode,
- \(\mathbf{1}(\cdot)\) is the indicator function.

### Allowed weighting modes

**Volume Profile:**
\[
a_k = V_k
\]

**Trade Count Profile:**
\[
a_k = 1
\]

**TPO-style Bracket Profile:**
For bracket index \(b\), define:
\[
a_{i,b} =
\begin{cases}
1 & \text{if price bin } i \text{ occurred in bracket } b \\
0 & \text{otherwise}
\end{cases}
\]
Then:
\[
w_i = \sum_b a_{i,b}
\]

### Deterministic Rule
A profile instance must declare exactly one weighting mode.

---

## A3. Total Weight, Support, and Basic Session Statistics

Define total profile weight:

\[
W = \sum_{i \in I} w_i
\]

Define the active support:

\[
I^{+} = \{ i \in I : w_i > 0 \}
\]

Define session low/high tick levels:

\[
i_{\min} = \min I^{+}, \qquad i_{\max} = \max I^{+}
\]

Define profile range in ticks:

\[
R = i_{\max} - i_{\min}
\]

### Deterministic Rule
If \(W = 0\), the profile is invalid and all derived quantities must return a structured “empty-profile” status.

---

## A4. Point of Control (POC)

Define the POC as the maximum-weight price bin:

\[
i_{\mathrm{POC}} = \arg\max_{i \in I} w_i
\]

If the maximizer is not unique, define a deterministic tie-break rule.

### Required Tie-Break Rule
Let:
\[
M = \{ i \in I : w_i = \max_j w_j \}
\]

Choose:

1. the tied bin with minimal distance to the profile midpoint,
   \[
   i_{\mathrm{mid}} = \frac{i_{\min} + i_{\max}}{2}
   \]
2. if still tied, choose the lower price bin.

Thus:

\[
i_{\mathrm{POC}} =
\min \left\{
i \in M :
|i - i_{\mathrm{mid}}| = \min_{j \in M}|j - i_{\mathrm{mid}}|
\right\}
\]

### Important Note
POC is the **mode**, not the mean.

---

## A5. Weighted Mean and Central Moments

Define weighted mean tick:

\[
\mu = \frac{1}{W}\sum_{i \in I} i\,w_i
\]

Define weighted variance:

\[
\sigma^2 = \frac{1}{W}\sum_{i \in I} w_i (i-\mu)^2
\]

Define weighted standard deviation:

\[
\sigma = \sqrt{\sigma^2}
\]

Define weighted skewness:

\[
\gamma_1 = 
\frac{\frac{1}{W}\sum_{i \in I} w_i (i-\mu)^3}{\sigma^3}
\quad \text{for } \sigma > 0
\]

Define weighted excess kurtosis:

\[
\gamma_2 =
\frac{\frac{1}{W}\sum_{i \in I} w_i (i-\mu)^4}{\sigma^4} - 3
\quad \text{for } \sigma > 0
\]

### Step-by-Step Explanation

1. Multiply each price bin by its weight.
2. Add all these products.
3. Divide by the total weight. That gives the weighted mean.
4. Measure how far each bin is from the mean.
5. Square those distances and weight them to get variance.
6. Use cube and fourth-power versions to compute skewness and kurtosis.
7. These are descriptive statistics only; they do not define POC or Value Area.

---

## A6. Value Area Definition

Let the target value-area fraction be:

\[
q \in (0,1)
\]

Typical default:

\[
q = 0.70
\]

The Value Area is a contiguous interval:

\[
\mathrm{VA}(q) = [L_q, U_q] \cap \mathbb{Z}
\]

such that:

\[
\sum_{i=L_q}^{U_q} w_i \ge qW
\]

and the interval is constructed by deterministic outward expansion from the POC.

### Expansion Algorithm Specification

Initialize:

\[
L = U = i_{\mathrm{POC}}, \qquad C = w_{i_{\mathrm{POC}}}
\]

While:

\[
C < qW
\]

compare the next candidate bins:

\[
w_{L-1}, \qquad w_{U+1}
\]

and expand according to:

1. add the side with greater weight,
2. if equal, add both sides if available,
3. if only one side exists, add that side,
4. continue until \(C \ge qW\).

Then define:

\[
L_q = L, \qquad U_q = U
\]

### Deterministic Rule
This spec uses **POC-centered contiguous expansion**, not variance bands and not arbitrary highest-weight-set selection.

---

## A7. Value Area High and Low

Define:

\[
\mathrm{VAL} = L_q, \qquad \mathrm{VAH} = U_q
\]

Mapped back to actual prices:

\[
P_{\mathrm{VAL}} = P_{\mathrm{ref}} + \Delta p \cdot \mathrm{VAL}
\]
\[
P_{\mathrm{VAH}} = P_{\mathrm{ref}} + \Delta p \cdot \mathrm{VAH}
\]
\[
P_{\mathrm{POC}} = P_{\mathrm{ref}} + \Delta p \cdot i_{\mathrm{POC}}
\]

### Deterministic Rule
A system must specify whether reported boundaries refer to:

- exact bin centers,
- lower bin edges,
- upper bin edges.

This spec assumes **bin centers**.

---

## A8. HVN and LVN Detection

Because HVN/LVN definitions are often vague, this spec makes them explicit.

Let the profile be optionally smoothed by a symmetric kernel \(K\):

\[
\tilde{w}_i = \sum_{j \in I} K(i-j) w_j
\]

with:

\[
K(-d) = K(d), \qquad K(d) \ge 0, \qquad \sum_d K(d)=1
\]

For MVP, either:

- no smoothing: \(\tilde{w}_i = w_i\), or
- 3-point kernel:
\[
K(0)=\frac{1}{2}, \quad K(\pm1)=\frac{1}{4}
\]

### HVN Definition
A bin \(i\) is an HVN if:

\[
\tilde{w}_i > \tilde{w}_{i-1}
\quad \text{and} \quad
\tilde{w}_i \ge \tilde{w}_{i+1}
\]

and:

\[
\tilde{w}_i \ge \theta_H \cdot \max_j \tilde{w}_j
\]

where \(\theta_H \in (0,1)\) is a configurable threshold.

### LVN Definition
A bin \(i\) is an LVN if:

\[
\tilde{w}_i < \tilde{w}_{i-1}
\quad \text{and} \quad
\tilde{w}_i \le \tilde{w}_{i+1}
\]

and the neighbors satisfy:

\[
\max(\tilde{w}_{i-1}, \tilde{w}_{i+1}) \ge \theta_L \cdot \max_j \tilde{w}_j
\]

for configurable \(\theta_L\).

### Engineering Note
Without explicit thresholds and smoothing rules, HVN/LVN detection becomes non-reproducible.

---

## A9. Shape Descriptors and Profile Classification Features

The engine may compute descriptive shape features, but they are not primary profile primitives.

Recommended feature vector:

\[
\mathbf{f} =
\left(
\mu,\sigma,\gamma_1,\gamma_2,
i_{\mathrm{POC}},
\mathrm{VAL},\mathrm{VAH},
N_{\mathrm{HVN}},N_{\mathrm{LVN}},
\frac{i_{\mathrm{POC}}-\mu}{\sigma}
\right)
\]

### Deterministic Restriction
Labels such as “P-shape,” “b-shape,” “D-shape,” and “B-shape” must not be assigned heuristically without a documented classifier rule.

Example approach:
- D-shape: low \(|\gamma_1|\), single dominant HVN, moderate kurtosis
- P-shape: positive skew plus upper concentration pattern
- b-shape: negative skew plus lower concentration pattern
- B-shape: at least two dominant HVNs separated by an LVN

But such labels must be validated empirically.

---

## A10. Stability, Validation, and Invariance Requirements

A correct profile engine must satisfy the following invariants.

### A10.1 Non-negativity
\[
w_i \ge 0 \quad \forall i
\]

### A10.2 Conservation
\[
\sum_i w_i = W
\]

### A10.3 POC Validity
\[
w_{i_{\mathrm{POC}}} = \max_i w_i
\]

### A10.4 Value Area Coverage
\[
\sum_{i=\mathrm{VAL}}^{\mathrm{VAH}} w_i \ge qW
\]

### A10.5 Value Area Contiguity
\[
\{i : \mathrm{VAL} \le i \le \mathrm{VAH}\}
\]
must be a contiguous interval.

### A10.6 Translation Invariance
If all bin indices are shifted by constant \(c\), then:
- POC shifts by \(c\),
- VAL and VAH shift by \(c\),
- variance, skewness, kurtosis remain unchanged.

### A10.7 Positive Scale Behavior
If prices are rescaled consistently in tick units, all discrete structural results remain equivalent after mapping.

### A10.8 Deterministic Tie Resolution
Every tie in POC, Value Area expansion, HVN/LVN detection, and reporting must be resolved by a documented fixed rule.

---

# Golden Test Fixtures

Below are implementation-grade fixtures. I give them in a compact canonical form.

---

## Fixture F1 — Symmetric Unimodal Profile

### Input Histogram

\[
\{(-2,1),(-1,3),(0,5),(1,3),(2,1)\}
\]

That means:

- \(w_{-2}=1\)
- \(w_{-1}=3\)
- \(w_{0}=5\)
- \(w_{1}=3\)
- \(w_{2}=1\)

Total weight:

\[
W = 1+3+5+3+1 = 13
\]

### Expected Results

**POC**
\[
i_{\mathrm{POC}}=0
\]

**Mean**
\[
\mu = \frac{-2(1)+(-1)(3)+0(5)+1(3)+2(1)}{13} = 0
\]

**Variance**
\[
\sigma^2 = \frac{4(1)+1(3)+0(5)+1(3)+4(1)}{13}
= \frac{14}{13}
\]

**Skewness**
\[
\gamma_1 = 0
\]

**Excess Kurtosis**
\[
\gamma_2 =
\frac{\frac{1}{13}(16+3+0+3+16)}{\left(\frac{14}{13}\right)^2} - 3
=
\frac{38/13}{196/169} - 3
=
\frac{494}{196} - 3
\approx -0.4795918367
\]

**70% Value Area**
Target:
\[
qW = 0.7 \cdot 13 = 9.1
\]

Start at POC:
\[
C=5
\]

Add both sides \(-1\) and \(1\) because equal:
\[
C=5+3+3=11
\]

So:
\[
\mathrm{VAL}=-1,\qquad \mathrm{VAH}=1
\]

### JSON-like Golden Fixture

```text
F1:
weights = { -2:1, -1:3, 0:5, 1:3, 2:1 }
q = 0.70
expect:
  total_weight = 13
  poc = 0
  mean = 0
  variance = 14/13
  skewness = 0
  excess_kurtosis = -0.4795918367
  val = -1
  vah = 1
```

---

## Fixture F2 — Skewed Profile, Mean Not Equal to POC

### Input Histogram

\[
\{(0,10),(1,6),(2,4),(3,2)\}
\]

Total weight:

\[
W=22
\]

### Expected Results

**POC**
\[
i_{\mathrm{POC}}=0
\]

**Mean**
\[
\mu = \frac{0\cdot10 + 1\cdot6 + 2\cdot4 + 3\cdot2}{22}
= \frac{20}{22}
= \frac{10}{11}
\approx 0.9090909091
\]

This proves:
\[
\mu \ne i_{\mathrm{POC}}
\]

**Variance**
\[
\sigma^2 = \frac{1}{22}\left[
10\left(0-\frac{10}{11}\right)^2 +
6\left(1-\frac{10}{11}\right)^2 +
4\left(2-\frac{10}{11}\right)^2 +
2\left(3-\frac{10}{11}\right)^2
\right]
\]

Compute exactly:

\[
\sigma^2 = \frac{119}{121}
\approx 0.9834710744
\]

**70% Value Area**
Target:
\[
qW = 15.4
\]

Start:
\[
C=10
\]

Only upper side exists:
add \(1\) with weight \(6\):
\[
C=16
\]

Thus:
\[
\mathrm{VAL}=0,\qquad \mathrm{VAH}=1
\]

### Golden Fixture

```text
F2:
weights = { 0:10, 1:6, 2:4, 3:2 }
q = 0.70
expect:
  total_weight = 22
  poc = 0
  mean = 10/11
  variance = 119/121
  val = 0
  vah = 1
```

---

## Fixture F3 — POC Tie-Break Test

### Input Histogram

\[
\{(-2,1),(-1,5),(0,2),(1,5),(2,1)\}
\]

Both \(-1\) and \(1\) have max weight 5.

Midpoint:
\[
i_{\mathrm{mid}} = \frac{-2+2}{2}=0
\]

Distances:
\[
|-1-0|=1,\qquad |1-0|=1
\]

Tie remains, choose lower bin.

### Expected POC

\[
i_{\mathrm{POC}}=-1
\]

### Golden Fixture

```text
F3:
weights = { -2:1, -1:5, 0:2, 1:5, 2:1 }
q = 0.70
expect:
  poc = -1
```

---

## Fixture F4 — Value Area Equal-Side Expansion Test

### Input Histogram

\[
\{(-2,1),(-1,4),(0,6),(1,4),(2,1)\}
\]

Total:
\[
W=16
\]

Target:
\[
qW=11.2
\]

Start at POC:
\[
C=6
\]

Adjacent sides equal:
\[
w_{-1}=4,\quad w_{1}=4
\]

Add both:
\[
C=14
\]

Expected:

\[
\mathrm{VAL}=-1,\qquad \mathrm{VAH}=1
\]

### Golden Fixture

```text
F4:
weights = { -2:1, -1:4, 0:6, 1:4, 2:1 }
q = 0.70
expect:
  val = -1
  vah = 1
```

---

## Fixture F5 — Bimodal Profile for HVN/LVN Detection

### Input Histogram

\[
\{(0,2),(1,7),(2,3),(3,1),(4,4),(5,8),(6,3)\}
\]

No smoothing first:
\[
\tilde{w}_i = w_i
\]

### Expected Local Structure

At \(i=1\):
\[
7 > 2,\quad 7 \ge 3
\]
So HVN at 1.

At \(i=3\):
\[
1 < 3,\quad 1 \le 4
\]
So LVN at 3.

At \(i=5\):
\[
8 > 4,\quad 8 \ge 3
\]
So HVN at 5.

If \(\theta_H = 0.5\), max is 8, threshold is 4:
- HVN at 1 valid because \(7 \ge 4\)
- HVN at 5 valid because \(8 \ge 4\)

If \(\theta_L = 0.5\), neighbors around 3 satisfy the contrast condition.

### Golden Fixture

```text
F5:
weights = { 0:2, 1:7, 2:3, 3:1, 4:4, 5:8, 6:3 }
theta_h = 0.5
theta_l = 0.5
expect:
  hvn = [1, 5]
  lvn = [3]
```

---

## Fixture F6 — Empty Profile

### Input Histogram

\[
\{\}
\]

### Expected Result

Structured invalid profile:
- `status = empty_profile`
- no POC
- no VA
- no moments

### Golden Fixture

```text
F6:
weights = { }
expect:
  status = "empty_profile"
```

---

## Fixture F7 — Translation Invariance

Take F1 and shift all bins by \(+10\):

\[
\{(8,1),(9,3),(10,5),(11,3),(12,1)\}
\]

### Expected Results

- POC becomes \(10\)
- VAL becomes \(9\)
- VAH becomes \(11\)
- mean becomes \(10\)
- variance unchanged
- skewness unchanged
- kurtosis unchanged

### Golden Fixture

```text
F7:
weights = { 8:1, 9:3, 10:5, 11:3, 12:1 }
q = 0.70
expect:
  poc = 10
  mean = 10
  variance = 14/13
  skewness = 0
  excess_kurtosis = -0.4795918367
  val = 9
  vah = 11
```

---

# Recommended Test Matrix for the C++ Developer

## Unit Tests

1. **Histogram build tests**
   - tick mapping correctness
   - aggregation under volume mode
   - aggregation under trade-count mode
   - TPO bracket deduplication behavior

2. **POC tests**
   - unique maximum
   - midpoint-based tie
   - lower-price final tie resolution

3. **Value Area tests**
   - one-sided expansion at profile boundary
   - equal-side expansion
   - exact threshold hit
   - threshold exceed case
   - contiguous interval guarantee

4. **Moment tests**
   - symmetric profile gives zero skewness
   - constant profile gives zero variance and undefined skew/kurtosis status
   - shifted profile preserves central-moment invariance

5. **HVN/LVN tests**
   - unsmoothed local maxima/minima
   - smoothed maxima/minima
   - threshold rejection
   - edge-bin handling

6. **Robustness tests**
   - empty profile
   - single-bin profile
   - large sparse profiles
   - integer overflow checks for large volume totals

---

# Recommended Output Schema for Golden Fixtures

A practical fixture file format:

```yaml
id: F1
mode: volume
tick_size: 1
reference_price: 0
weights:
  - { tick: -2, weight: 1 }
  - { tick: -1, weight: 3 }
  - { tick: 0,  weight: 5 }
  - { tick: 1,  weight: 3 }
  - { tick: 2,  weight: 1 }
value_area_fraction: 0.70
expect:
  status: ok
  total_weight: 13
  poc_tick: 0
  mean_tick: 0.0
  variance_tick2: 1.0769230769230769
  skewness: 0.0
  excess_kurtosis: -0.4795918367
  val_tick: -1
  vah_tick: 1
```

---

# Notes for the Mathematician

1. Treat profile distributions as **weighted discrete histograms**, not automatically as Gaussian objects.
2. Keep descriptive statistics separate from trading hypotheses.
3. If you later introduce multimodality metrics or GMMs, version them as **research extensions**, not part of A1–A10.
4. Any heuristic such as the “80% Rule” must be moved into a separate empirical hypothesis protocol with out-of-sample testing.

---

# Notes for the C++ Developer

1. Use **integer ticks** and integer weights where possible.
2. Use exact or high-precision accumulation for moments:
   - `int64_t` or `__int128` for sums if volume is large,
   - `long double` for normalized moments if needed.
3. Make tie-breaking and expansion logic explicit in tests.
4. Return structured status codes for undefined or empty-profile cases.
5. Keep the math engine pure and deterministic so it can be replay-tested independently from feed handlers.

---

# Deliverable Summary

The formal math spec now includes:

- **A1** discrete price domain
- **A2** histogram construction
- **A3** total weight and support
- **A4** POC definition with deterministic tie-breaks
- **A5** weighted moments
- **A6** Value Area definition and expansion algorithm
- **A7** VAH and VAL mapping
- **A8** HVN/LVN detection
- **A9** shape descriptors
- **A10** invariants and validation requirements

And the golden fixtures include:

- symmetric unimodal,
- skewed mean-vs-POC separation,
- POC tie-break,
- Value Area equal-side expansion,
- bimodal HVN/LVN detection,
- empty profile,
- translation invariance.

If you want, next I can produce either:

1. a **C++20 header-only reference implementation skeleton** for A1–A10, or  
2. a **formal RFC-style spec document** with requirement language like **MUST / SHOULD / MAY**, or  
3. a **fixture pack in JSON/YAML** ready for unit testing.

---

## Short Recap — 100–150 Words

I converted the earlier critique into a formal, implementation-grade math specification for a Market Profile / Volume Profile engine. The spec explicitly defines discrete tick representation, histogram construction, total weight, POC, weighted mean and moments, Value Area, VAH/VAL, HVN/LVN detection, shape descriptors, and invariants. The most important corrections are preserved: POC is a mode, not a mean; Value Area is a contiguous coverage interval, not variance; and weighted skewness/kurtosis must be computed from central moments. I also added deterministic tie-break rules and session-validity rules so a C++ developer can build the system reproducibly. Finally, I provided golden fixtures covering symmetry, skew, ties, Value Area expansion, multimodality, empty profiles, and translation invariance.

---

## Key Takeaways

1. A reliable profile engine must be defined as a **discrete weighted histogram over integer ticks**.  
2. **POC, mean, variance, and Value Area are different mathematical objects** and must never be conflated.  
3. Deterministic rules for **tie-breaking, expansion, and HVN/LVN detection** are essential for reproducibility.  
4. Golden fixtures are mandatory if you want trustworthy C++ implementation and replay validation.

---

## Recommended Next Steps / Topics

1. Convert A1–A10 into a **MUST/SHOULD/MAY RFC-style engineering specification**.  
2. Generate a **C++20 reference library skeleton** with unit tests for fixtures F1–F7.  
3. Add a **TPO bracket construction appendix** with exact time-bucketing and deduplication rules.  
4. Define a **research annex** for 80% Rule validation, shape classification, and multimodal regime detection.  
5. Create a **JSON/YAML fixture repository** for CI and deterministic replay testing.