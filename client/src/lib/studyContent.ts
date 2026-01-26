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
  { id: "m1", question: "Solve for x: 2x + 5 = 15", answer: "x = 5", solution: "2x + 5 = 15 → 2x = 10 → x = 5", type: "short" },
  { id: "m2", question: "Solve for x: 3(x - 2) = 12", answer: "x = 6", solution: "3x - 6 = 12 → 3x = 18 → x = 6", type: "short" },
  { id: "m3", question: "Simplify: 4x + 3y - 2x + 5y", answer: "2x + 8y", solution: "Combine like terms: (4x - 2x) + (3y + 5y) = 2x + 8y", type: "short" },
  { id: "m4", question: "What is the gradient of y = 3x - 7?", answer: "3", options: ["3", "-7", "7", "-3"], type: "multiple-choice" },
  { id: "m5", question: "Solve: x² = 49", answer: "x = 7 or x = -7", solution: "Take square root of both sides: x = ±√49 = ±7", type: "short" },
  { id: "m6", question: "Expand: (x + 3)(x + 2)", answer: "x² + 5x + 6", solution: "FOIL: x² + 2x + 3x + 6 = x² + 5x + 6", type: "short" },
  { id: "m7", question: "Factorize: x² + 7x + 12", answer: "(x + 3)(x + 4)", solution: "Find two numbers that multiply to 12 and add to 7: 3 and 4", type: "short" },
  { id: "m8", question: "Find y when x = 2 in: y = 4x - 3", answer: "y = 5", solution: "y = 4(2) - 3 = 8 - 3 = 5", type: "short" },
  { id: "m9", question: "Solve the simultaneous equations: x + y = 10, x - y = 4", answer: "x = 7, y = 3", solution: "Add equations: 2x = 14, so x = 7. Substitute: 7 + y = 10, so y = 3", type: "short" },
  { id: "m10", question: "Simplify: 2³ × 2⁴", answer: "2⁷ = 128", solution: "When multiplying same base, add indices: 2³⁺⁴ = 2⁷ = 128", type: "short" },
  { id: "m11", question: "Express 0.00045 in scientific notation", answer: "4.5 × 10⁻⁴", solution: "Move decimal 4 places right: 4.5 × 10⁻⁴", type: "short" },
  { id: "m12", question: "Find the hypotenuse of a right triangle with sides 6cm and 8cm", answer: "10 cm", solution: "c² = 6² + 8² = 36 + 64 = 100, c = 10", type: "short" },
  { id: "m13", question: "In a right triangle, if the opposite side is 5 and hypotenuse is 13, find sin(θ)", answer: "5/13", solution: "sin(θ) = opposite/hypotenuse = 5/13", type: "short" },
  { id: "m14", question: "Expand: (x - 4)²", answer: "x² - 8x + 16", solution: "(x-4)(x-4) = x² - 4x - 4x + 16 = x² - 8x + 16", type: "short" },
  { id: "m15", question: "Solve using quadratic formula: x² - 5x + 6 = 0", answer: "x = 2 or x = 3", solution: "Factorizes to (x-2)(x-3) = 0, so x = 2 or x = 3", type: "short" },
  { id: "m16", question: "What is the discriminant of x² + 4x + 5?", answer: "-4", solution: "b² - 4ac = 16 - 20 = -4 (no real solutions)", type: "short" },
  { id: "m17", question: "Find the vertex of y = x² - 6x + 8", answer: "(3, -1)", solution: "x = -b/2a = 6/2 = 3, y = 9 - 18 + 8 = -1", type: "short" },
  { id: "m18", question: "Find the mean of: 12, 15, 18, 21, 24", answer: "18", solution: "(12+15+18+21+24)/5 = 90/5 = 18", type: "short" },
  { id: "m19", question: "Find the median of: 3, 7, 2, 9, 5, 8, 1", answer: "5", solution: "Ordered: 1,2,3,5,7,8,9. Middle value = 5", type: "short" },
  { id: "m20", question: "Calculate the area of a circle with radius 5cm (use π = 3.14)", answer: "78.5 cm²", solution: "A = πr² = 3.14 × 25 = 78.5 cm²", type: "short" },
  { id: "m21", question: "Find the volume of a cylinder with radius 3cm and height 10cm (use π = 3.14)", answer: "282.6 cm³", solution: "V = πr²h = 3.14 × 9 × 10 = 282.6 cm³", type: "short" },
  { id: "m22", question: "What is cos(60°)?", answer: "0.5", options: ["0.5", "0.866", "1", "0"], type: "multiple-choice" },
  { id: "m23", question: "Solve: 5(2x - 3) = 3(x + 4)", answer: "x = 27/7", solution: "10x - 15 = 3x + 12 → 7x = 27 → x = 27/7", type: "short" },
  { id: "m24", question: "Find the y-intercept of 2x + 3y = 12", answer: "(0, 4)", solution: "When x = 0: 3y = 12, y = 4", type: "short" },
  { id: "m25", question: "What is the probability of rolling an even number on a standard die?", answer: "1/2 or 0.5", solution: "Even numbers: 2, 4, 6 (3 outcomes) out of 6 total = 3/6 = 1/2", type: "short" },
];

const scienceQuestions: PracticeQuestion[] = [
  { id: "s1", question: "What organelle is responsible for cellular respiration?", answer: "Mitochondria", options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"], type: "multiple-choice" },
  { id: "s2", question: "Name the process by which plants make glucose using sunlight.", answer: "Photosynthesis", type: "short" },
  { id: "s3", question: "What is the function of the cell membrane?", answer: "Controls what enters and exits the cell", type: "short" },
  { id: "s4", question: "In which direction does water move during osmosis?", answer: "From high water concentration to low water concentration", options: ["High to low concentration", "Low to high concentration", "Random movement", "Only when heated"], type: "multiple-choice" },
  { id: "s5", question: "What is the basic unit of heredity?", answer: "Gene", type: "short" },
  { id: "s6", question: "What type of cell division produces gametes?", answer: "Meiosis", options: ["Mitosis", "Meiosis", "Binary fission", "Budding"], type: "multiple-choice" },
  { id: "s7", question: "What is the shape of the DNA molecule?", answer: "Double helix", type: "short" },
  { id: "s8", question: "If a parent is Bb and the other is bb, what percentage of offspring will be Bb?", answer: "50%", solution: "Punnett square: Bb × bb → Bb, Bb, bb, bb = 50% Bb", type: "short" },
  { id: "s9", question: "Name the scientist who proposed natural selection.", answer: "Charles Darwin", type: "short" },
  { id: "s10", question: "What type of evidence for evolution compares similar bone structures?", answer: "Comparative anatomy / Homologous structures", type: "short" },
  { id: "s11", question: "What kingdom do bacteria belong to?", answer: "Monera / Prokaryota", type: "short" },
  { id: "s12", question: "What is an ecosystem?", answer: "A community of living organisms interacting with their physical environment", type: "short" },
  { id: "s13", question: "Name one biotic and one abiotic factor.", answer: "Biotic: plants, animals, bacteria. Abiotic: water, temperature, sunlight", type: "short" },
  { id: "s14", question: "What is the role of decomposers in an ecosystem?", answer: "Break down dead organisms and recycle nutrients", type: "short" },
  { id: "s15", question: "Where does gas exchange occur in the lungs?", answer: "Alveoli", type: "short" },
  { id: "s16", question: "What carries oxygen in the blood?", answer: "Red blood cells / Haemoglobin", type: "short" },
  { id: "s17", question: "What enzyme breaks down starch in the mouth?", answer: "Amylase", type: "short" },
  { id: "s18", question: "Where does most nutrient absorption occur?", answer: "Small intestine", options: ["Stomach", "Small intestine", "Large intestine", "Oesophagus"], type: "multiple-choice" },
  { id: "s19", question: "Balance this equation: H₂ + O₂ → H₂O", answer: "2H₂ + O₂ → 2H₂O", solution: "Need 4 H on each side and 2 O on each side", type: "short" },
  { id: "s20", question: "What type of reaction is: HCl + NaOH → NaCl + H₂O?", answer: "Neutralisation reaction", type: "short" },
  { id: "s21", question: "What pH indicates an acid?", answer: "Less than 7", options: ["Less than 7", "Equal to 7", "Greater than 7", "Equal to 14"], type: "multiple-choice" },
  { id: "s22", question: "What indicator turns red in acid and blue in base?", answer: "Litmus paper", type: "short" },
  { id: "s23", question: "What subatomic particle determines the element?", answer: "Proton", options: ["Electron", "Proton", "Neutron", "Photon"], type: "multiple-choice" },
  { id: "s24", question: "What is the electron configuration of Oxygen (atomic number 8)?", answer: "2, 6", type: "short" },
  { id: "s25", question: "What type of bond forms when electrons are shared?", answer: "Covalent bond", type: "short" },
];

const historyQuestions: PracticeQuestion[] = [
  { id: "h1", question: "What event triggered the start of World War I?", answer: "Assassination of Archduke Franz Ferdinand", type: "short" },
  { id: "h2", question: "Name the four main causes of WWI (MAIN)", answer: "Militarism, Alliances, Imperialism, Nationalism", type: "short" },
  { id: "h3", question: "What was trench warfare?", answer: "A type of fighting where soldiers fought from ditches dug into the ground", type: "short" },
  { id: "h4", question: "What new weapon was first used extensively in WWI?", answer: "Poison gas / Machine guns / Tanks", type: "short" },
  { id: "h5", question: "When did the Gallipoli campaign take place?", answer: "1915", options: ["1914", "1915", "1916", "1918"], type: "multiple-choice" },
  { id: "h6", question: "What is ANZAC Day commemorating?", answer: "Australian and New Zealand soldiers who served at Gallipoli and all wars", type: "short" },
  { id: "h7", question: "What treaty ended WWI?", answer: "Treaty of Versailles", type: "short" },
  { id: "h8", question: "Which country was blamed and punished most severely for WWI?", answer: "Germany", type: "short" },
  { id: "h9", question: "What was the Great Depression?", answer: "A severe worldwide economic downturn in the 1930s", type: "short" },
  { id: "h10", question: "Who became dictator of Germany in 1933?", answer: "Adolf Hitler", type: "short" },
  { id: "h11", question: "What ideology did Hitler's Nazi Party promote?", answer: "Fascism / National Socialism", type: "short" },
  { id: "h12", question: "What event started WWII in Europe?", answer: "Germany's invasion of Poland in 1939", type: "short" },
  { id: "h13", question: "What was the Holocaust?", answer: "The systematic genocide of six million Jews by Nazi Germany", type: "short" },
  { id: "h14", question: "What was D-Day?", answer: "The Allied invasion of Normandy, France on June 6, 1944", type: "short" },
  { id: "h15", question: "What ended the war in the Pacific?", answer: "Atomic bombs dropped on Hiroshima and Nagasaki", type: "short" },
  { id: "h16", question: "What was the Cold War?", answer: "A period of tension between USA and USSR without direct military conflict", type: "short" },
  { id: "h17", question: "What was the Iron Curtain?", answer: "The ideological boundary dividing Europe into Western and Soviet spheres", type: "short" },
  { id: "h18", question: "What is decolonisation?", answer: "The process of colonies gaining independence from imperial powers", type: "short" },
  { id: "h19", question: "Who was Martin Luther King Jr.?", answer: "American civil rights leader who advocated for equality through peaceful protest", type: "short" },
  { id: "h20", question: "What does a primary source provide?", answer: "First-hand evidence from the time being studied", options: ["Analysis of events", "First-hand evidence", "Modern interpretation", "Expert opinion"], type: "multiple-choice" },
  { id: "h21", question: "What is OPCL in source analysis?", answer: "Origin, Purpose, Content, Limitation", type: "short" },
  { id: "h22", question: "What is historical bias?", answer: "A one-sided or prejudiced perspective in historical sources", type: "short" },
  { id: "h23", question: "What major immigration policy changed in Australia in 1973?", answer: "The White Australia Policy was abolished", type: "short" },
  { id: "h24", question: "What does 'multicultural' mean in Australian context?", answer: "A society made up of people from many different cultural backgrounds", type: "short" },
  { id: "h25", question: "Why is it important to use multiple sources when studying history?", answer: "To get a balanced view and verify information through corroboration", type: "short" },
];

const englishQuestions: PracticeQuestion[] = [
  { id: "e1", question: "What is an allegory?", answer: "A story with a hidden political or moral meaning", type: "short" },
  { id: "e2", question: "What is satire?", answer: "Using humor or irony to criticize or expose foolishness", type: "short" },
  { id: "e3", question: "In Animal Farm, who does Napoleon represent?", answer: "Joseph Stalin", type: "short" },
  { id: "e4", question: "What does the windmill in Animal Farm symbolize?", answer: "Soviet industrialization and propaganda promises", type: "short" },
  { id: "e5", question: "What is the final commandment in Animal Farm?", answer: "All animals are equal, but some are more equal than others", type: "short" },
  { id: "e6", question: "What is ethos in persuasive writing?", answer: "Appeal to credibility or character", options: ["Appeal to emotion", "Appeal to credibility", "Appeal to logic", "Appeal to fear"], type: "multiple-choice" },
  { id: "e7", question: "What is pathos?", answer: "Appeal to emotion", type: "short" },
  { id: "e8", question: "What is logos?", answer: "Appeal to logic and reason", type: "short" },
  { id: "e9", question: "What is a rhetorical question?", answer: "A question asked for effect, not requiring an answer", type: "short" },
  { id: "e10", question: "What is an anecdote?", answer: "A short personal story used to make a point", type: "short" },
  { id: "e11", question: "What does TEEL stand for in essay writing?", answer: "Topic, Explain, Evidence, Link", type: "short" },
  { id: "e12", question: "What is a thesis statement?", answer: "A sentence stating the main argument of an essay", type: "short" },
  { id: "e13", question: "What is a metaphor?", answer: "A comparison saying one thing IS another (without like/as)", type: "short" },
  { id: "e14", question: "What is a simile?", answer: "A comparison using 'like' or 'as'", type: "short" },
  { id: "e15", question: "What is symbolism?", answer: "Using objects or images to represent abstract ideas", type: "short" },
  { id: "e16", question: "What is imagery?", answer: "Descriptive language that appeals to the senses", type: "short" },
  { id: "e17", question: "Who wrote Animal Farm and when?", answer: "George Orwell, 1945", type: "short" },
  { id: "e18", question: "What historical event does Animal Farm represent?", answer: "The Russian Revolution and rise of Soviet communism", type: "short" },
  { id: "e19", question: "Who does Boxer represent in Animal Farm?", answer: "The loyal working class who are exploited", type: "short" },
  { id: "e20", question: "What happens to Boxer at the end of Animal Farm?", answer: "He is sold to a glue factory when he can no longer work", type: "short" },
  { id: "e21", question: "What is the purpose of a contention?", answer: "To state your main argument or position on an issue", type: "short" },
  { id: "e22", question: "What makes writing 'persuasive'?", answer: "It aims to convince the reader to accept a viewpoint or take action", type: "short" },
  { id: "e23", question: "What is tone in writing?", answer: "The author's attitude toward the subject matter", type: "short" },
  { id: "e24", question: "What is the difference between connotation and denotation?", answer: "Denotation is literal meaning; connotation is emotional associations", type: "short" },
  { id: "e25", question: "What are the key features of a text response essay?", answer: "Thesis, topic sentences, evidence/quotes, analysis, conclusion", type: "short" },
];

// Week-specific reading content for each subject
const mathReadingByWeek: Record<number, ReadingContent> = {
  1: {
    title: "Introduction to Algebra and Variables",
    content: `Algebra is a branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations. These letters are called variables because their values can vary or change.

A variable like 'x' is simply a placeholder for a number we don't know yet. For example, if you have 5 apples and someone gives you more, you could write: 5 + x = total apples, where x represents how many you received.

Terms are parts of an expression separated by + or - signs. In the expression 3x + 2y - 5, there are three terms: 3x, 2y, and -5. The numbers in front of variables (like 3 and 2) are called coefficients.

Like terms are terms with exactly the same variables raised to the same power. You can only combine like terms: 3x + 5x = 8x, but 3x + 5y cannot be simplified because x and y are different variables.

Understanding these basic concepts is essential for solving equations and working with more complex mathematical problems throughout the year.`,
    keyPoints: [
      "Variables are letters representing unknown numbers",
      "Terms are separated by + or - signs",
      "Coefficients are numbers multiplied by variables",
      "Like terms have the same variable and can be combined"
    ]
  },
  2: {
    title: "Solving Linear Equations",
    content: `A linear equation is an equation where the highest power of the variable is 1. Examples include 2x + 3 = 7 and 5y - 2 = 13. The goal is to find the value of the variable that makes the equation true.

The Golden Rule of Equations: Whatever you do to one side, you must do to the other. This keeps the equation balanced. Think of it like a balance scale - both sides must always be equal.

Step-by-step approach:
1. Simplify each side by combining like terms
2. Move variable terms to one side using addition/subtraction
3. Move constant terms to the other side
4. Divide both sides by the coefficient of the variable

Example: Solve 3x + 7 = 16
Step 1: Subtract 7 from both sides: 3x = 9
Step 2: Divide both sides by 3: x = 3
Check: 3(3) + 7 = 9 + 7 = 16 ✓

Always check your answer by substituting it back into the original equation.`,
    keyPoints: [
      "Linear equations have variables with power of 1",
      "Keep the equation balanced - same operation on both sides",
      "Isolate the variable step by step",
      "Always check your answer by substitution"
    ]
  },
  3: {
    title: "Equations with Brackets and Fractions",
    content: `When equations contain brackets, use the distributive property to expand them first. The distributive property states: a(b + c) = ab + ac.

Example with brackets: 2(x + 3) = 14
Step 1: Expand: 2x + 6 = 14
Step 2: Subtract 6: 2x = 8
Step 3: Divide by 2: x = 4

For equations with the variable on both sides, collect variables on one side and numbers on the other.

Example: 5x - 3 = 2x + 9
Step 1: Subtract 2x from both sides: 3x - 3 = 9
Step 2: Add 3 to both sides: 3x = 12
Step 3: Divide by 3: x = 4

Equations with fractions: Multiply every term by the denominator to eliminate fractions.

Example: x/4 + 2 = 5
Step 1: Multiply everything by 4: x + 8 = 20
Step 2: Subtract 8: x = 12`,
    keyPoints: [
      "Use distributive property to expand brackets: a(b+c) = ab + ac",
      "Collect variables on one side, constants on the other",
      "Multiply by denominator to eliminate fractions",
      "Take it step by step and check your work"
    ]
  },
  4: {
    title: "Introduction to Linear Graphs",
    content: `Linear equations can be represented visually as straight lines on a coordinate plane. The standard form of a linear equation is y = mx + b, where m is the gradient (slope) and b is the y-intercept.

The gradient (m) tells you how steep the line is and whether it goes up or down:
- Positive gradient: line goes up from left to right
- Negative gradient: line goes down from left to right
- Larger number = steeper line

The y-intercept (b) is where the line crosses the y-axis. This happens when x = 0.

To graph a linear equation:
1. Find the y-intercept (set x = 0)
2. Find another point by substituting any x value
3. Draw a straight line through both points

Example: y = 2x + 1
When x = 0: y = 1 (y-intercept)
When x = 1: y = 3
When x = 2: y = 5
Plot these points and connect them with a straight line.`,
    keyPoints: [
      "Linear equations graph as straight lines",
      "y = mx + b: m is gradient, b is y-intercept",
      "Positive gradient slopes up, negative slopes down",
      "Find at least two points to draw the line"
    ]
  },
  5: {
    title: "Gradient and Y-Intercept",
    content: `The gradient of a line measures its steepness and direction. It tells you how much y changes when x increases by 1.

Calculating gradient from two points:
Gradient (m) = rise/run = (y₂ - y₁)/(x₂ - x₁)

Example: Find the gradient between (2, 3) and (4, 7)
m = (7 - 3)/(4 - 2) = 4/2 = 2

This means for every 1 unit increase in x, y increases by 2 units.

Finding the equation of a line:
1. Calculate the gradient using two points
2. Use one point and the gradient in y = mx + b to find b
3. Write the full equation

Special cases:
- Horizontal lines (like y = 3) have gradient 0
- Vertical lines (like x = 2) have undefined gradient
- Parallel lines have the same gradient
- Perpendicular lines have gradients that multiply to -1`,
    keyPoints: [
      "Gradient = rise/run = change in y / change in x",
      "Positive gradient goes up, negative goes down",
      "Horizontal lines have gradient 0",
      "Parallel lines have equal gradients"
    ]
  },
  6: {
    title: "Simultaneous Equations",
    content: `Simultaneous equations are two or more equations with the same variables that must be solved together. The solution is the point where both equations are true at the same time.

Graphically, the solution is where two lines intersect.

Substitution Method:
1. Solve one equation for a variable
2. Substitute into the other equation
3. Solve for the remaining variable
4. Substitute back to find the other variable

Example: y = 2x + 1 and x + y = 7
Step 1: Substitute y = 2x + 1 into x + y = 7
Step 2: x + (2x + 1) = 7
Step 3: 3x + 1 = 7, so 3x = 6, x = 2
Step 4: y = 2(2) + 1 = 5
Solution: (2, 5)

Elimination Method:
1. Multiply equations so one variable has the same coefficient
2. Add or subtract to eliminate that variable
3. Solve and substitute back`,
    keyPoints: [
      "Simultaneous equations share the same variables",
      "Solution is where both equations are true",
      "Use substitution when one variable is already isolated",
      "Use elimination when coefficients can be matched"
    ]
  },
  7: {
    title: "Expanding and Factorising",
    content: `Expanding means removing brackets by multiplying. Factorising means putting brackets back in - it's the reverse of expanding.

Expanding single brackets: Multiply the term outside by each term inside.
3(x + 4) = 3x + 12
-2(y - 5) = -2y + 10

Expanding double brackets using FOIL:
(x + 2)(x + 3)
First: x × x = x²
Outer: x × 3 = 3x
Inner: 2 × x = 2x
Last: 2 × 3 = 6
Result: x² + 3x + 2x + 6 = x² + 5x + 6

Common factorising:
Find the highest common factor (HCF) of all terms.
6x + 9 = 3(2x + 3)
4x² - 8x = 4x(x - 2)

Factorising quadratics (x² + bx + c):
Find two numbers that multiply to c and add to b.
x² + 7x + 12 = (x + 3)(x + 4)
because 3 × 4 = 12 and 3 + 4 = 7`,
    keyPoints: [
      "Expanding removes brackets by multiplying",
      "FOIL: First, Outer, Inner, Last for double brackets",
      "Factorising is the reverse of expanding",
      "For x² + bx + c, find numbers that multiply to c, add to b"
    ]
  },
  8: {
    title: "Introduction to Quadratic Equations",
    content: `A quadratic equation has the form ax² + bx + c = 0, where a ≠ 0. The highest power of x is 2, which creates a U-shaped curve called a parabola when graphed.

Solving by Factorising:
1. Write the equation in standard form (= 0)
2. Factorise the quadratic expression
3. Set each bracket equal to zero
4. Solve for x

Example: x² + 5x + 6 = 0
Step 1: Factorise: (x + 2)(x + 3) = 0
Step 2: Either x + 2 = 0 or x + 3 = 0
Step 3: x = -2 or x = -3

Why two answers? A quadratic can cross the x-axis at two points, one point, or no points.

Special cases:
- x² - 9 = 0 → (x + 3)(x - 3) = 0 → x = ±3 (difference of squares)
- x² - 6x = 0 → x(x - 6) = 0 → x = 0 or x = 6 (common factor)
- x² + 4 = 0 has no real solutions (can't square to get negative)`,
    keyPoints: [
      "Quadratic equations have x² as highest power",
      "Graph as U-shaped parabola",
      "Factorise and set each bracket to zero",
      "Usually have two solutions"
    ]
  },
  9: {
    title: "The Quadratic Formula",
    content: `When a quadratic equation cannot be easily factorised, use the quadratic formula:

x = (-b ± √(b² - 4ac)) / 2a

For the equation ax² + bx + c = 0, identify a, b, and c, then substitute into the formula.

Example: 2x² + 5x - 3 = 0
Here: a = 2, b = 5, c = -3

x = (-5 ± √(25 - 4(2)(-3))) / (2 × 2)
x = (-5 ± √(25 + 24)) / 4
x = (-5 ± √49) / 4
x = (-5 ± 7) / 4

x = (-5 + 7)/4 = 2/4 = 0.5
or x = (-5 - 7)/4 = -12/4 = -3

The Discriminant (b² - 4ac) tells us about solutions:
- If > 0: two different real solutions
- If = 0: one repeated solution (touches x-axis once)
- If < 0: no real solutions (parabola doesn't cross x-axis)`,
    keyPoints: [
      "Formula: x = (-b ± √(b² - 4ac)) / 2a",
      "Identify a, b, c from ax² + bx + c = 0",
      "The ± gives two possible solutions",
      "Discriminant determines number of solutions"
    ]
  },
  10: {
    title: "Pythagoras' Theorem",
    content: `Pythagoras' Theorem applies to right-angled triangles only. It states that the square of the hypotenuse equals the sum of squares of the other two sides.

a² + b² = c²

The hypotenuse (c) is always the longest side, opposite the right angle.

Finding the hypotenuse:
If a = 3 and b = 4:
c² = 3² + 4² = 9 + 16 = 25
c = √25 = 5

Finding a shorter side:
If c = 13 and a = 5:
b² = c² - a² = 169 - 25 = 144
b = √144 = 12

Real-world applications:
- Finding distances on maps
- Checking if corners are right angles
- Calculating diagonal lengths
- Height and distance problems

Pythagorean triples are whole number sets that work perfectly:
3, 4, 5 | 5, 12, 13 | 8, 15, 17 | 7, 24, 25`,
    keyPoints: [
      "Only works for right-angled triangles",
      "a² + b² = c² where c is the hypotenuse",
      "Hypotenuse is longest side, opposite the right angle",
      "Take square root as the final step"
    ]
  },
  11: {
    title: "Introduction to Trigonometry",
    content: `Trigonometry studies the relationships between angles and sides in right-angled triangles. The three main ratios are sine, cosine, and tangent.

For any angle θ in a right triangle:
- Opposite side: across from the angle
- Adjacent side: next to the angle (not the hypotenuse)
- Hypotenuse: longest side, opposite the right angle

The ratios - remember SOH CAH TOA:
sin θ = Opposite / Hypotenuse (SOH)
cos θ = Adjacent / Hypotenuse (CAH)
tan θ = Opposite / Adjacent (TOA)

Example: In a triangle with angle 30°, opposite = 5, hypotenuse = 10
sin 30° = 5/10 = 0.5

Finding a side:
If θ = 40° and hypotenuse = 15, find opposite:
sin 40° = opposite/15
opposite = 15 × sin 40° = 15 × 0.643 = 9.64

Finding an angle:
If opposite = 7 and hypotenuse = 10:
sin θ = 7/10 = 0.7
θ = sin⁻¹(0.7) = 44.4°`,
    keyPoints: [
      "SOH CAH TOA - sine, cosine, tangent ratios",
      "Identify opposite, adjacent, hypotenuse from the angle",
      "Use calculator for trig values",
      "Inverse trig functions find angles from ratios"
    ]
  },
  12: {
    title: "Applications of Trigonometry",
    content: `Trigonometry has many practical applications for measuring heights, distances, and angles in real-world situations.

Angles of elevation and depression:
- Angle of elevation: looking UP from horizontal
- Angle of depression: looking DOWN from horizontal
These are always measured from the horizontal line.

Problem-solving approach:
1. Draw a clear diagram
2. Mark the right angle
3. Label known sides and angles
4. Choose the appropriate ratio (SOH CAH TOA)
5. Set up and solve the equation

Example: A ladder leans against a wall. If the ladder is 5m long and makes a 70° angle with the ground, how high up the wall does it reach?

Draw the triangle: hypotenuse = 5m, angle = 70°, finding opposite (height)
sin 70° = height/5
height = 5 × sin 70° = 5 × 0.940 = 4.7m

Always check: Does the answer make sense? The height should be less than the ladder length.`,
    keyPoints: [
      "Elevation = looking up, Depression = looking down",
      "Always draw a diagram first",
      "Choose the right ratio based on given information",
      "Check if your answer is reasonable"
    ]
  },
  13: {
    title: "Statistics: Data Collection and Representation",
    content: `Statistics involves collecting, organising, displaying, and interpreting data to understand patterns and make decisions.

Types of data:
- Categorical (qualitative): labels or categories (colours, names)
- Numerical (quantitative): numbers you can calculate with
  - Discrete: counted values (number of students)
  - Continuous: measured values (height, weight)

Data collection methods:
- Surveys and questionnaires
- Observations
- Experiments
- Census (entire population) vs Sample (subset)

Displaying data:
- Bar graphs: categorical data, compare frequencies
- Histograms: continuous numerical data, bars touch
- Pie charts: show proportions of a whole
- Stem-and-leaf plots: show distribution while keeping original values
- Scatter plots: relationship between two numerical variables

Choosing the right graph depends on your data type and what you want to show. Bar graphs compare categories, histograms show distributions, and scatter plots reveal relationships.`,
    keyPoints: [
      "Categorical vs Numerical (discrete/continuous)",
      "Choose appropriate graphs for data type",
      "Histograms for continuous data, bars touch",
      "Scatter plots show relationships between variables"
    ]
  },
  14: {
    title: "Measures of Centre and Spread",
    content: `Measures of centre describe the 'typical' value in a dataset. The three main measures are mean, median, and mode.

Mean (average): Add all values and divide by how many there are.
Example: 3, 5, 7, 8, 12 → Mean = (3+5+7+8+12)/5 = 35/5 = 7

Median: The middle value when data is ordered.
For odd count: middle number
For even count: average of two middle numbers
Example: 3, 5, 7, 8, 12 → Median = 7 (middle value)

Mode: Most frequent value. There can be no mode, one mode, or multiple modes.

Choosing the right measure:
- Mean is affected by extreme values (outliers)
- Median is resistant to outliers - better for skewed data
- Mode is useful for categorical data

Measures of spread show how spread out data is:
- Range = highest - lowest (simple but affected by outliers)
- Interquartile Range (IQR) = Q3 - Q1 (middle 50% of data)
- Standard deviation measures average distance from mean`,
    keyPoints: [
      "Mean = sum of values ÷ number of values",
      "Median = middle value when ordered",
      "Median is better when outliers exist",
      "Range and IQR measure spread of data"
    ]
  },
  15: {
    title: "Probability Fundamentals",
    content: `Probability measures how likely an event is to occur, expressed as a number between 0 and 1 (or 0% to 100%).

Probability = Number of favourable outcomes / Total number of outcomes

Probability scale:
- 0 = impossible
- 0.5 = equally likely (50-50)
- 1 = certain

Example: Rolling a standard die
P(rolling a 4) = 1/6 (one 4 out of 6 numbers)
P(rolling even) = 3/6 = 1/2 (three even numbers: 2, 4, 6)
P(rolling less than 7) = 6/6 = 1 (certain)

Complement: P(not A) = 1 - P(A)
If P(rain) = 0.3, then P(no rain) = 1 - 0.3 = 0.7

Independent events: One doesn't affect the other.
P(A and B) = P(A) × P(B) for independent events

Example: Flipping heads twice
P(H and H) = 1/2 × 1/2 = 1/4`,
    keyPoints: [
      "Probability ranges from 0 (impossible) to 1 (certain)",
      "P = favourable outcomes / total outcomes",
      "Complement: P(not A) = 1 - P(A)",
      "Independent events: multiply probabilities"
    ]
  },
  16: {
    title: "Area and Volume",
    content: `Area measures the space inside a 2D shape. Volume measures the space inside a 3D object.

Area formulas:
- Rectangle: A = length × width
- Triangle: A = (1/2) × base × height
- Parallelogram: A = base × height
- Trapezium: A = (1/2) × (a + b) × height
- Circle: A = πr²

Volume formulas:
- Rectangular prism: V = length × width × height
- Cylinder: V = πr²h
- Triangular prism: V = (1/2) × base × height × length
- Sphere: V = (4/3)πr³
- Cone: V = (1/3)πr²h

Surface area is the total area of all surfaces of a 3D shape.
- Rectangular prism: SA = 2(lw + lh + wh)
- Cylinder: SA = 2πr² + 2πrh

Always include units! Area is in square units (cm², m²), volume is in cubic units (cm³, m³).`,
    keyPoints: [
      "Area is 2D (square units), Volume is 3D (cubic units)",
      "Circle area: A = πr²",
      "Cylinder volume: V = πr²h",
      "Always include appropriate units"
    ]
  },
  17: {
    title: "Review and Exam Preparation",
    content: `This week focuses on consolidating all the concepts learned throughout the semester. Effective revision strategies will help you prepare for exams.

Key topics to review:
1. Algebra: Solving equations, expanding, factorising
2. Linear graphs: Gradient, y-intercept, equation of a line
3. Quadratics: Factorising, quadratic formula, parabolas
4. Pythagoras and Trigonometry: Finding sides and angles
5. Statistics: Mean, median, mode, graphing data
6. Probability: Calculating probabilities, tree diagrams
7. Measurement: Area and volume formulas

Exam strategies:
- Read each question carefully
- Show all working - partial marks are awarded
- Check units are consistent
- Use diagrams where helpful
- Check answers make sense
- Attempt every question

Practice with past papers and identify any weak areas for extra focus. Remember: understanding concepts is more important than memorising formulas.`,
    keyPoints: [
      "Review all major topics systematically",
      "Practice past exam questions",
      "Show all working for partial marks",
      "Check that answers are reasonable"
    ]
  }
};

const scienceReadingByWeek: Record<number, ReadingContent> = {
  1: {
    title: "Introduction to Cells: The Building Blocks of Life",
    content: `All living things are made of cells - the smallest units of life. Cells were first discovered by Robert Hooke in 1665 when he looked at cork through a microscope.

Cell Theory states:
1. All living things are made of one or more cells
2. Cells are the basic unit of structure and function
3. All cells come from pre-existing cells

There are two main types of cells:
Prokaryotic cells (bacteria) - simple, no membrane-bound nucleus
Eukaryotic cells (plants, animals, fungi) - complex, have a true nucleus

Key cell organelles:
- Cell membrane: Controls what enters and exits the cell
- Nucleus: Contains DNA, controls cell activities
- Cytoplasm: Jelly-like substance where chemical reactions occur
- Mitochondria: Produces energy through cellular respiration
- Ribosomes: Makes proteins
- Endoplasmic Reticulum: Transports materials within cell
- Golgi body: Packages and distributes proteins

Plant cells have additional structures:
- Cell wall: Provides rigid support and protection
- Chloroplasts: Site of photosynthesis (contain chlorophyll)
- Large central vacuole: Stores water and maintains pressure`,
    keyPoints: [
      "All living things are made of cells",
      "Prokaryotic cells lack a nucleus, eukaryotic cells have one",
      "Mitochondria produce energy (ATP)",
      "Plant cells have cell walls and chloroplasts"
    ]
  },
  2: {
    title: "Cell Transport: Diffusion and Osmosis",
    content: `Cells need to exchange materials with their environment to survive. This happens through the cell membrane, which is selectively permeable - allowing some substances through while blocking others.

Diffusion is the movement of particles from an area of high concentration to low concentration. It's a passive process (requires no energy).

Examples of diffusion:
- Oxygen moving from lungs into blood
- Carbon dioxide leaving cells
- Perfume spreading through a room

Osmosis is a special type of diffusion - the movement of water molecules through a selectively permeable membrane from high water concentration to low water concentration.

Effects on cells:
- Hypotonic solution (more water outside): Water enters cell, cell swells
  - Animal cells may burst (lysis)
  - Plant cells become turgid (firm)
- Hypertonic solution (less water outside): Water leaves cell, cell shrinks
  - Animal cells shrivel (crenation)
  - Plant cells become flaccid or plasmolysed
- Isotonic solution (equal concentration): No net water movement

Active transport requires energy (ATP) to move substances against the concentration gradient - from low to high concentration.`,
    keyPoints: [
      "Diffusion: high to low concentration, no energy required",
      "Osmosis: water movement through a membrane",
      "Cells swell in hypotonic, shrink in hypertonic solutions",
      "Active transport uses energy to move against gradient"
    ]
  },
  3: {
    title: "Photosynthesis: How Plants Make Food",
    content: `Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. This process is essential for life on Earth.

The equation for photosynthesis:
Carbon dioxide + Water → Glucose + Oxygen
6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂
(This requires light energy and chlorophyll)

Where it happens: Chloroplasts in plant cells contain chlorophyll, the green pigment that captures light energy.

Requirements for photosynthesis:
1. Light (usually sunlight)
2. Carbon dioxide (from the air, enters through stomata)
3. Water (absorbed by roots from soil)
4. Chlorophyll (in chloroplasts)

The rate of photosynthesis is affected by:
- Light intensity: More light = faster rate (up to a point)
- Carbon dioxide concentration: More CO₂ = faster rate
- Temperature: Optimal around 25-35°C, too hot damages enzymes
- Water availability: Drought slows photosynthesis

Importance of photosynthesis:
- Produces oxygen we breathe
- Produces glucose for plant growth
- Forms base of most food chains
- Removes CO₂ from atmosphere`,
    keyPoints: [
      "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
      "Occurs in chloroplasts using chlorophyll",
      "Needs light, CO₂, water, and chlorophyll",
      "Produces glucose for energy and oxygen as byproduct"
    ]
  },
  4: {
    title: "Cellular Respiration: Releasing Energy",
    content: `Cellular respiration is the process of breaking down glucose to release energy. This energy is stored in molecules called ATP (adenosine triphosphate), which cells use for all their activities.

The equation for aerobic respiration:
Glucose + Oxygen → Carbon dioxide + Water + Energy
C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP

This is essentially the reverse of photosynthesis!

Aerobic respiration (with oxygen):
- Occurs in mitochondria
- Produces large amounts of ATP (about 36-38 per glucose)
- More efficient than anaerobic respiration
- Products: CO₂ and H₂O

Anaerobic respiration (without oxygen):
In animals: Glucose → Lactic acid + Small amount of ATP
- Occurs during intense exercise
- Causes muscle fatigue and cramps
- "Oxygen debt" must be repaid afterward

In yeast (fermentation): Glucose → Ethanol + Carbon dioxide + Small amount of ATP
- Used in bread making (CO₂ makes dough rise)
- Used in alcohol production

All living cells perform cellular respiration - it's not just breathing!`,
    keyPoints: [
      "Respiration breaks down glucose to release ATP energy",
      "Aerobic respiration needs oxygen, produces most ATP",
      "Anaerobic respiration: no oxygen, produces lactic acid or ethanol",
      "Occurs in mitochondria (aerobic) or cytoplasm (anaerobic)"
    ]
  },
  5: {
    title: "DNA and Genes: The Blueprint of Life",
    content: `DNA (deoxyribonucleic acid) is the molecule that carries genetic information in all living things. It's found in the nucleus of eukaryotic cells.

Structure of DNA:
- Double helix: twisted ladder shape
- Made of nucleotides (building blocks)
- Each nucleotide has: sugar, phosphate, and a base
- Four bases: Adenine (A), Thymine (T), Guanine (G), Cytosine (C)
- Base pairing rules: A pairs with T, G pairs with C

Genes and chromosomes:
- A gene is a section of DNA that codes for a specific protein
- Chromosomes are long strands of DNA coiled with proteins
- Humans have 46 chromosomes (23 pairs)
- Genes are located at specific positions on chromosomes

DNA → RNA → Protein:
1. DNA is copied (transcription) into messenger RNA (mRNA)
2. mRNA travels to ribosomes
3. Ribosomes read mRNA and build proteins (translation)
4. Proteins carry out functions in the cell

Genetic code:
- Three bases (codon) code for one amino acid
- Amino acids join to form proteins
- Proteins determine our traits`,
    keyPoints: [
      "DNA is a double helix made of nucleotides",
      "Base pairing: A-T and G-C",
      "Genes are sections of DNA that code for proteins",
      "Humans have 46 chromosomes (23 pairs)"
    ]
  },
  6: {
    title: "Cell Division: Mitosis and Meiosis",
    content: `Cells reproduce by dividing. There are two types of cell division: mitosis and meiosis.

Mitosis produces identical copies of cells:
- Used for growth, repair, and asexual reproduction
- One cell divides into two identical daughter cells
- Same number of chromosomes as parent (46 in humans)
- Stages: Prophase, Metaphase, Anaphase, Telophase

Mitosis stages:
1. Interphase: Cell prepares, DNA replicates
2. Prophase: Chromosomes condense, nuclear membrane breaks down
3. Metaphase: Chromosomes line up in middle
4. Anaphase: Chromosomes separate and move to opposite poles
5. Telophase: Nuclear membranes reform, cell divides (cytokinesis)

Meiosis produces sex cells (gametes):
- Used for sexual reproduction only
- One cell divides into four different daughter cells
- Half the chromosomes of parent (23 in human gametes)
- Two divisions: Meiosis I and Meiosis II
- Creates genetic variation through crossing over and random assortment

When egg (23) and sperm (23) combine at fertilisation, the resulting zygote has 46 chromosomes again.`,
    keyPoints: [
      "Mitosis: 1 cell → 2 identical cells (same chromosomes)",
      "Meiosis: 1 cell → 4 different cells (half chromosomes)",
      "Mitosis for growth/repair, Meiosis for reproduction",
      "Meiosis creates genetic variation"
    ]
  },
  7: {
    title: "Genetics and Inheritance",
    content: `Genetics is the study of heredity - how traits are passed from parents to offspring. Gregor Mendel discovered the basic principles of inheritance by studying pea plants.

Key terms:
- Alleles: Different versions of a gene (e.g., brown eye allele, blue eye allele)
- Dominant allele: Shows its effect even with one copy (capital letter: B)
- Recessive allele: Only shows effect with two copies (lowercase: b)
- Genotype: The alleles an organism has (BB, Bb, or bb)
- Phenotype: The physical appearance (brown eyes)
- Homozygous: Two of the same allele (BB or bb)
- Heterozygous: Two different alleles (Bb)

Punnett Squares predict offspring genotypes:
If both parents are Bb (heterozygous):
        B       b
   B   BB      Bb
   b   Bb      bb

Results: 25% BB, 50% Bb, 25% bb
Phenotype ratio: 3 dominant : 1 recessive

Some traits follow more complex patterns:
- Incomplete dominance: blend of traits
- Codominance: both alleles expressed equally
- Multiple alleles: more than two versions (like blood types)`,
    keyPoints: [
      "Alleles are different versions of genes",
      "Dominant alleles mask recessive alleles",
      "Genotype = genetic makeup, Phenotype = physical trait",
      "Punnett squares predict offspring ratios"
    ]
  },
  8: {
    title: "Evolution and Natural Selection",
    content: `Evolution is the change in inherited characteristics of populations over generations. Charles Darwin proposed the theory of evolution by natural selection in 1859.

Natural selection works through:
1. Variation: Individuals in a population have different traits
2. Overproduction: More offspring are born than can survive
3. Competition: Individuals compete for limited resources
4. Survival of the fittest: Those with advantageous traits survive
5. Reproduction: Survivors pass on their beneficial traits
6. Gradual change: Over many generations, populations change

Evidence for evolution:
- Fossil record: Shows change over time
- Comparative anatomy: Similar bone structures (homologous structures)
- Embryology: Similar early development stages
- DNA comparisons: Genetic similarities between species
- Direct observation: Bacteria developing antibiotic resistance

Types of selection:
- Directional: Favours one extreme phenotype
- Stabilising: Favours average phenotype
- Disruptive: Favours both extreme phenotypes

Speciation occurs when populations become so different they can no longer interbreed, forming new species.`,
    keyPoints: [
      "Evolution is change in populations over time",
      "Natural selection: survival and reproduction of fittest",
      "Evidence: fossils, comparative anatomy, DNA",
      "Speciation creates new species over time"
    ]
  },
  9: {
    title: "Classification and Biodiversity",
    content: `Classification (taxonomy) is the system of organising living things into groups based on shared characteristics. This helps scientists study and communicate about organisms.

The classification hierarchy (from broadest to narrowest):
Kingdom → Phylum → Class → Order → Family → Genus → Species
"King Philip Came Over For Good Soup"

The five kingdoms (traditional):
1. Animalia: Multicellular, eat other organisms
2. Plantae: Multicellular, photosynthesise
3. Fungi: Absorb nutrients from dead/decaying matter
4. Protista: Mostly single-celled eukaryotes
5. Monera: Prokaryotes (bacteria)

Scientific naming (binomial nomenclature):
- Genus + species (e.g., Homo sapiens)
- Written in italics, genus capitalised
- Created by Carl Linnaeus

Modern classification uses:
- Evolutionary relationships (phylogeny)
- DNA and molecular analysis
- Three domains: Bacteria, Archaea, Eukarya

Biodiversity refers to the variety of life on Earth. High biodiversity is important for:
- Ecosystem stability
- Food security
- Medicine discovery
- Economic value`,
    keyPoints: [
      "Classification groups organisms by shared features",
      "Kingdom → Phylum → Class → Order → Family → Genus → Species",
      "Scientific names: Genus species (italicised)",
      "Biodiversity is variety of life, essential for ecosystems"
    ]
  },
  10: {
    title: "Ecosystems and Food Webs",
    content: `An ecosystem is a community of living organisms (biotic factors) interacting with their physical environment (abiotic factors).

Abiotic factors: Temperature, light, water, soil pH, minerals
Biotic factors: All living things - plants, animals, bacteria, fungi

Energy flow in ecosystems:
- Producers (autotrophs): Make their own food through photosynthesis
- Primary consumers (herbivores): Eat producers
- Secondary consumers (carnivores): Eat primary consumers
- Tertiary consumers: Top predators
- Decomposers: Break down dead organisms

Food chains show single pathways of energy transfer.
Food webs show multiple interconnected food chains.

Energy pyramid:
- Only about 10% of energy transfers to each level
- Rest is lost as heat through respiration
- Limits the number of trophic levels (usually 4-5)

Nutrient cycling:
- Carbon cycle: CO₂ → photosynthesis → respiration → decomposition
- Nitrogen cycle: N₂ → bacteria → plants → animals → decomposition
- Water cycle: Evaporation → condensation → precipitation

Human impacts on ecosystems: pollution, deforestation, overfishing, climate change.`,
    keyPoints: [
      "Ecosystems include biotic and abiotic factors",
      "Energy flows: producers → consumers → decomposers",
      "Only ~10% of energy transfers to each level",
      "Nutrients cycle through ecosystems continuously"
    ]
  },
  11: {
    title: "The Periodic Table and Atomic Structure",
    content: `All matter is made of atoms. Understanding atomic structure helps us explain chemical properties and reactions.

Parts of an atom:
- Protons: Positive charge, in nucleus, determines the element
- Neutrons: No charge, in nucleus, affects mass
- Electrons: Negative charge, orbit the nucleus in shells

Key numbers:
- Atomic number: Number of protons (defines the element)
- Mass number: Protons + neutrons
- Number of electrons = number of protons (in neutral atoms)

Electron shells:
- First shell: Maximum 2 electrons
- Second shell: Maximum 8 electrons
- Third shell: Maximum 8 electrons (for first 20 elements)

The Periodic Table:
- Arranged by increasing atomic number
- Rows (periods): Same number of electron shells
- Columns (groups): Same number of outer electrons
- Group number = number of outer electrons
- Outer electrons determine chemical properties

Key groups:
- Group 1 (Alkali metals): 1 outer electron, very reactive
- Group 7 (Halogens): 7 outer electrons, reactive non-metals
- Group 0/18 (Noble gases): Full outer shell, unreactive`,
    keyPoints: [
      "Atoms have protons (+), neutrons (0), electrons (-)",
      "Atomic number = protons, defines the element",
      "Electrons fill shells: 2, 8, 8...",
      "Group number = outer electrons, determines properties"
    ]
  },
  12: {
    title: "Chemical Bonding",
    content: `Atoms bond together to achieve a full outer electron shell (usually 8 electrons, or 2 for the first shell). This is called the octet rule.

Ionic bonding:
- Metal + Non-metal
- Electrons are transferred from metal to non-metal
- Creates charged ions that attract each other
- Example: Na gives 1 electron to Cl → Na⁺Cl⁻ (sodium chloride)

Properties of ionic compounds:
- High melting and boiling points
- Conduct electricity when molten or dissolved (ions can move)
- Form crystal lattice structures
- Usually dissolve in water

Covalent bonding:
- Non-metal + Non-metal
- Electrons are shared between atoms
- Forms molecules
- Example: H₂O - oxygen shares electrons with two hydrogens

Properties of covalent compounds:
- Lower melting and boiling points
- Do not conduct electricity (no free ions or electrons)
- Can be gases, liquids, or soft solids

Metallic bonding:
- Metal atoms in a sea of delocalised electrons
- Explains conductivity, malleability, ductility`,
    keyPoints: [
      "Ionic bonds: electrons transferred, metal + non-metal",
      "Covalent bonds: electrons shared, non-metal + non-metal",
      "Ionic compounds: high melting point, conduct when dissolved",
      "Covalent compounds: lower melting point, don't conduct"
    ]
  },
  13: {
    title: "Chemical Reactions and Equations",
    content: `A chemical reaction occurs when substances (reactants) are transformed into new substances (products) with different properties.

Signs of a chemical reaction:
- Colour change
- Gas bubbles produced
- Temperature change (heat released or absorbed)
- Precipitate forms (solid from mixing liquids)
- Light or sound produced

Writing chemical equations:
Reactants → Products
Word equation: Hydrogen + Oxygen → Water
Symbol equation: 2H₂ + O₂ → 2H₂O

Balancing equations:
- Same number of each atom on both sides
- Conservation of mass: matter cannot be created or destroyed
- Only change coefficients (numbers in front), never subscripts

Types of reactions:
- Synthesis: A + B → AB
- Decomposition: AB → A + B
- Single replacement: A + BC → AC + B
- Double replacement: AB + CD → AD + CB
- Combustion: Fuel + O₂ → CO₂ + H₂O
- Neutralisation: Acid + Base → Salt + Water

Reaction rates depend on: temperature, concentration, surface area, catalysts.`,
    keyPoints: [
      "Chemical reactions form new substances",
      "Equations must be balanced - same atoms each side",
      "Conservation of mass: nothing created or destroyed",
      "Types: synthesis, decomposition, combustion, neutralisation"
    ]
  },
  14: {
    title: "Acids and Bases",
    content: `Acids and bases are important chemicals with opposite properties. Their strength is measured using the pH scale.

The pH scale:
- Ranges from 0 to 14
- pH 0-6: Acidic (lower = stronger acid)
- pH 7: Neutral (pure water)
- pH 8-14: Basic/Alkaline (higher = stronger base)

Common acids:
- Hydrochloric acid (HCl): stomach acid
- Sulfuric acid (H₂SO₄): car batteries
- Citric acid: citrus fruits
- Carbonic acid: fizzy drinks

Common bases:
- Sodium hydroxide (NaOH): drain cleaner
- Calcium hydroxide (Ca(OH)₂): lime
- Ammonia (NH₃): cleaning products
- Baking soda (NaHCO₃)

Properties:
Acids: Taste sour, turn litmus red, react with metals to produce hydrogen
Bases: Taste bitter, feel slippery, turn litmus blue

Neutralisation:
Acid + Base → Salt + Water
HCl + NaOH → NaCl + H₂O
The products are neutral - pH moves toward 7.

Applications: Treating acid spills, antacids for heartburn, soil treatment.`,
    keyPoints: [
      "pH scale: 0-6 acidic, 7 neutral, 8-14 basic",
      "Acids donate H⁺ ions, bases donate OH⁻ ions",
      "Neutralisation: Acid + Base → Salt + Water",
      "Indicators change colour to show pH"
    ]
  },
  15: {
    title: "Forces and Motion",
    content: `Force is a push or pull that can change an object's motion, shape, or direction. Forces are measured in Newtons (N).

Types of forces:
- Gravity: Pulls objects toward Earth (weight = mass × g)
- Friction: Opposes motion between surfaces
- Normal force: Perpendicular support force from surface
- Tension: Force in stretched strings/ropes
- Applied force: Push or pull from contact

Newton's Laws of Motion:
1. Law of Inertia: An object stays at rest or in constant motion unless acted on by a force
2. F = ma: Force equals mass times acceleration
3. Action-Reaction: For every action, there's an equal and opposite reaction

Balanced vs Unbalanced forces:
- Balanced: Equal forces in opposite directions, no change in motion
- Unbalanced: Net force in one direction, causes acceleration

Speed = distance / time (m/s)
Velocity = speed with direction
Acceleration = change in velocity / time (m/s²)

Free body diagrams show all forces acting on an object with arrows indicating direction and magnitude.`,
    keyPoints: [
      "Force can change motion, shape, or direction",
      "Newton's 2nd Law: F = ma",
      "Balanced forces: no acceleration",
      "Unbalanced forces: cause acceleration"
    ]
  },
  16: {
    title: "Energy Transfer and Transformation",
    content: `Energy is the ability to do work. It cannot be created or destroyed, only transferred or transformed (Law of Conservation of Energy).

Types of energy:
- Kinetic: Energy of motion
- Potential: Stored energy (gravitational, elastic, chemical)
- Thermal: Heat energy from particle movement
- Electrical: Energy from moving charges
- Light (radiant): Energy from electromagnetic waves
- Sound: Energy from vibrations
- Nuclear: Energy stored in atomic nuclei

Energy transformations:
- Solar panel: Light → Electrical
- Car engine: Chemical → Kinetic + Thermal
- Speaker: Electrical → Sound
- Hydroelectric dam: Gravitational potential → Kinetic → Electrical
- Photosynthesis: Light → Chemical

Energy efficiency:
Efficiency = (useful energy output / total energy input) × 100%

No machine is 100% efficient - some energy is always "lost" as heat.

Renewable vs Non-renewable energy sources:
Renewable: Solar, wind, hydro, geothermal (replenished naturally)
Non-renewable: Fossil fuels, nuclear (limited supply)`,
    keyPoints: [
      "Energy cannot be created or destroyed",
      "Forms: kinetic, potential, thermal, electrical, light, sound",
      "Energy transforms from one form to another",
      "Efficiency = useful output / total input × 100%"
    ]
  },
  17: {
    title: "Science Review and Connections",
    content: `This week we consolidate our understanding of the major themes in science and see how different concepts connect.

Connections between topics:
- Cells use energy from respiration (chemical reactions)
- Photosynthesis and respiration are reverse processes
- DNA codes for proteins that catalyse chemical reactions (enzymes)
- Evolution is driven by genetic variation (DNA mutations)
- Ecosystems rely on energy transfer and nutrient cycling
- Chemical reactions in organisms maintain homeostasis

The scientific method:
1. Observation: Notice something interesting
2. Question: Ask what, why, or how
3. Hypothesis: Make a testable prediction
4. Experiment: Design a fair test with controlled variables
5. Analyse: Collect and interpret data
6. Conclusion: Accept or reject hypothesis
7. Communicate: Share findings with others

Key skills for science:
- Designing fair tests (control variables)
- Collecting accurate data
- Graphing and analysing results
- Drawing evidence-based conclusions
- Evaluating reliability and validity

Remember: Science is a process of inquiry and discovery. Keep asking questions!`,
    keyPoints: [
      "All science topics are interconnected",
      "Scientific method: observe, hypothesise, test, conclude",
      "Control variables for fair tests",
      "Base conclusions on evidence"
    ]
  }
};

const historyReadingByWeek: Record<number, ReadingContent> = {
  1: {
    title: "Introduction to Historical Inquiry",
    content: `History is the study of the past - the people, events, and forces that shaped our world. But history is more than just facts and dates. It's about understanding why things happened and how they connect to our present.

Primary and Secondary Sources:
Primary sources are created at the time being studied - diaries, photographs, letters, newspapers, speeches, artefacts. They give us direct evidence but may be biased.

Secondary sources are created later by historians who analyse primary sources - textbooks, documentaries, academic articles.

Evaluating sources - use OPCL:
O - Origin: Who created it? When and where?
P - Purpose: Why was it created? To inform, persuade, entertain?
C - Content: What does it say or show?
L - Limitation: What are its weaknesses? What's missing? Is there bias?

Historical perspectives:
Different people experience events differently based on their position, beliefs, and circumstances. A wealthy factory owner and a child worker would have very different views of the Industrial Revolution.

Cause and consequence:
Historical events have multiple causes (short-term triggers and long-term factors) and multiple consequences (immediate and lasting effects).`,
    keyPoints: [
      "Primary sources: created at the time (diaries, photos, letters)",
      "Secondary sources: created later by historians",
      "OPCL: Origin, Purpose, Content, Limitation",
      "Consider different perspectives on events"
    ]
  },
  2: {
    title: "Europe Before World War I",
    content: `By 1914, Europe was a powder keg waiting to explode. The major powers had built up tensions through alliances, military competition, and imperial rivalries.

The Great Powers:
- Britain: Largest empire, powerful navy
- France: Democratic republic, rivalry with Germany
- Germany: Newly unified (1871), growing industrial and military power
- Russia: Vast empire, autocratic rule, industrialising
- Austria-Hungary: Multi-ethnic empire with internal tensions
- Ottoman Empire: Declining power in Eastern Europe and Middle East

MAIN causes of WWI:
Militarism: Countries built up armies and weapons. Arms race between Britain and Germany.

Alliances: Europe divided into two armed camps:
- Triple Alliance: Germany, Austria-Hungary, Italy
- Triple Entente: France, Russia, Britain
An attack on one would bring others into war.

Imperialism: Competition for colonies in Africa and Asia caused tensions.

Nationalism: Pride in one's nation, desire for independence among ethnic groups in empires (especially Austria-Hungary and the Balkans).

The Balkans were called "the powder keg of Europe" - many ethnic groups seeking independence, competing interests of major powers.`,
    keyPoints: [
      "MAIN: Militarism, Alliances, Imperialism, Nationalism",
      "Europe divided into Triple Alliance and Triple Entente",
      "Arms race increased tensions between powers",
      "Balkans were politically unstable 'powder keg'"
    ]
  },
  3: {
    title: "The Outbreak of World War I",
    content: `On June 28, 1914, Archduke Franz Ferdinand of Austria-Hungary was assassinated in Sarajevo by Gavrilo Princip, a Serbian nationalist. This single event triggered a chain reaction that plunged Europe into war.

The chain of events:
1. Austria-Hungary blamed Serbia and issued an ultimatum
2. Serbia rejected some demands
3. Austria-Hungary declared war on Serbia (28 July)
4. Russia mobilised to support Serbia (Slavic ally)
5. Germany declared war on Russia (1 August)
6. Germany declared war on France (3 August)
7. Germany invaded Belgium to attack France
8. Britain declared war on Germany (4 August) - Belgium's neutrality was guaranteed by treaty

The Schlieffen Plan:
Germany's strategy to avoid fighting on two fronts:
- Quickly defeat France through Belgium in 6 weeks
- Then turn to fight Russia (slow to mobilise)
- The plan failed - France held, leading to stalemate

Why did so many countries join so quickly?
- Alliance obligations
- Fear of being left out or losing power
- Nationalist enthusiasm
- Belief the war would be short ("home by Christmas")

By August 1914, most of Europe was at war.`,
    keyPoints: [
      "Assassination of Franz Ferdinand triggered the war",
      "Alliance system caused rapid escalation",
      "Schlieffen Plan aimed for quick victory but failed",
      "Many believed war would be short"
    ]
  },
  4: {
    title: "Life in the Trenches",
    content: `After the failure of the Schlieffen Plan, the Western Front became a stalemate. Both sides dug trenches stretching from the English Channel to Switzerland - over 700km.

Trench structure:
- Front line trenches faced the enemy
- Support trenches behind held reserves
- Communication trenches connected them
- No Man's Land between opposing trenches

Conditions in the trenches:
- Mud: Constant flooding, soldiers stood in water for days
- Rats: Fed on corpses and food supplies
- Lice: Spread disease, constant itching
- Disease: Trench foot (from wet conditions), dysentery
- Smell: Dead bodies, sewage, unwashed soldiers
- Cold: Freezing winters with inadequate shelter
- Boredom: Long periods of waiting between attacks

The daily routine:
- "Stand to" at dawn and dusk (ready for attack)
- Sentry duty watching No Man's Land
- Repair trenches, fill sandbags
- Rest during the day
- Raids and attacks mostly at night

Psychological impact:
- Shell shock (now called PTSD)
- Constant fear of death
- Witnessing friends killed
- Censored mail couldn't express true feelings`,
    keyPoints: [
      "Trenches stretched 700km across Western Front",
      "Conditions: mud, rats, lice, disease, cold",
      "Soldiers suffered physical and psychological trauma",
      "Stalemate led to years of little territorial gain"
    ]
  },
  5: {
    title: "New Technology of World War I",
    content: `World War I introduced devastating new weapons that made the war deadlier than any previous conflict. The technology of killing outpaced the ability to protect soldiers.

Machine guns:
- Could fire 400-600 rounds per minute
- Mowed down soldiers charging across No Man's Land
- Made frontal attacks suicidal

Artillery:
- Massive guns bombarded trenches before attacks
- Caused the most casualties of any weapon
- Created the shell-cratered landscape of the Western Front
- Constant noise led to shell shock

Poison gas:
- First used by Germany at Ypres in 1915
- Types: chlorine, phosgene, mustard gas
- Caused blindness, choking, skin burns
- Gas masks became essential equipment

Tanks:
- First used by Britain at the Somme in 1916
- Could cross trenches and barbed wire
- Unreliable and slow at first
- Pointed to future of warfare

Aircraft:
- Initially used for reconnaissance
- Became fighters and bombers
- "Aces" like the Red Baron became famous
- Air warfare was born

Submarines (U-boats):
- Germany used U-boats to blockade Britain
- Unrestricted submarine warfare provoked the USA`,
    keyPoints: [
      "Machine guns made trench attacks deadly",
      "Artillery caused most WWI casualties",
      "Poison gas introduced chemical warfare",
      "Tanks and aircraft changed future warfare"
    ]
  },
  6: {
    title: "The Gallipoli Campaign",
    content: `The Gallipoli Campaign (1915-1916) was an attempt by Allied forces to open a new front against the Ottoman Empire and gain a sea route to Russia. For Australia and New Zealand, it became a defining moment in national identity.

The plan:
- Control the Dardanelles Strait (connecting Mediterranean to Black Sea)
- Capture Constantinople (Istanbul)
- Knock the Ottoman Empire out of the war
- Open supply route to Russia

The landing:
- April 25, 1915: ANZAC troops landed at Anzac Cove
- They faced steep cliffs and well-defended Turkish positions
- Instead of easy victory, they became trapped on narrow beaches

The campaign:
- Fighting in harsh conditions - heat, flies, disease
- Limited water and supplies
- Unable to break through Turkish defences
- Stalemate similar to Western Front

The evacuation:
- December 1915 - January 1916
- The most successful part of the campaign
- Troops evacuated secretly with minimal casualties

The cost:
- Over 8,000 Australian soldiers killed
- 2,700 New Zealand soldiers killed
- 21,000 British soldiers killed
- Turkish casualties: approximately 86,000 killed

ANZAC Day (April 25) commemorates this sacrifice and all who served.`,
    keyPoints: [
      "Gallipoli aimed to knock Ottoman Empire out of war",
      "ANZAC troops landed April 25, 1915",
      "Campaign failed but evacuation was successful",
      "Foundation of ANZAC legend and national identity"
    ]
  },
  7: {
    title: "The End of World War I",
    content: `By 1917, all sides were exhausted. The war had killed millions and bankrupted nations. New developments finally broke the stalemate.

Key events of 1917:
USA enters the war (April 1917):
- German unrestricted submarine warfare sank American ships
- The Zimmermann Telegram (Germany offered Mexico territory)
- Fresh American troops and resources tipped the balance

Russian Revolution (1917):
- Revolution overthrew the Tsar
- Communist government signed Treaty of Brest-Litovsk (March 1918)
- Russia left the war, freeing German troops for Western Front

1918 - The final year:
- Germany's Spring Offensive (March-July) nearly succeeded
- Allied Hundred Days Offensive pushed Germans back
- German allies collapsed: Bulgaria, Ottoman Empire, Austria-Hungary
- German Revolution forced the Kaiser to abdicate
- Armistice signed November 11, 1918 at 11am

The human cost:
- Over 10 million soldiers killed
- 20 million wounded
- Millions of civilian deaths
- Entire generation devastated
- Empires collapsed: German, Austrian, Russian, Ottoman

The world would never be the same.`,
    keyPoints: [
      "USA entered war in 1917, bringing fresh resources",
      "Russia left after Communist Revolution",
      "Armistice signed November 11, 1918",
      "Over 10 million soldiers killed worldwide"
    ]
  },
  8: {
    title: "The Treaty of Versailles",
    content: `The Paris Peace Conference began in January 1919. The Treaty of Versailles was signed on June 28, 1919 - exactly five years after Franz Ferdinand's assassination.

The Big Three:
- Georges Clemenceau (France): Wanted to punish Germany severely
- David Lloyd George (Britain): Wanted balance - punish but not crush
- Woodrow Wilson (USA): Wanted fair peace based on his Fourteen Points

Terms of the Treaty:
War Guilt: Germany accepted blame for causing the war (Article 231)

Reparations: Germany had to pay massive compensation (132 billion gold marks)

Territory losses:
- Alsace-Lorraine returned to France
- Polish Corridor gave Poland access to sea
- All overseas colonies taken
- Rhineland demilitarised

Military restrictions:
- Army limited to 100,000 soldiers
- No air force
- Navy severely limited
- No submarines or tanks

League of Nations:
- International organisation to prevent future wars
- Germany initially excluded
- USA never joined (Congress rejected it)

German reaction:
Germans felt the treaty was a "diktat" (dictated peace) - unfair and humiliating. This resentment would fuel the rise of Hitler and contribute to World War II.`,
    keyPoints: [
      "Germany blamed for war, forced to pay reparations",
      "Lost territory and colonies, military restricted",
      "League of Nations created but weakened without USA",
      "German resentment contributed to WWII"
    ]
  },
  9: {
    title: "The Interwar Period and Rise of Fascism",
    content: `The period between WWI and WWII (1919-1939) saw economic turmoil, political extremism, and the rise of dictatorships.

The Great Depression (1929-1939):
- Wall Street Crash (October 1929) triggered global economic collapse
- Unemployment soared - up to 25% in some countries
- Poverty, hunger, and desperation
- People lost faith in democratic governments

The Rise of Fascism:
Fascism promised strong leadership, national pride, and economic recovery.

Italy - Benito Mussolini:
- Seized power in 1922 (March on Rome)
- Created first fascist state
- Suppressed opposition, controlled media

Germany - Adolf Hitler:
- Nazi Party gained support during Depression
- Became Chancellor in 1933, then Führer in 1934
- Promised to restore German greatness
- Blamed Jews, communists for Germany's problems
- Began rearmament, defying Treaty of Versailles

Japan:
- Military leaders gained power
- Invaded Manchuria (1931), then China (1937)
- Aggressive expansion in Asia

Appeasement:
Britain and France tried to avoid war by accepting Hitler's demands (e.g., Munich Agreement 1938). This policy failed - Hitler kept demanding more.`,
    keyPoints: [
      "Great Depression caused economic devastation",
      "Fascist dictators rose: Mussolini, Hitler",
      "Hitler blamed Treaty of Versailles, promised restoration",
      "Appeasement failed to prevent war"
    ]
  },
  10: {
    title: "The Causes and Outbreak of World War II",
    content: `World War II began on September 1, 1939, when Germany invaded Poland. But the roots of the conflict lay in the aftermath of WWI and the failures of the interwar period.

Long-term causes:
- Treaty of Versailles: Created German resentment
- Great Depression: Brought extremists to power
- Failure of League of Nations: Couldn't stop aggression
- Appeasement: Encouraged Hitler to take more

Hitler's aggression:
1935: Reintroduced conscription (broke Treaty of Versailles)
1936: Remilitarised the Rhineland
1938: Anschluss - united with Austria
1938: Munich Agreement - given Sudetenland (Czechoslovakia)
1939: Took rest of Czechoslovakia
1939: Nazi-Soviet Pact with USSR

The Nazi-Soviet Pact (August 1939):
- Hitler and Stalin agreed not to attack each other
- Secretly planned to divide Poland
- Shocked the world - fascists and communists were enemies

The invasion of Poland:
- September 1, 1939: Germany invaded Poland using Blitzkrieg
- September 3, 1939: Britain and France declared war on Germany
- September 17: USSR invaded Poland from the east

World War II had begun. It would become the deadliest conflict in human history.`,
    keyPoints: [
      "WWII caused by Treaty of Versailles, Depression, appeasement",
      "Hitler broke treaty, expanded German territory",
      "Nazi-Soviet Pact allowed invasion of Poland",
      "Britain and France declared war September 3, 1939"
    ]
  },
  11: {
    title: "World War II: The Global Conflict",
    content: `World War II (1939-1945) was fought on multiple fronts across the globe, involving more nations and causing more destruction than any previous war.

The European Theatre:
1939-1940: German Blitzkrieg conquered Poland, Denmark, Norway, Belgium, Netherlands, France
1940: Battle of Britain - RAF defended against German air attacks
1941: Germany invaded USSR (Operation Barbarossa)
1942-1943: Stalingrad - turning point, Germans pushed back
1944: D-Day (June 6) - Allied invasion of Normandy
1945: Allies closed in from West (USA, Britain) and East (USSR)
May 8, 1945: V-E Day - Germany surrendered

The Pacific Theatre:
1937: Japan invaded China
1941: Pearl Harbor attack (December 7) - USA entered war
1942: Battle of Midway - turning point against Japan
1942-1945: Island-hopping campaign toward Japan
1945: Atomic bombs on Hiroshima and Nagasaki
August 15, 1945: V-J Day - Japan surrendered

Key Allied leaders:
- Winston Churchill (Britain)
- Franklin D. Roosevelt (USA)
- Joseph Stalin (USSR)

Axis powers:
- Germany, Italy, Japan`,
    keyPoints: [
      "Blitzkrieg brought quick German victories 1939-1941",
      "Stalingrad and Midway were turning points",
      "D-Day opened Western Front in Europe",
      "Atomic bombs ended war in Pacific"
    ]
  },
  12: {
    title: "The Holocaust",
    content: `The Holocaust was the systematic, state-sponsored persecution and murder of six million Jews by the Nazi regime. It stands as one of history's greatest tragedies and crimes against humanity.

Nazi ideology:
- Believed in racial hierarchy with "Aryans" at top
- Jews portrayed as enemies of Germany
- Other groups also targeted: Roma, disabled people, homosexuals, political opponents

Stages of persecution:
1933-1938: Discrimination
- Anti-Jewish laws (Nuremberg Laws 1935)
- Jews lost citizenship, jobs, property
- Kristallnacht (1938) - violent attacks on Jewish businesses and synagogues

1939-1941: Concentration
- Jews forced into ghettos
- Overcrowded, starvation conditions
- Deportations began

1942-1945: Extermination
- "Final Solution" decided at Wannsee Conference
- Death camps built: Auschwitz, Treblinka, Sobibor
- Mass murder in gas chambers

Resistance:
- Warsaw Ghetto Uprising (1943)
- Some individuals hid Jews at great personal risk
- Jewish partisans fought back

Liberation:
- Allies discovered camps as they advanced
- World shocked by evidence of genocide

We must remember the Holocaust to ensure it never happens again.`,
    keyPoints: [
      "Six million Jews murdered in systematic genocide",
      "Persecution escalated from discrimination to extermination",
      "Death camps like Auschwitz built for mass murder",
      "We must remember to prevent future genocides"
    ]
  },
  13: {
    title: "The Cold War Begins",
    content: `The Cold War (1947-1991) was a period of tension between the United States and the Soviet Union. Though they never fought directly, they competed through proxy wars, arms races, and propaganda.

Origins:
- Wartime allies became post-war rivals
- Fundamental ideological differences:
  - USA: Democracy, capitalism, individual freedom
  - USSR: Communism, state control, collective society

The Iron Curtain:
- Winston Churchill's term for the divide across Europe
- Eastern Europe: Soviet-controlled communist states
- Western Europe: Democratic, American-aligned

Key events:
1947: Truman Doctrine - USA would support countries resisting communism
1947: Marshall Plan - US economic aid to rebuild Western Europe
1948-1949: Berlin Blockade and Airlift
1949: NATO formed (Western military alliance)
1949: USSR tested atomic bomb
1955: Warsaw Pact formed (Soviet bloc alliance)

The nuclear arms race:
- Both superpowers built massive nuclear arsenals
- Mutually Assured Destruction (MAD) deterred direct conflict
- Fear of nuclear war pervaded society

Proxy wars:
- Korean War (1950-1953)
- Vietnam War (1955-1975)
- Various conflicts in Africa, Asia, Latin America`,
    keyPoints: [
      "Cold War: USA vs USSR ideological competition",
      "Iron Curtain divided Europe into East and West",
      "Nuclear arms race created MAD deterrence",
      "Proxy wars fought instead of direct conflict"
    ]
  },
  14: {
    title: "Rights and Freedoms Movements",
    content: `The post-WWII era saw powerful movements for civil rights, decolonisation, and equality around the world. People who had been denied basic rights fought for justice.

African American Civil Rights Movement (USA):
Key events:
- 1954: Brown v. Board of Education ended school segregation
- 1955: Montgomery Bus Boycott (Rosa Parks)
- 1963: March on Washington ("I Have a Dream" - MLK)
- 1964: Civil Rights Act banned discrimination
- 1965: Voting Rights Act protected voting rights

Leaders:
- Martin Luther King Jr.: Non-violent resistance, peaceful protest
- Malcolm X: More militant approach, Black pride
- Many ordinary people risked their lives

Decolonisation:
After WWII, European empires collapsed:
- India: Independence from Britain (1947)
- African nations: Ghana (1957), many others followed
- Asian nations gained independence
- Some transitions peaceful, others violent

Australian Indigenous Rights:
- 1962: Right to vote in federal elections
- 1967 Referendum: Indigenous people counted in census
- Land rights movements (Mabo 1992)
- Stolen Generations: Forced removal of Indigenous children
- 2008: National Apology by Prime Minister Kevin Rudd

These movements continue to inspire struggles for justice today.`,
    keyPoints: [
      "Civil rights movement fought racial discrimination in USA",
      "Decolonisation ended European empires",
      "1967 Referendum significant for Indigenous Australians",
      "Movements for rights continue today"
    ]
  },
  15: {
    title: "Australia's Changing Identity",
    content: `Australia's national identity has evolved significantly since 1945, shaped by immigration, Indigenous rights recognition, and changing international relationships.

Post-WWII Immigration:
- Australia needed population growth for defence and development
- "Populate or Perish" policy
- Initially preferred British migrants
- Displaced persons from Europe accepted
- Southern Europeans (Italians, Greeks) arrived 1950s-60s

End of White Australia Policy:
- 1966: Migration Act removed racial criteria
- 1973: Whitlam government officially ended policy
- Asia-Pacific immigration increased
- Australia became multicultural society

Multiculturalism:
- Recognition of cultural diversity as strength
- Policies supporting ethnic communities
- SBS, community language programs
- Food, music, festivals enriched Australian culture

Indigenous Recognition:
- 1967 Referendum: Yes vote allowed counting in census
- Land rights: Mabo (1992), Native Title Act (1993)
- Stolen Generations: Bringing Them Home Report (1997)
- 2008: National Apology
- Ongoing movements for constitutional recognition

Modern Australian Identity:
- Multicultural, diverse
- Connection to Indigenous heritage
- Part of Asia-Pacific region
- Still debating symbols (flag, national day)`,
    keyPoints: [
      "Post-WWII immigration transformed Australia",
      "White Australia Policy ended 1973",
      "Multiculturalism recognised as national strength",
      "Indigenous rights recognition ongoing"
    ]
  },
  16: {
    title: "Analysing Historical Sources",
    content: `Historians use sources as evidence to understand the past. Developing source analysis skills is essential for studying history.

Types of sources:
Written: Letters, diaries, newspapers, government documents, speeches
Visual: Photographs, paintings, posters, cartoons, films
Oral: Interviews, recorded testimonies
Physical: Artefacts, buildings, clothing, tools

Corroboration:
- Compare multiple sources about the same event
- Look for agreement and contradiction
- More sources supporting = more reliable claim

Reliability vs Usefulness:
- Reliability: How accurate and truthful is the source?
- Usefulness: How helpful is it for understanding a topic?
- Even biased sources can be useful for showing perspectives

Questions to ask:
1. Who created this? What was their perspective?
2. When was it created? During or after the event?
3. Why was it created? To inform, persuade, record?
4. What does it show or tell us?
5. What might be missing or left out?
6. How does it compare to other sources?

Constructing historical arguments:
- Make a claim (contention)
- Support with evidence from sources
- Analyse what the evidence shows
- Acknowledge limitations
- Consider different interpretations`,
    keyPoints: [
      "Use multiple sources for corroboration",
      "Consider origin, purpose, and bias",
      "Even biased sources can be useful",
      "Support arguments with evidence"
    ]
  },
  17: {
    title: "Humanities Review: Making Connections",
    content: `As we conclude this semester's study, let's connect the major themes and understand how historical events relate to our present world.

Key themes across the semester:
1. Cause and consequence: Events have multiple causes and lead to lasting effects
2. Continuity and change: Some things change dramatically, others persist
3. Perspectives: Different groups experience events differently
4. Significance: Some events shape the course of history

Connections between topics:
- Treaty of Versailles → German resentment → Rise of Hitler → WWII
- WWII devastation → Cold War rivalry → Proxy conflicts
- Colonialism → Decolonisation → Modern global inequalities
- Discrimination → Civil rights movements → Ongoing struggles for equality

Lessons from history:
- Extreme nationalism can lead to conflict
- Economic hardship can empower extremists
- Appeasement of aggression doesn't prevent war
- Ordinary people can make extraordinary change
- Human rights must be protected actively

Relevance to today:
- International cooperation (UN, NATO)
- Ongoing conflicts and their historical roots
- Movements for Indigenous rights
- Immigration and multiculturalism debates
- Importance of democracy and human rights

History helps us understand how we got here and guides our choices for the future.`,
    keyPoints: [
      "Historical events have long-lasting consequences",
      "Different perspectives reveal complexity",
      "Lessons from past inform present decisions",
      "Understanding history shapes better futures"
    ]
  }
};

const englishReadingByWeek: Record<number, ReadingContent> = {
  1: {
    title: "Introduction to Text Analysis",
    content: `Text analysis is the process of closely examining a piece of writing to understand not just what it says, but how and why the author has crafted it in particular ways.

Key elements of text analysis:
Purpose: What is the author trying to achieve?
- To inform (explain, teach)
- To persuade (convince, argue)
- To entertain (engage, amuse)
- To describe (paint a picture with words)

Audience: Who is the text written for?
- Consider age, background, knowledge level, interests
- Language choices reflect intended audience

Context: When and where was the text created?
- Historical period affects themes and language
- Social issues of the time influence content
- Author's background shapes perspective

Structure: How is the text organised?
- Introduction, body, conclusion
- Chapters, paragraphs, stanzas
- How structure supports meaning

Language features:
- Word choice (formal/informal, technical, emotive)
- Sentence length and variety
- Figurative language (metaphor, simile, personification)
- Tone (serious, humorous, critical, hopeful)

Reading actively means questioning as you read: Why did the author choose this word? What effect does this technique create? What is the underlying message?`,
    keyPoints: [
      "Consider purpose, audience, and context",
      "Analyse structure and language choices",
      "Identify figurative language and techniques",
      "Question author's choices and their effects"
    ]
  },
  2: {
    title: "Introduction to Animal Farm",
    content: `Animal Farm by George Orwell, published in 1945, is a powerful allegory that uses a farmyard setting to criticise totalitarianism and the corruption of revolutionary ideals.

The author:
George Orwell (1903-1950) was an English writer concerned with social injustice and political oppression. He fought in the Spanish Civil War and witnessed communist betrayal of socialist ideals, which influenced his writing.

Historical context:
Animal Farm allegorises the Russian Revolution (1917) and the rise of Soviet totalitarianism under Joseph Stalin. Written during WWII, it criticised the Soviet Union at a time when the USSR was a British ally.

The allegory:
Mr. Jones = Tsar Nicholas II (incompetent ruler)
Old Major = Karl Marx/Lenin (revolutionary idealist)
Napoleon = Joseph Stalin (tyrannical leader)
Snowball = Leon Trotsky (exiled rival)
Boxer = Loyal working class
Squealer = Propaganda machine
The dogs = Secret police

The story:
Animals overthrow the farmer, establish their own society based on "Animalism" (Seven Commandments), but the pigs gradually take power, eventually becoming indistinguishable from the humans they replaced.

Central theme: "All animals are equal, but some animals are more equal than others."`,
    keyPoints: [
      "Animal Farm is an allegory of the Russian Revolution",
      "Characters represent historical figures (Napoleon = Stalin)",
      "Orwell criticises corruption of revolutionary ideals",
      "Theme: Power corrupts; absolute power corrupts absolutely"
    ]
  },
  3: {
    title: "Themes in Animal Farm",
    content: `Animal Farm explores several interconnected themes that remain relevant today.

Power and Corruption:
The pigs begin with noble intentions but gradually abuse their power. Napoleon uses violence (dogs), propaganda (Squealer), and manipulation to control the other animals. The commandments are changed to suit the pigs' behaviour.

"All animals are equal" becomes "All animals are equal, but some animals are more equal than others."

Class and Exploitation:
Despite the revolution, a new ruling class (pigs) emerges that exploits the working class (other animals). Boxer works himself to death while believing in the pigs' leadership.

Propaganda and Manipulation:
Squealer represents the power of propaganda. He rewrites history, justifies the pigs' privileges, and convinces the animals that things are better than before the revolution, even as their lives worsen.

Language and Control:
Control over language means control over thought. The pigs are educated while keeping others illiterate. They use complicated arguments the other animals can't follow.

Ignorance and Compliance:
The animals' failure to remember the past and question authority allows their exploitation. Education and critical thinking are essential for freedom.

Revolution and Betrayal:
Well-intentioned revolutions can be corrupted. The idealistic vision of Animalism is betrayed by those who gain power.`,
    keyPoints: [
      "Power corrupts - pigs become like the humans",
      "Propaganda controls through manipulation of truth",
      "Language and education used as tools of control",
      "Revolution betrayed when leaders prioritise themselves"
    ]
  },
  4: {
    title: "Symbolism in Animal Farm",
    content: `Orwell uses symbols throughout Animal Farm to represent larger ideas and historical realities.

The Windmill:
Represents Soviet industrialisation and propaganda promises. Snowball designs it, Napoleon takes credit. Building it becomes a distraction from the animals' declining conditions. Despite their sacrifices, the windmill benefits only the pigs.

The Seven Commandments:
Represent the ideals of the revolution. Their gradual alteration shows how propaganda rewrites history and justifies oppression. The final single commandment ("All animals are equal, but some animals are more equal than others") encapsulates the corruption of revolutionary ideals.

The Farmhouse:
Represents the seat of power. When the pigs move in, they adopt the trappings of the oppressors they replaced - sleeping in beds, wearing clothes, drinking alcohol.

Animalism:
Represents communist ideology. Its noble principles of equality and cooperation are corrupted into a system that benefits only the elite.

The Flag:
Green with hoof and horn, representing animal solidarity. Eventually replaced, symbolising the complete betrayal of original ideals.

Napoleon's Dogs:
Represent Stalin's secret police (NKVD). Used to intimidate and eliminate opponents. The private army ensures Napoleon's absolute power.

Songs and Rituals:
"Beasts of England" inspires revolution but is eventually banned when it no longer serves the pigs' purposes.`,
    keyPoints: [
      "Windmill: industrialisation and distraction",
      "Seven Commandments: revolutionary ideals corrupted",
      "Farmhouse: embracing oppressors' privileges",
      "Dogs: violence and intimidation to maintain power"
    ]
  },
  5: {
    title: "Character Analysis: The Pigs",
    content: `The pigs in Animal Farm represent the ruling class that emerges after the revolution.

Old Major:
- Wise old boar who inspires the revolution
- Represents Karl Marx and/or Lenin
- Dies before seeing his vision corrupted
- His teachings (Animalism) are later distorted

Napoleon:
- Represents Joseph Stalin
- "Not much of a talker, but with a reputation for getting his own way"
- Uses violence, fear, and propaganda to control
- Secretly raises dogs as his private army
- Expels Snowball, rewrites history, accumulates power
- By the end, walks on two legs and is indistinguishable from humans

Snowball:
- Represents Leon Trotsky
- Intelligent, passionate, genuinely believes in Animalism
- Designs the windmill and works for the animals' benefit
- Expelled by Napoleon, then blamed for everything wrong
- History rewrites his heroism as treachery

Squealer:
- Represents propaganda/state media
- "Could turn black into white"
- Justifies every action the pigs take
- Convinces animals that memory and perception are wrong
- Uses statistics, complex arguments, and threats

The pigs' transformation:
From walking on four legs to two, from barn to farmhouse, from animalism to capitalism - they become what they overthrew.`,
    keyPoints: [
      "Napoleon represents Stalin - violent, manipulative dictator",
      "Snowball represents Trotsky - genuine idealist, exiled and vilified",
      "Squealer represents propaganda - distorts truth to serve power",
      "Pigs become indistinguishable from human oppressors"
    ]
  },
  6: {
    title: "Character Analysis: The Other Animals",
    content: `The non-pig animals represent different groups in society and their responses to oppression.

Boxer:
- Powerful, loyal cart-horse
- Represents the exploited working class
- Motto: "I will work harder" and "Napoleon is always right"
- Works himself to exhaustion for the farm
- Sold to the knacker's (glue factory) when no longer useful
- His fate shows how loyal workers are exploited and discarded

Clover:
- Gentle mare, motherly figure
- Senses something is wrong but can't articulate it
- Represents those who doubt but don't act
- Tries to remember the original commandments

Benjamin:
- Cynical old donkey
- Represents intellectuals who refuse to speak up
- "Donkeys live a long time"
- Only acts when Boxer is taken - too late
- Knows the truth but does nothing

Mollie:
- Vain white mare who loves ribbons
- Represents the bourgeoisie who flee revolution
- Cares only for personal comforts
- Defects to another farm

The Sheep:
- Mindlessly repeat slogans ("Four legs good, two legs bad/better")
- Represent masses easily manipulated by propaganda
- Drown out dissenting voices

Moses the Raven:
- Tells stories of Sugarcandy Mountain (heaven)
- Represents religion used to pacify workers
- Tolerated by pigs because his stories discourage rebellion`,
    keyPoints: [
      "Boxer: loyal worker exploited then discarded",
      "Benjamin: cynical intellectual who doesn't act",
      "Sheep: easily manipulated masses",
      "Each animal represents a social group"
    ]
  },
  7: {
    title: "Writing TEEL Paragraphs",
    content: `TEEL is a structure for writing analytical paragraphs that helps you develop clear, well-supported arguments.

T - Topic Sentence:
Opens the paragraph with the main idea. This is your argument for this paragraph.
Example: "Orwell uses the character of Boxer to illustrate how totalitarian regimes exploit the loyalty of the working class."

E - Explain:
Elaborate on your topic sentence. Provide context and begin to explain your thinking.
Example: "Boxer's unwavering dedication to the farm represents the naïve trust that workers place in their leaders. His mottos - 'I will work harder' and 'Napoleon is always right' - demonstrate his complete faith in the system."

E - Evidence:
Provide specific examples, quotes, or references from the text.
Example: "When Boxer is injured and can no longer work, the pigs sell him to the knacker's, despite his years of loyal service. The van that takes him away clearly reads 'Horse Slaughterer,' yet Squealer convinces the animals that Boxer died peacefully in hospital."

L - Link:
Connect back to your main argument and/or transition to the next point.
Example: "Through Boxer's tragic fate, Orwell warns readers that blind loyalty to authority can lead to exploitation and betrayal, reinforcing the novel's critique of totalitarian power."

Tips:
- One main idea per paragraph
- Use quotes sparingly but effectively
- Analyse, don't just describe
- Link paragraphs together for flow`,
    keyPoints: [
      "Topic: State the paragraph's main argument",
      "Explain: Develop and elaborate on the idea",
      "Evidence: Use quotes and examples from text",
      "Link: Connect to overall argument"
    ]
  },
  8: {
    title: "Persuasive Writing Techniques",
    content: `Persuasive writing aims to convince the reader to accept a viewpoint or take action. Understanding these techniques helps you both analyse and create persuasive texts.

Appeals (Aristotle's Rhetorical Triangle):
Ethos: Appeal to credibility and character
- Expert opinions, qualifications, shared values
- "As a doctor with 20 years of experience..."

Pathos: Appeal to emotion
- Stories, vivid imagery, emotional language
- "Imagine a child too hungry to concentrate at school..."

Logos: Appeal to logic and reason
- Statistics, facts, evidence, logical arguments
- "Studies show that 90% of students who..."

Language techniques:
Rhetorical questions: Questions that don't need answers
- "How can we call ourselves a fair society?"

Repetition: Emphasises key ideas
- "We need action. We need change. We need it now."

Inclusive language: Creates connection with audience
- "We all want what's best for our children"

Emotive language: Triggers emotional responses
- "Innocent victims," "heartless decision," "devastating consequences"

Rule of three: Groups ideas for impact
- "Education, equality, opportunity"

Anecdote: Personal story to illustrate a point
- "Last week I met a family who..."

Hyperbole: Exaggeration for effect
- "This is the most important decision of our generation"`,
    keyPoints: [
      "Ethos: credibility, Pathos: emotion, Logos: logic",
      "Rhetorical questions engage the reader",
      "Inclusive language creates connection",
      "Balance emotional and logical appeals"
    ]
  },
  9: {
    title: "Structuring Persuasive Texts",
    content: `Effective persuasive writing requires careful organisation to build a compelling argument.

Structure of a persuasive essay:
Introduction:
- Hook: Grab attention (question, statistic, quote, scenario)
- Context: Briefly introduce the issue
- Contention: State your main argument clearly
- Preview: Outline your main points

Body paragraphs (TEEL for each):
- Start with your strongest argument
- Each paragraph focuses on one main point
- Include evidence and examples
- Address counterarguments (rebuttals)

Conclusion:
- Restate your contention in different words
- Summarise main points briefly
- End with a call to action or memorable statement
- Leave a lasting impression

Planning your argument:
1. Identify your audience - who are you trying to convince?
2. Research both sides of the issue
3. Choose your strongest supporting points
4. Anticipate objections and prepare rebuttals
5. Select appropriate evidence

Addressing counterarguments:
Acknowledge opposing views, then rebut them:
- "Some argue that... However..."
- "While it's true that..., this overlooks..."
- "Critics may suggest..., but the evidence shows..."

This shows you've considered multiple perspectives and strengthens your argument.`,
    keyPoints: [
      "Introduction: hook, context, contention, preview",
      "Body: one argument per paragraph with evidence",
      "Address counterarguments to strengthen position",
      "Conclusion: restate contention, call to action"
    ]
  },
  10: {
    title: "Analysing Persuasive Texts",
    content: `When analysing persuasive texts, look beyond what is said to examine how and why it's said.

Framework for analysis:
1. What is the contention? (main argument)
2. Who is the intended audience?
3. What persuasive techniques are used?
4. How effective are these techniques?
5. What evidence is provided?
6. Are there any logical fallacies or weaknesses?

Identifying techniques:
Read actively and annotate the text:
- Underline emotive words
- Circle rhetorical questions
- Note appeals to ethos, pathos, logos
- Identify any statistics or expert opinions
- Mark repetition and patterns

Evaluating effectiveness:
Consider:
- Does the evidence support the claims?
- Is the reasoning logical?
- Are emotional appeals balanced with facts?
- Does the author address counterarguments?
- Is the language appropriate for the audience?

Common logical fallacies to identify:
- Ad hominem: Attacking the person, not the argument
- Appeal to fear: Using scare tactics
- Bandwagon: "Everyone else believes/does this"
- False dichotomy: Presenting only two options
- Strawman: Misrepresenting the opposing view

Writing your analysis:
Use TEEL paragraphs to analyse specific techniques and their effects. Quote directly from the text and explain how the technique works.`,
    keyPoints: [
      "Identify contention, audience, and techniques",
      "Look for ethos, pathos, logos appeals",
      "Watch for logical fallacies",
      "Evaluate effectiveness with evidence"
    ]
  },
  11: {
    title: "Comparative Text Analysis",
    content: `Comparing texts means examining how different authors approach similar themes, issues, or topics. This develops critical thinking about how meaning is constructed.

What to compare:
Purpose and audience:
- What is each author trying to achieve?
- Who are they writing for?
- How does this affect their choices?

Argument and perspective:
- What position does each take on the issue?
- What values or beliefs underpin their views?
- How do they support their arguments?

Techniques and style:
- What persuasive techniques does each use?
- How does their language differ?
- What is the tone of each text?

Structure:
- How is each text organised?
- How do they introduce and conclude?
- How do they sequence their arguments?

Language for comparison:
Similarity: Similarly, likewise, in the same way, both texts...
Difference: In contrast, however, whereas, on the other hand...
Degree: While Text A emphasises..., Text B focuses more on...

Structure of comparative analysis:
Option 1 - Text by text: Analyse Text A fully, then Text B, then compare
Option 2 - Point by point: Compare both texts on each aspect (usually better)

Example topic sentence: "While both authors oppose the new policy, Text A relies primarily on emotional appeals, whereas Text B emphasises statistical evidence."`,
    keyPoints: [
      "Compare purpose, audience, argument, techniques",
      "Use comparative language (similarly, however, whereas)",
      "Point-by-point structure usually more effective",
      "Analyse both similarities and differences"
    ]
  },
  12: {
    title: "Writing Text Response Essays",
    content: `A text response essay analyses how a text explores themes, develops characters, or uses literary techniques. It requires close reading and thoughtful interpretation.

Essay structure:
Introduction:
- Name the text and author
- Provide brief context (when written, type of text)
- State your contention (thesis) - your main argument about the text
- Preview your main points

Body paragraphs (3-4 typically):
- Each paragraph explores one aspect of your argument
- Use TEEL structure
- Include quotes (evidence from the text)
- Analyse the quotes - explain what they show and how

Conclusion:
- Restate your thesis in different words
- Summarise how your points support your argument
- End with a broader statement about significance

Using evidence effectively:
- Select short, relevant quotes
- Embed quotes smoothly into your sentences
- Always analyse - never just quote and move on
- Explain what the evidence shows

Example integration:
Weak: "Napoleon is always right." This shows Boxer is loyal.
Strong: Boxer's unquestioning devotion is encapsulated in his motto, "Napoleon is always right," which reveals how totalitarian regimes exploit the trust of loyal citizens.

Key verbs for analysis:
Orwell demonstrates/suggests/reveals/illustrates/conveys/criticises/highlights/explores/exposes...`,
    keyPoints: [
      "Introduction: text, thesis, preview",
      "Body: TEEL with embedded quotes",
      "Always analyse evidence - explain what it shows",
      "Conclusion: restate thesis, significance"
    ]
  },
  13: {
    title: "Developing Voice and Tone",
    content: `Voice is the writer's distinctive style - their personality on the page. Tone is the attitude conveyed toward the subject matter.

Elements of voice:
Word choice: Formal vs informal, simple vs sophisticated
Sentence structure: Short and punchy or long and complex
Perspective: First person (I), second (you), or third (they)
Personality: Serious, humorous, conversational, academic

Types of tone:
Formal/Academic: Professional, objective, third person
Persuasive: Confident, direct, may be passionate
Descriptive: Evocative, sensory, creative
Reflective: Thoughtful, personal, introspective
Satirical: Mocking, ironic, critical through humour

Matching voice and tone to purpose:
Persuasive essay: Confident, direct, mix of formal and engaging
Creative writing: Flexible, character-driven, distinctive
Text response: Formal, analytical, objective
Personal reflection: First person, thoughtful, genuine

Developing your voice:
- Read widely to see how other writers create voice
- Practice writing in different styles
- Be authentic - don't try to sound like someone else
- Match your voice to your audience and purpose

Analysing tone in texts:
Ask: What is the author's attitude toward the subject?
How do word choices reveal this attitude?
Does the tone change throughout the text?
How does tone affect the reader's response?`,
    keyPoints: [
      "Voice is the writer's distinctive style",
      "Tone is the attitude toward the subject",
      "Match voice and tone to purpose and audience",
      "Analyse word choice to identify tone"
    ]
  },
  14: {
    title: "Media and Multimodal Texts",
    content: `Multimodal texts combine multiple modes of communication - written, visual, audio, and gestural. Understanding how these elements work together is essential in our media-rich world.

Types of multimodal texts:
- Advertisements (print and video)
- Websites and social media
- Documentary films
- News broadcasts
- Graphic novels
- Infographics
- Podcasts with visual elements

Visual elements to analyse:
Colour: Warm colours (excitement), cool colours (calm), black and white (serious)
Layout: Where elements are placed draws attention
Images: Photographs, illustrations, symbols
Typography: Font choices convey meaning (formal, fun, urgent)
Size: Larger elements have more importance

Analysing advertisements:
Target audience: Who is this designed for?
Product positioning: What lifestyle or values is it associated with?
Visual techniques: Colour, imagery, layout
Language: Slogans, claims, persuasive techniques
Appeals: Ethos, pathos, logos

Camera techniques (video):
Close-up: Emotion, importance
Long shot: Context, setting
Low angle: Power, dominance
High angle: Vulnerability, weakness
Tracking: Following action

Questions for analysis:
- How do visual and written elements work together?
- What message is being communicated?
- Who created this and why?
- What perspectives are included or excluded?`,
    keyPoints: [
      "Multimodal texts combine written, visual, audio elements",
      "Analyse colour, layout, images, typography",
      "Consider target audience and purpose",
      "Visual and verbal elements work together"
    ]
  },
  15: {
    title: "Creative Writing Techniques",
    content: `Creative writing brings stories, characters, and ideas to life through imaginative use of language. Strong creative writing engages readers through vivid description, compelling characters, and effective narrative techniques.

Show, don't tell:
Instead of telling readers what to feel, show them through action, dialogue, and sensory detail.
Telling: She was angry.
Showing: Her fists clenched, knuckles whitening as she bit back words that would only make things worse.

Sensory detail:
Engage all five senses to immerse readers in your writing.
- Sight: What does the scene look like?
- Sound: What can be heard?
- Touch: Textures, temperatures
- Smell: Scents and odours
- Taste: When appropriate

Figurative language:
Simile: The moon hung like a silver coin in the sky.
Metaphor: Life is a journey with no map.
Personification: The wind whispered secrets through the trees.
Symbolism: Objects representing larger ideas.

Narrative techniques:
Point of view: First person (I) is intimate; third person allows wider perspective
Flashback: Reveals backstory
Foreshadowing: Hints at what's to come
Dialogue: Reveals character, advances plot
Pacing: Vary sentence length for effect

Creating characters:
- Physical description (but not too much)
- Distinctive voice and speech patterns
- Motivation - what do they want?
- Flaws and contradictions - make them human`,
    keyPoints: [
      "Show emotions through action and detail, don't tell",
      "Use sensory detail to immerse readers",
      "Figurative language creates vivid imagery",
      "Characters need motivation and flaws"
    ]
  },
  16: {
    title: "Grammar and Editing Skills",
    content: `Clear, correct writing communicates your ideas effectively. Understanding grammar rules and developing editing skills improves all your writing.

Common errors to avoid:
Sentence fragments: Incomplete sentences lacking subject or verb.
Wrong: Because it was raining.
Right: We stayed inside because it was raining.

Run-on sentences: Two sentences joined without proper punctuation.
Wrong: She left early she had a meeting.
Right: She left early because she had a meeting. OR She left early; she had a meeting.

Subject-verb agreement: Subjects and verbs must match in number.
Wrong: The group of students are waiting.
Right: The group of students is waiting.

Apostrophe use:
Possession: The dog's bowl (one dog), The dogs' bowls (multiple dogs)
Contractions: It's = it is, Its = belonging to it

Punctuation:
- Commas: Separate items in lists, after introductory phrases, around non-essential information
- Semicolons: Connect related independent clauses
- Colons: Introduce lists or explanations

Editing checklist:
1. Read aloud - does it sound right?
2. Check sentence structure - any fragments or run-ons?
3. Verify subject-verb agreement
4. Review punctuation and apostrophes
5. Check spelling (don't rely only on spell-check)
6. Ensure paragraphs are focused
7. Verify you've answered the question

Proofreading tips:
- Read backwards (sentence by sentence)
- Change the font or print it out
- Read slowly and carefully
- Focus on common personal errors`,
    keyPoints: [
      "Avoid fragments and run-on sentences",
      "Ensure subject-verb agreement",
      "Use apostrophes correctly (possession vs contraction)",
      "Always edit and proofread your work"
    ]
  },
  17: {
    title: "English Review and Exam Preparation",
    content: `As you prepare for assessments, consolidate your understanding of key concepts and develop effective exam strategies.

Key skills to review:
Text analysis: Identify and explain techniques and their effects
Essay writing: Structure, TEEL paragraphs, evidence integration
Persuasive writing: Techniques, structure, appeals
Comparative analysis: Similarities, differences, evaluation
Creative writing: Show don't tell, sensory detail, narrative techniques

Animal Farm focus:
- Know the allegory - what each character/symbol represents
- Understand key themes: power, propaganda, class, corruption
- Have quotes ready for each major character and theme
- Be able to analyse Orwell's techniques and their effects

Exam strategies:
Before the exam:
- Review notes and practice essays
- Prepare quotes and examples
- Get a good night's sleep

During the exam:
- Read all questions carefully before starting
- Plan your response (5 minutes planning saves time)
- Allocate time based on marks
- Answer the actual question asked
- Leave time to proofread

Essay planning:
1. Underline key words in the question
2. Brainstorm relevant ideas, quotes, techniques
3. Organise into logical paragraph order
4. Write your contention/thesis
5. Begin writing, following your plan

Remember: Quality of analysis matters more than quantity of quotes. Explain and interpret, don't just describe.`,
    keyPoints: [
      "Review all key concepts and texts",
      "Plan essays before writing",
      "Answer the question asked",
      "Quality analysis over quantity"
    ]
  }
};

const mathContent: StudyContent = {
  type: "practice",
  vocabulary: [
    { term: "Variable", definition: "A letter or symbol representing an unknown value" },
    { term: "Coefficient", definition: "The number multiplied by a variable" },
    { term: "Equation", definition: "A mathematical statement showing two expressions are equal" },
    { term: "Linear Equation", definition: "An equation that forms a straight line when graphed (y = mx + b)" },
    { term: "Quadratic", definition: "An equation with a squared term (ax² + bx + c)" },
    { term: "Gradient", definition: "The slope or steepness of a line" },
    { term: "Y-intercept", definition: "Where a line crosses the y-axis" },
    { term: "Discriminant", definition: "b² - 4ac, determines nature of roots" },
  ],
  practiceQuestions: mathQuestions,
  summaryPoints: [
    "Always perform the same operation on both sides of an equation",
    "FOIL method: First, Outer, Inner, Last for expanding brackets",
    "Linear equations have form y = mx + b where m is gradient",
    "Quadratic formula: x = (-b ± √(b²-4ac)) / 2a",
    "Pythagoras theorem: a² + b² = c² for right triangles",
    "SOH CAH TOA for trigonometry ratios",
  ],
};

const scienceContent: StudyContent = {
  type: "practice",
  vocabulary: [
    { term: "Cell", definition: "The basic structural and functional unit of all living organisms" },
    { term: "Homeostasis", definition: "The maintenance of a stable internal environment" },
    { term: "Nucleus", definition: "The control center of the cell containing genetic material" },
    { term: "Mitochondria", definition: "The powerhouse of the cell - produces ATP energy" },
    { term: "Photosynthesis", definition: "Process by which plants convert light energy into glucose" },
    { term: "Respiration", definition: "Process of breaking down glucose to release energy" },
    { term: "Osmosis", definition: "Movement of water from high to low concentration through a membrane" },
    { term: "Enzyme", definition: "A biological catalyst that speeds up chemical reactions" },
    { term: "DNA", definition: "Deoxyribonucleic acid - molecule carrying genetic information" },
    { term: "Evolution", definition: "Change in inherited characteristics of populations over time" },
    { term: "Ecosystem", definition: "A community of organisms interacting with their environment" },
    { term: "Atom", definition: "The smallest unit of an element" },
  ],
  practiceQuestions: scienceQuestions,
  summaryPoints: [
    "Cells are the building blocks of all living things",
    "DNA carries genetic information in chromosomes",
    "Natural selection leads to evolution over time",
    "Ecosystems include biotic (living) and abiotic (non-living) factors",
    "Chemical equations must be balanced - conservation of mass",
    "pH scale: 0-7 acidic, 7 neutral, 7-14 alkaline",
    "Energy cannot be created or destroyed, only transformed",
    "Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
  ],
};

const historyContent: StudyContent = {
  type: "review",
  vocabulary: [
    { term: "Primary Source", definition: "An original document or object created at the time being studied" },
    { term: "Secondary Source", definition: "An interpretation or analysis of primary sources" },
    { term: "Bias", definition: "A one-sided or prejudiced perspective in a source" },
    { term: "Causation", definition: "The relationship between cause and effect in historical events" },
    { term: "Totalitarianism", definition: "A system of government with absolute power" },
    { term: "Nationalism", definition: "Strong identification with one's nation, often feeling superior to others" },
    { term: "Imperialism", definition: "A policy of extending a country's power through colonization" },
    { term: "Propaganda", definition: "Information used to promote a political cause or viewpoint" },
    { term: "Armistice", definition: "An agreement to stop fighting temporarily" },
    { term: "Reparations", definition: "Compensation demanded from a defeated nation" },
    { term: "Decolonisation", definition: "The process of colonies gaining independence" },
    { term: "Holocaust", definition: "The systematic genocide of six million Jews by Nazi Germany" },
  ],
  practiceQuestions: historyQuestions,
  flashcards: [
    { question: "What does MAIN stand for (causes of WWI)?", answer: "Militarism, Alliances, Imperialism, Nationalism", type: "short-answer" },
    { question: "When was the Treaty of Versailles signed?", answer: "1919", type: "short-answer" },
    { question: "What was the League of Nations?", answer: "International organization formed after WWI to maintain peace", type: "short-answer" },
    { question: "What date is ANZAC Day?", answer: "April 25", type: "short-answer" },
    { question: "Who were the 'Big Three' at Paris Peace Conference?", answer: "Clemenceau (France), Lloyd George (Britain), Wilson (USA)", type: "short-answer" },
  ],
  summaryPoints: [
    "Always consider who created a source and why",
    "Compare multiple sources to get a balanced view",
    "Historical events have multiple causes and consequences",
    "WWI was caused by nationalism, alliances, imperialism, and militarism",
    "WWII arose from unresolved issues of WWI and the Great Depression",
    "The Cold War was ideological conflict between capitalism and communism",
    "Use OPCL to analyse sources: Origin, Purpose, Content, Limitation",
    "Primary sources give direct evidence but may be biased",
  ],
};

const englishContent: StudyContent = {
  type: "reading",
  vocabulary: [
    { term: "Allegory", definition: "A story with a hidden political or moral meaning" },
    { term: "Satire", definition: "Using humor or irony to criticize or expose foolishness" },
    { term: "Ethos", definition: "Appeal to credibility or character" },
    { term: "Pathos", definition: "Appeal to emotion" },
    { term: "Logos", definition: "Appeal to logic and reason" },
    { term: "Metaphor", definition: "A comparison saying one thing IS another" },
    { term: "Symbolism", definition: "Using objects or images to represent abstract ideas" },
    { term: "Contention", definition: "The main argument or position in persuasive writing" },
    { term: "Rhetoric", definition: "The art of effective or persuasive speaking or writing" },
    { term: "Tone", definition: "The author's attitude toward the subject matter" },
    { term: "Irony", definition: "Expressing meaning by using language that signifies the opposite" },
    { term: "Theme", definition: "The central idea or message of a text" },
  ],
  practiceQuestions: englishQuestions,
  comprehensionQuestions: [
    { question: "What is the main message of the text?", answer: "Identify the central argument or thesis the author is presenting" },
    { question: "Who is the intended audience?", answer: "Consider age, interests, beliefs, and background of target readers" },
    { question: "What persuasive techniques does the author use?", answer: "Look for emotional appeals, statistics, expert opinions, rhetorical questions" },
    { question: "Is the text biased? How can you tell?", answer: "Check for one-sided arguments, loaded language, missing counterarguments" },
  ],
  writingPrompts: [
    {
      prompt: "Write a persuasive text arguing for or against social media use by teenagers",
      requirements: ["Clear contention stated early", "At least 3 supporting arguments", "Use of persuasive techniques", "Address a counterargument"],
      structure: ["Introduction with hook and contention", "Body paragraph 1: Strongest argument", "Body paragraph 2: Supporting argument", "Conclusion with call to action"],
    },
    {
      prompt: "Analyze how Orwell uses symbolism in Animal Farm to critique totalitarianism",
      requirements: ["Clear thesis statement", "At least 3 examples of symbolism", "Explain what each symbol represents", "Use quotes from the text"],
      structure: ["Introduction with thesis", "Symbol 1: The windmill", "Symbol 2: The commandments", "Symbol 3: The pigs becoming human-like", "Conclusion"],
    },
  ],
  summaryPoints: [
    "Animal Farm is an allegory for the Russian Revolution",
    "Napoleon represents Stalin; Snowball represents Trotsky",
    "Use TEEL paragraphs: Topic, Explain, Evidence, Link",
    "Persuasive texts use ethos, pathos, and logos",
    "Consider author's purpose: inform, persuade, entertain",
    "Analyse both what is said and how it's said",
    "Support arguments with evidence from the text",
    "Show, don't tell in creative writing",
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
