# 🎯 DETAILED PRODUCTION-READY PROMPT: VECTOR (Unit 5)
## Interactive Learning App Generation for TVET DUM10092

---

## 📋 EXECUTIVE BRIEF

**Topic:** VECTOR (Unit 5 - DUM10092 Engineering Mathematics)  
**Subtopics Covered:** 5.1, 5.2, 5.3 (All from syllabus)  
**Target Level:** TVET Diploma (weak math foundation students)  
**Duration:** 45-60 minutes of learning content  
**Delivery:** Single HTML file, responsive, fully interactive  

---

## 🎓 LEARNING OUTCOMES (C1-C3 Competencies)

**After completing this app, students should be able to:**

**C1 - Remember (Identify & Recognize):**
- Identify scalar vs vector quantities correctly
- Recognize vector notation (both forms: xi + yj and column)
- Distinguish between null, unit, parallel, and equal vectors
- Identify direction and magnitude of given vectors

**C2 - Understand (Explain & Express):**
- Explain difference between scalar and vector quantities
- Express vectors in component form (i, j notation)
- Explain how to draw directed line segments
- Interpret vector diagrams in Cartesian plane
- Explain vector equality conditions

**C3 - Apply (Solve & Construct):**
- Apply triangle law to add vectors geometrically
- Apply parallelogram law to add vectors geometrically
- Perform scalar multiplication on vectors
- Add and subtract vectors algebraically
- Determine if two vectors are parallel or equal
- Solve real-world vector problems (forces, velocities)

---

## 📊 DETAILED SYLLABUS MAPPING

```
UNIT 5: VECTOR
├─ 5.1 INTRODUCTION TO VECTOR
│   ├─ Subtopic: Scalar vs Vector
│   │   ├─ Definition of scalar (magnitude only)
│   │   ├─ Definition of vector (magnitude + direction)
│   │   ├─ Examples of each
│   │   └─ Notation introduction
│   │
│   ├─ Subtopic: Types of Vectors
│   │   ├─ Zero/null vector (0 or 0)
│   │   ├─ Unit vector (magnitude = 1)
│   │   ├─ Parallel vectors (same direction, any magnitude)
│   │   ├─ Equal vectors (same magnitude & direction)
│   │   └─ Negative vector (opposite direction)
│   │
│   ├─ Subtopic: Vector Notation
│   │   ├─ Column form: [x]
│   │   │           [y]
│   │   ├─ Component form: xi + yj
│   │   ├─ Arrow notation: AB or v
│   │   └─ Magnitude notation: |v| or v
│   │
│   └─ Subtopic: Scalar Multiplication
│       ├─ Definition: k × v (scalar k times vector v)
│       ├─ Effect on magnitude: |kv| = |k| × |v|
│       ├─ Effect on direction: positive k (same direction), negative k (opposite)
│       └─ Examples: 2v, -v, 0.5v
│
├─ 5.2 VECTOR IN CARTESIAN PLANES
│   ├─ Subtopic: Component Form (i, j notation)
│   │   ├─ i-unit vector: direction along x-axis
│   │   ├─ j-unit vector: direction along y-axis
│   │   ├─ Expressing position vectors
│   │   ├─ From coordinates to component form
│   │   └─ From component form to coordinates
│   │
│   ├─ Subtopic: Drawing Vectors
│   │   ├─ Direction: angle from positive x-axis
│   │   ├─ Magnitude: length of arrow
│   │   ├─ Directed line segment: from point A to point B
│   │   └─ Head-and-tail representation
│   │
│   └─ Subtopic: Vector Magnitude & Direction
│       ├─ Magnitude formula: |v| = √(x² + y²)
│       ├─ Direction angle: θ = arctan(y/x)
│       └─ Real-world applications (speed, velocity)
│
└─ 5.3 ADDITION & SUBTRACTION OF VECTORS
    ├─ Subtopic: Triangle Law
    │   ├─ Definition: Place vectors head-to-tail
    │   ├─ Result: Vector from start to end
    │   ├─ Geometric construction
    │   └─ Algebraic verification
    │
    ├─ Subtopic: Parallelogram Law
    │   ├─ Definition: Place vectors tail-to-tail
    │   ├─ Complete parallelogram
    │   ├─ Diagonal is resultant
    │   └─ Equivalence to triangle law
    │
    ├─ Subtopic: Algebraic Addition
    │   ├─ Add components separately: (a+c)i + (b+d)j
    │   ├─ Column form addition: [a] + [c] = [a+c]
    │   │                         [b]   [d]   [b+d]
    │   ├─ Properties: commutative, associative
    │   └─ Verification with geometric methods
    │
    └─ Subtopic: Subtraction & Vector Properties
        ├─ Subtraction as addition of negative: A - B = A + (-B)
        ├─ Reverse direction of second vector
        ├─ Parallel vectors (cannot be "split" further)
        ├─ Non-parallel vectors (unique resultant)
        └─ Real-world: relative velocity, net force
```

---

## 🧠 CVSA PROGRESSION FOR VECTOR

### CONCRETE STAGE (Why vectors matter - real stories)

**Story 1: Airplane Flight Path**
```
Scenario: Airplane wants to fly directly North at 300 km/h
Reality: Wind pushes from West at 50 km/h
Question: What's the actual path the airplane takes?

Why it matters: 
- Can't just add 300 + 50 = 350 km/h
- Direction of wind matters (perpendicular to intended path)
- Magnitude AND direction critical
- Pilot must know actual path to reach destination

Visual: Animated airplane with:
- Intended velocity vector (North, 300 km/h) - RED
- Wind velocity vector (East, 50 km/h) - BLUE
- Actual path (resultant, Northeast angle) - GREEN
- Show "if we add like scalars: wrong path"
- Show "if we add like vectors: correct path"
```

**Story 2: Building Forces**
```
Scenario: Construction hook has 2 cables pulling at angles
Cable 1: 800 N force at 30° from horizontal
Cable 2: 600 N force at 120° from horizontal
Question: What's the total force on the hook?

Why it matters:
- Engineers MUST calculate resultant force
- Safety depends on correct force calculation
- Wrong calculation → structural failure
- Shows why vector addition (not scalar) is needed

Visual: 2D top-down view of hook with:
- Cable 1 force (RED arrow)
- Cable 2 force (BLUE arrow)
- Resultant force (GREEN arrow showing net pull direction)
```

**Interactive Element (Concrete):**
```
Student drags arrows on canvas to represent vectors:
- Drag arrow A (RED) to length 300, direction North
- Drag arrow B (BLUE) to length 50, direction East
- See resultant (GREEN) automatically drawn
- Understand: changing magnitude/direction changes result

Key insight: "You can't just ADD the numbers!"
```

---

### VISUAL STAGE (Diagrams showing structure)

**Visual 1: Scalar vs Vector Comparison**
```
┌─────────────────────────────────┬─────────────────────────────────┐
│ SCALAR (Temperature)            │ VECTOR (Velocity)               │
├─────────────────────────────────┼─────────────────────────────────┤
│                                 │                                 │
│     25°C                        │     50 km/h North               │
│     (just a number)             │     (magnitude + direction)     │
│                                 │                                 │
│     No direction needed         │     ┌──────────────────────┐    │
│     No spatial component        │     │   N ↑               │    │
│     Cannot be broken into parts │     │     |               │    │
│                                 │     | ← E             W →|    │
│                                 │     |    |               │    │
│                                 │     └──────────────────────┘    │
│                                 │   Arrow shows direction & size  │
└─────────────────────────────────┴─────────────────────────────────┘

Color-coding throughout app:
- Scalar values: BLACK text (no color)
- Vectors in i-direction: BLUE (always blue for i)
- Vectors in j-direction: RED (always red for j)
- Resultant vectors: GREEN
```

**Visual 2: Cartesian Plane with Unit Vectors**
```
              j-axis (RED, vertical)
                  ↑
                  |
              j (unit = 1)
                  |
    ──────────────O─────────────→ i-axis (BLUE, horizontal)
                  |
                i (unit = 1)
                  |

Example: Vector v = 3i + 2j
├─ Component in i-direction: 3 units BLUE (horizontal)
└─ Component in j-direction: 2 units RED (vertical)

Position: Ends at point (3, 2) on Cartesian plane
```

**Visual 3: Vector Equality & Properties**
```
EQUAL VECTORS (same magnitude & direction):
AB = CD = EF
[All same length, same direction - shown as parallel arrows]

PARALLEL VECTORS (same direction, different magnitudes):
v and 2v are parallel (2v is longer)

NULL VECTOR:
0 or 0 (point, no length, no direction)
         0

UNIT VECTOR:
|u| = 1 (magnitude exactly 1)
```

**Visual 4: Triangle Law Animation**
```
Step 1: Draw vector A from O to P
    P
   /|
  / |
 /  | A
O───┤
 B  
     (A drawn, shown in RED)

Step 2: From P, draw vector B to Q
        Q
       /|
      / |
     /  | B (shown in BLUE)
    P   |
   /|   |
  / |   |
 /  | A |
O───┴───┤
        (B's tail at A's head)

Step 3: Resultant from O to Q
        Q
       /
      / (Resultant = A + B)
     / (shown in GREEN)
    /
   /
  P
 /
O
  (Closes the triangle)

Key: "Head-to-tail = Triangle Law"
```

**Visual 5: Parallelogram Law Animation**
```
Step 1: Draw A from O to A'
Step 2: Draw B from O to B'
Step 3: Complete parallelogram
Step 4: Diagonal OC is resultant (A + B)

    B'───────────C
    /           /|
   / B         / |
  /           /  |
 O───────────A'  |
  \  A   \    \  |
   \       \   \ |
    \       \   \|
     A'      B'  C

Diagonal = same as triangle law result (GREEN)
```

**Interactive Element (Visual):**
```
Student adjusts Cartesian plane:
- Drag point P around
- See i-component (blue line) change length
- See j-component (red line) change length
- Watch vector OV update in real-time
- Understand component breakdown visually
```

---

### SYMBOL STAGE (Notation and formulas)

**Notation Introduction:**

```
VECTOR NOTATION FORMS:

Form 1: Position Vector (from origin O to point P)
    OP or v

Form 2: Component Form (i, j basis)
    v = 3i + 2j (read: "3 i plus 2 j")
    
Form 3: Column Vector
    v = [3]
        [2]

Form 4: Magnitude (length of vector)
    |v| = √(3² + 2²) = √13

Form 5: Direction (angle from positive x-axis)
    θ = arctan(2/3) = 33.7°

All forms describe the SAME vector:
"3 units East AND 2 units North"
```

**Key Formulas:**

```
1. COMPONENT FORM to COORDINATES:
   v = 3i + 2j  →  Point is at (3, 2)

2. COORDINATES to COMPONENT FORM:
   Point (5, -1)  →  v = 5i - 1j

3. MAGNITUDE:
   |v| = √(x² + y²)
   Example: v = 3i + 4j  →  |v| = √(9 + 16) = √25 = 5

4. UNIT VECTOR (direction only):
   u = v / |v|
   Example: v = 3i + 4j, |v| = 5  →  u = (3/5)i + (4/5)j

5. SCALAR MULTIPLICATION:
   kv = k(xi + yj) = (kx)i + (ky)j
   Example: 2(3i + 4j) = 6i + 8j

6. VECTOR ADDITION:
   A + B = (a₁i + a₂j) + (b₁i + b₂j) = (a₁+b₁)i + (a₂+b₂)j
   Example: (3i + 4j) + (2i - 1j) = 5i + 3j

7. VECTOR SUBTRACTION:
   A - B = (a₁i + a₂j) - (b₁i + b₂j) = (a₁-b₁)i + (a₂-b₂)j
   Example: (5i + 3j) - (2i - 1j) = 3i + 4j

8. PARALLEL VECTORS:
   A || B if A = kB for some scalar k
   Example: (6i + 4j) || (3i + 2j) because (6i + 4j) = 2(3i + 2j)

9. EQUAL VECTORS:
   A = B if they have same i-component AND same j-component
   A = (3i + 4j) and B = (3i + 4j)  →  A = B
```

**Interactive Element (Symbol):**
```
Formula Input Practice:

Student sees: "Express this vector in i,j form"
[Cartesian diagram showing vector to point (3, 4)]

Student types: [ 3 ] i + [ 4 ] j
              (input) (input)

Live validation:
- As student types "3" → first box turns YELLOW
- Correct → box turns GREEN, shows ✓
- Wrong → box turns RED, shows ✗
```

---

### ABSTRACT STAGE (Independent problem solving)

**Problem Type 1: Express Vector in Component Form**

```
Difficulty EASY:
Given: Point P at (2, 5)
Task: Express OP in component form
Answer: 2i + 5j

Difficulty MEDIUM:
Given: Vector from A(2, 3) to B(7, 8)
Task: Express AB in component form
Working: AB = (7-2)i + (8-3)j = 5i + 5j
Answer: 5i + 5j

Difficulty HARD:
Given: Point P at (3.5, -2.8), unit vectors i and j given
Task: Express OP and find magnitude
Working: OP = 3.5i - 2.8j
         |OP| = √(3.5² + 2.8²) = √(12.25 + 7.84) = √20.09 ≈ 4.48
Answer: Vector = 3.5i - 2.8j, Magnitude = 4.48 units
```

**Problem Type 2: Add Vectors (Algebraically)**

```
Difficulty EASY:
A = 2i + 3j
B = 1i + 2j
Find: A + B

Step-by-step:
i-components: 2 + 1 = 3
j-components: 3 + 2 = 5
Result: 3i + 5j

Difficulty MEDIUM:
A = 5i + 2j
B = -3i + 4j
Find: A + B

Step-by-step:
i-components: 5 + (-3) = 2
j-components: 2 + 4 = 6
Result: 2i + 6j

Difficulty HARD:
A = 7i - 5j
B = -2i + 8j
C = 3i - 2j
Find: A + B - C

Step-by-step:
i-components: 7 + (-2) - 3 = 2
j-components: -5 + 8 - (-2) = 5
Result: 2i + 5j
```

**Problem Type 3: Vector Equality Check**

```
Difficulty EASY:
Given: X = 3i + 4j, Y = 3i + 4j
Question: Are X and Y equal?
Answer: Yes (i-components match, j-components match)

Difficulty MEDIUM:
Given: A = 2i - 5j, B = 2i - 5j
Question: Are A and B equal? Explain.
Answer: Yes, identical in magnitude and direction

Difficulty HARD:
Given: P = 4i + 3j, Q = 6i + 4.5j
Question: Are P and Q parallel? Equal? Explain.
Analysis: 6i + 4.5j = 1.5(4i + 3j) = 1.5P
Answer: Parallel (Q = 1.5P) but NOT equal (different magnitudes)
```

**Problem Type 4: Scalar Multiplication**

```
Difficulty EASY:
v = 2i + 3j
Find: 2v and -v

Solution:
2v = 2(2i + 3j) = 4i + 6j
-v = -1(2i + 3j) = -2i - 3j

Difficulty MEDIUM:
u = 3i - 2j
Find: -3u and 0.5u

Solution:
-3u = -3(3i - 2j) = -9i + 6j
0.5u = 0.5(3i - 2j) = 1.5i - 1j

Difficulty HARD:
v = 3i + 4j
Find: k such that |kv| = 10

Solution:
|kv| = |k| × |v|
|k| × √(9+16) = 10
|k| × 5 = 10
|k| = 2
So k = 2 or k = -2
```

**Problem Type 5: Real-World Application**

```
Difficulty EASY:
A boat travels 4 km East then 3 km North.
Express total displacement as vector.
Answer: 4i + 3j km

Difficulty MEDIUM:
A plane flies at 300 km/h North.
Wind blows at 50 km/h East.
Find resultant velocity vector.

Solution:
Plane velocity: 0i + 300j
Wind velocity: 50i + 0j
Resultant: 50i + 300j km/h

Difficulty HARD:
Two forces act on object:
F₁ = 12i + 5j N
F₂ = -8i + 3j N
Find resultant force and its magnitude.

Solution:
Resultant = F₁ + F₂ = (12-8)i + (5+3)j = 4i + 8j N
Magnitude = √(16 + 64) = √80 = 4√5 ≈ 8.94 N
```

---

## 🎨 INTERACTIVE PATTERNS (Framework 2 Specifications)

### PATTERN 1: Express Vector in Component Form

```
VISUAL DISPLAY:
┌────────────────────────────────────────────┐
│ Cartesian Plane (200×200 pixels)          │
│                                            │
│   j-axis (RED, vertical)                   │
│      ↑                                      │
│      |    P(3, 4)                          │
│      |    •────────→                       │
│      |    │\                                │
│      |    │ \                               │
│      |    │  \  OP vector                   │
│      |    │   \                             │
│  ────┼────O────────→ i-axis (BLUE)        │
│      |    (origin)                         │
│      |                                      │
│      ↓                                      │
│                                            │
│ Component breakdown:                       │
│ i-component (blue): 3 units →             │
│ j-component (red): 4 units ↑              │
└────────────────────────────────────────────┘

STUDENT INPUT:
┌────────────────────────────────────────────┐
│ Express vector OP in component form:      │
│                                            │
│ OP = [ 3 ] i  +  [ 4 ] j                   │
│       ─────        ─────                   │
│     (input)      (input)                   │
│                                            │
│ [Check Answer] [Hint] [Show Solution]     │
└────────────────────────────────────────────┘

REAL-TIME VALIDATION:
- As student types "3" → first box: YELLOW outline
- Student correct → GREEN outline + ✓
- Student wrong → RED outline + ✗

FEEDBACK (Correct):
"✓ Correct! Vector OP = 3i + 4j
 Meaning: 3 units East (i-direction) + 4 units North (j-direction)"

FEEDBACK (Incorrect):
"✗ Not quite. Let me help:
 - Count blue line (i-component): How many units?
 - Count red line (j-component): How many units?
 Hint: Looking at the diagram, point P is at x = __, y = __"

DIFFICULTY PROGRESSION:
Easy: P at (2, 5), positive integers
Medium: P at (-3, 4), with negative
Hard: P at (3.5, -2.7), with decimals

HINTS (4-level):
Hint 1: "Look at the BLUE line (i-direction). How many units?"
Hint 2: "The point is 3 units to the right, so i-component is 3"
Hint 3: "Now look at RED line (j-direction). How many units up?"
Show Answer: "Vector OP = 3i + 4j (3 units right, 4 units up)"
```

### PATTERN 2: Vector Addition Step-by-Step

```
VISUAL DISPLAY:
┌─────────────────────────────────────────────────┐
│ VECTOR ADDITION using TRIANGLE LAW             │
│                                                 │
│ Given: A = 3i + 4j (RED)                        │
│        B = 2i - 1j (BLUE)                       │
│                                                 │
│ Step 1: Draw A from O to point (3, 4)          │
│         ┌──────────────────────────────┐        │
│         │        (3,4)                 │        │
│         │        •                     │        │
│         │        /|                    │        │
│         │    A  / |                    │        │
│         │      /  |                    │        │
│         │     /   |                    │        │
│         │    /    |                    │        │
│         │   O────────                 │        │
│         │         (3,4)              │        │
│         └──────────────────────────────┘        │
│                                                 │
│ Step 2: From end of A, draw B                   │
│         ┌──────────────────────────────┐        │
│         │                 (5,3) ← END  │        │
│         │                  •           │        │
│         │                 /|           │        │
│         │                / | B         │        │
│         │               /  |           │        │
│         │              /   |           │        │
│         │         (3,4)•   |           │        │
│         │            /|    |           │        │
│         │        A  / |    |           │        │
│         │          /  |    |           │        │
│         │         /   |    |           │        │
│         │        O─────────●           │        │
│         │              (5,0)          │        │
│         └──────────────────────────────┘        │
│                                                 │
│ Step 3: Resultant from O to final point        │
│         ┌──────────────────────────────┐        │
│         │              (5,3)           │        │
│         │               •              │        │
│         │              /|              │        │
│         │         A+B / |              │        │
│         │            /  |              │        │
│         │           /   |              │        │
│         │          /    |              │        │
│         │         /     |              │        │
│         │        O──────•              │        │
│         │            (5,3)            │        │
│         │     A + B = 5i + 3j        │        │
│         └──────────────────────────────┘        │
└─────────────────────────────────────────────────┘

STUDENT INTERACTIVE TASKS:
┌─────────────────────────────────────────────────┐
│ STEP 1: Add i-components                        │
│ 3 + 2 = [ 5 ]                                   │
│         ─────                                   │
│       (input)                                   │
│ [Check]                                         │
│                                                 │
│ STEP 2: Add j-components                        │
│ 4 + (-1) = [ 3 ]                                │
│            ─────                                │
│          (input)                                │
│ [Check]                                         │
│                                                 │
│ STEP 3: Write resultant                         │
│ A + B = [ 5 ] i + [ 3 ] j                       │
│         ─────       ─────                       │
│       (input)     (input)                       │
│ [Check Answer] [Hint] [Show Solution]          │
└─────────────────────────────────────────────────┘

VALIDATION LOGIC:
For each step:
- Check answer immediately upon input
- Green if correct, red if incorrect
- Partial credit: "i-component correct, check j-component"
- Cannot move to next step until current step correct

FEEDBACK (Each Step):
Step 1 Correct: "✓ Yes! 3 + 2 = 5"
Step 2 Correct: "✓ Good! 4 + (-1) = 3 (remember: positive plus negative)"
Step 3 Correct: "✓ Perfect! A + B = 5i + 3j"

HINTS (Progressive):
For Step 2:
Hint 1: "Add the numbers: 4 + (-1) = ?"
Hint 2: "Think: 4 - 1 = 3"
Hint 3: "Positive and negative: 4 + (-1) = 3"

SOLUTION REVEAL (Full Jalan Kerja):
"Given: A = 3i + 4j and B = 2i - 1j

Step 1: Add i-components
        i-component of A: 3
        i-component of B: 2
        Sum: 3 + 2 = 5

Step 2: Add j-components
        j-component of A: 4
        j-component of B: -1
        Sum: 4 + (-1) = 3

Step 3: Write resultant vector
        A + B = 5i + 3j

Verification (Geometric):
Using triangle law:
- Start at O, move 3 units East, 4 units North → reach (3,4)
- From (3,4), move 2 units East, 1 unit South → reach (5,3)
- Direct path O to (5,3) = 5 units East, 3 units North
- Therefore A + B = 5i + 3j ✓"

DIFFICULTY LEVELS:
Easy: A = 2i + 1j, B = 1i + 2j (positive integers)
Medium: A = 5i - 2j, B = -3i + 4j (negative included)
Hard: A = 7.5i - 3.2j, B = -2.1i + 5.8j (decimals)
```

### PATTERN 3: Vector Equality Determination

```
VISUAL COMPARISON:
┌──────────────────────────────────────────────┐
│ Are these vectors equal?                     │
│                                              │
│ Vector X = 4i - 2j          Vector Y = 4i - 2j
│                                              │
│ ┌──────────────────┐  ┌──────────────────┐  │
│ │   j              │  │   j              │  │
│ │   ↑              │  │   ↑              │  │
│ │   |              │  │   |              │  │
│ │   •              │  │   |              │  │
│ │  /|              │  │   |              │  │
│ │ / |              │  │   •              │  │
│ │/  |              │  │  /|              │  │
│ O────→ i          │  │ / |              │  │
│ │ (4,-2)          │  │/  |              │  │
│ │                 │  │O────→ i          │  │
│ │                 │  │ (4,-2)           │  │
│ └──────────────────┘  └──────────────────┘  │
│ Diagram 1              Diagram 2            │
└──────────────────────────────────────────────┘

COMPARISON TABLE (Auto-updating as student checks):
┌──────────────┬──────┬──────┬─────────────────┐
│ Component    │  X   │  Y   │ Match? (✓/✗)    │
├──────────────┼──────┼──────┼─────────────────┤
│ i-component  │  4   │  4   │      ✓ YES      │
│ j-component  │  -2  │  -2  │      ✓ YES      │
├──────────────┼──────┼──────┼─────────────────┤
│ VERDICT      │      │      │  X = Y (EQUAL)  │
└──────────────┴──────┴──────┴─────────────────┘

STUDENT INTERACTION:
┌──────────────────────────────────────────────┐
│ Are X and Y equal?                           │
│                                              │
│ [EQUAL]  [NOT EQUAL]  ← Toggle buttons      │
│                                              │
│ Your answer: _____                          │
│                                              │
│ [Submit Answer] [Get Hint] [Show Solution]  │
└──────────────────────────────────────────────┘

FEEDBACK (Correct):
"✓ Correct! X and Y are EQUAL.
 Both have i-component = 4 AND j-component = -2
 Equal vectors have same magnitude AND same direction."

FEEDBACK (Incorrect):
"✗ Not quite. Let's check:
 X has i = 4, j = -2
 Y has i = 4, j = -2
 All components match, so they ARE equal."

HINTS:
Hint 1: "Compare each component. Do all match?"
Hint 2: "Check i-components: X has 4, Y has 4. Match? Yes"
Hint 3: "Check j-components: X has -2, Y has -2. Match? Yes"
Show Answer: "Both vectors are EQUAL (same i and j components)"

DIFFICULTY LEVELS:
Easy: X = 3i + 4j, Y = 3i + 4j (obviously equal)
Medium: X = 5i - 2j, Y = 5i + 2j (one component different)
Hard: X = 6i + 8j, Y = 3i + 4j (parallel but not equal)
```

### PATTERN 4: Dynamic Problem Generator

```
JAVASCRIPT PSEUDOCODE:

function generateVectorProblem(difficulty, problemType) {
    
    if (difficulty === 'easy') {
        // Small positive integers (1-5)
        const x1 = Math.floor(Math.random() * 5) + 1;
        const y1 = Math.floor(Math.random() * 5) + 1;
        
        if (problemType === 'express') {
            return {
                type: 'express_vector',
                point: { x: x1, y: y1 },
                instruction: `Express vector O→P in i,j form where P(${x1}, ${y1})`,
                correctAnswer: { i: x1, j: y1 }
            };
        } else if (problemType === 'add') {
            const x2 = Math.floor(Math.random() * 5) + 1;
            const y2 = Math.floor(Math.random() * 5) + 1;
            
            return {
                type: 'add_vectors',
                vectorA: { i: x1, j: y1 },
                vectorB: { i: x2, j: y2 },
                instruction: `Add: (${x1}i + ${y1}j) + (${x2}i + ${y2}j)`,
                correctAnswer: { i: x1 + x2, j: y1 + y2 }
            };
        }
    }
    
    else if (difficulty === 'medium') {
        // Mix of positive and negative (-10 to 10)
        const x1 = Math.floor(Math.random() * 21) - 10;  // -10 to 10
        const y1 = Math.floor(Math.random() * 21) - 10;
        const x2 = Math.floor(Math.random() * 21) - 10;
        const y2 = Math.floor(Math.random() * 21) - 10;
        
        const operation = Math.random() > 0.5 ? 'add' : 'subtract';
        
        if (operation === 'add') {
            return {
                type: 'add_vectors',
                vectorA: { i: x1, j: y1 },
                vectorB: { i: x2, j: y2 },
                instruction: `Add: (${x1}i ${y1>=0?'+':''} ${y1}j) + (${x2}i ${y2>=0?'+':''} ${y2}j)`,
                correctAnswer: { i: x1 + x2, j: y1 + y2 }
            };
        } else {
            return {
                type: 'subtract_vectors',
                vectorA: { i: x1, j: y1 },
                vectorB: { i: x2, j: y2 },
                instruction: `Subtract: (${x1}i ${y1>=0?'+':''} ${y1}j) - (${x2}i ${y2>=0?'+':''} ${y2}j)`,
                correctAnswer: { i: x1 - x2, j: y1 - y2 }
            };
        }
    }
    
    else if (difficulty === 'hard') {
        // Decimals, real-world context
        const x1 = (Math.random() * 20 - 10).toFixed(1);  // -10 to 10
        const y1 = (Math.random() * 20 - 10).toFixed(1);
        
        const problemTypes = [
            {
                type: 'resultant_force',
                scenario: 'Two forces acting on object',
                F1_i: parseFloat(x1),
                F1_j: parseFloat(y1),
                F2_i: (Math.random() * 20 - 10).toFixed(1),
                F2_j: (Math.random() * 20 - 10).toFixed(1),
                unit: 'N'
            },
            {
                type: 'resultant_velocity',
                scenario: 'Boat crossing river with current',
                boatI: parseFloat(x1),
                boatJ: parseFloat(y1),
                currentI: (Math.random() * 10 - 5).toFixed(1),
                currentJ: 0,
                unit: 'km/h'
            }
        ];
        
        return problemTypes[Math.floor(Math.random() * problemTypes.length)];
    }
}

// Usage:
let problem = generateVectorProblem('medium', 'add');
displayProblem(problem);

// When student submits:
let userAnswer = getUserInput();  // { i: ___, j: ___ }
let isCorrect = checkAnswer(userAnswer, problem.correctAnswer);
```

---

## 📱 APP STRUCTURE (6 Tabs)

### TAB 1: 🏠 INTRO - "Why Vectors Matter?"

**Section 1: Real-World Story 1 - Airplane Flight**

```
HEADING: "Pesawat Terbang Melintasi Angin (Airplane Flying Through Wind)"

SCENARIO:
"Pilot ingin terbang langsung ke Utara dengan kecepatan 300 km/j.
Tetapi angin berhembus dari Barat dengan kecepatan 50 km/j.
Soalan: Kemana sebenarnya pesawat akan terbang?"

VISUAL: Canvas animation showing:
- Velocity vector (North, 300 km/h) - RED arrow
- Wind vector (East, 50 km/h) - BLUE arrow
- Resultant path - GREEN arrow at angle

INTERACTIVE: 
Student can:
- Drag wind speed slider (0-100 km/h)
- See airplane path change in real-time
- Understand: "Arah angin mempengaruhi laluan sebenar"

KEY INSIGHT:
"Anda tidak boleh hanya menambah 300 + 50 = 350 km/h.
Arah sangat penting!
Inilah kenapa kita pelajari VEKTOR (bukan SKALAR)."
```

**Section 2: Real-World Story 2 - Building Forces**

```
HEADING: "Kabel Konstruksi (Construction Cable Forces)"

SCENARIO:
"Dua kabel menarik hook di lokasi pembinaan.
Kabel 1: 800 N pada sudut 30° dari horizontal
Kabel 2: 600 N pada sudut 120° dari horizontal
Soalan: Apakah daya paduan pada hook?"

VISUAL: Top-down diagram showing:
- Hook in center
- Two cables pulling at different angles
- Resultant force shown dynamically

INTERACTIVE:
Student adjusts:
- Magnitude of Force 1 (slider)
- Angle of Force 1 (slider)
- See resultant change visually

KEY INSIGHT:
"Jurutera MESTI mengira daya paduan dengan betul.
Jika salah, struktur boleh runtuh!
Itulah kuasa VEKTOR dalam dunia nyata."
```

**[Button] Mulai Pembelajaran (Start Learning)**

---

### TAB 2: 📘 CONCEPT 1 - "Skalar vs Vektor (Scalar vs Vector)"

**Definition Section:**

```
HEADING: "Apakah Perbezaan Skalar dan Vektor?"

SKALAR (Scalar):
Definition: "Kuantiti yang hanya mempunyai magnitud (saiz/nilai)"
Examples:
- Suhu: 25°C (hanya angka, tiada arah)
- Jarak: 50 m (berapa jauh, tapi tidak ke mana)
- Masa: 2 jam (berapa lama saja)
- Jisim: 70 kg (berapa berat saja)

VEKTOR (Vector):
Definition: "Kuantiti yang mempunyai magnitud DAN arah"
Examples:
- Halaju: 50 km/j ke Utara (berapa cepat DAN ke mana)
- Sesaran: 100 m ke Timur (berapa jauh DAN arah mana)
- Daya: 500 N ke bawah (kuatnya berapa DAN arah mana)

COMPARISON TABLE:
┌────────────────┬──────────────────┬──────────────────────┐
│ Ciri-ciri      │ SKALAR           │ VEKTOR               │
├────────────────┼──────────────────┼──────────────────────┤
│ Magnitud       │ Ya (saja)        │ Ya + Arah            │
│ Arah           │ Tidak            │ Ya (penting)         │
│ Contoh notasi  │ 5 m/s            │ 5 m/s ke Utara       │
│ Penambahan     │ 3 + 2 = 5        │ Mesti guna gambar    │
│ Boleh diuraikan│ Tidak            │ Ya (i, j components) │
└────────────────┴──────────────────┴──────────────────────┘
```

**Interactive Quiz:**

```
TASK: Kategori setiap kuantiti sebagai SKALAR atau VEKTOR

Items to categorize:
1. Suhu bilik 20°C → [SCALAR] [VECTOR]
2. Kecepatan 30 km/j timur → [SCALAR] [VECTOR]
3. Jarak 5 km → [SCALAR] [VECTOR]
4. Sesaran 5 km utara → [SCALAR] [VECTOR]
5. Daya 200 N → [SCALAR] [VECTOR]
6. Daya 200 N ke bawah → [SCALAR] [VECTOR]

Real-time feedback:
✓ Correct: "Betul! Suhu hanya angka, tiada arah (Skalar)"
✗ Wrong: "Tidak. Perhatian: Arah disebutkan (Vektor)"
```

---

### TAB 3: 📗 CONCEPT 2 - "Vektor dalam Satah Cartes (Vector in Cartesian Plane)"

**Component Form Introduction:**

```
HEADING: "Bentuk Komponen: xi + yj"

EXPLANATION:

i-unit vector: Menunjuk ke arah positif x (TIMUR)
j-unit vector: Menunjuk ke arah positif y (UTARA)

Vektor v = 3i + 2j bermaksud:
"3 unit ke TIMUR (i-direction) + 2 unit ke UTARA (j-direction)"

VISUAL: Cartesian plane dengan color-coding:
- Horizontal line (3 units): BLUE (i-direction)
- Vertical line (2 units): RED (j-direction)
- Arrow from O to endpoint: GREEN (resultant)

POINT COORDINATES ↔ VECTOR FORM:

Jika titik P pada (3, 2):
→ Vektor OP = 3i + 2j

Jika vektor v = 5i - 2j:
→ Titik akhir pada (5, -2)
```

**Interactive Converter:**

```
VISUAL: Cartesian plane dengan:
- Horizontal grid (0-10)
- Vertical grid (-5 to 5)
- Draggable point P
- Live display of coordinates and vector form

Student drags point P:
- When P moves → coordinates update
- When coordinates update → vector form updates
- Shows i-component (blue) and j-component (red)

Example transitions:
Coordinates (2, 3) ↔ Vector 2i + 3j
Coordinates (5, -1) ↔ Vector 5i - 1j
Coordinates (-3, 4) ↔ Vector -3i + 4j

Understanding: Same vector can be translated (moved) anywhere,
but keeps same i and j components.
```

**Practice: Express Vectors**

```
TASK 1: Given coordinates, write vector
Point: (3, 4)
Answer: [3] i + [4] j
(with real-time validation)

TASK 2: Given vector, identify point
Vector: 2i - 5j
Answer: Point is at ([2], [-5])
(with real-time validation)

TASK 3: Calculate magnitude
Vector: 3i + 4j
Task: Find |v| = √(3² + 4²) = √[__] = [__]
Steps: 3² = [9], 4² = [16], 9+16 = [25], √25 = [5]
```

---

### TAB 4: 📕 CONCEPT 3 - "Penambahan & Pengurangan Vektor (Addition & Subtraction)"

**Triangle Law Visual:**

```
HEADING: "Hukum Segitiga (Triangle Law)"

DEFINITION:
"Untuk menambah vektor A dan B:
1. Lukiskan A dari titik O
2. Dari hujung A, lukiskan B
3. Vektor paduan (A+B) dari O ke hujung B"

VISUAL ANIMATION (3 steps):
Step 1: A appears (red arrow from O)
Step 2: B appears (blue arrow from A's end)
Step 3: Resultant highlighted (green arrow O to B's end)

Key insight: "Bentuk SEGI TIGA"
```

**Parallelogram Law Visual:**

```
HEADING: "Hukum Segiempat Selari (Parallelogram Law)"

DEFINITION:
"Untuk menambah vektor A dan B:
1. Lukiskan A dari titik O
2. Dari O, lukiskan B juga
3. Lengkapkan segi empat selari
4. Vektor paduan adalah pepenjuru"

VISUAL ANIMATION (4 steps):
Step 1: A from O (red)
Step 2: B from O (blue)
Step 3: Parallel lines drawn
Step 4: Diagonal highlighted (green resultant)

Comparison: "Triangle Law and Parallelogram Law give SAME result!"
```

**Interactive Problem Solver:**

```
HEADING: "Kira Hasil Tambah (Calculate Resultant)"

Given: A = 3i + 4j, B = 2i - 1j
Find: A + B

STEP-BY-STEP GUIDE:

LANGKAH 1: Tambah komponen i
Komponen i bagi A: 3
Komponen i bagi B: 2
Hasil: 3 + 2 = [5]  ← Student inputs
[Check] [Hint] [Show]

LANGKAH 2: Tambah komponen j
Komponen j bagi A: 4
Komponen j bagi B: -1
Hasil: 4 + (-1) = [3]  ← Student inputs
[Check] [Hint] [Show]

LANGKAH 3: Vektor Paduan
A + B = [5]i + [3]j  ← Student inputs both
[Check Answer] [Show Full Solution]

VISUALISASI:
- Diagram showing triangle law with A (red), B (blue), A+B (green)
- All components labeled with colors
- Head-to-tail connection clear
```

---

### TAB 5: 🎮 PRACTICE - "Latihan Interaktif (Interactive Practice)"

**Difficulty Selector:**

```
BUTTONS: [Mudah / Easy] [Sederhana / Medium] [Mencabar / Hard]

Easy Tab Selected:
"Soalan 1 of 5 | Tepat: 0 | Peratus: 0%"

PROBLEM GENERATION:
Each problem randomly generated from:
- Type: Express vector / Add vectors / Vector equality / Scalar multiplication
- Difficulty level: Positive integers / With negatives / With decimals

Real-time score tracking visible
```

**Problem Display:**

```
HEADING: "Soalan 1 (Question 1)"

DIAGRAM: Cartesian plane or problem setup
TEXT: Problem statement (Bahasa Malaysia)

INPUT FIELDS:
[Answer box 1] [Answer box 2] (as needed)

BUTTONS:
[Semak Jawapan (Check Answer)]
[Petua (Hint)] 
[Tunjukkan Penyelesaian (Show Solution)]
[Soalan Seterusnya (Next Problem)]

INSTANT FEEDBACK:
Green box + ✓ → Correct!
Red box + ✗ → Try again

PROGRESS TRACKER:
Score: 2/5
Accuracy: 40%
XP: 45/100 to reach Level 2
[Progress bar]

GAMIFICATION:
Each correct answer:
- First try: +10 XP, "Perfect! Master mode!"
- Second try: +7 XP, "Good effort!"
- After hint: +5 XP, "Nice work!"
```

---

### TAB 6: 💡 TIPS - "Kesilapan Lazim (Common Mistakes)"

**Mistake 1:**
```
❌ WRONG:
"Komponen i dan j boleh ditambah bersama"
3i + 4j = 7 (treating i and j like regular variables)

✓ CORRECT:
"Komponen i dan j BERBEZA - hanya boleh tambah sesama jenis"
(3i + 2i) + (4j + 5j) = 5i + 9j
TIDAK boleh: 3i + 4j = 7 (ini salah!)

Analogi: 
"3 buku + 4 pensil ≠ 7. Jenis berbeza!"
Begitu juga: 3i + 4j tidak boleh dijumlahkan seperti angka biasa"
```

**Mistake 2:**
```
❌ WRONG:
"Untuk tambah vektor, cukup tambah magnitud"
|A| = 5, |B| = 3 → |A+B| = 8

✓ CORRECT:
"Kena guna hukum segitiga atau segiempat selari"
Vektor A = 3i + 4j dengan |A| = 5
Vektor B = 4i + 0j dengan |B| = 4
A + B = 7i + 4j dengan |A+B| = √(49+16) = √65 ≈ 8.06
(Kebetulan hampir sama, tapi CARA BERBEZA!)

Sebab: Arah vektor penting, bukan hanya magnitud"
```

**Mistake 3:**
```
❌ WRONG:
"Komponen negatif bermakna tidak ada"
-3i + 4j: "Arah i tidak ada"

✓ CORRECT:
"Negatif bermakna arah SEBALIKNYA"
-3i means: 3 units ke BARAT (opposite of TIMUR)
+4j means: 4 units ke UTARA
Jadi vektor: 3 units BARAT + 4 units UTARA

Analogi:
"+3 pada i-axis → 3 steps TIMUR
-3 pada i-axis → 3 steps BARAT (sebaliknya)"
```

**Quick Reference Formulas:**

```
1. COMPONENT FORM:
   Point (x, y) ↔ Vector xi + yj

2. MAGNITUDE:
   |v| = √(x² + y²)

3. ADDITION:
   (a+c)i + (b+d)j = A + B

4. SUBTRACTION:
   (a-c)i + (b-d)j = A - B

5. SCALAR MULTIPLICATION:
   kv = (kx)i + (ky)j

6. PARALLEL VECTORS:
   A || B jika A = kB

7. EQUAL VECTORS:
   A = B jika i-components sama DAN j-components sama
```

---

## 💻 TECHNICAL SPECIFICATIONS

### File Format:
- Single HTML file (self-contained)
- No external dependencies (except CDN)
- Works offline once loaded

### Responsive Design:
- Mobile (320px): Single column, stacked elements
- Tablet (768px): 2-column where appropriate
- Desktop (1024px+): Full layout with sidebars

### Color Scheme:
```css
--primary-blue: #3b82f6 (for i-direction, buttons)
--vector-red: #ef4444 (for j-direction, errors)
--success-green: #22c55e (for correct answers)
--warning-orange: #f59e0b (for hints)
--bg-light: #f9fafb (page background)
--bg-white: #ffffff (cards)
--text-dark: #1f2937 (main text)
--text-muted: #6b7280 (secondary text)
```

### Accessibility:
```
✓ WCAG 2.1 Level AA compliant
✓ Keyboard navigation (Tab, Enter, Arrows)
✓ Color contrast ratio ≥ 4.5:1
✓ ARIA labels on all interactive elements
✓ Focus indicators visible (blue outline 3px)
✓ Semantic HTML5 structure
✓ Screen reader compatible
```

### Performance:
```
✓ File size < 100KB (target: 50KB)
✓ Load time < 2 seconds
✓ Animations 60fps (no lag)
✓ No console errors
✓ Zero layout shift
```

---

## 📝 LEARNING OUTCOMES ASSESSMENT

**C1 (Remember):**
- Students identify scalar vs vector correctly
- Recognize vector notation in multiple forms
- Distinguish vector types (null, unit, parallel, equal)

**C2 (Understand):**
- Explain why direction matters for vectors
- Express vectors in component form with reasoning
- Interpret geometric representations of vectors
- Explain how vector addition works geometrically

**C3 (Apply):**
- Solve vector addition/subtraction problems
- Apply knowledge to real-world scenarios
- Determine if vectors are parallel or equal
- Calculate resultant forces/velocities

---

## ✅ QUALITY CHECKLIST

Before generating, verify this prompt covers:

- [x] All subtopics from Unit 5 syllabus (5.1, 5.2, 5.3)
- [x] C1, C2, C3 competency levels
- [x] 2 real-world stories (airplane, building forces)
- [x] CVSA progression (Concrete → Visual → Symbol → Abstract)
- [x] 4 main interactive patterns fully specified
- [x] 6-tab structure with content for each
- [x] Difficulty levels (Easy / Medium / Hard)
- [x] Hints 4-level progressive system
- [x] Full jalan kerja solutions
- [x] Dynamic problem generator specifications
- [x] Color-coding consistency (blue=i, red=j, green=resultant)
- [x] Bilingual (Bahasa Malaysia + English)
- [x] Technical requirements (responsive, accessible, performance)
- [x] Gamification mechanics (XP, levels, badges, progress)
- [x] Common misconceptions addressed with specific feedback

---

## 🚀 READY TO GENERATE

This prompt is production-ready for Claude code generation. 

**Next step:** Copy this entire prompt (or sections as needed) and paste into Claude chat with command:

```
"Generate complete interactive HTML app for VECTOR topic using this detailed prompt.
Output: Single .html file, production-ready, all features working."
```

**Expected output:** Complete, tested, classroom-ready interactive learning application in 5-10 minutes.

---

**End of Detailed VECTOR Prompt**

