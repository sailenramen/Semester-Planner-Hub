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

const scienceContent: Record<string, StudyContent> = {
  chemistry: {
    type: "practice",
    vocabulary: [
      { term: "Atom", definition: "The smallest unit of matter that retains the properties of an element" },
      { term: "Element", definition: "A pure substance made of only one type of atom" },
      { term: "Compound", definition: "A substance made of two or more different elements chemically bonded" },
      { term: "Molecule", definition: "Two or more atoms bonded together" },
      { term: "Periodic Table", definition: "A table organizing elements by atomic number and properties" },
      { term: "Atomic Number", definition: "The number of protons in an atom's nucleus" },
      { term: "Electron", definition: "A negatively charged particle orbiting the nucleus" },
      { term: "Proton", definition: "A positively charged particle in the nucleus" },
      { term: "Neutron", definition: "A neutral particle in the nucleus" },
    ],
    practiceQuestions: [
      { id: "chem1", question: "What is the atomic number of Carbon?", answer: "6", type: "short" },
      { id: "chem2", question: "How many electrons does Oxygen have?", answer: "8", type: "short" },
      { id: "chem3", question: "Balance this equation: H₂ + O₂ → H₂O", answer: "2H₂ + O₂ → 2H₂O", solution: "Count atoms: 4 hydrogen on left (2×2), 2 oxygen. Right side: 4 hydrogen (2×2), 2 oxygen (2×1)", type: "short" },
      { id: "chem4", question: "What type of bond forms between sodium (Na) and chlorine (Cl)?", answer: "Ionic bond", options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"], type: "multiple-choice" },
      { id: "chem5", question: "Which subatomic particle determines the element?", answer: "Proton", options: ["Electron", "Proton", "Neutron", "Photon"], type: "multiple-choice" },
      { id: "chem6", question: "Balance: Fe + O₂ → Fe₂O₃", answer: "4Fe + 3O₂ → 2Fe₂O₃", solution: "Left: 4 Fe, 6 O. Right: 4 Fe (2×2), 6 O (2×3)", type: "short" },
      { id: "chem7", question: "What is the electron configuration of Sodium (atomic number 11)?", answer: "2, 8, 1", type: "short" },
      { id: "chem8", question: "In a chemical reaction, which is conserved?", answer: "Mass", options: ["Color", "Mass", "Temperature", "Volume"], type: "multiple-choice" },
    ],
    summaryPoints: [
      "Atoms are made of protons, neutrons, and electrons",
      "The periodic table organizes elements by atomic number",
      "Chemical equations must be balanced - same atoms on both sides",
      "Ionic bonds form between metals and non-metals",
      "Covalent bonds form between non-metals sharing electrons",
    ],
  },
  biology: {
    type: "practice",
    vocabulary: [
      { term: "Cell", definition: "The basic structural and functional unit of all living organisms" },
      { term: "Homeostasis", definition: "The maintenance of a stable internal environment in an organism" },
      { term: "Nucleus", definition: "The control center of the cell containing genetic material" },
      { term: "Mitochondria", definition: "The powerhouse of the cell - produces ATP energy" },
      { term: "Cell Membrane", definition: "The semi-permeable barrier controlling what enters/exits the cell" },
      { term: "Photosynthesis", definition: "Process by which plants convert light energy into glucose" },
      { term: "Respiration", definition: "Process of breaking down glucose to release energy" },
      { term: "Osmosis", definition: "Movement of water from high to low concentration through a membrane" },
    ],
    practiceQuestions: [
      { id: "bio1", question: "What organelle is responsible for cellular respiration?", answer: "Mitochondria", options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"], type: "multiple-choice" },
      { id: "bio2", question: "Name the process by which plants make glucose using sunlight.", answer: "Photosynthesis", type: "short" },
      { id: "bio3", question: "What happens to your body temperature when you exercise?", answer: "It increases, and homeostatic mechanisms like sweating activate to cool you down", type: "short" },
      { id: "bio4", question: "Which system regulates blood sugar levels?", answer: "Endocrine system (specifically pancreas with insulin/glucagon)", type: "short" },
      { id: "bio5", question: "What is the function of the cell membrane?", answer: "Controls what enters and exits the cell", type: "short" },
      { id: "bio6", question: "In which direction does water move during osmosis?", answer: "From high water concentration to low water concentration", options: ["High to low concentration", "Low to high concentration", "Random movement", "Only when heated"], type: "multiple-choice" },
      { id: "bio7", question: "Name three examples of homeostasis in the human body.", answer: "Temperature regulation, blood sugar control, water balance, pH balance", type: "short" },
    ],
    summaryPoints: [
      "Cells are the building blocks of all living things",
      "Homeostasis keeps internal conditions stable",
      "The body uses feedback loops to maintain balance",
      "Plant cells have chloroplasts and cell walls; animal cells don't",
      "Energy is produced through cellular respiration in mitochondria",
    ],
  },
};

const mathContent: Record<string, StudyContent> = {
  algebra: {
    type: "practice",
    vocabulary: [
      { term: "Variable", definition: "A letter or symbol representing an unknown value" },
      { term: "Coefficient", definition: "The number multiplied by a variable" },
      { term: "Equation", definition: "A mathematical statement showing two expressions are equal" },
      { term: "Expression", definition: "A combination of numbers, variables, and operations" },
      { term: "Linear Equation", definition: "An equation that forms a straight line when graphed (y = mx + b)" },
      { term: "Quadratic", definition: "An equation with a squared term (ax² + bx + c)" },
    ],
    practiceQuestions: [
      { id: "alg1", question: "Solve for x: 2x + 5 = 15", answer: "x = 5", solution: "2x + 5 = 15 → 2x = 10 → x = 5", type: "short" },
      { id: "alg2", question: "Solve for x: 3(x - 2) = 12", answer: "x = 6", solution: "3x - 6 = 12 → 3x = 18 → x = 6", type: "short" },
      { id: "alg3", question: "Simplify: 4x + 3y - 2x + 5y", answer: "2x + 8y", solution: "Combine like terms: (4x - 2x) + (3y + 5y) = 2x + 8y", type: "short" },
      { id: "alg4", question: "What is the gradient of y = 3x - 7?", answer: "3", options: ["3", "-7", "7", "-3"], type: "multiple-choice" },
      { id: "alg5", question: "Solve: x² = 49", answer: "x = 7 or x = -7", solution: "Take square root of both sides: x = ±√49 = ±7", type: "short" },
      { id: "alg6", question: "Expand: (x + 3)(x + 2)", answer: "x² + 5x + 6", solution: "FOIL: x² + 2x + 3x + 6 = x² + 5x + 6", type: "short" },
      { id: "alg7", question: "Factorize: x² + 7x + 12", answer: "(x + 3)(x + 4)", solution: "Find two numbers that multiply to 12 and add to 7: 3 and 4", type: "short" },
      { id: "alg8", question: "Find y when x = 2 in: y = 4x - 3", answer: "y = 5", solution: "y = 4(2) - 3 = 8 - 3 = 5", type: "short" },
    ],
    summaryPoints: [
      "Always perform the same operation on both sides of an equation",
      "Combine like terms to simplify expressions",
      "FOIL method: First, Outer, Inner, Last for expanding brackets",
      "Linear equations have form y = mx + b where m is gradient",
    ],
  },
  geometry: {
    type: "practice",
    practiceQuestions: [
      { id: "geo1", question: "Find the area of a rectangle with length 8cm and width 5cm", answer: "40 cm²", solution: "Area = length × width = 8 × 5 = 40 cm²", type: "short" },
      { id: "geo2", question: "Calculate the circumference of a circle with radius 7cm (use π = 3.14)", answer: "43.96 cm", solution: "C = 2πr = 2 × 3.14 × 7 = 43.96 cm", type: "short" },
      { id: "geo3", question: "Find the area of a triangle with base 10cm and height 6cm", answer: "30 cm²", solution: "Area = ½ × base × height = ½ × 10 × 6 = 30 cm²", type: "short" },
      { id: "geo4", question: "What is the sum of angles in a triangle?", answer: "180°", options: ["90°", "180°", "270°", "360°"], type: "multiple-choice" },
      { id: "geo5", question: "Calculate the volume of a cube with side length 4cm", answer: "64 cm³", solution: "Volume = side³ = 4³ = 64 cm³", type: "short" },
      { id: "geo6", question: "Find the hypotenuse of a right triangle with sides 3cm and 4cm", answer: "5 cm", solution: "Using Pythagoras: c² = a² + b² = 9 + 16 = 25, so c = 5", type: "short" },
    ],
    summaryPoints: [
      "Area of rectangle = length × width",
      "Area of triangle = ½ × base × height",
      "Area of circle = πr²",
      "Circumference = 2πr",
      "Pythagoras theorem: a² + b² = c²",
    ],
  },
  statistics: {
    type: "practice",
    vocabulary: [
      { term: "Mean", definition: "The average - sum of all values divided by count" },
      { term: "Median", definition: "The middle value when data is ordered" },
      { term: "Mode", definition: "The most frequently occurring value" },
      { term: "Range", definition: "The difference between highest and lowest values" },
    ],
    practiceQuestions: [
      { id: "stat1", question: "Find the mean of: 4, 7, 9, 12, 8", answer: "8", solution: "Mean = (4+7+9+12+8) ÷ 5 = 40 ÷ 5 = 8", type: "short" },
      { id: "stat2", question: "Find the median of: 3, 7, 9, 4, 5", answer: "5", solution: "Order: 3, 4, 5, 7, 9. Middle value = 5", type: "short" },
      { id: "stat3", question: "Find the mode of: 2, 4, 4, 5, 7, 4, 8", answer: "4", solution: "4 appears most often (3 times)", type: "short" },
      { id: "stat4", question: "Find the range of: 15, 22, 8, 31, 19", answer: "23", solution: "Range = 31 - 8 = 23", type: "short" },
    ],
    summaryPoints: [
      "Mean = sum of values ÷ number of values",
      "Order data to find the median",
      "Mode is the most common value (there can be more than one)",
      "Range shows the spread of data",
    ],
  },
};

const humanitiesContent: Record<string, StudyContent> = {
  history: {
    type: "review",
    vocabulary: [
      { term: "Primary Source", definition: "An original document or object created at the time being studied" },
      { term: "Secondary Source", definition: "An interpretation or analysis of primary sources" },
      { term: "Bias", definition: "A one-sided or prejudiced perspective in a source" },
      { term: "Causation", definition: "The relationship between cause and effect in historical events" },
      { term: "Continuity", definition: "Aspects that remain the same over time" },
      { term: "Change", definition: "Aspects that are different over time" },
    ],
    flashcards: [
      { question: "What makes a source 'primary'?", answer: "It was created at the time of the event being studied", type: "short-answer" },
      { question: "Name three types of primary sources", answer: "Letters, photographs, diaries, official documents, artifacts, newspapers from the time", type: "short-answer" },
      { question: "What questions should you ask when analyzing a source?", answer: "Origin (who created it), Purpose (why), Content (what does it show), Limitation (what doesn't it show)", type: "short-answer" },
      { question: "What is OPCL analysis?", answer: "Origin, Purpose, Content, Limitation", type: "short-answer", options: ["Origin, Purpose, Content, Limitation", "Old, Past, Current, Latest", "Opinion, Proof, Claim, Logic", "Order, Position, Context, Level"] },
    ],
    summaryPoints: [
      "Always consider who created a source and why",
      "Compare multiple sources to get a balanced view",
      "Consider what a source doesn't show (limitations)",
      "Historical events have multiple causes and consequences",
    ],
  },
  politics: {
    type: "review",
    vocabulary: [
      { term: "Democracy", definition: "A system of government where citizens have the power to choose their leaders" },
      { term: "Global Citizenship", definition: "Being aware of and participating in the wider world community" },
      { term: "Human Rights", definition: "Basic rights and freedoms that belong to every person" },
      { term: "Sustainability", definition: "Meeting present needs without compromising future generations" },
      { term: "NGO", definition: "Non-Governmental Organization - independent groups addressing social issues" },
    ],
    flashcards: [
      { question: "What are the three levels of government in Australia?", answer: "Federal, State, Local", type: "short-answer" },
      { question: "What is the UN Declaration of Human Rights?", answer: "A document outlining fundamental human rights that should be universally protected", type: "short-answer" },
      { question: "Name three global issues affecting citizenship today", answer: "Climate change, refugee crises, inequality, digital privacy, terrorism", type: "short-answer" },
      { question: "What does SDG stand for?", answer: "Sustainable Development Goals", options: ["Sustainable Development Goals", "Social Democratic Government", "State Department Guidelines", "Standard Development Group"], type: "multiple-choice" },
    ],
    summaryPoints: [
      "Active citizenship involves participating in your community",
      "Global issues require international cooperation",
      "Human rights apply to everyone regardless of nationality",
      "Sustainable practices consider environmental, social, and economic factors",
    ],
  },
};

const englishContent: Record<string, StudyContent> = {
  term1: {
    type: "reading",
    vocabulary: [
      { term: "Rationale", definition: "The underlying reason or explanation for something" },
      { term: "Persuasive Technique", definition: "Methods used to convince or influence an audience" },
      { term: "Ethos", definition: "Appeal to credibility or character" },
      { term: "Pathos", definition: "Appeal to emotion" },
      { term: "Logos", definition: "Appeal to logic and reason" },
      { term: "Rhetorical Question", definition: "A question asked for effect, not requiring an answer" },
      { term: "Anecdote", definition: "A short personal story used to make a point" },
      { term: "Statistics", definition: "Numerical data used to support an argument" },
    ],
    comprehensionQuestions: [
      { question: "What is the main message of the article?", answer: "Identify the central argument or thesis the author is presenting" },
      { question: "Who is the intended audience?", answer: "Consider age, interests, beliefs, and background of target readers" },
      { question: "What persuasive techniques does the author use?", answer: "Look for emotional appeals, statistics, expert opinions, rhetorical questions" },
      { question: "Is the article biased? How can you tell?", answer: "Check for one-sided arguments, loaded language, missing counterarguments" },
      { question: "What is the author's purpose?", answer: "To inform, persuade, entertain, or call to action" },
    ],
    summaryPoints: [
      "Identify the main contention (what the author wants you to believe/do)",
      "Note persuasive techniques: appeals to emotion, logic, authority",
      "Consider the intended audience and how language targets them",
      "Evaluate the effectiveness of the argument",
      "Identify any bias or missing perspectives",
    ],
  },
  animalFarm: {
    type: "reading",
    vocabulary: [
      { term: "Allegory", definition: "A story with a hidden political or moral meaning" },
      { term: "Satire", definition: "Using humor or irony to criticize or expose foolishness" },
      { term: "Totalitarianism", definition: "A system of government with absolute power" },
      { term: "Propaganda", definition: "Information used to promote a particular political cause" },
      { term: "Corruption", definition: "Dishonest or immoral behavior by those in power" },
      { term: "Revolution", definition: "A forcible overthrow of a government or social order" },
    ],
    comprehensionQuestions: [
      { question: "What does Animal Farm represent?", answer: "The Russian Revolution and the rise of Soviet communism" },
      { question: "Who does Napoleon represent?", answer: "Joseph Stalin - a power-hungry dictator who uses force and propaganda" },
      { question: "Who does Snowball represent?", answer: "Leon Trotsky - an idealist leader who is eventually exiled" },
      { question: "What is the significance of the pigs walking on two legs?", answer: "It shows how the pigs have become indistinguishable from the humans they overthrew" },
      { question: "What does 'All animals are equal, but some are more equal than others' mean?", answer: "It shows the hypocrisy of the pigs claiming equality while giving themselves privileges" },
    ],
    flashcards: [
      { question: "What genre is Animal Farm?", answer: "Allegorical novella / Political satire", type: "short-answer" },
      { question: "Who wrote Animal Farm and when?", answer: "George Orwell, 1945", type: "short-answer" },
      { question: "What do the Seven Commandments represent?", answer: "The original ideals of the revolution that get corrupted over time", type: "short-answer" },
      { question: "What does Boxer's motto 'I will work harder' represent?", answer: "The exploitation of the loyal working class", type: "short-answer" },
      { question: "What happens to Boxer?", answer: "He is sold to a glue factory when he can no longer work", type: "short-answer" },
    ],
    summaryPoints: [
      "Animal Farm is an allegory for the Russian Revolution",
      "Napoleon represents Stalin; Snowball represents Trotsky",
      "The pigs gradually become corrupt and indistinguishable from humans",
      "Orwell warns about the dangers of totalitarianism and propaganda",
      "The commandments changing shows how truth can be manipulated",
    ],
  },
  writing: {
    type: "writing",
    writingPrompts: [
      {
        prompt: "Write a persuasive text arguing for or against social media use by teenagers",
        requirements: ["Clear contention stated early", "At least 3 supporting arguments", "Use of persuasive techniques (ethos, pathos, logos)", "Address a counterargument", "Strong concluding call to action"],
        structure: ["Introduction with hook and contention", "Body paragraph 1: Strongest argument", "Body paragraph 2: Supporting argument", "Body paragraph 3: Address counterargument", "Conclusion with call to action"],
      },
      {
        prompt: "Analyze how Orwell uses symbolism in Animal Farm to critique totalitarianism",
        requirements: ["Clear thesis statement", "At least 3 examples of symbolism", "Explain what each symbol represents", "Link to the broader message about power", "Use quotes from the text"],
        structure: ["Introduction with thesis", "Symbol 1: The windmill", "Symbol 2: The commandments", "Symbol 3: The pigs becoming human-like", "Conclusion linking to Orwell's message"],
      },
    ],
    summaryPoints: [
      "Start with a clear thesis or contention",
      "Use TEEL paragraphs: Topic, Explain, Evidence, Link",
      "Include relevant quotes and examples",
      "Use formal language in analytical writing",
      "Conclude by linking back to your main argument",
    ],
  },
};

export function getStudyContent(subjectId: SubjectId, taskTitle: string, week: number): StudyContent {
  const taskType = getTaskType(taskTitle);
  const term = week <= 9 ? 1 : 2;
  
  switch (subjectId) {
    case "science":
      if (term === 1) {
        return { ...scienceContent.chemistry, type: taskType };
      }
      return { ...scienceContent.biology, type: taskType };
    
    case "math":
      if (taskTitle.toLowerCase().includes("geometry") || taskTitle.toLowerCase().includes("measurement")) {
        return { ...mathContent.geometry, type: taskType };
      }
      if (taskTitle.toLowerCase().includes("statistic") || taskTitle.toLowerCase().includes("data")) {
        return { ...mathContent.statistics, type: taskType };
      }
      return { ...mathContent.algebra, type: taskType };
    
    case "history":
      if (term === 1) {
        return { ...humanitiesContent.history, type: taskType };
      }
      return { ...humanitiesContent.politics, type: taskType };
    
    case "english":
      if (term === 2 || taskTitle.toLowerCase().includes("animal farm")) {
        return { ...englishContent.animalFarm, type: taskType };
      }
      if (taskType === "writing") {
        return englishContent.writing;
      }
      return { ...englishContent.term1, type: taskType };
    
    default:
      return { type: taskType };
  }
}
