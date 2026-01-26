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

export interface StudyContent {
  type: TaskType;
  comprehensionQuestions?: ComprehensionQuestion[];
  vocabulary?: VocabularyTerm[];
  summaryPoints?: string[];
  practiceQuestions?: PracticeQuestion[];
  writingPrompts?: WritingPrompt[];
  flashcards?: FlashcardQuestion[];
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
  ],
  practiceQuestions: scienceQuestions,
  summaryPoints: [
    "Cells are the building blocks of all living things",
    "DNA carries genetic information in chromosomes",
    "Natural selection leads to evolution over time",
    "Ecosystems include biotic (living) and abiotic (non-living) factors",
    "Chemical equations must be balanced - conservation of mass",
    "pH scale: 0-7 acidic, 7 neutral, 7-14 alkaline",
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
  ],
  practiceQuestions: historyQuestions,
  flashcards: [
    { question: "What does MAIN stand for (causes of WWI)?", answer: "Militarism, Alliances, Imperialism, Nationalism", type: "short-answer" },
    { question: "When was the Treaty of Versailles signed?", answer: "1919", type: "short-answer" },
    { question: "What was the League of Nations?", answer: "International organization formed after WWI to maintain peace", type: "short-answer" },
  ],
  summaryPoints: [
    "Always consider who created a source and why",
    "Compare multiple sources to get a balanced view",
    "Historical events have multiple causes and consequences",
    "WWI was caused by nationalism, alliances, imperialism, and militarism",
    "WWII arose from unresolved issues of WWI and the Great Depression",
    "The Cold War was ideological conflict between capitalism and communism",
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
  ],
};

export function getStudyContent(subjectId: SubjectId, taskTitle: string, week: number): StudyContent {
  const taskType = getTaskType(taskTitle);
  
  switch (subjectId) {
    case "math":
      return { ...mathContent, type: taskType };
    
    case "science":
      return { ...scienceContent, type: taskType };
    
    case "history":
      return { ...historyContent, type: taskType };
    
    case "english":
      return { ...englishContent, type: taskType };
    
    default:
      return { type: taskType };
  }
}
