import { SubjectId } from "@shared/schema";

export type TaskType = "reading" | "practice" | "writing" | "review";

export interface ComprehensionQuestion {
  question: string;
  answer: string;
}

export interface VocabularyTerm {
  term: string;
  definition: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  answer: string;
  solution?: string;
  options?: string[];
  type: "short" | "multiple-choice";
}

export interface WritingPrompt {
  prompt: string;
  requirements: string[];
  structure: string[];
}

export interface FlashcardQuestion {
  question: string;
  answer: string;
  type: "multiple-choice" | "short-answer";
  options?: string[];
}

export interface ReadingContent {
  title: string;
  content: string;
  keyPoints: string[];
}

export interface StudyContent {
  type: TaskType;
  comprehensionQuestions?: ComprehensionQuestion[];
  vocabulary?: VocabularyTerm[];
  summaryPoints?: string[];
  practiceQuestions?: PracticeQuestion[];
  writingPrompts?: WritingPrompt[];
  flashcards?: FlashcardQuestion[];
  reading?: ReadingContent;
}

export function getTaskType(taskTitle: string): TaskType {
  const title = taskTitle.toLowerCase();
  if (title.includes("read") || title.includes("chapter") || title.includes("study")) {
    return "reading";
  }
  if (title.includes("practice") || title.includes("problem") || title.includes("exercise") || title.includes("worksheet")) {
    return "practice";
  }
  if (title.includes("write") || title.includes("essay") || title.includes("outline") || title.includes("draft") || title.includes("response")) {
    return "writing";
  }
  return "review";
}

const mathQuestions: PracticeQuestion[] = [
  { id: "m1", question: "Simplify: 2³ × 2⁴", answer: "2⁷ = 128", solution: "When multiplying same base, add indices: 2³⁺⁴ = 2⁷ = 128", type: "short" },
  { id: "m2", question: "Simplify: (3²)⁴", answer: "3⁸ = 6561", solution: "When raising a power to a power, multiply indices: 3²×⁴ = 3⁸", type: "short" },
  { id: "m3", question: "Evaluate: 5⁰", answer: "1", solution: "Any non-zero number raised to the power of 0 equals 1", type: "short" },
  { id: "m4", question: "Simplify: 4⁻²", answer: "1/16", solution: "Negative exponent means reciprocal: 4⁻² = 1/4² = 1/16", type: "short" },
  { id: "m5", question: "Convert 2.5 km to metres", answer: "2500 m", solution: "1 km = 1000 m, so 2.5 × 1000 = 2500 m", type: "short" },
  { id: "m6", question: "Simplify: √72", answer: "6√2", solution: "√72 = √(36 × 2) = √36 × √2 = 6√2", type: "short" },
  { id: "m7", question: "Simplify: √50 + √18", answer: "8√2", solution: "√50 = 5√2, √18 = 3√2, so 5√2 + 3√2 = 8√2", type: "short" },
  { id: "m8", question: "Evaluate: |−7|", answer: "7", solution: "Absolute value gives the distance from zero, always positive", type: "short" },
  { id: "m9", question: "Solve: |x| = 5", answer: "x = 5 or x = −5", solution: "If |x| = 5, then x is 5 units from zero, so x = 5 or x = −5", type: "short" },
  { id: "m10", question: "Find the distance between points (2, 3) and (5, 7)", answer: "5", solution: "d = √[(5-2)² + (7-3)²] = √[9 + 16] = √25 = 5", type: "short" },
  { id: "m11", question: "Find the midpoint of (1, 4) and (5, 8)", answer: "(3, 6)", solution: "Midpoint = ((1+5)/2, (4+8)/2) = (3, 6)", type: "short" },
  { id: "m12", question: "Find the gradient between (2, 1) and (6, 9)", answer: "2", solution: "Gradient = (9-1)/(6-2) = 8/4 = 2", type: "short" },
  { id: "m13", question: "What is the equation of a line with gradient 3 passing through (0, 2)?", answer: "y = 3x + 2", solution: "Using y = mx + c, m = 3 and c = 2", type: "short" },
  { id: "m14", question: "Solve: 3x + 7 = 16", answer: "x = 3", solution: "3x = 16 - 7 = 9, so x = 9/3 = 3", type: "short" },
  { id: "m15", question: "Solve the system: x + y = 10, x - y = 4", answer: "x = 7, y = 3", solution: "Add equations: 2x = 14, x = 7. Substitute: 7 + y = 10, y = 3", type: "short" },
  { id: "m16", question: "Expand: (x + 3)(x + 5)", answer: "x² + 8x + 15", solution: "FOIL: x² + 5x + 3x + 15 = x² + 8x + 15", type: "short" },
  { id: "m17", question: "Factorise: x² + 7x + 12", answer: "(x + 3)(x + 4)", solution: "Find two numbers that multiply to 12 and add to 7: 3 and 4", type: "short" },
  { id: "m18", question: "Find the axis of symmetry of y = x² - 6x + 8", answer: "x = 3", solution: "Axis of symmetry = -b/2a = -(-6)/2(1) = 6/2 = 3", type: "short" },
  { id: "m19", question: "Solve: x² - 5x + 6 = 0", answer: "x = 2 or x = 3", solution: "Factorise: (x-2)(x-3) = 0, so x = 2 or x = 3", type: "short" },
  { id: "m20", question: "Find the next term: 2, 5, 8, 11, ...", answer: "14", solution: "Arithmetic sequence with common difference 3: 11 + 3 = 14", type: "short" },
  { id: "m21", question: "Write the explicit formula for: 3, 7, 11, 15, ...", answer: "aₙ = 4n - 1", solution: "First term a₁ = 3, common difference d = 4, so aₙ = 3 + (n-1)×4 = 4n - 1", type: "short" },
  { id: "m22", question: "If y is directly proportional to x and y = 12 when x = 4, find y when x = 7", answer: "21", solution: "y = kx, so 12 = k(4), k = 3. When x = 7, y = 3(7) = 21", type: "short" },
  { id: "m23", question: "Rearrange v = u + at to make t the subject", answer: "t = (v - u)/a", solution: "Subtract u: v - u = at. Divide by a: t = (v - u)/a", type: "short" },
  { id: "m24", question: "Express the quadratic y = x² - 4x + 3 in vertex form", answer: "y = (x - 2)² - 1", solution: "Complete the square: (x² - 4x + 4) - 4 + 3 = (x - 2)² - 1", type: "short" },
  { id: "m25", question: "What is the discriminant of x² + 4x + 5?", answer: "-4", solution: "b² - 4ac = 16 - 20 = -4 (no real solutions)", type: "short" },
];

const scienceQuestions: PracticeQuestion[] = [
  { id: "s1", question: "What subatomic particle determines the element?", answer: "Proton", options: ["Electron", "Proton", "Neutron", "Photon"], type: "multiple-choice" },
  { id: "s2", question: "What is an isotope?", answer: "Atoms of the same element with different numbers of neutrons", type: "short" },
  { id: "s3", question: "What is half-life?", answer: "The time it takes for half of a radioactive sample to decay", type: "short" },
  { id: "s4", question: "What type of radiation can be stopped by paper?", answer: "Alpha particles", options: ["Alpha", "Beta", "Gamma", "X-rays"], type: "multiple-choice" },
  { id: "s5", question: "Balance this equation: H₂ + O₂ → H₂O", answer: "2H₂ + O₂ → 2H₂O", solution: "Need 4 H on each side and 2 O on each side", type: "short" },
  { id: "s6", question: "What type of reaction is: HCl + NaOH → NaCl + H₂O?", answer: "Neutralisation reaction", type: "short" },
  { id: "s7", question: "What is electrolysis?", answer: "Using electricity to break down a compound into its elements", type: "short" },
  { id: "s8", question: "What is produced at the cathode during electrolysis of water?", answer: "Hydrogen gas", type: "short" },
  { id: "s9", question: "What is the law of conservation of mass?", answer: "Mass cannot be created or destroyed in a chemical reaction", type: "short" },
  { id: "s10", question: "What type of reaction releases energy?", answer: "Exothermic", options: ["Endothermic", "Exothermic", "Synthesis", "Decomposition"], type: "multiple-choice" },
  { id: "s11", question: "What is homeostasis?", answer: "The maintenance of a stable internal environment", type: "short" },
  { id: "s12", question: "Which system controls long-lasting effects through hormones?", answer: "Endocrine system", type: "short" },
  { id: "s13", question: "What hormone regulates blood glucose levels?", answer: "Insulin", type: "short" },
  { id: "s14", question: "What type of feedback loop maintains homeostasis?", answer: "Negative feedback loop", type: "short" },
  { id: "s15", question: "Name the 'fight or flight' hormones", answer: "Adrenaline and noradrenaline", type: "short" },
  { id: "s16", question: "What is a pathogen?", answer: "A microorganism that causes disease", type: "short" },
  { id: "s17", question: "Name the four types of pathogens", answer: "Bacteria, viruses, fungi, parasites", type: "short" },
  { id: "s18", question: "What is the first line of defence against pathogens?", answer: "Physical barriers (skin, mucous membranes)", type: "short" },
  { id: "s19", question: "What cells produce antibodies?", answer: "B lymphocytes (B cells)", type: "short" },
  { id: "s20", question: "What is immunological memory?", answer: "The immune system's ability to remember and respond faster to previously encountered pathogens", type: "short" },
  { id: "s21", question: "What is an autoimmune disease?", answer: "When the immune system attacks the body's own cells", type: "short" },
  { id: "s22", question: "How do vaccines work?", answer: "They expose the body to weakened/inactive pathogens to build immunity", type: "short" },
  { id: "s23", question: "What is the difference between infectious and non-infectious diseases?", answer: "Infectious diseases are caused by pathogens and can spread; non-infectious cannot spread between people", type: "short" },
  { id: "s24", question: "What gland is known as the 'master gland'?", answer: "Pituitary gland", type: "short" },
  { id: "s25", question: "What is Type 1 diabetes caused by?", answer: "The body's inability to produce insulin", type: "short" },
];

const historyQuestions: PracticeQuestion[] = [
  { id: "h1", question: "What event triggered the start of World War I?", answer: "Assassination of Archduke Franz Ferdinand", type: "short" },
  { id: "h2", question: "Name the four main causes of WWI (MAIN)", answer: "Militarism, Alliances, Imperialism, Nationalism", type: "short" },
  { id: "h3", question: "When did the Gallipoli campaign take place?", answer: "1915", options: ["1914", "1915", "1916", "1918"], type: "multiple-choice" },
  { id: "h4", question: "What is ANZAC Day commemorating?", answer: "Australian and New Zealand soldiers who served at Gallipoli and all wars", type: "short" },
  { id: "h5", question: "Name three battles on the Western Front involving Australians", answer: "Somme, Fromelles, Passchendaele", type: "short" },
  { id: "h6", question: "What treaty ended WWI?", answer: "Treaty of Versailles", type: "short" },
  { id: "h7", question: "Which country was blamed for WWI in the Treaty of Versailles?", answer: "Germany", type: "short" },
  { id: "h8", question: "What was the Great Depression?", answer: "A severe worldwide economic downturn in the 1930s", type: "short" },
  { id: "h9", question: "What event started WWII in Europe?", answer: "Germany's invasion of Poland in 1939", type: "short" },
  { id: "h10", question: "What was the Holocaust?", answer: "The systematic genocide of six million Jews by Nazi Germany", type: "short" },
  { id: "h11", question: "What was the significance of the Fall of Singapore?", answer: "Britain's worst military defeat; 15,000 Australians captured", type: "short" },
  { id: "h12", question: "Why was the Kokoda Track campaign significant?", answer: "First time Australians defended their homeland; stopped Japanese advance", type: "short" },
  { id: "h13", question: "What is a primary source?", answer: "An original document or object created at the time being studied", type: "short" },
  { id: "h14", question: "What is the Australian Constitution?", answer: "The set of rules establishing Australia's federal system of government", type: "short" },
  { id: "h15", question: "What is the role of the House of Representatives?", answer: "The lower house where government is formed and laws are debated", type: "short" },
  { id: "h16", question: "What is a referendum?", answer: "A vote by citizens to change the Constitution", type: "short" },
  { id: "h17", question: "What is the role of the Governor-General?", answer: "The Queen's representative who gives royal assent to laws", type: "short" },
  { id: "h18", question: "What is the difference between federal and state powers?", answer: "Federal powers apply nationally; state powers apply within each state", type: "short" },
  { id: "h19", question: "What is civic participation?", answer: "Ways citizens engage in their community and government (voting, volunteering, activism)", type: "short" },
  { id: "h20", question: "Name three international organisations Australia belongs to", answer: "United Nations, ASEAN, Pacific Islands Forum", type: "short" },
  { id: "h21", question: "What does OPCL stand for in source analysis?", answer: "Origin, Purpose, Content, Limitation", type: "short" },
  { id: "h22", question: "What is historical bias?", answer: "A one-sided or prejudiced perspective in historical sources", type: "short" },
  { id: "h23", question: "Why is it important to use multiple sources?", answer: "To get a balanced view and verify information through corroboration", type: "short" },
  { id: "h24", question: "What does 'Lest We Forget' mean?", answer: "A phrase of remembrance for those who died in war", type: "short" },
  { id: "h25", question: "What is the ANZAC legend?", answer: "The idea that Australian soldiers showed courage, mateship, and endurance at Gallipoli", type: "short" },
];

const englishQuestions: PracticeQuestion[] = [
  { id: "e1", question: "What is ethos in persuasive writing?", answer: "Appeal to credibility or character", options: ["Appeal to emotion", "Appeal to credibility", "Appeal to logic", "Appeal to fear"], type: "multiple-choice" },
  { id: "e2", question: "What is pathos?", answer: "Appeal to emotion", type: "short" },
  { id: "e3", question: "What is logos?", answer: "Appeal to logic and reason", type: "short" },
  { id: "e4", question: "What is a rhetorical question?", answer: "A question asked for effect, not requiring an answer", type: "short" },
  { id: "e5", question: "What is an anecdote?", answer: "A short personal story used to make a point", type: "short" },
  { id: "e6", question: "What is emotive language?", answer: "Words chosen to trigger an emotional response", type: "short" },
  { id: "e7", question: "What is the purpose of a news article?", answer: "To inform readers about current events", type: "short" },
  { id: "e8", question: "What makes writing 'persuasive'?", answer: "It aims to convince the reader to accept a viewpoint or take action", type: "short" },
  { id: "e9", question: "What is tone in writing?", answer: "The author's attitude toward the subject matter", type: "short" },
  { id: "e10", question: "What is a contention?", answer: "The main argument or position in persuasive writing", type: "short" },
  { id: "e11", question: "What is a dystopia?", answer: "An imagined society with great suffering and injustice", type: "short" },
  { id: "e12", question: "Who wrote 1984?", answer: "George Orwell", type: "short" },
  { id: "e13", question: "What is the Party's slogan in 1984?", answer: "War is Peace. Freedom is Slavery. Ignorance is Strength.", type: "short" },
  { id: "e14", question: "What is Newspeak?", answer: "The Party's simplified language designed to limit free thought", type: "short" },
  { id: "e15", question: "What does Big Brother represent?", answer: "Total surveillance and authoritarian control", type: "short" },
  { id: "e16", question: "What is Room 101?", answer: "A torture room containing each person's worst fear", type: "short" },
  { id: "e17", question: "What does '2+2=5' symbolise in 1984?", answer: "Total submission to the Party's control over truth", type: "short" },
  { id: "e18", question: "Who is the protagonist of 1984?", answer: "Winston Smith", type: "short" },
  { id: "e19", question: "What is the Ministry of Truth's real purpose?", answer: "To rewrite history and spread propaganda", type: "short" },
  { id: "e20", question: "What is doublethink?", answer: "Holding two contradictory beliefs simultaneously", type: "short" },
  { id: "e21", question: "What is symbolism?", answer: "Using objects or images to represent abstract ideas", type: "short" },
  { id: "e22", question: "What is irony?", answer: "Expressing meaning by using language that signifies the opposite", type: "short" },
  { id: "e23", question: "What does TEEL stand for?", answer: "Topic, Explain, Evidence, Link", type: "short" },
  { id: "e24", question: "What is a thesis statement?", answer: "A sentence stating the main argument of an essay", type: "short" },
  { id: "e25", question: "What is an allegory?", answer: "A story with a hidden political or moral meaning", type: "short" },
];

// Week-specific reading content for Mathematics
// Term 1: Problem solving, exponents, units, surds, absolute value, patterns, coordinate geometry, linear equations
// Term 2: Algebra review, relations/functions, quadratics, sequences, formulas, proportion
const mathReadingByWeek: Record<number, ReadingContent> = {
  1: {
    title: "Problem Solving and the Real Number System",
    content: `Mathematics is fundamentally about problem solving. George Polya developed a famous four-step approach that helps tackle any mathematical problem systematically.

Polya's Four Steps:
1. Understand the Problem: What are you asked to find? What information is given? What are the conditions?
2. Devise a Plan: How can you connect the given information to what you need to find? Consider strategies like drawing a diagram, looking for patterns, working backwards, or breaking the problem into smaller parts.
3. Carry Out the Plan: Execute your strategy step by step, checking each step as you go.
4. Look Back: Check your answer. Does it make sense? Could you solve it differently?

The Real Number System:
All numbers we use can be classified into the real number system:
- Natural numbers (N): Counting numbers 1, 2, 3, ...
- Whole numbers (W): Natural numbers plus zero
- Integers (Z): Whole numbers and their negatives ..., -2, -1, 0, 1, 2, ...
- Rational numbers (Q): Numbers expressible as fractions a/b where b ≠ 0
- Irrational numbers: Numbers that cannot be expressed as fractions (like π, √2)

Together, rational and irrational numbers form the real numbers (R).`,
    keyPoints: [
      "Polya's 4 steps: Understand, Plan, Execute, Check",
      "Natural ⊂ Whole ⊂ Integers ⊂ Rational ⊂ Real",
      "Irrational numbers cannot be written as fractions",
      "Apply systematic problem-solving to all mathematics"
    ]
  },
  2: {
    title: "Laws of Exponents",
    content: `Exponents (or indices) are a shorthand way of writing repeated multiplication. Understanding the laws of exponents is essential for simplifying expressions and solving equations.

The Laws of Exponents:

1. Product Rule: aᵐ × aⁿ = aᵐ⁺ⁿ
When multiplying same bases, add the exponents.
Example: 2³ × 2⁴ = 2⁷ = 128

2. Quotient Rule: aᵐ ÷ aⁿ = aᵐ⁻ⁿ
When dividing same bases, subtract the exponents.
Example: 5⁶ ÷ 5² = 5⁴ = 625

3. Power Rule: (aᵐ)ⁿ = aᵐˣⁿ
When raising a power to a power, multiply the exponents.
Example: (3²)⁴ = 3⁸ = 6561

4. Zero Exponent: a⁰ = 1 (where a ≠ 0)
Any non-zero number raised to the power of zero equals 1.

5. Negative Exponent: a⁻ⁿ = 1/aⁿ
A negative exponent means the reciprocal.
Example: 2⁻³ = 1/2³ = 1/8

6. Power of a Product: (ab)ⁿ = aⁿbⁿ
7. Power of a Quotient: (a/b)ⁿ = aⁿ/bⁿ`,
    keyPoints: [
      "Multiply same base: add exponents (aᵐ × aⁿ = aᵐ⁺ⁿ)",
      "Divide same base: subtract exponents (aᵐ ÷ aⁿ = aᵐ⁻ⁿ)",
      "Power to power: multiply exponents ((aᵐ)ⁿ = aᵐˣⁿ)",
      "a⁰ = 1 and a⁻ⁿ = 1/aⁿ"
    ]
  },
  3: {
    title: "Units and Measurements",
    content: `Understanding units and being able to convert between them is essential for solving real-world problems. The metric system is based on powers of 10, making conversions straightforward.

Metric Prefixes:
- kilo (k) = 1000
- hecto (h) = 100
- deca (da) = 10
- base unit = 1
- deci (d) = 0.1
- centi (c) = 0.01
- milli (m) = 0.001

Length Conversions:
1 km = 1000 m, 1 m = 100 cm = 1000 mm

Area Conversions:
Since area is length × length, we square the conversion factor.
1 m² = 10,000 cm² (because 1 m = 100 cm, so 100² = 10,000)
1 km² = 1,000,000 m²

Volume Conversions:
Since volume is length × length × length, we cube the conversion factor.
1 m³ = 1,000,000 cm³
1 L = 1000 mL = 1000 cm³

Compound Measures:
Speed = distance/time (km/h or m/s)
Density = mass/volume (g/cm³ or kg/m³)
Pressure = force/area (Pa or N/m²)

To convert km/h to m/s: multiply by 1000/3600 = 5/18`,
    keyPoints: [
      "Metric system is based on powers of 10",
      "Area units: square the conversion factor",
      "Volume units: cube the conversion factor",
      "Compound measures combine multiple units"
    ]
  },
  4: {
    title: "Surds, Roots and Radicals",
    content: `A surd (or radical) is a root that cannot be simplified to a whole number. Understanding how to work with surds is important for exact calculations.

What is a Surd?
√4 = 2 (not a surd - it's rational)
√5 ≈ 2.236... (a surd - it's irrational)

Simplifying Surds:
To simplify a surd, find the largest perfect square factor.
√72 = √(36 × 2) = √36 × √2 = 6√2
√50 = √(25 × 2) = √25 × √2 = 5√2

Rules for Radicals:
1. √a × √b = √(ab)
2. √a ÷ √b = √(a/b)
3. √a² = |a| (absolute value)
4. (√a)² = a

Adding and Subtracting Surds:
You can only combine like surds (same number under the root).
3√2 + 5√2 = 8√2
√50 + √18 = 5√2 + 3√2 = 8√2

Multiplying Surds:
√3 × √5 = √15
2√3 × 4√5 = 8√15

Rationalising the Denominator:
To remove a surd from the denominator, multiply by a form of 1.
1/√2 = 1/√2 × √2/√2 = √2/2`,
    keyPoints: [
      "Surds are irrational roots like √2, √3, √5",
      "Simplify by finding largest perfect square factor",
      "Only combine like surds (same radical)",
      "Rationalise denominators by multiplying by √n/√n"
    ]
  },
  5: {
    title: "Absolute Value",
    content: `Absolute value represents the distance of a number from zero on the number line. Distance is always positive, so absolute value is always non-negative.

Definition:
|a| = a if a ≥ 0
|a| = -a if a < 0

In words: If the number is positive or zero, keep it. If negative, make it positive.

Examples:
|7| = 7
|-7| = 7
|0| = 0

Properties of Absolute Value:
1. |a| ≥ 0 (always non-negative)
2. |a| = |-a| (distance is the same in both directions)
3. |ab| = |a| × |b|
4. |a/b| = |a|/|b| (where b ≠ 0)
5. |a + b| ≤ |a| + |b| (triangle inequality)

Solving Absolute Value Equations:
If |x| = 5, then x = 5 or x = -5
If |x - 3| = 7, then x - 3 = 7 or x - 3 = -7
So x = 10 or x = -4

Solving Absolute Value Inequalities:
|x| < 3 means -3 < x < 3
|x| > 3 means x < -3 or x > 3`,
    keyPoints: [
      "Absolute value = distance from zero",
      "|a| is always non-negative",
      "|x| = k has two solutions: x = k or x = -k",
      "|x| < k means -k < x < k"
    ]
  },
  6: {
    title: "Making Generalisations and Patterns",
    content: `Finding patterns and making generalisations is at the heart of algebra. By identifying patterns in specific examples, we can write general rules that work for any case.

Looking for Patterns:
Consider the sum of the first n odd numbers:
1 = 1 = 1²
1 + 3 = 4 = 2²
1 + 3 + 5 = 9 = 3²
1 + 3 + 5 + 7 = 16 = 4²

Pattern: The sum of the first n odd numbers equals n².

Steps to Find Patterns:
1. List several specific examples
2. Look for relationships between inputs and outputs
3. Test your pattern with more examples
4. Write a general rule using algebra
5. Prove it works for all cases

Types of Patterns:
Linear patterns: Increase by a constant amount (2, 5, 8, 11...)
Quadratic patterns: Second differences are constant (1, 4, 9, 16...)
Geometric patterns: Multiply by a constant (2, 6, 18, 54...)

Writing Generalisations:
If the nth term of a sequence is aₙ:
Linear: aₙ = dn + c (where d is common difference)
Quadratic: aₙ = an² + bn + c

Using patterns to solve problems allows us to find answers for any value of n without calculating every case.`,
    keyPoints: [
      "Look for patterns in specific examples",
      "Test patterns with more examples before generalising",
      "Linear patterns have constant first differences",
      "Quadratic patterns have constant second differences"
    ]
  },
  7: {
    title: "NAPLAN Preparation - Review Week",
    content: `This week focuses on consolidating skills for NAPLAN. Review the key mathematical concepts and practice applying them in various contexts.

Number and Algebra Review:
- Place value and number operations
- Fractions, decimals, and percentages
- Ratio and proportion
- Order of operations (BODMAS)
- Algebraic expressions and equations

Measurement and Geometry Review:
- Perimeter, area, and volume
- Angles and shapes
- Coordinate geometry
- Time and rates

Statistics and Probability Review:
- Mean, median, mode, range
- Reading graphs and tables
- Probability calculations

NAPLAN Tips:
1. Read questions carefully - identify what's being asked
2. Show your working - even for multiple choice
3. Check units match in your answer
4. Use estimation to check if answers are reasonable
5. Manage your time - don't spend too long on one question
6. If stuck, move on and come back later

Practice applying Polya's problem-solving steps to unfamiliar questions. Many NAPLAN questions test understanding rather than just procedures.`,
    keyPoints: [
      "Review number, algebra, measurement, statistics",
      "Read questions carefully before solving",
      "Check that answers are reasonable",
      "Manage time effectively during the test"
    ]
  },
  8: {
    title: "Coordinate Geometry",
    content: `Coordinate geometry connects algebra and geometry by using coordinates to describe positions and relationships on a plane.

The Coordinate Plane:
- Horizontal axis (x-axis) and vertical axis (y-axis)
- Origin (0, 0) is where axes meet
- Points are written as ordered pairs (x, y)

Distance Between Two Points:
The distance between (x₁, y₁) and (x₂, y₂) is:
d = √[(x₂ - x₁)² + (y₂ - y₁)²]

This comes from Pythagoras' theorem.
Example: Distance from (1, 2) to (4, 6)
d = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5

Midpoint Between Two Points:
The midpoint of the line segment joining (x₁, y₁) and (x₂, y₂) is:
M = ((x₁ + x₂)/2, (y₁ + y₂)/2)

Example: Midpoint of (2, 3) and (8, 7)
M = ((2+8)/2, (3+7)/2) = (5, 5)

Gradient (Slope):
The gradient measures steepness and direction.
m = (y₂ - y₁)/(x₂ - x₁) = rise/run

Positive gradient: line goes up from left to right
Negative gradient: line goes down from left to right
Zero gradient: horizontal line
Undefined: vertical line`,
    keyPoints: [
      "Distance formula: d = √[(x₂-x₁)² + (y₂-y₁)²]",
      "Midpoint formula: M = ((x₁+x₂)/2, (y₁+y₂)/2)",
      "Gradient = rise/run = (y₂-y₁)/(x₂-x₁)",
      "Positive gradient goes up, negative goes down"
    ]
  },
  9: {
    title: "Linear Equations and Systems",
    content: `Linear equations form straight lines when graphed. Solving systems of linear equations means finding where two lines intersect.

Equation of a Straight Line:
Gradient-intercept form: y = mx + c
- m is the gradient
- c is the y-intercept

Finding the Equation:
Given gradient m and a point (x₁, y₁):
y - y₁ = m(x - x₁)

Solving Linear Equations:
The goal is to isolate the variable.
Example: 3x + 7 = 16
3x = 16 - 7 = 9
x = 3

Systems of Linear Equations:
Two equations with two unknowns - find values that satisfy both.

Substitution Method:
1. Solve one equation for a variable
2. Substitute into the other equation
3. Solve and substitute back

Elimination Method:
1. Multiply equations so coefficients match
2. Add or subtract to eliminate a variable
3. Solve and substitute back

Example: x + y = 10, x - y = 4
Adding: 2x = 14, so x = 7
Substituting: 7 + y = 10, so y = 3

Real-Life Modelling:
Linear equations can model situations with constant rates of change, such as distance-time relationships, cost functions, or depreciation.`,
    keyPoints: [
      "y = mx + c: m is gradient, c is y-intercept",
      "Use substitution when one equation is already solved",
      "Use elimination when coefficients can be matched",
      "Check solutions in both original equations"
    ]
  },
  10: {
    title: "Algebra Review: Simplifying and Expanding",
    content: `Term 2 begins with consolidating algebraic skills. Being fluent with simplifying, expanding, and factorising is essential for working with functions and equations.

Simplifying Algebraic Expressions:
Combine like terms - terms with the same variables raised to the same power.
3x + 5y - 2x + 3y = x + 8y
4a²b - 2ab² + 3a²b = 7a²b - 2ab²

Expanding Single Brackets:
Multiply the term outside by each term inside.
3(x + 4) = 3x + 12
-2(3y - 5) = -6y + 10
x(x + 3) = x² + 3x

Expanding Double Brackets (FOIL):
(x + 2)(x + 5)
= x² + 5x + 2x + 10
= x² + 7x + 10

First × First, Outer × Outer, Inner × Inner, Last × Last

Special Products:
Perfect square: (a + b)² = a² + 2ab + b²
Perfect square: (a - b)² = a² - 2ab + b²
Difference of squares: (a + b)(a - b) = a² - b²

Factorising (reverse of expanding):
Common factor: 6x + 9 = 3(2x + 3)
Grouping: ax + ay + bx + by = a(x+y) + b(x+y) = (a+b)(x+y)`,
    keyPoints: [
      "Combine like terms when simplifying",
      "Use FOIL for double brackets",
      "(a+b)² = a² + 2ab + b²",
      "(a+b)(a-b) = a² - b²"
    ]
  },
  11: {
    title: "Relations and Functions",
    content: `Functions are a fundamental concept in mathematics, describing relationships where each input has exactly one output.

Relations vs Functions:
A relation is any set of ordered pairs.
A function is a special relation where each x-value maps to exactly one y-value.

Testing for Functions:
Vertical Line Test: If any vertical line crosses the graph more than once, it's NOT a function.

Mapping Diagrams:
Show how each input maps to outputs.
If any input has more than one arrow leaving it, it's not a function.

Function Notation:
f(x) reads as "f of x" - the output when x is input.
If f(x) = 2x + 3:
f(1) = 2(1) + 3 = 5
f(-2) = 2(-2) + 3 = -1

Domain and Range:
Domain: All possible input values (x-values)
Range: All possible output values (y-values)

For f(x) = √x:
Domain: x ≥ 0 (can't take square root of negative)
Range: y ≥ 0 (square root is always non-negative)

Evaluating Functions:
To find f(a), substitute a for x in the function rule.
To find x when f(x) = k, solve the equation.`,
    keyPoints: [
      "Functions: each input has exactly one output",
      "Vertical line test identifies functions",
      "f(x) notation: f(2) means substitute x = 2",
      "Domain = inputs, Range = outputs"
    ]
  },
  12: {
    title: "Quadratic Expressions",
    content: `Quadratic expressions contain a variable squared as the highest power. Learning to factorise them is key to solving quadratic equations.

Standard Form:
ax² + bx + c where a ≠ 0

Factorising when a = 1 (Monic Quadratics):
x² + bx + c = (x + m)(x + n)
where m × n = c and m + n = b

Example: x² + 7x + 12
Need: m × n = 12 and m + n = 7
Factors of 12: 1×12, 2×6, 3×4
3 + 4 = 7 ✓
So x² + 7x + 12 = (x + 3)(x + 4)

Factorising when a ≠ 1 (Non-Monic):
2x² + 7x + 3
Product: 2 × 3 = 6
Sum: 7
Factors: 1 and 6 (1 × 6 = 6, 1 + 6 = 7)
Rewrite: 2x² + x + 6x + 3
Group: x(2x + 1) + 3(2x + 1)
Factor: (x + 3)(2x + 1)

Special Cases:
Difference of squares: x² - 16 = (x + 4)(x - 4)
Perfect square: x² + 6x + 9 = (x + 3)²

Always check by expanding your answer!`,
    keyPoints: [
      "Find two numbers that multiply to c and add to b",
      "For non-monic: use the product-sum method",
      "x² - a² = (x + a)(x - a)",
      "Always check by expanding"
    ]
  },
  13: {
    title: "Representing Quadratic Functions",
    content: `Quadratic functions create parabolas when graphed. Understanding different forms helps us identify key features.

Three Forms of Quadratics:
1. Standard form: y = ax² + bx + c
   - a determines if parabola opens up (a > 0) or down (a < 0)
   - c is the y-intercept

2. Factorised form: y = a(x - p)(x - q)
   - p and q are the x-intercepts (roots)
   - Axis of symmetry: x = (p + q)/2

3. Vertex form: y = a(x - h)² + k
   - (h, k) is the vertex (turning point)
   - Axis of symmetry: x = h

Finding the Vertex:
From standard form y = ax² + bx + c:
x-coordinate: x = -b/(2a)
y-coordinate: Substitute x back into equation

Example: y = x² - 6x + 8
x = -(-6)/(2×1) = 3
y = (3)² - 6(3) + 8 = 9 - 18 + 8 = -1
Vertex: (3, -1)

Converting to Vertex Form (Completing the Square):
y = x² - 6x + 8
y = (x² - 6x + 9) - 9 + 8
y = (x - 3)² - 1

Key Features:
- Vertex (turning point)
- Axis of symmetry
- x-intercepts (if they exist)
- y-intercept
- Direction (opens up or down)`,
    keyPoints: [
      "Standard form: y = ax² + bx + c (y-intercept = c)",
      "Factorised form: y = a(x-p)(x-q) (roots at p and q)",
      "Vertex form: y = a(x-h)² + k (vertex at (h,k))",
      "Axis of symmetry: x = -b/(2a)"
    ]
  },
  14: {
    title: "Solving Quadratic Equations",
    content: `A quadratic equation is when a quadratic expression equals zero. There are several methods to find the solutions (roots).

Method 1: Factorising
If x² - 5x + 6 = 0
Factorise: (x - 2)(x - 3) = 0
If product = 0, one factor must be 0:
x - 2 = 0 or x - 3 = 0
x = 2 or x = 3

Method 2: Quadratic Formula
For ax² + bx + c = 0:
x = (-b ± √(b² - 4ac)) / (2a)

The Discriminant (Δ = b² - 4ac):
- Δ > 0: Two distinct real solutions
- Δ = 0: One repeated solution
- Δ < 0: No real solutions

Example: 2x² + 5x - 3 = 0
a = 2, b = 5, c = -3
Δ = 25 - 4(2)(-3) = 25 + 24 = 49
x = (-5 ± 7)/4
x = 2/4 = 0.5 or x = -12/4 = -3

Method 3: Graphically
The solutions are where the parabola crosses the x-axis.

Real-Life Applications:
Projectile motion: height = -4.9t² + v₀t + h₀
Optimisation problems (finding maximum/minimum)
Area problems`,
    keyPoints: [
      "Factorise and set each bracket to zero",
      "Quadratic formula: x = (-b ± √(b²-4ac))/2a",
      "Discriminant tells number of solutions",
      "Solutions are x-intercepts of the parabola"
    ]
  },
  15: {
    title: "Sequences",
    content: `A sequence is an ordered list of numbers following a pattern. Understanding sequences helps model many real-world situations.

Key Terms:
- Term: Each number in the sequence
- First term (a₁ or a): The starting value
- Common difference (d): Amount added each time (arithmetic)
- Common ratio (r): Amount multiplied each time (geometric)

Arithmetic Sequences:
Each term is found by adding a constant.
2, 5, 8, 11, 14, ... (d = 3)

Explicit formula: aₙ = a₁ + (n-1)d
Recursive formula: aₙ = aₙ₋₁ + d

Example: First term 3, common difference 4
aₙ = 3 + (n-1)×4 = 3 + 4n - 4 = 4n - 1

Geometric Sequences:
Each term is found by multiplying by a constant.
2, 6, 18, 54, ... (r = 3)

Explicit formula: aₙ = a₁ × r^(n-1)
Recursive formula: aₙ = aₙ₋₁ × r

Finding the Pattern:
1. Calculate differences between consecutive terms
2. If differences are constant → arithmetic
3. If differences are not constant, check ratios
4. If ratios are constant → geometric

Real-Life Examples:
- Simple interest (arithmetic)
- Compound interest (geometric)
- Population growth (geometric)`,
    keyPoints: [
      "Arithmetic: add constant (aₙ = a₁ + (n-1)d)",
      "Geometric: multiply constant (aₙ = a₁ × r^(n-1))",
      "Constant differences → arithmetic sequence",
      "Constant ratios → geometric sequence"
    ]
  },
  16: {
    title: "Rearranging Formulas and Proportion",
    content: `Being able to rearrange formulas and understand proportional relationships are essential skills for applying mathematics to real situations.

Changing the Subject of a Formula:
Use inverse operations to isolate the desired variable.

Example: Make r the subject of A = πr²
A/π = r²
r = √(A/π)

Example: Make t the subject of v = u + at
v - u = at
t = (v - u)/a

Tips:
- Do the same operation to both sides
- Work from the outside in
- Clear fractions by multiplying by denominators

Direct Proportion:
When one quantity increases, the other increases by the same factor.
y ∝ x means y = kx (k is the constant of proportionality)

If y = 12 when x = 4, find k:
12 = k × 4, so k = 3
The equation is y = 3x

Inverse Proportion:
When one quantity increases, the other decreases by the same factor.
y ∝ 1/x means y = k/x

If y = 6 when x = 2, find k:
6 = k/2, so k = 12
The equation is y = 12/x

Graphs:
Direct proportion: straight line through origin
Inverse proportion: hyperbola`,
    keyPoints: [
      "Use inverse operations to change the subject",
      "Direct: y = kx (straight line through origin)",
      "Inverse: y = k/x (hyperbola)",
      "Find k by substituting known values"
    ]
  },
  17: {
    title: "Semester Review and Exam Preparation",
    content: `This week focuses on reviewing all topics covered this semester in preparation for the end-of-semester examination.

Term 1 Topics:
- Problem solving (Polya's steps)
- Real number system
- Laws of exponents
- Units and measurements
- Surds and radicals
- Absolute value
- Patterns and generalisations
- Coordinate geometry (distance, midpoint, gradient)
- Linear equations and systems

Term 2 Topics:
- Algebra: simplifying, expanding, factorising
- Relations and functions
- Quadratic expressions
- Quadratic functions (standard, factorised, vertex form)
- Solving quadratic equations
- Sequences (arithmetic and geometric)
- Rearranging formulas
- Direct and inverse proportion

Exam Tips:
1. Read each question carefully
2. Show all working for partial marks
3. Check units are consistent
4. Draw diagrams when helpful
5. Use the discriminant to check number of solutions
6. Check answers by substituting back
7. Manage your time - attempt all questions

Key Formulas to Remember:
- Distance: d = √[(x₂-x₁)² + (y₂-y₁)²]
- Midpoint: M = ((x₁+x₂)/2, (y₁+y₂)/2)
- Quadratic formula: x = (-b ± √(b²-4ac))/2a
- Arithmetic sequence: aₙ = a₁ + (n-1)d
- Geometric sequence: aₙ = a₁ × r^(n-1)`,
    keyPoints: [
      "Review all topics from both terms",
      "Practice past exam questions",
      "Show working for partial marks",
      "Check answers are reasonable"
    ]
  }
};

// Science reading by week
// Term 1 (Weeks 1-9): Chemistry - Atomic structure, isotopes, radioactivity, chemical reactions
// Term 2 (Weeks 10-17): Biology - Homeostasis, endocrine system, diseases, immune system
const scienceReadingByWeek: Record<number, ReadingContent> = {
  1: {
    title: "The Structure of the Atom",
    content: `Understanding atomic structure is fundamental to chemistry. Our model of the atom has evolved over centuries as scientists discovered new evidence.

History of Atomic Theory:
- Democritus (400 BC): First proposed matter was made of indivisible "atoms"
- Dalton (1803): Atoms are solid spheres; each element has unique atoms
- Thomson (1897): Discovered electrons; "plum pudding" model
- Rutherford (1911): Discovered the nucleus; mostly empty space
- Bohr (1913): Electrons orbit in fixed energy levels
- Modern model: Electron cloud/probability model

Parts of an Atom:
- Protons: Positive charge (+1), in nucleus, mass ≈ 1 amu
- Neutrons: No charge (0), in nucleus, mass ≈ 1 amu
- Electrons: Negative charge (-1), orbit nucleus, negligible mass

Key Numbers:
- Atomic number (Z): Number of protons - defines the element
- Mass number (A): Protons + neutrons
- Number of electrons = protons (in neutral atom)

The Periodic Table:
Elements are arranged by increasing atomic number.
- Rows (periods): Same number of electron shells
- Columns (groups): Same number of outer electrons
- Properties repeat periodically (hence the name)

Electron Configuration:
Electrons fill shells from the nucleus outward.
Shell 1: Maximum 2 electrons
Shell 2: Maximum 8 electrons
Shell 3: Maximum 8 electrons (for first 20 elements)`,
    keyPoints: [
      "Atomic number = protons, defines the element",
      "Mass number = protons + neutrons",
      "Electrons fill shells: 2, 8, 8...",
      "Periodic table organised by atomic number"
    ]
  },
  2: {
    title: "Isotopes and Radioactive Decay",
    content: `Isotopes are atoms of the same element with different numbers of neutrons. Some isotopes are unstable and undergo radioactive decay.

Isotopes:
- Same number of protons (same element)
- Different number of neutrons (different mass)
- Similar chemical properties
- Different physical properties

Notation:
Carbon-12: ¹²C (6 protons, 6 neutrons)
Carbon-14: ¹⁴C (6 protons, 8 neutrons)
Both are carbon, but C-14 is radioactive.

Radioactive Decay:
Unstable nuclei release energy and particles to become more stable.

Types of Radiation:
1. Alpha (α) particles:
   - 2 protons + 2 neutrons (helium nucleus)
   - Stopped by paper
   - Most ionising, least penetrating

2. Beta (β) particles:
   - High-energy electron
   - Stopped by aluminium
   - Medium ionising and penetrating

3. Gamma (γ) rays:
   - High-energy electromagnetic radiation
   - Reduced by lead/concrete
   - Least ionising, most penetrating

Nuclear Equations:
Mass number and atomic number must balance.
²³⁸U → ²³⁴Th + ⁴He (alpha decay)
¹⁴C → ¹⁴N + e⁻ (beta decay)`,
    keyPoints: [
      "Isotopes: same protons, different neutrons",
      "Alpha: stopped by paper, most ionising",
      "Beta: stopped by aluminium",
      "Gamma: reduced by lead, most penetrating"
    ]
  },
  3: {
    title: "Half-Life and Uses of Radioisotopes",
    content: `Half-life is a measure of how quickly a radioactive isotope decays. Radioisotopes have many important applications.

What is Half-Life?
Half-life (t½) is the time taken for half of the radioactive nuclei in a sample to decay.

Example:
If you start with 100g and the half-life is 10 years:
After 10 years: 50g remains
After 20 years: 25g remains
After 30 years: 12.5g remains

Calculating Remaining Amount:
Amount remaining = Initial amount × (1/2)^n
where n = number of half-lives elapsed

Different isotopes have very different half-lives:
- Polonium-214: 0.00016 seconds
- Carbon-14: 5,730 years
- Uranium-238: 4.5 billion years

Applications of Radioisotopes:

Medical Uses:
- Diagnosis: Tracers show organ function (technetium-99m)
- Treatment: Radiation kills cancer cells (cobalt-60, iodine-131)
- Sterilisation: Medical equipment

Dating:
- Carbon-14 dating: For organic materials up to 50,000 years
- Uranium-lead dating: For rocks billions of years old

Industrial Uses:
- Smoke detectors (americium-241)
- Thickness gauges in manufacturing
- Detecting leaks in pipes`,
    keyPoints: [
      "Half-life: time for half the sample to decay",
      "Amount remaining = Initial × (1/2)^n",
      "Carbon-14 used to date organic materials",
      "Medical uses: tracers, cancer treatment"
    ]
  },
  4: {
    title: "Atomic Model Project Week",
    content: `This week focuses on consolidating understanding of atomic structure through the Atomic Model Project assessment.

Review: Atomic Structure
The atom consists of:
- Nucleus: Contains protons (+) and neutrons (neutral)
- Electron cloud: Electrons (-) orbit the nucleus

Each element is defined by its number of protons (atomic number).

Evolution of Atomic Models:
Scientists refined the atomic model as new evidence emerged:
1. Dalton's solid sphere → simple but incomplete
2. Thomson's plum pudding → discovered electrons
3. Rutherford's nuclear model → gold foil experiment
4. Bohr's planetary model → fixed electron orbits
5. Quantum model → electron probability clouds

Key Evidence:
- Cathode ray experiments → electrons exist
- Gold foil experiment → most of atom is empty space
- Line spectra → electrons have specific energy levels

Connecting Structure to Properties:
- Electron configuration determines chemical behaviour
- Group number relates to number of outer electrons
- Atoms react to achieve stable outer shells (8 electrons)

For Your Project:
Consider how the atomic model:
- Explains the organisation of the periodic table
- Predicts chemical properties of elements
- Has evolved based on experimental evidence`,
    keyPoints: [
      "Atomic models evolved with new evidence",
      "Protons define the element",
      "Outer electrons determine chemical properties",
      "Scientific models are refined as evidence emerges"
    ]
  },
  5: {
    title: "Introduction to Chemical Reactions",
    content: `A chemical reaction occurs when substances (reactants) are transformed into new substances (products) with different properties.

Signs of a Chemical Reaction:
- Colour change
- Gas bubbles produced
- Temperature change (heat released or absorbed)
- Precipitate forms (solid from liquids)
- Light or sound produced
- Difficult to reverse

Physical vs Chemical Change:
Physical change: No new substances formed (e.g., melting ice)
Chemical change: New substances with different properties formed

Law of Conservation of Mass:
In a chemical reaction, the total mass of reactants equals the total mass of products. Atoms are rearranged, not created or destroyed.

Writing Chemical Equations:
Word equation: Hydrogen + Oxygen → Water
Symbol equation: 2H₂ + O₂ → 2H₂O

Balancing Equations:
The same number of each type of atom must appear on both sides.

Steps to Balance:
1. Write the unbalanced equation with correct formulas
2. Count atoms of each element on both sides
3. Add coefficients (numbers in front) to balance
4. Check all atoms are balanced
5. Reduce coefficients to smallest whole numbers

Never change the subscripts in formulas - only add coefficients!`,
    keyPoints: [
      "Chemical reactions form new substances",
      "Conservation of mass: atoms rearranged, not created",
      "Same atoms on both sides of equation",
      "Balance by adding coefficients, not changing formulas"
    ]
  },
  6: {
    title: "Types of Chemical Reactions",
    content: `Chemical reactions can be classified into several types based on how atoms are rearranged.

Synthesis (Combination):
Two or more substances combine to form one product.
A + B → AB
Example: 2Na + Cl₂ → 2NaCl

Decomposition:
One compound breaks down into simpler substances.
AB → A + B
Example: 2H₂O → 2H₂ + O₂

Single Replacement (Displacement):
One element replaces another in a compound.
A + BC → AC + B
Example: Zn + CuSO₄ → ZnSO₄ + Cu

Double Replacement:
Two compounds exchange ions.
AB + CD → AD + CB
Example: NaCl + AgNO₃ → NaNO₃ + AgCl

Combustion:
A substance reacts rapidly with oxygen, releasing heat and light.
Fuel + O₂ → CO₂ + H₂O
Example: CH₄ + 2O₂ → CO₂ + 2H₂O

Neutralisation:
Acid + Base → Salt + Water
Example: HCl + NaOH → NaCl + H₂O

Energy Changes:
Exothermic: Releases energy (combustion, neutralisation)
Endothermic: Absorbs energy (photosynthesis, decomposition)`,
    keyPoints: [
      "Synthesis: A + B → AB",
      "Decomposition: AB → A + B",
      "Combustion: Fuel + O₂ → CO₂ + H₂O",
      "Neutralisation: Acid + Base → Salt + Water"
    ]
  },
  7: {
    title: "Electrolysis and Extraction of Metals",
    content: `Electrolysis uses electricity to break down compounds and can be used to extract metals from their ores.

What is Electrolysis?
Electrolysis is the process of using electric current to decompose an ionic compound in solution or when molten.

Components:
- Electrolyte: The liquid that conducts electricity (molten ionic compound or solution)
- Electrodes: Conductors where reactions occur
  - Anode: Positive electrode (oxidation occurs)
  - Cathode: Negative electrode (reduction occurs)

Electrolysis of Water:
2H₂O → 2H₂ + O₂
- Hydrogen forms at cathode (negative)
- Oxygen forms at anode (positive)
- Volume of H₂ is twice that of O₂

Extraction of Metals:
Very reactive metals (like aluminium) cannot be extracted by carbon reduction. They must be extracted by electrolysis.

Aluminium Extraction (Hall-Héroult Process):
- Aluminium oxide dissolved in molten cryolite
- At cathode: Al³⁺ + 3e⁻ → Al
- At anode: Oxygen formed (reacts with carbon anode)

Activity Series:
Metals can be ranked by reactivity:
K, Na, Ca, Mg, Al, Zn, Fe, Pb, Cu, Ag, Au
More reactive metals require more energy to extract.`,
    keyPoints: [
      "Electrolysis uses electricity to break down compounds",
      "Cathode: negative electrode, reduction (gain electrons)",
      "Anode: positive electrode, oxidation (lose electrons)",
      "Very reactive metals extracted by electrolysis"
    ]
  },
  8: {
    title: "Green Chemistry and Environmental Impact",
    content: `Green chemistry focuses on designing chemical products and processes that reduce or eliminate hazardous substances and environmental impact.

Principles of Green Chemistry:
1. Prevention: Prevent waste rather than clean it up
2. Atom economy: Maximise atoms from reactants in products
3. Less hazardous synthesis: Use and generate safer substances
4. Safer solvents: Avoid toxic solvents where possible
5. Energy efficiency: Minimise energy requirements
6. Renewable feedstocks: Use renewable raw materials
7. Reduce derivatives: Avoid unnecessary steps
8. Catalysis: Use catalysts rather than stoichiometric reagents
9. Design for degradation: Products should break down safely
10. Pollution prevention: Monitor and prevent releases

Environmental Issues from Chemistry:
- Acid rain: From SO₂ and NOₓ emissions
- Ozone depletion: From CFCs
- Climate change: From CO₂ and other greenhouse gases
- Water pollution: From industrial waste
- Plastic pollution: From non-biodegradable materials

Sustainable Solutions:
- Biodegradable plastics
- Alternative energy sources
- Water treatment technologies
- Recycling and circular economy
- Electric vehicles and hydrogen fuel cells

As scientists, we have responsibility to consider the environmental impact of chemical processes and develop sustainable alternatives.`,
    keyPoints: [
      "Green chemistry aims to reduce environmental impact",
      "Prevent waste rather than clean up",
      "Use renewable resources where possible",
      "Design products to break down safely"
    ]
  },
  9: {
    title: "Chemistry Review and Revision",
    content: `This week consolidates all Chemistry topics covered in Term 1 in preparation for assessment.

Atomic Structure:
- Atoms contain protons, neutrons, and electrons
- Atomic number = protons, mass number = protons + neutrons
- Isotopes have same protons, different neutrons
- Electron configuration determines chemical properties

Radioactivity:
- Unstable isotopes decay, emitting radiation
- Alpha (stopped by paper), Beta (stopped by aluminium), Gamma (reduced by lead)
- Half-life: time for half the sample to decay
- Applications: dating, medicine, industry

Chemical Reactions:
- Conservation of mass: atoms rearranged, not created
- Balance equations using coefficients
- Types: synthesis, decomposition, displacement, combustion, neutralisation
- Energy changes: exothermic (releases) vs endothermic (absorbs)

Electrolysis:
- Uses electricity to decompose compounds
- Cathode (negative): reduction, metal deposited
- Anode (positive): oxidation, non-metal released
- Used to extract reactive metals

Key Skills:
- Balancing equations
- Calculating half-life problems
- Identifying reaction types
- Writing nuclear equations

Review these topics and practice problems to prepare for Term 2.`,
    keyPoints: [
      "Know atomic structure and isotopes",
      "Understand radioactive decay and half-life",
      "Balance chemical equations correctly",
      "Identify reaction types and energy changes"
    ]
  },
  10: {
    title: "The Endocrine System",
    content: `Term 2 focuses on Biology. The endocrine system controls body functions through hormones, producing long-lasting effects compared to the nervous system.

Endocrine vs Nervous System:
Nervous system: Fast, short-lived, electrical signals
Endocrine system: Slower, long-lasting, chemical signals (hormones)

Hormones:
Chemical messengers produced by endocrine glands, transported in blood to target organs.

Major Endocrine Glands:
- Pituitary gland: "Master gland" - controls other glands
- Thyroid: Metabolism (thyroxine)
- Adrenal glands: Stress response (adrenaline, cortisol)
- Pancreas: Blood sugar (insulin, glucagon)
- Ovaries/Testes: Reproduction (oestrogen, testosterone)

Fight, Flight, or Freeze Response:
When you perceive danger:
1. Hypothalamus signals adrenal glands
2. Adrenaline and noradrenaline released
3. Effects: increased heart rate, blood to muscles, pupils dilate, digestion stops
4. Body prepared for immediate action

This response evolved to help us survive threats but can be triggered by modern stressors like exams or public speaking.

Hormones work more slowly than nerve impulses but their effects last longer - from minutes to months.`,
    keyPoints: [
      "Hormones are chemical messengers in blood",
      "Pituitary is the 'master gland'",
      "Adrenaline triggers fight/flight response",
      "Hormones act slower but last longer than nerves"
    ]
  },
  11: {
    title: "Homeostasis and Regulation",
    content: `Homeostasis is the maintenance of a stable internal environment despite changing external conditions. It's essential for cells to function properly.

Why Homeostasis Matters:
Cells work best within narrow ranges of temperature, pH, glucose, water, etc. Too much variation can damage or kill cells.

What is Regulated?
- Body temperature (~37°C)
- Blood glucose levels
- Water and salt balance
- Blood pH
- Oxygen and carbon dioxide levels

Negative Feedback Loops:
The main mechanism for homeostasis. When a variable moves away from the set point, mechanisms bring it back.

Example: Blood Glucose Regulation
1. Blood glucose rises (after eating)
2. Pancreas detects increase
3. Pancreas releases insulin
4. Cells take up glucose; liver stores glucose as glycogen
5. Blood glucose returns to normal

If blood glucose falls too low:
1. Pancreas detects decrease
2. Pancreas releases glucagon
3. Liver converts glycogen to glucose
4. Blood glucose rises to normal

Temperature Regulation:
Too hot: Sweating, vasodilation, less activity
Too cold: Shivering, vasoconstriction, increased metabolism

The brain (hypothalamus) acts as the control centre for many homeostatic processes.`,
    keyPoints: [
      "Homeostasis maintains stable internal conditions",
      "Negative feedback returns variables to set point",
      "Insulin lowers blood glucose, glucagon raises it",
      "Hypothalamus is the control centre"
    ]
  },
  12: {
    title: "Disruptions to Homeostasis",
    content: `When homeostatic mechanisms fail, disease can result. Understanding these disruptions helps us appreciate the importance of regulation.

Type 1 Diabetes:
- Autoimmune disease - immune system destroys insulin-producing cells
- Body cannot produce insulin
- Blood glucose remains high
- Treatment: Insulin injections

Type 2 Diabetes:
- Cells become resistant to insulin
- Often linked to lifestyle factors
- Treatment: Diet, exercise, medication

Hyperthyroidism (Overactive Thyroid):
- Too much thyroxine produced
- Symptoms: Weight loss, rapid heartbeat, anxiety
- Body's metabolism too fast

Hypothyroidism (Underactive Thyroid):
- Too little thyroxine produced
- Symptoms: Weight gain, fatigue, feeling cold
- Body's metabolism too slow

Performance-Enhancing Hormones:
Athletes sometimes misuse hormones to gain advantage:
- EPO (Erythropoietin): Increases red blood cells
- Testosterone/Anabolic steroids: Increase muscle mass
- Human Growth Hormone: Increases muscle and reduces fat

Ethical Issues:
- Health risks to athletes
- Unfair advantage
- Against the spirit of sport
- Pressure on others to use them

These substances are banned in competitive sports.`,
    keyPoints: [
      "Type 1 diabetes: can't produce insulin (autoimmune)",
      "Type 2 diabetes: cells resist insulin (lifestyle-related)",
      "Thyroid disorders affect metabolism",
      "Performance-enhancing hormones are banned and risky"
    ]
  },
  13: {
    title: "Homeostasis Project Week",
    content: `This week focuses on the Homeostasis Project assessment. Apply your understanding of how the body maintains stable internal conditions.

Key Concepts to Include:

What is Homeostasis?
- Definition: Maintenance of stable internal environment
- Importance: Cells function best in specific conditions
- Examples: Temperature, glucose, water, pH

Feedback Mechanisms:
- Negative feedback: Returns variable to set point
- Components: Stimulus → Receptor → Control centre → Effector → Response
- Example: Blood glucose regulation with insulin and glucagon

Case Study Ideas:
1. Temperature regulation during exercise
2. Blood glucose control in diabetes
3. Water balance during dehydration
4. Hormone regulation in stress response

Data Interpretation:
- Analyse graphs showing homeostatic responses
- Identify normal ranges and fluctuations
- Explain what happens when systems fail

Connections to Real Life:
- Medical treatments that support homeostasis
- How diet and exercise affect regulation
- Environmental factors that challenge homeostasis

Your project should demonstrate understanding of:
- The concept of homeostasis
- Specific examples with biological detail
- What happens when regulation fails
- Application to real-world scenarios`,
    keyPoints: [
      "Define and explain homeostasis clearly",
      "Include specific examples with detail",
      "Explain the role of negative feedback",
      "Connect to real-world applications"
    ]
  },
  14: {
    title: "Infectious and Non-Infectious Diseases",
    content: `Diseases can be classified based on whether they can spread from person to person.

Infectious Diseases:
Caused by pathogens and can spread between organisms.
- Bacteria: Tuberculosis, cholera, food poisoning
- Viruses: COVID-19, influenza, measles
- Fungi: Athlete's foot, thrush
- Parasites: Malaria, tapeworm

Transmission Methods:
- Direct contact: Touching infected person
- Droplet: Coughing, sneezing
- Airborne: Fine particles in air
- Vector: Carried by organisms (mosquitoes)
- Contaminated food/water
- Body fluids: Blood, sexual contact

Non-Infectious Diseases:
Cannot spread between people.
Caused by:
- Genetics: Cystic fibrosis, sickle cell
- Lifestyle: Type 2 diabetes, heart disease
- Environment: Some cancers, asthma
- Nutritional deficiency: Scurvy, rickets
- Immune malfunction: Allergies, autoimmune

Risk Factors:
Factors that increase chance of disease:
- Modifiable: Diet, exercise, smoking
- Non-modifiable: Age, genetics, sex

Prevention:
Infectious: Vaccination, hygiene, quarantine
Non-infectious: Healthy lifestyle, screening, avoiding risk factors`,
    keyPoints: [
      "Infectious diseases spread via pathogens",
      "Non-infectious diseases don't spread between people",
      "Pathogens: bacteria, viruses, fungi, parasites",
      "Risk factors can be modifiable or non-modifiable"
    ]
  },
  15: {
    title: "Germ Theory and Pathogens",
    content: `Germ theory states that many diseases are caused by microorganisms (germs/pathogens) invading the body.

History of Germ Theory:
Before germ theory, people believed diseases came from "bad air" (miasma) or imbalanced humours.

Key Scientists:
- Louis Pasteur: Proved microorganisms cause disease
- Robert Koch: Developed Koch's postulates to identify disease-causing organisms
- Joseph Lister: Introduced antiseptic surgery

Koch's Postulates:
1. The microorganism must be found in all cases of the disease
2. It must be isolated and grown in pure culture
3. It must cause the disease when introduced to a healthy host
4. It must be re-isolated from the new host

Types of Pathogens:

Bacteria:
- Single-celled organisms
- Can reproduce rapidly
- Some produce toxins
- Treated with antibiotics

Viruses:
- Not living (can't reproduce alone)
- Invade cells and use them to replicate
- Antibiotics don't work against viruses
- Treated with antivirals or prevented by vaccines

Fungi:
- Can be single-celled (yeast) or multicellular
- Often affect skin, nails, respiratory system
- Treated with antifungals

Parasites:
- Live on or in a host organism
- Take nutrients from host
- Include protozoa, worms, insects`,
    keyPoints: [
      "Germ theory: microorganisms cause disease",
      "Koch's postulates identify disease-causing organisms",
      "Antibiotics only work on bacteria, not viruses",
      "Different treatments for different pathogen types"
    ]
  },
  16: {
    title: "Disease Transmission and the Immune System",
    content: `Understanding how diseases spread helps us prevent infection. The immune system protects us from pathogens.

How Diseases Spread:
1. Contact transmission: Direct (touching) or indirect (surfaces)
2. Droplet: Large particles from coughs/sneezes
3. Airborne: Small particles stay suspended in air
4. Vector-borne: Carried by animals (mosquitoes, ticks)
5. Vehicle: Contaminated food, water, blood

Breaking the Chain of Infection:
- Hand hygiene
- Masks and barriers
- Vaccination
- Safe food handling
- Vector control
- Isolation of infected individuals

The Immune System:
Three lines of defence protect us from pathogens.

First Line (Physical/Chemical Barriers):
- Skin: Physical barrier
- Mucus: Traps pathogens
- Stomach acid: Kills microbes
- Tears and saliva: Contain enzymes

Second Line (Innate Immune Response):
- Inflammation: Increases blood flow
- Phagocytes: Engulf and destroy pathogens
- Fever: High temperature kills some pathogens
- Natural killer cells: Destroy infected cells

Third Line (Adaptive Immune Response):
- B lymphocytes: Produce antibodies
- T lymphocytes: Destroy infected cells
- Specific to each pathogen
- Creates immunological memory`,
    keyPoints: [
      "Break chain of infection to prevent spread",
      "First line: physical barriers (skin, mucus)",
      "Second line: inflammation, phagocytes",
      "Third line: specific antibodies and memory"
    ]
  },
  17: {
    title: "Immunity, Vaccination, and Science Review",
    content: `Vaccination harnesses the immune system's memory to provide protection against future infections.

How Vaccines Work:
1. Vaccine contains weakened, dead, or parts of pathogen
2. Immune system recognises foreign antigens
3. B cells produce antibodies
4. Memory cells are created
5. If exposed to real pathogen, response is rapid

Types of Vaccines:
- Live attenuated: Weakened pathogen (MMR, chickenpox)
- Inactivated: Killed pathogen (flu, polio)
- Subunit: Parts of pathogen (hepatitis B)
- mRNA: Instructions to make viral protein (COVID-19)

Herd Immunity:
When enough people are vaccinated, disease can't spread easily, protecting those who can't be vaccinated.

When the Immune System Goes Wrong:
- Allergies: Overreaction to harmless substances
- Autoimmune diseases: Immune system attacks own cells
- Immunodeficiency: Weak immune response (HIV/AIDS)

Semester Review:
Term 1 Chemistry: Atomic structure, isotopes, radioactivity, chemical reactions, electrolysis
Term 2 Biology: Endocrine system, homeostasis, diseases, immune system

Key Skills:
- Explain how body systems maintain homeostasis
- Describe how pathogens cause disease
- Explain how the immune system responds
- Evaluate the importance of vaccination`,
    keyPoints: [
      "Vaccines train immune system using safe antigens",
      "Memory cells enable rapid secondary response",
      "Herd immunity protects the whole community",
      "Review both Chemistry and Biology for exam"
    ]
  }
};

// History/Humanities reading by week
// Term 1 (Weeks 1-9): History - Australians at War (WWI, WWII)
// Term 2 (Weeks 10-17): Politics/Civics - Australian democracy, Constitution, citizenship
const historyReadingByWeek: Record<number, ReadingContent> = {
  1: {
    title: "The World Goes to War: Setting the Stage for WWI",
    content: `World War I (1914-1918) was one of the deadliest conflicts in human history. Understanding its causes helps us see how a single event could trigger a global catastrophe.

Global Causes of WWI (MAIN):

Militarism:
Countries built up armies and navies. An arms race between Britain and Germany increased tensions. Military leaders gained political influence.

Alliances:
Europe was divided into two armed camps:
- Triple Alliance: Germany, Austria-Hungary, Italy
- Triple Entente: France, Russia, Britain
An attack on one would bring allies into war.

Imperialism:
European powers competed for colonies in Africa and Asia, creating rivalries and tensions.

Nationalism:
Intense pride in one's nation led countries to believe they were superior. Ethnic groups in empires (especially Austria-Hungary) wanted independence.

The Spark:
On June 28, 1914, Archduke Franz Ferdinand of Austria-Hungary was assassinated in Sarajevo by a Serbian nationalist.

Chain of Events:
Austria-Hungary → Serbia → Russia → Germany → France → Britain

Why Australia Went to War:
- Loyalty to Britain ("when Britain is at war, Australia is at war")
- Defence concerns about German presence in Pacific
- Sense of adventure and duty
- Belief it would be a short war`,
    keyPoints: [
      "MAIN: Militarism, Alliances, Imperialism, Nationalism",
      "Assassination of Franz Ferdinand triggered the war",
      "Alliance system caused rapid escalation",
      "Australia entered due to ties with Britain"
    ]
  },
  2: {
    title: "Gallipoli and the Birth of National Identity",
    content: `The Gallipoli campaign became a defining moment in Australian history, shaping the ANZAC legend and national identity.

The Gallipoli Campaign (1915):
The Allies aimed to capture the Dardanelles Strait and knock the Ottoman Empire out of the war. The campaign was poorly planned and faced determined Turkish resistance.

April 25, 1915:
Australian and New Zealand Army Corps (ANZAC) landed at what became known as Anzac Cove. Instead of the expected low beaches, they faced steep cliffs and well-defended positions.

The Campaign:
- Soldiers became trapped on narrow beaches
- Brutal conditions: heat, flies, disease, limited water
- Neither side could break the deadlock
- Fighting continued for eight months

The Evacuation (December 1915 - January 1916):
The most successful part of the campaign. Troops were evacuated secretly with minimal casualties.

The Cost:
- 8,000+ Australian soldiers killed
- 2,700+ New Zealand soldiers killed
- 21,000+ British soldiers killed
- ~86,000 Turkish casualties

The ANZAC Legend:
From this defeat emerged powerful national symbols:
- Courage under fire
- Mateship and looking after your mates
- Endurance in harsh conditions
- Larrikin spirit and irreverence for authority

Different Perspectives:
Consider experiences of: soldiers, nurses, families at home, Turkish defenders. Each group experienced Gallipoli differently.`,
    keyPoints: [
      "ANZAC landed April 25, 1915 (now ANZAC Day)",
      "Eight-month campaign ending in evacuation",
      "8,000+ Australian soldiers died",
      "ANZAC legend: courage, mateship, endurance"
    ]
  },
  3: {
    title: "The Western Front and the Changing Nature of War",
    content: `After Gallipoli, Australian forces joined the Western Front in France and Belgium, where they experienced the horrors of modern industrial warfare.

Key Battles Involving Australians:

Battle of Fromelles (July 1916):
- First major Australian battle on Western Front
- Disastrous attack with 5,500 casualties in one night
- Bodies not recovered for decades

Battle of the Somme (1916):
- Massive offensive lasting months
- Australians involved in battles at Pozières
- Over 1 million casualties total

Battle of Passchendaele (1917):
- Fought in horrific mud
- Soldiers drowned in shell holes
- Little territorial gain for massive losses

Trench Warfare:
- Front lines, support trenches, communication trenches
- No Man's Land between opposing forces
- Soldiers lived with mud, rats, disease
- Constant shelling created psychological trauma

New Technologies:
- Machine guns: Made frontal attacks suicidal
- Artillery: Caused most casualties
- Poison gas: Chemical warfare introduced
- Tanks: First used 1916, broke stalemate
- Aircraft: Reconnaissance and fighting

Impact on Soldiers:
- Physical: Wounds, gas damage, disease
- Psychological: Shell shock (now PTSD)
- Loss of innocence about glory of war`,
    keyPoints: [
      "Western Front: years of trench warfare stalemate",
      "Fromelles, Pozières, Passchendaele - major Australian battles",
      "New technology made war more deadly",
      "Physical and psychological trauma affected soldiers"
    ]
  },
  4: {
    title: "The Interwar Period: From Hope to Tension",
    content: `The period between WWI and WWII saw attempts at peace but also growing instability that would lead to another global conflict.

Treaty of Versailles (1919):
The peace treaty that ended WWI:
- War Guilt Clause: Germany accepted blame
- Reparations: Germany paid massive compensation
- Territory: Germany lost land and colonies
- Military: German army limited to 100,000
- League of Nations: New international organisation

Problems with the Treaty:
- Germany felt humiliated ("diktat" - dictated peace)
- Reparations crippled German economy
- National borders didn't match ethnic populations
- USA didn't join the League of Nations

The Great Depression (1929-1939):
- Stock market crash triggered global economic collapse
- Unemployment reached 25% in many countries
- Poverty, hunger, social unrest
- People lost faith in democratic governments

Rise of Fascism:
In times of crisis, people turned to strong leaders promising order:
- Italy: Mussolini (1922)
- Germany: Hitler (1933)
- Japan: Military government

These regimes:
- Rejected democracy
- Promoted aggressive nationalism
- Built up military power
- Sought territorial expansion

League of Nations Failures:
- No army to enforce decisions
- Major powers ignored it
- Failed to stop Japanese invasion of Manchuria (1931)
- Failed to stop Italian invasion of Ethiopia (1935)`,
    keyPoints: [
      "Treaty of Versailles humiliated Germany",
      "Great Depression caused global economic collapse",
      "Fascism rose in Italy, Germany, Japan",
      "League of Nations couldn't prevent aggression"
    ]
  },
  5: {
    title: "The Outbreak of World War II and Australia's Early Involvement",
    content: `World War II began in 1939, and Australia was quickly drawn into another global conflict.

Causes of WWII:
- Treaty of Versailles created resentment
- Rise of totalitarianism (fascism, Nazism)
- Failure of appeasement (giving in to Hitler's demands)
- Hitler's territorial expansion
- Japanese expansion in Asia

Hitler's Aggression:
1935: Reintroduced conscription (broke treaty)
1936: Remilitarised Rhineland
1938: Anschluss with Austria
1938: Munich Agreement (took Sudetenland)
1939: Invaded Czechoslovakia
1939: Nazi-Soviet Pact
September 1, 1939: Invaded Poland

Australia Enters the War:
Prime Minister Menzies: "Britain is at war; therefore Australia is at war."
Initially, Australian troops went to North Africa and the Middle East.

Key Campaigns:

Fall of Singapore (February 1942):
- Britain's "impregnable fortress" fell in days
- 15,000 Australian soldiers captured
- Shattered belief in British protection
- War came to Australia's doorstep

Siege of Tobruk (1941):
- Australian troops held Libyan port for months
- German propaganda called them "rats of Tobruk"
- Australians adopted name with pride

Kokoda Track (1942):
- Japanese advance toward Port Moresby
- Australian troops fought in brutal jungle conditions
- First time Australians defended their homeland
- Stopped Japanese advance toward Australia`,
    keyPoints: [
      "Hitler's aggression led to war in 1939",
      "Fall of Singapore: 15,000 Australians captured",
      "Kokoda: Australians defended homeland",
      "War came directly to Australia's region"
    ]
  },
  6: {
    title: "The Australian Home Front",
    content: `WWII affected everyone in Australia, not just soldiers. The home front was essential to the war effort.

Government Controls:
- Rationing: Limited quantities of food, petrol, clothing
- Censorship: Government controlled information
- Manpower regulations: Directed where people worked
- Internment: Japanese-Australians and others detained

Women's Roles:
With men away fighting, women filled essential roles:
- Factories producing munitions and equipment
- Land Army - farming
- Armed forces (WAAAF, AWAS, WRANS) - non-combat roles
- Nursing - including in war zones
- Volunteer work

Indigenous Australians:
- Many served despite not being citizens
- Approximately 3,000 enlisted
- Faced discrimination in and out of military
- Service not always recognised
- Some communities used for defence labour

Propaganda:
Government used posters, radio, and film to:
- Encourage enlistment
- Promote war bonds
- Maintain morale
- Encourage productivity
- Promote rationing and conservation

Brisbane Line:
Secret plan to abandon northern Australia if invaded. Controversial and never officially confirmed.

Attack on Australia:
- Darwin bombed February 19, 1942 (more bombs than Pearl Harbor)
- 64 raids on Darwin total
- Sydney Harbour attacked by Japanese midget submarines
- Showed vulnerability of Australia`,
    keyPoints: [
      "Rationing, censorship, and labour controls",
      "Women entered workforce in new roles",
      "Indigenous Australians served despite discrimination",
      "Darwin bombed, Sydney Harbour attacked"
    ]
  },
  7: {
    title: "The Holocaust and Human Rights",
    content: `The Holocaust was the systematic, state-sponsored persecution and murder of six million Jews by the Nazi regime. It stands as one of history's greatest crimes against humanity.

Nazi Ideology:
- Racial hierarchy with "Aryans" at top
- Jews portrayed as enemies of Germany
- Other groups also targeted: Roma, disabled, homosexuals, political opponents

Stages of Persecution:

1933-1938: Discrimination
- Anti-Jewish laws (Nuremberg Laws 1935)
- Jews lost citizenship, jobs, property
- Kristallnacht (1938) - violent attacks on Jewish businesses

1939-1941: Concentration
- Jews forced into ghettos
- Overcrowded, starvation conditions
- Deportations began

1942-1945: Extermination
- "Final Solution" decided at Wannsee Conference
- Death camps: Auschwitz, Treblinka, Sobibor
- Mass murder in gas chambers

Liberation:
- Allies discovered camps as they advanced
- World shocked by evidence of genocide
- Nuremberg Trials held perpetrators accountable

Lessons for Human Rights:
- Universal Declaration of Human Rights (1948)
- Genocide Convention
- "Never Again" - commitment to prevent genocide
- Importance of speaking out against hatred

Australia's Response:
After the war, Australia accepted many Holocaust survivors as refugees, changing immigration policies.`,
    keyPoints: [
      "Six million Jews murdered in systematic genocide",
      "Persecution escalated: discrimination → ghettos → death camps",
      "Holocaust led to human rights declarations",
      "Responsibility to prevent genocide"
    ]
  },
  8: {
    title: "Source Interpretation and Historical Analysis",
    content: `This week focuses on developing skills in analysing historical sources for assessment.

Types of Sources:
Primary Sources: Created at the time
- Letters, diaries, photographs
- Government documents, speeches
- Newspapers, propaganda posters
- Artefacts, uniforms, medals

Secondary Sources: Created later
- Textbooks, documentaries
- Historical analyses
- Museum exhibitions

Analysing Sources - OPCL:
O - Origin:
- Who created it? When? Where?
- What type of source is it?

P - Purpose:
- Why was it created?
- To inform? Persuade? Entertain? Record?
- Who was the intended audience?

C - Content:
- What does it say or show?
- What information does it provide?
- What language or imagery is used?

L - Limitation:
- What biases might exist?
- What information is missing?
- How reliable is this source?
- What perspective is represented?

Evaluating Reliability:
- Consider author's position and motivation
- Cross-reference with other sources
- Look for corroboration
- Be aware of propaganda

Using Evidence in Arguments:
- Make a claim (contention)
- Support with evidence from sources
- Analyse what the evidence shows
- Consider multiple perspectives
- Acknowledge limitations`,
    keyPoints: [
      "OPCL: Origin, Purpose, Content, Limitation",
      "Primary sources: from the time period",
      "Consider bias, perspective, and gaps",
      "Corroborate with multiple sources"
    ]
  },
  9: {
    title: "Legacy, Remembrance, and Reflection",
    content: `The world wars continue to shape Australian identity, international relations, and our approach to remembrance.

The ANZAC Legend:
Emerged from Gallipoli, grew through subsequent wars:
- Courage and sacrifice
- Mateship
- Endurance
- Australian values under pressure

Changing Narratives:
How we remember has evolved:
- Initially: Focus on heroism and sacrifice
- Later: Recognition of horror and trauma
- Now: Inclusion of Indigenous service, women's contributions, diverse experiences

ANZAC Day:
- April 25 commemorates the landing at Gallipoli
- Dawn services echo the early morning landing
- "Lest We Forget" - commitment to remember
- Marches, ceremonies, two-up games

Remembrance Day:
- November 11, 11am - armistice took effect
- One minute's silence
- Red poppies worn

Commemorative Sites:
- Australian War Memorial, Canberra
- Shrine of Remembrance, Melbourne
- Local war memorials throughout Australia

Continuing Legacy:
The wars shaped:
- Australia's national identity
- International alliances (ANZUS, Five Eyes)
- Immigration policies
- Commitment to human rights
- Regional defence relationships

Questions for Reflection:
- How should we remember war?
- Whose stories are told? Whose are missing?
- What responsibilities come from remembrance?
- How do these events connect to today?`,
    keyPoints: [
      "ANZAC legend: courage, mateship, endurance",
      "Remembrance has evolved to include more perspectives",
      "ANZAC Day (April 25) and Remembrance Day (November 11)",
      "Wars continue to shape Australian identity"
    ]
  },
  10: {
    title: "Australian Democracy and the Constitution",
    content: `Term 2 focuses on Politics and Civics. Understanding Australia's democratic system is essential for active citizenship.

Federation (1901):
Six separate British colonies united to form the Commonwealth of Australia.

Reasons for Federation:
- Defence: Stronger together
- Immigration: Uniform policies
- Trade: Remove interstate tariffs
- National identity

The Australian Constitution:
The set of rules establishing Australia's system of government.
- Divides power between federal and state governments
- Establishes the Parliament, Executive, and Judiciary
- Can only be changed by referendum

Division of Powers:
Federal (Commonwealth) Powers:
- Defence, foreign affairs
- Immigration, customs
- Currency, banking
- Telecommunications

State Powers:
- Education, health
- Police, roads
- Land management

Concurrent (Shared) Powers:
- Taxation
- Environment
- Some social services

Constitutional Monarchy:
- The King is Head of State (represented by Governor-General)
- Prime Minister is Head of Government
- Parliament makes laws
- Courts interpret laws

Referendums:
To change the Constitution:
- Majority of voters nationally must agree
- Majority of voters in majority of states (4/6)
- Only 8 of 44 referendums have passed`,
    keyPoints: [
      "Federation united six colonies in 1901",
      "Constitution divides power between federal and state",
      "Constitutional monarchy with democratic Parliament",
      "Referendums required to change Constitution"
    ]
  },
  11: {
    title: "Parliament and the Legislative Process",
    content: `Understanding how Parliament works helps us see how laws are made and how citizens can influence the process.

Structure of Federal Parliament:
Three parts:
1. The King (represented by Governor-General)
2. Senate (Upper House)
3. House of Representatives (Lower House)

House of Representatives:
- 151 members, one per electorate
- Government formed by party with majority
- Prime Minister leads the government
- Debates and passes bills
- Money bills must start here

Senate:
- 76 senators (12 per state, 2 per territory)
- Reviews bills from the House
- Represents state interests
- Can block or amend legislation
- Minor parties often hold balance of power

How a Bill Becomes Law:
1. Proposal: Drafted by government department
2. First Reading: Introduced to Parliament
3. Second Reading: Debated, voted on in principle
4. Committee Stage: Detailed examination, amendments
5. Third Reading: Final vote
6. Other House: Same process in Senate
7. Royal Assent: Governor-General signs into law

Representation and Legitimacy:
- Elected members represent constituents
- Free, fair elections provide legitimacy
- Voting is compulsory for Australian citizens
- Preferential voting in House, proportional in Senate`,
    keyPoints: [
      "Parliament: House of Representatives + Senate + King",
      "Government formed in House of Representatives",
      "Senate reviews and can amend legislation",
      "Bills require both houses and royal assent"
    ]
  },
  12: {
    title: "Political Parties, Interest Groups, and Media",
    content: `Democracy involves many groups trying to influence government decisions. Understanding these influences helps us be informed citizens.

Political Parties:
Organised groups seeking to win government:
- Develop policies based on ideology
- Select candidates for elections
- Provide stable government

Major Australian Parties:
- Liberal Party: Centre-right, business focus
- Labor Party: Centre-left, union origins
- National Party: Rural and regional
- Greens: Environmental focus
- Minor parties and independents

Ideology:
Left: More government intervention, social equality
Right: Less government, individual responsibility
Most parties sit somewhere on this spectrum.

Interest Groups:
Organised groups that try to influence policy:
- Unions (workers' rights)
- Business groups (industry interests)
- Environmental groups
- Professional associations
- Community organisations

How They Influence:
- Lobbying politicians
- Media campaigns
- Protests and demonstrations
- Providing expertise
- Political donations

The Media:
Traditional and social media shape public opinion:
- Report on government actions
- Investigate issues
- Provide platforms for debate
- Can influence election outcomes

Media literacy is crucial:
- Identify bias and perspective
- Check sources
- Distinguish news from opinion
- Consider who owns the media`,
    keyPoints: [
      "Political parties compete for government",
      "Ideology ranges from left to right",
      "Interest groups lobby to influence policy",
      "Media shapes public opinion - be critical"
    ]
  },
  13: {
    title: "Citizenship, Rights, and Responsibilities",
    content: `Australian citizenship comes with both rights and responsibilities. Active citizenship strengthens democracy.

Becoming a Citizen:
- By birth: Born in Australia to citizen/resident parent
- By descent: Born overseas to Australian parent
- By application: Meet residency and character requirements, take pledge

Rights of Citizens:
- Vote in elections
- Run for Parliament
- Work in public service
- Apply for Australian passport
- Return to Australia at any time
- Access to consular assistance overseas

Responsibilities:
- Vote in elections (compulsory)
- Serve on a jury if called
- Defend Australia if needed
- Obey the law

Values:
Citizenship test includes commitment to:
- Democratic beliefs
- Rule of law
- Freedom and dignity
- Equality and fair go

Forms of Civic Participation:
Beyond voting, citizens can:
- Join political parties
- Write to representatives
- Sign petitions
- Attend public meetings
- Join community organisations
- Volunteer
- Peaceful protest
- Engage in public debate

Active citizenship means being informed and participating in democracy, not just following rules.`,
    keyPoints: [
      "Citizens have rights (vote, passport) and responsibilities (vote, jury)",
      "Citizenship by birth, descent, or application",
      "Civic participation goes beyond voting",
      "Active citizenship strengthens democracy"
    ]
  },
  14: {
    title: "Influencing Decision-Making and Global Citizenship",
    content: `Citizens and groups can influence government decisions at local, national, and global levels.

Ways Citizens Influence Decisions:
- Voting: Choosing representatives
- Contacting representatives: Letters, emails, meetings
- Petitions: Gathering support for causes
- Protests: Peaceful demonstrations
- Media: Writing letters, social media campaigns
- Joining organisations: Amplifying voice through groups

Successful Campaigns:
Examples of citizen action creating change:
- Environmental campaigns
- Marriage equality
- Indigenous rights recognition
- Consumer campaigns

Advocacy vs Activism:
Advocacy: Working within the system (lobbying, submissions)
Activism: Direct action to demand change (protests, boycotts)
Both are legitimate forms of civic participation.

Global Citizenship:
Beyond national citizenship, we are part of a global community.

Global Issues Requiring Cooperation:
- Climate change
- Refugees and migration
- Human rights
- Global health
- International trade

Responsibilities:
- Awareness of global issues
- Ethical consumption
- Support for international aid
- Understanding diverse perspectives
- Acting locally, thinking globally

Connecting Local to Global:
Local actions can have global impact. Individual choices about consumption, waste, and engagement matter.`,
    keyPoints: [
      "Citizens influence through voting, petitions, protests",
      "Advocacy works within systems, activism demands change",
      "Global citizenship: awareness and responsibility beyond borders",
      "Local actions have global impact"
    ]
  },
  15: {
    title: "Australia's International Relationships",
    content: `Australia's foreign policy balances relationships with major powers, regional engagement, and global responsibilities.

Key Relationships:

United States:
- ANZUS Treaty (1951): Security alliance
- Five Eyes: Intelligence sharing
- Trade and investment partner
- Cultural connections

China:
- Major trading partner
- Complex relationship: trade vs security concerns
- Growing tensions over various issues

United Kingdom:
- Historical ties
- Head of Commonwealth
- Five Eyes member
- Ongoing cultural connections

Regional Engagement:
- ASEAN: Association of Southeast Asian Nations
- Pacific Islands Forum: Regional cooperation
- Important for security and stability

International Organisations:
- United Nations: Collective security, human rights
- World Trade Organization: Trade rules
- G20: Major economies coordination
- Commonwealth of Nations

Treaties and Agreements:
International agreements shape domestic policy:
- Trade agreements
- Environmental treaties (Paris Agreement)
- Human rights conventions
- Defence agreements

Balancing Sovereignty and Cooperation:
Australia must balance:
- National interests
- Alliance obligations
- Regional relationships
- Global responsibilities`,
    keyPoints: [
      "ANZUS alliance with USA central to security",
      "China: major trade partner, complex relationship",
      "Regional engagement through ASEAN, Pacific Forum",
      "Balance sovereignty with international cooperation"
    ]
  },
  16: {
    title: "Contemporary Issues and Civic Engagement",
    content: `Applying political understanding to contemporary issues helps us engage meaningfully as citizens.

Current Political Issues:
Consider how different perspectives approach:
- Climate policy
- Immigration and refugees
- Indigenous recognition
- Economic management
- Education and health funding
- Housing affordability

Analysing Issues:
1. What is the issue?
2. Who are the stakeholders?
3. What are different perspectives?
4. What evidence supports each view?
5. What are possible solutions?
6. What are the trade-offs?

Making Informed Decisions:
- Seek diverse sources of information
- Distinguish facts from opinions
- Consider short and long-term consequences
- Recognise your own biases
- Be willing to change your mind with evidence

Engaging Respectfully:
Democratic debate requires:
- Listening to other views
- Arguing with evidence, not personal attacks
- Accepting that people can disagree reasonably
- Finding common ground where possible
- Respecting the process even when you disagree

Being an Active Citizen:
- Stay informed about current affairs
- Engage with issues that matter to you
- Participate in democratic processes
- Encourage others to engage
- Model respectful debate`,
    keyPoints: [
      "Analyse issues from multiple perspectives",
      "Distinguish facts from opinions",
      "Engage respectfully in democratic debate",
      "Active citizenship requires ongoing engagement"
    ]
  },
  17: {
    title: "Humanities Review and Exam Preparation",
    content: `This week consolidates learning from both terms in preparation for the end-of-semester examination.

Term 1: History - Australians at War
Key Topics:
- Causes of WWI (MAIN: Militarism, Alliances, Imperialism, Nationalism)
- Gallipoli campaign and ANZAC legend
- Western Front battles and trench warfare
- Treaty of Versailles and interwar period
- Causes and outbreak of WWII
- Australian home front
- Holocaust and human rights
- Source analysis (OPCL)

Term 2: Politics and Civics
Key Topics:
- Constitution and Federation
- Structure of Parliament
- How laws are made
- Political parties and interest groups
- Media influence
- Citizenship rights and responsibilities
- Civic participation
- Australia's international relationships

Historical Skills:
- Source analysis using OPCL
- Identifying perspectives and bias
- Using evidence to support arguments
- Understanding cause and effect
- Recognising continuity and change

Civics Skills:
- Understanding how democracy works
- Analysing political issues
- Evaluating civic participation
- Connecting local to global

Exam Tips:
- Read questions carefully
- Use specific examples
- Structure responses clearly
- Support arguments with evidence
- Consider multiple perspectives`,
    keyPoints: [
      "Review WWI, WWII, and their legacy",
      "Know Australian democracy and citizenship",
      "Use OPCL for source analysis",
      "Support arguments with specific evidence"
    ]
  }
};

// English reading by week
// Term 1 (Weeks 1-9): News Article Analysis - rationale, message, persuasive techniques
// Term 2 (Weeks 10-17): 1984 by George Orwell - dystopia, power, control
const englishReadingByWeek: Record<number, ReadingContent> = {
  1: {
    title: "Introduction to News Article Analysis",
    content: `Term 1 focuses on analysing news articles, understanding how they communicate messages and use persuasive techniques to influence readers.

What is a News Article?
A news article is a piece of writing that informs readers about current events. While news should be objective, all media involves choices about what to include, how to frame issues, and what language to use.

Purpose of News Media:
- Inform: Provide facts about events
- Interpret: Explain significance
- Investigate: Uncover hidden information
- Entertain: Engage audience interest

Structure of News Articles:
- Headline: Grabs attention, summarises story
- Lead/Byline: Opening paragraph with key information (Who, What, When, Where, Why, How)
- Body: Details in order of importance
- Quotes: Direct statements from sources
- Background: Context and history

The Inverted Pyramid:
News articles put the most important information first, with decreasing importance as you read. This allows readers to get key facts quickly.

Analysing News:
When reading news articles, consider:
- What facts are presented?
- What sources are quoted?
- What language choices are made?
- What is included and what is left out?
- What perspective is represented?`,
    keyPoints: [
      "News articles inform, interpret, investigate, entertain",
      "Inverted pyramid: most important information first",
      "Consider what is included and what is left out",
      "All media involves choices that shape meaning"
    ]
  },
  2: {
    title: "Understanding Rationale and Message",
    content: `Every news article has an underlying rationale (reason for writing) and message (what the writer wants you to understand or believe).

Rationale:
The rationale is the purpose behind the article. Ask: Why was this written?
- To report breaking news
- To investigate an issue
- To profile a person
- To review or critique
- To persuade readers
- To generate discussion

Message:
The message is the main idea or argument. Ask: What does the writer want me to think?
- This might be stated explicitly
- Or implied through choices made
- Consider the angle or slant

Identifying the Message:
1. Read the headline and lead - what's emphasised?
2. Look at which facts are highlighted
3. Consider which sources are quoted
4. Notice the language used
5. What conclusion does the article lead to?

Intended Audience:
Writers shape content for their audience:
- Consider the publication (broadsheet vs tabloid)
- Age and education level of readers
- Political leanings of readership
- Existing knowledge assumed

Context Matters:
The same event can be reported very differently depending on:
- When the article was written
- Where it was published
- Who the writer is
- What else was happening at the time`,
    keyPoints: [
      "Rationale: Why was this article written?",
      "Message: What does the writer want you to think?",
      "Consider audience and publication context",
      "Same event can be framed differently"
    ]
  },
  3: {
    title: "Persuasive Techniques in News",
    content: `While news should be objective, many articles use persuasive techniques to influence how readers interpret information.

Appeals:
Ethos: Appeal to credibility
- Expert quotes
- References to authority
- Credentials of writer

Pathos: Appeal to emotion
- Emotive language
- Personal stories
- Imagery

Logos: Appeal to logic
- Statistics and data
- Facts and evidence
- Logical reasoning

Language Techniques:
Emotive Language:
Instead of "said," using "claimed" or "admitted" changes meaning.
"Home" vs "house" vs "property"

Connotation:
Words carry emotional associations beyond their literal meaning.
"Freedom fighter" vs "terrorist" - same person, different framing

Rhetorical Questions:
Questions that don't need answers but make readers think.
"How long can we ignore this crisis?"

Repetition:
Repeating key words or phrases for emphasis.

Hyperbole:
Exaggeration for effect.
"The worst decision in history"

Selection and Omission:
What facts are included? What is left out?
This shapes the story without obvious bias.`,
    keyPoints: [
      "Ethos (credibility), Pathos (emotion), Logos (logic)",
      "Emotive language shapes reader response",
      "Connotation carries meaning beyond definition",
      "Selection and omission shape without obvious bias"
    ]
  },
  4: {
    title: "Analysing Visual Elements and Layout",
    content: `News articles use visual elements strategically. Understanding these choices helps you analyse the full message.

Headlines:
- Large, bold, designed to grab attention
- May use wordplay, alliteration, questions
- Often simplify or sensationalise
- Set expectations for the article

Images and Photographs:
- Selected to support the story's angle
- Caption provides interpretation
- Positioning affects importance
- Subject's expression/pose matters

Consider:
- Who is shown? Who is not?
- What is the subject doing?
- What angle is the photo taken from?
- What emotions does it evoke?

Layout and Design:
- Size and placement show importance
- Front page vs back pages
- Above vs below the fold
- Sidebar vs main story
- Pull quotes highlight key points

Infographics and Data:
- Statistics presented visually
- Can clarify or mislead
- Check scale and context
- Consider what data is selected

Typography:
- Font size shows hierarchy
- Bold and italics add emphasis
- Colour can evoke emotion
- All-caps suggests urgency

Reading Images Critically:
Images are not neutral - they are chosen and cropped to support the story. The same event photographed differently creates different impressions.`,
    keyPoints: [
      "Headlines grab attention and set expectations",
      "Images are selected to support the story's angle",
      "Layout and placement indicate importance",
      "All visual elements are deliberate choices"
    ]
  },
  5: {
    title: "Comparing News Coverage",
    content: `Comparing how different sources cover the same story reveals how media shapes our understanding of events.

Why Compare?
- Different outlets have different perspectives
- Reveals what's emphasised and omitted
- Shows how framing affects meaning
- Helps identify bias
- Develops critical reading skills

What to Compare:
Headlines:
- How do they frame the same event?
- What words are chosen?
- What aspect is emphasised?

Lead Paragraphs:
- What information comes first?
- What angle is taken?
- Who/what is centred?

Sources Quoted:
- Whose voices are included?
- What perspectives are represented?
- Are sources balanced?

Language:
- Emotive vs neutral words
- Positive vs negative framing
- Active vs passive voice

What's Included/Omitted:
- What facts appear in one but not another?
- What context is provided?
- What might change understanding?

Visuals:
- What images are selected?
- How do they affect interpretation?

Language for Comparison:
- "While [Source A] emphasises..., [Source B] focuses on..."
- "In contrast to..."
- "Similarly, both sources..."
- "However, they differ in..."`,
    keyPoints: [
      "Comparing sources reveals framing and bias",
      "Compare headlines, leads, sources, language",
      "Note what's included and what's omitted",
      "Use comparative language in analysis"
    ]
  },
  6: {
    title: "News Article Assessment Preparation",
    content: `This week prepares you for the News Article Analysis assessment, consolidating skills developed in Term 1.

Assessment Structure:
You will analyse a news article, identifying:
- The rationale (purpose)
- The message (main argument)
- Persuasive techniques used
- How techniques support the message

Approaching the Task:
1. Read the article carefully - multiple times
2. Identify the topic and main message
3. Note who the audience might be
4. Highlight persuasive techniques
5. Consider visual elements if present
6. Plan your response before writing

Analysis Structure:
Introduction:
- Identify the article, author, publication
- State the main message/contention
- Preview your analysis

Body Paragraphs:
Use TEEL structure for each technique:
- Topic: Identify the technique
- Explain: How is it used?
- Evidence: Quote from the text
- Link: How does it support the message?

Conclusion:
- Summarise how techniques work together
- Evaluate effectiveness
- Consider overall impact on readers

Key Terms:
- Rationale, message, contention
- Ethos, pathos, logos
- Emotive language, connotation
- Rhetorical question, repetition
- Selection, omission, framing`,
    keyPoints: [
      "Read carefully and annotate the article",
      "Identify message before analysing techniques",
      "Use TEEL paragraphs for each technique",
      "Link techniques to the overall message"
    ]
  },
  7: {
    title: "Political Campaign Presentation Preparation",
    content: `This week focuses on preparing your Political Campaign Presentation, demonstrating your understanding of persuasive communication.

The Task:
Create and deliver a persuasive presentation on a political or social issue, using the techniques studied in news analysis.

Choosing Your Topic:
Select an issue you care about:
- Local community issue
- School-related topic
- Social justice issue
- Environmental concern
- Youth-focused policy

Crafting Your Message:
- Clear contention (what you want audience to believe/do)
- Supporting arguments
- Anticipate counterarguments
- Call to action

Using Persuasive Techniques:
Ethos: Establish credibility
- Research your topic
- Use reliable sources
- Present professionally

Pathos: Appeal to emotion
- Personal stories
- Vivid examples
- Connect to audience's values

Logos: Appeal to logic
- Facts and statistics
- Logical reasoning
- Cause and effect

Presentation Skills:
Speaking:
- Clear, confident voice
- Appropriate pace
- Eye contact
- Avoid reading directly

Visual Aids:
- Support, don't replace, your words
- Simple and clear
- Professional appearance

Structure:
- Engaging opening
- Clear arguments
- Strong conclusion with call to action`,
    keyPoints: [
      "Choose a topic you care about",
      "State a clear contention",
      "Use ethos, pathos, and logos",
      "Practise delivery for confidence"
    ]
  },
  8: {
    title: "Presentation Delivery and Feedback",
    content: `This week focuses on delivering presentations and providing constructive peer feedback.

Presentation Delivery:
Before:
- Review your content
- Practise timing (stay within limits)
- Prepare visual aids
- Arrive ready

During:
- Breathe and stay calm
- Speak clearly and confidently
- Make eye contact with audience
- Use gestures naturally
- Engage with your content

After:
- Answer questions thoughtfully
- Accept feedback graciously
- Reflect on your performance

Providing Peer Feedback:
Good feedback is:
- Specific: Not just "good job" but what was good
- Constructive: Suggestions for improvement
- Kind: Delivered respectfully
- Balanced: Positives and areas for growth

Feedback Framework:
What worked well:
- Strong opening/closing
- Effective use of techniques
- Confident delivery
- Engaging content

Areas for development:
- Clearer structure
- More evidence
- Better eye contact
- Stronger call to action

Receiving Feedback:
- Listen without defending
- Ask clarifying questions
- Note specific suggestions
- Thank the person
- Reflect on what's useful`,
    keyPoints: [
      "Preparation and practice build confidence",
      "Engage with audience through eye contact",
      "Give specific, constructive feedback",
      "Use feedback to improve future work"
    ]
  },
  9: {
    title: "Term 1 Review and Transition to Term 2",
    content: `This week consolidates Term 1 learning and prepares for the study of 1984 in Term 2.

Term 1 Skills Review:
News Article Analysis:
- Identifying rationale and message
- Recognising persuasive techniques
- Analysing language choices
- Considering visual elements
- Comparing coverage

Persuasive Communication:
- Ethos, pathos, logos
- Structuring arguments
- Supporting with evidence
- Presentation skills

Critical Literacy:
- Questioning media messages
- Recognising bias
- Considering perspectives
- Evaluating sources

Looking Ahead to Term 2:
In Term 2, we study George Orwell's dystopian novel 1984.

What is a Dystopia?
A dystopia is an imagined society with:
- Oppressive social control
- Loss of individual freedom
- Often totalitarian government
- Warnings about current trends

1984 Overview:
- Written by George Orwell in 1948
- Set in a totalitarian future society
- Explores surveillance, propaganda, control
- Remains relevant to modern issues

Connecting Terms:
The persuasive techniques studied in Term 1 connect to 1984's exploration of propaganda and manipulation. Understanding how media influences thinking prepares us to analyse how the Party controls thought in 1984.`,
    keyPoints: [
      "Review news analysis and persuasive techniques",
      "Dystopia: imagined oppressive society",
      "1984 explores surveillance, propaganda, control",
      "Term 1 skills apply to Term 2 text study"
    ]
  },
  10: {
    title: "Introduction to 1984: Dystopia and Context",
    content: `Term 2 begins our study of George Orwell's 1984, a dystopian novel that remains powerfully relevant today.

About the Author:
George Orwell (1903-1950):
- Real name Eric Arthur Blair
- Fought in Spanish Civil War
- Witnessed totalitarianism firsthand
- Concerned with truth, justice, freedom
- Also wrote Animal Farm

Historical Context:
1984 was written in 1948, responding to:
- Rise of Nazism and fascism
- Soviet totalitarianism under Stalin
- World War II and its aftermath
- Emerging Cold War tensions
- Concerns about technology and power

The Dystopian Genre:
Key features:
- Imagined future society
- Oppressive government control
- Propaganda and surveillance
- Suppression of individuality
- Warning about current trends

1984's World:
- Set in Oceania (including Britain/Airstrip One)
- Perpetual war between three superpowers
- The Party controls everything
- Big Brother is the symbolic leader
- History constantly rewritten

Key Concepts:
- Big Brother: Symbol of total surveillance
- Thought Police: Enforce orthodoxy
- Newspeak: Language designed to limit thought
- Doublethink: Holding contradictory beliefs
- Ministry of Truth: Propaganda and lies`,
    keyPoints: [
      "Orwell wrote 1984 in response to totalitarianism",
      "Dystopia: imagined oppressive future society",
      "Big Brother symbolises total surveillance",
      "Newspeak limits thought through language"
    ]
  },
  11: {
    title: "1984 Part 1: Oceania and the Party",
    content: `Part 1 of 1984 introduces the world of Oceania, the Party's control, and our protagonist Winston Smith.

The Setting:
London (now Airstrip One) is a dreary place:
- Crumbling buildings
- Constant surveillance via telescreens
- Posters: "Big Brother Is Watching You"
- Perpetual war creates scarcity
- Everything controlled by the Party

The Party's Structure:
- Big Brother: Unseen leader, maybe not real
- Inner Party: Elite ruling class (2%)
- Outer Party: Workers like Winston (13%)
- Proles: Working class, largely ignored (85%)

Party Slogans:
"War is Peace" - perpetual war unites people
"Freedom is Slavery" - independence leads to failure
"Ignorance is Strength" - thinking leads to trouble

Winston Smith:
- Works at Ministry of Truth
- Job: Rewriting historical records
- Secretly hates the Party
- Begins keeping an illegal diary
- Commits "thoughtcrime"

Surveillance and Control:
- Telescreens watch and listen
- Thought Police arrest thoughtcriminals
- Children spy on parents
- No privacy exists

Orwell's Techniques:
- Third-person limited perspective
- Detailed world-building
- Ironic naming (Ministry of Truth spreads lies)
- Cold, oppressive atmosphere`,
    keyPoints: [
      "Oceania: totalitarian society under the Party",
      "Big Brother represents constant surveillance",
      "Winston commits thoughtcrime by questioning",
      "Irony: ministries do opposite of their names"
    ]
  },
  12: {
    title: "1984 Part 1-2: Propaganda and Rebellion",
    content: `The novel develops themes of propaganda, truth manipulation, and the beginning of Winston's rebellion.

Propaganda in 1984:
Two Minutes Hate:
- Daily ritual of directed hatred
- Emmanuel Goldstein as enemy figure
- Unifies people against common enemy
- Releases and redirects anger

Historical Revisionism:
- Winston's job: altering historical records
- "Who controls the past controls the future"
- No objective truth can exist
- Memory becomes unreliable

Newspeak:
The Party is developing a new language:
- Reduce vocabulary
- Eliminate words for rebellion
- Make thoughtcrime literally impossible
- "Thoughtcrime does not entail death. Thoughtcrime IS death."

Winston's Rebellion:
His acts of rebellion:
- Keeping a diary ("down with Big Brother")
- Remembering the past
- Having independent thoughts
- His fascination with Julia
- Seeking the Brotherhood

Julia:
- Fellow Outer Party member
- Appears to be devout Party member
- Actually rebels through pleasure
- More practical than Winston
- Their relationship is political act

The Paperweight:
Symbol of the past and beauty:
- Fragment of pre-Party world
- Represents Winston's hope
- Later destroyed (foreshadowing)`,
    keyPoints: [
      "Two Minutes Hate directs emotion against enemies",
      "History is constantly rewritten",
      "Newspeak designed to prevent thoughtcrime",
      "Winston and Julia's relationship is rebellion"
    ]
  },
  13: {
    title: "1984 Part 2-3: Love, Betrayal, and the Brotherhood",
    content: `Part 2 explores Winston and Julia's relationship, while Part 3 reveals the Party's ultimate power over individuals.

Winston and Julia:
Their relationship develops:
- Secret meetings in countryside
- Renting room above Mr Charrington's shop
- Sexual relationship as political act
- "I love you" as rebellion
- Different approaches to resistance

O'Brien:
- Inner Party member
- Winston believes he's Brotherhood member
- Gives Winston "The Book" (Goldstein's manifesto)
- Actually working for Thought Police
- Represents the Party's deception

The Betrayal:
- Mr Charrington is Thought Police
- Telescreen hidden behind painting
- Winston and Julia arrested
- Their private world destroyed
- Paperweight smashed (symbol)

Ministry of Love:
Part 3 takes place here:
- Where thought criminals are "cured"
- Designed to break individuals
- Physical and psychological torture
- Goal: make prisoners love Big Brother

O'Brien as Torturer:
Reveals Party's true nature:
- Power is not a means, but an end
- "If you want a picture of the future, imagine a boot stamping on a human face—forever"
- Party seeks power for its own sake`,
    keyPoints: [
      "Winston and Julia's love is an act of rebellion",
      "O'Brien betrays Winston's trust",
      "Ministry of Love 'cures' thought criminals",
      "Party seeks power as an end in itself"
    ]
  },
  14: {
    title: "1984 Part 3: Room 101 and the Ending",
    content: `The novel's climax shows the Party's complete victory over Winston's individual spirit.

Breaking Winston:
The Party's goal is not just obedience but love.
Stages of his "re-education":
1. Physical torture
2. Psychological manipulation
3. Understanding Party philosophy
4. Final step: Room 101

2+2=5:
Winston is tortured until he genuinely believes 2+2=5.
This represents:
- Complete control over truth
- Victory of Party over reality
- Destruction of objective thinking

Room 101:
Contains each person's worst fear.
For Winston: rats
Faced with rats, Winston betrays Julia:
- "Do it to Julia! Not me!"
- His last private self is destroyed
- The Party has conquered his mind

The Ending:
After release:
- Winston works at ministry
- He and Julia meet but feel nothing
- He has been "cured"
- "He loved Big Brother"

The Appendix:
Written in past tense about Newspeak.
Suggests the Party eventually fell.
Ambiguous hope in otherwise bleak ending.

Interpretations:
Is the ending:
- Complete despair?
- Warning we can still avoid?
- Hidden hope in the appendix?
Orwell leaves readers to decide.`,
    keyPoints: [
      "Room 101 contains each person's worst fear",
      "Winston betrays Julia to save himself",
      "The ending: 'He loved Big Brother'",
      "Appendix may suggest eventual Party fall"
    ]
  },
  15: {
    title: "Themes and Techniques in 1984",
    content: `Understanding Orwell's major themes and techniques deepens our analysis of 1984.

Major Themes:

Totalitarianism and Power:
- Absolute power corrupts absolutely
- Power as end in itself
- Control over history, language, thought
- Surveillance as control mechanism

Truth and Reality:
- Party controls what is "true"
- "Reality exists in the human mind"
- Memory vs official history
- Objective truth destroyed

Language and Thought:
- Newspeak limits possible thoughts
- Language shapes consciousness
- Propaganda replaces genuine communication
- "Doublethink" holds contradictions

Individuality and Identity:
- Party seeks to destroy the self
- Love and loyalty as threats
- "Freedom is the freedom to say 2+2=4"
- Without private thought, no self exists

Orwell's Techniques:

Symbolism:
- Big Brother: surveillance
- Telescreen: constant watching
- Paperweight: fragile past
- Golden Country: freedom

Irony:
- Ministry of Truth spreads lies
- Ministry of Love tortures
- Ministry of Peace wages war
- Ministry of Plenty creates scarcity

Language:
- Cold, precise prose
- Newspeak vocabulary
- Contrast between Party language and Winston's thoughts`,
    keyPoints: [
      "Power, truth, language, individuality - key themes",
      "Newspeak shows language controls thought",
      "Ironic naming of ministries",
      "Symbols reinforce themes throughout"
    ]
  },
  16: {
    title: "1984's Relevance Today",
    content: `Orwell's warnings remain relevant as modern societies grapple with surveillance, misinformation, and power.

Surveillance Today:
Modern parallels to Big Brother:
- CCTV cameras everywhere
- Social media tracking
- Data collection by companies
- Government surveillance programs
- Smart devices that listen

"Post-Truth" and Propaganda:
Modern parallels to Ministry of Truth:
- "Fake news" debates
- Social media misinformation
- Deep fakes and manipulation
- Denial of established facts
- Information bubbles

Language and Manipulation:
Modern parallels to Newspeak:
- Political euphemisms
- Simplified communication
- Algorithms shaping information
- Reduced attention spans

Individual Freedom:
Ongoing debates about:
- Privacy vs security
- Free speech limits
- Corporate power
- Government overreach

Islamic Perspectives:
Consider through ethical lens:
- Truth-telling as religious duty
- Justice and accountability
- Protection of privacy
- Speaking truth to power
- Moral responsibility

Critical Questions:
- What surveillance do you accept?
- How do you verify information?
- What would you sacrifice for security?
- How can we protect truth and freedom?`,
    keyPoints: [
      "Surveillance technology echoes Big Brother",
      "Misinformation parallels Ministry of Truth",
      "Language manipulation continues today",
      "Consider ethical implications critically"
    ]
  },
  17: {
    title: "English Review and Exam Preparation",
    content: `This week consolidates all learning from both terms in preparation for the end-of-semester examination.

Term 1: News Article Analysis
Key Skills:
- Identifying rationale and message
- Analysing persuasive techniques (ethos, pathos, logos)
- Examining language choices
- Considering visual elements
- Comparing coverage

Key Terms:
Contention, emotive language, connotation, rhetorical question, framing, selection, omission

Term 2: 1984 Analysis
Key Topics:
- Context: Orwell's purpose and historical background
- Plot: Winston's journey from rebellion to submission
- Characters: Winston, Julia, O'Brien, Big Brother
- Themes: Power, truth, language, individuality
- Techniques: Symbolism, irony, language

Key Quotes:
- "War is Peace. Freedom is Slavery. Ignorance is Strength."
- "Who controls the past controls the future."
- "If you want a picture of the future, imagine a boot stamping on a human face—forever."
- "Freedom is the freedom to say that two plus two make four."

Essay Skills:
- Clear thesis statement
- TEEL paragraphs
- Evidence with quotations
- Link techniques to meaning
- Consider multiple perspectives

Exam Tips:
- Read questions carefully
- Plan before writing
- Use specific textual evidence
- Connect to themes and context
- Proofread your work`,
    keyPoints: [
      "Review news analysis and 1984 themes",
      "Know key quotes and their significance",
      "Use TEEL structure with evidence",
      "Connect techniques to meaning and context"
    ]
  }
};

const mathContent: StudyContent = {
  type: "practice",
  vocabulary: [
    { term: "Exponent", definition: "A number indicating how many times to multiply the base by itself" },
    { term: "Surd", definition: "An irrational root that cannot be simplified to a whole number" },
    { term: "Absolute Value", definition: "The distance of a number from zero, always positive" },
    { term: "Gradient", definition: "The slope or steepness of a line" },
    { term: "Quadratic", definition: "An expression with a squared term as the highest power" },
    { term: "Vertex", definition: "The turning point of a parabola" },
    { term: "Sequence", definition: "An ordered list of numbers following a pattern" },
    { term: "Proportion", definition: "A relationship where two quantities change at the same rate" },
  ],
  practiceQuestions: mathQuestions,
  summaryPoints: [
    "Polya's 4 steps: Understand, Plan, Execute, Check",
    "Exponent laws: multiply → add indices, divide → subtract indices",
    "Distance formula: d = √[(x₂-x₁)² + (y₂-y₁)²]",
    "Quadratic formula: x = (-b ± √(b²-4ac))/2a",
    "Arithmetic sequence: aₙ = a₁ + (n-1)d",
    "Direct proportion: y = kx",
  ],
};

const scienceContent: StudyContent = {
  type: "practice",
  vocabulary: [
    { term: "Isotope", definition: "Atoms of the same element with different numbers of neutrons" },
    { term: "Half-life", definition: "Time for half of a radioactive sample to decay" },
    { term: "Electrolysis", definition: "Using electricity to break down compounds" },
    { term: "Homeostasis", definition: "Maintenance of stable internal conditions" },
    { term: "Hormone", definition: "Chemical messenger produced by endocrine glands" },
    { term: "Pathogen", definition: "Microorganism that causes disease" },
    { term: "Antibody", definition: "Protein produced by immune cells to fight specific pathogens" },
    { term: "Vaccine", definition: "Preparation that stimulates immunity without causing disease" },
  ],
  practiceQuestions: scienceQuestions,
  summaryPoints: [
    "Atomic number = protons, mass number = protons + neutrons",
    "Alpha stopped by paper, Beta by aluminium, Gamma by lead",
    "Chemical equations must balance (conservation of mass)",
    "Negative feedback maintains homeostasis",
    "Insulin lowers blood glucose, glucagon raises it",
    "Three lines of defence: barriers, innate, adaptive",
  ],
};

const historyContent: StudyContent = {
  type: "review",
  vocabulary: [
    { term: "ANZAC", definition: "Australian and New Zealand Army Corps" },
    { term: "Armistice", definition: "Agreement to stop fighting" },
    { term: "Treaty of Versailles", definition: "Peace treaty that ended WWI" },
    { term: "Federation", definition: "The uniting of Australian colonies in 1901" },
    { term: "Constitution", definition: "The set of rules establishing government" },
    { term: "Referendum", definition: "Vote by citizens to change the Constitution" },
    { term: "Civic Participation", definition: "Ways citizens engage in democracy" },
    { term: "Primary Source", definition: "Original document from the time studied" },
  ],
  practiceQuestions: historyQuestions,
  flashcards: [
    { question: "What does MAIN stand for?", answer: "Militarism, Alliances, Imperialism, Nationalism", type: "short-answer" },
    { question: "When is ANZAC Day?", answer: "April 25", type: "short-answer" },
    { question: "What treaty ended WWI?", answer: "Treaty of Versailles", type: "short-answer" },
    { question: "When was Australian Federation?", answer: "1901", type: "short-answer" },
  ],
  summaryPoints: [
    "MAIN: Causes of WWI - Militarism, Alliances, Imperialism, Nationalism",
    "ANZAC legend: courage, mateship, endurance",
    "OPCL: Origin, Purpose, Content, Limitation for source analysis",
    "Parliament: House of Representatives + Senate + King",
    "Constitution can only be changed by referendum",
  ],
};

const englishContent: StudyContent = {
  type: "reading",
  vocabulary: [
    { term: "Rationale", definition: "The underlying reason or purpose for something" },
    { term: "Contention", definition: "The main argument or position" },
    { term: "Ethos", definition: "Appeal to credibility" },
    { term: "Pathos", definition: "Appeal to emotion" },
    { term: "Logos", definition: "Appeal to logic" },
    { term: "Dystopia", definition: "Imagined society with suffering and injustice" },
    { term: "Newspeak", definition: "The Party's language designed to limit thought" },
    { term: "Doublethink", definition: "Holding two contradictory beliefs simultaneously" },
  ],
  practiceQuestions: englishQuestions,
  writingPrompts: [
    {
      prompt: "Analyse how Orwell uses language and structure to critique totalitarianism in 1984",
      requirements: ["Clear thesis", "Multiple techniques analysed", "Textual evidence", "Link to themes"],
      structure: ["Introduction with thesis", "Technique 1", "Technique 2", "Technique 3", "Conclusion"],
    },
    {
      prompt: "Compare how two news articles present the same event differently",
      requirements: ["Identify both messages", "Compare techniques", "Analyse language", "Evaluate effectiveness"],
      structure: ["Introduction", "Article A analysis", "Article B analysis", "Comparison", "Conclusion"],
    },
  ],
  summaryPoints: [
    "News analysis: rationale, message, persuasive techniques",
    "Ethos, pathos, logos - three forms of persuasion",
    "1984: dystopia exploring surveillance, propaganda, control",
    "Big Brother represents total surveillance",
    "Newspeak designed to limit thought",
    "TEEL: Topic, Explain, Evidence, Link",
  ],
};

export function getStudyContent(subjectId: SubjectId, taskTitle: string, week: number): StudyContent {
  const taskType = getTaskType(taskTitle);
  const safeWeek = Math.max(1, Math.min(17, week));
  
  switch (subjectId) {
    case "math":
      return { 
        ...mathContent, 
        type: taskType,
        reading: mathReadingByWeek[safeWeek] || mathReadingByWeek[1]
      };
    
    case "science":
      return { 
        ...scienceContent, 
        type: taskType,
        reading: scienceReadingByWeek[safeWeek] || scienceReadingByWeek[1]
      };
    
    case "history":
      return { 
        ...historyContent, 
        type: taskType,
        reading: historyReadingByWeek[safeWeek] || historyReadingByWeek[1]
      };
    
    case "english":
      return { 
        ...englishContent, 
        type: taskType,
        reading: englishReadingByWeek[safeWeek] || englishReadingByWeek[1]
      };
    
    default:
      return { type: taskType };
  }
}
