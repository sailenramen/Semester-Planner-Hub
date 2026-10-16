import { SubjectId, TOTAL_WEEKS } from "@shared/schema";

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
  /** For a multiple-choice question this is the exact text of one of `options`. */
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

// ===== Maths (Term 4) =====
// Every question is multiple choice: `answer` is the exact text of the correct
// option, so the study page can mark it without a second lookup.
const mathQuestions: PracticeQuestion[] = [
  {
    id: "m1",
    question: "A scatter plot shows the points rising from left to right. What type of correlation does this show?",
    options: ["Positive correlation", "Negative correlation", "No correlation", "Perfect causation"],
    answer: "Positive correlation",
    solution: "As one variable increases the other tends to increase, which is a positive correlation.",
    type: "multiple-choice",
  },
  {
    id: "m2",
    question: "A set of bivariate data has a correlation coefficient of r = -0.9. How would you describe it?",
    options: ["Strong negative correlation", "Weak negative correlation", "Strong positive correlation", "No correlation"],
    answer: "Strong negative correlation",
    solution: "The sign gives the direction (negative) and a value near -1 means the relationship is strong.",
    type: "multiple-choice",
  },
  {
    id: "m3",
    question: "A study finds a strong correlation between hours studied and test marks. What can you correctly conclude?",
    options: [
      "The two variables are related, but more evidence is needed before claiming one causes the other",
      "Studying more definitely causes higher marks",
      "The results must be wrong because correlation is meaningless",
      "Marks cause students to study more, and that is proven",
    ],
    answer: "The two variables are related, but more evidence is needed before claiming one causes the other",
    solution: "Correlation describes a relationship between two variables; only a controlled experiment can show causation.",
    type: "multiple-choice",
  },
  {
    id: "m4",
    question: "Why is a line of best fit drawn by eye onto a scatter plot?",
    options: [
      "To describe the overall trend of the data",
      "To join up every data point exactly",
      "To prove that the variables are causally related",
      "To remove outliers from the data set",
    ],
    answer: "To describe the overall trend of the data",
    solution: "The line of best fit summarises the trend so predictions and comparisons can be made.",
    type: "multiple-choice",
  },
  {
    id: "m5",
    question: "A survey is sent to 60 people and 45 reply. What is the response rate?",
    options: ["75%", "45%", "60%", "80%"],
    answer: "75%",
    solution: "45 ÷ 60 × 100 = 75%.",
    type: "multiple-choice",
  },
  {
    id: "m6",
    question: "What is the surface area of a cube with side length 3 cm?",
    options: ["54 cm²", "27 cm²", "36 cm²", "18 cm²"],
    answer: "54 cm²",
    solution: "A cube has 6 identical square faces: 6 × (3 × 3) = 54 cm².",
    type: "multiple-choice",
  },
  {
    id: "m7",
    question: "What is the volume of a rectangular prism measuring 4 cm × 3 cm × 5 cm?",
    options: ["60 cm³", "47 cm³", "12 cm³", "120 cm³"],
    answer: "60 cm³",
    solution: "Volume = length × width × height = 4 × 3 × 5 = 60 cm³.",
    type: "multiple-choice",
  },
  {
    id: "m8",
    question: "What is the volume of a cylinder with radius 2 cm and height 10 cm, in terms of π?",
    options: ["40π cm³", "20π cm³", "80π cm³", "10π cm³"],
    answer: "40π cm³",
    solution: "V = πr²h = π × 2² × 10 = 40π cm³.",
    type: "multiple-choice",
  },
  {
    id: "m9",
    question: "What is the surface area of a sphere with radius 3 cm, in terms of π?",
    options: ["36π cm²", "9π cm²", "18π cm²", "27π cm²"],
    answer: "36π cm²",
    solution: "SA = 4πr² = 4π × 9 = 36π cm².",
    type: "multiple-choice",
  },
  {
    id: "m10",
    question: "Which rule finds the volume of any prism?",
    options: ["Area of the base × height", "2πr", "4/3 πr³", "πr²"],
    answer: "Area of the base × height",
    solution: "A prism has a constant cross-section, so volume is the cross-sectional area multiplied by the length or height.",
    type: "multiple-choice",
  },
  {
    id: "m11",
    question: "The point (3, 1) is translated by the vector (2, -4). What are its new coordinates?",
    options: ["(5, -3)", "(1, 5)", "(5, 3)", "(-1, -3)"],
    answer: "(5, -3)",
    solution: "Add the vector to each coordinate: (3 + 2, 1 - 4) = (5, -3).",
    type: "multiple-choice",
  },
  {
    id: "m12",
    question: "The point (4, -2) is reflected in the y-axis. What are its new coordinates?",
    options: ["(-4, -2)", "(4, 2)", "(-4, 2)", "(2, -4)"],
    answer: "(-4, -2)",
    solution: "A reflection in the y-axis changes the sign of the x-coordinate only.",
    type: "multiple-choice",
  },
  {
    id: "m13",
    question: "The point (1, 0) is rotated 90° anticlockwise about the origin. Where does it land?",
    options: ["(0, 1)", "(0, -1)", "(-1, 0)", "(1, 1)"],
    answer: "(0, 1)",
    solution: "A 90° anticlockwise rotation maps (x, y) to (-y, x), so (1, 0) becomes (0, 1).",
    type: "multiple-choice",
  },
  {
    id: "m14",
    question: "A 2D shape is enlarged by a scale factor of 3. Its area is multiplied by what?",
    options: ["9", "3", "6", "27"],
    answer: "9",
    solution: "Area scales by the square of the scale factor: 3² = 9. (Volume would scale by 3³ = 27.)",
    type: "multiple-choice",
  },
  {
    id: "m15",
    question: "Which regular polygon tessellates on its own?",
    options: ["Regular hexagon", "Regular pentagon", "Regular octagon", "Regular decagon"],
    answer: "Regular hexagon",
    solution: "A regular hexagon has interior angles of 120° and 3 × 120° = 360°, so the tiles meet exactly at a point. A pentagon's 108°, octagon's 135° and decagon's 144° do not divide 360°.",
    type: "multiple-choice",
  },
  {
    id: "m16",
    question: "What is the size of each interior angle of a regular hexagon?",
    options: ["120°", "60°", "108°", "135°"],
    answer: "120°",
    solution: "Interior angle = (6 - 2) × 180° ÷ 6 = 120°.",
    type: "multiple-choice",
  },
  {
    id: "m17",
    question: "In a right-angled triangle the hypotenuse is 10 cm and one angle is 30°. How long is the side opposite that angle?",
    options: ["5 cm", "8.66 cm", "10 cm", "20 cm"],
    answer: "5 cm",
    solution: "sin 30° = opposite ÷ hypotenuse, so opposite = 10 × 0.5 = 5 cm.",
    type: "multiple-choice",
  },
  {
    id: "m18",
    question: "Using tan 40° = x ÷ 8, find x correct to 2 decimal places.",
    options: ["6.71", "5.14", "9.53", "4.20"],
    answer: "6.71",
    solution: "x = 8 × tan 40° ≈ 8 × 0.8391 ≈ 6.71.",
    type: "multiple-choice",
  },
  {
    id: "m19",
    question: "A 15 m tower is viewed from a point 20 m from its base. What is the angle of elevation of the top, to 1 decimal place?",
    options: ["36.9°", "48.6°", "53.1°", "41.4°"],
    answer: "36.9°",
    solution: "tan θ = 15 ÷ 20 = 0.75, so θ = tan⁻¹(0.75) ≈ 36.9°.",
    type: "multiple-choice",
  },
  {
    id: "m20",
    question: "What is the bearing of east?",
    options: ["090°", "000°", "180°", "270°"],
    answer: "090°",
    solution: "Bearings are measured clockwise from north, so east is 090°.",
    type: "multiple-choice",
  },
  {
    id: "m21",
    question: "A boat is 50 m from the base of a 30 m cliff. What is the angle of depression from the top of the cliff to the boat, to 1 decimal place?",
    options: ["31.0°", "59.0°", "36.9°", "53.1°"],
    answer: "31.0°",
    solution: "The angle of depression equals the angle of elevation from the boat: tan θ = 30 ÷ 50, so θ ≈ 31.0°.",
    type: "multiple-choice",
  },
  {
    id: "m22",
    question: "What is the length of an arc with radius 6 cm and angle at the centre 60°, in terms of π?",
    options: ["2π cm", "6π cm", "π cm", "3π cm"],
    answer: "2π cm",
    solution: "Arc length = (60 ÷ 360) × 2πr = (1/6) × 12π = 2π cm.",
    type: "multiple-choice",
  },
  {
    id: "m23",
    question: "What is the area of a sector with radius 4 cm and angle at the centre 90°, in terms of π?",
    options: ["4π cm²", "2π cm²", "8π cm²", "16π cm²"],
    answer: "4π cm²",
    solution: "Sector area = (90 ÷ 360) × πr² = (1/4) × 16π = 4π cm².",
    type: "multiple-choice",
  },
  {
    id: "m24",
    question: "An angle at the circumference is 35°. What is the angle at the centre standing on the same arc?",
    options: ["70°", "35°", "17.5°", "145°"],
    answer: "70°",
    solution: "The angle at the centre is twice the angle at the circumference: 2 × 35° = 70°.",
    type: "multiple-choice",
  },
  {
    id: "m25",
    question: "What is the size of the angle in a semicircle?",
    options: ["90°", "180°", "60°", "45°"],
    answer: "90°",
    solution: "The angle in a semicircle is always a right angle (90°).",
    type: "multiple-choice",
  },
  {
    id: "m26",
    question: "A tangent touches a circle at the point of contact with a radius. What angle do they make?",
    options: ["90°", "180°", "45°", "60°"],
    answer: "90°",
    solution: "A tangent is perpendicular to the radius at the point of contact.",
    type: "multiple-choice",
  },
  {
    id: "m27",
    question: "Two chords intersect inside a circle. AP = 4 cm, PB = 9 cm and CP = 6 cm. Using AP × PB = CP × PD, find PD.",
    options: ["6 cm", "9 cm", "4 cm", "13.5 cm"],
    answer: "6 cm",
    solution: "4 × 9 = 36, so 6 × PD = 36 and PD = 6 cm.",
    type: "multiple-choice",
  },
  {
    id: "m28",
    question: "What do the opposite angles of a cyclic quadrilateral add up to?",
    options: ["180°", "360°", "90°", "270°"],
    answer: "180°",
    solution: "Opposite angles in a cyclic quadrilateral are supplementary: they add to 180°.",
    type: "multiple-choice",
  },
  {
    id: "m29",
    question: "What is the volume of a cylinder with radius 5 cm and height 4 cm, in terms of π?",
    options: ["100π cm³", "40π cm³", "25π cm³", "20π cm³"],
    answer: "100π cm³",
    solution: "V = πr²h = π × 25 × 4 = 100π cm³.",
    type: "multiple-choice",
  },
  {
    id: "m30",
    question: "Two transformations are applied to a shape. What does 'replacing transformations' mean?",
    options: [
      "Finding a single transformation that has the same effect as the two together",
      "Drawing the shape again in the same place",
      "Removing the shape from the grid",
      "Changing the scale factor only",
    ],
    answer: "Finding a single transformation that has the same effect as the two together",
    solution: "For example, two reflections can be replaced by a translation or a rotation.",
    type: "multiple-choice",
  },
];

const mathContent: StudyContent = {
  type: "practice",
  vocabulary: [
    { term: "Bivariate data", definition: "Data where two variables are recorded for each individual" },
    { term: "Correlation", definition: "A relationship between two variables; it does not prove causation" },
    { term: "Line of best fit", definition: "A line drawn by eye that describes the trend of a scatter plot" },
    { term: "Response rate", definition: "The percentage of people surveyed who reply" },
    { term: "Surface area", definition: "The total area of all the outer faces of a 3D shape" },
    { term: "Volume", definition: "The amount of space inside a 3D shape, in cubic units" },
    { term: "Transformation", definition: "A change of position or size: translation, rotation, reflection or enlargement" },
    { term: "Tessellation", definition: "Shapes fitting together to cover a plane with no gaps or overlaps" },
    { term: "Trigonometric ratio", definition: "sin, cos or tan — a ratio of two sides of a right-angled triangle" },
    { term: "Angle of elevation", definition: "The angle measured up from the horizontal to an object" },
    { term: "Angle of depression", definition: "The angle measured down from the horizontal to an object" },
    { term: "Bearing", definition: "A direction measured clockwise from north, written with three figures" },
    { term: "Arc", definition: "A part of the circumference of a circle" },
    { term: "Sector", definition: "The region of a circle bounded by two radii and an arc" },
    { term: "Chord", definition: "A straight line joining two points on the circumference" },
    { term: "Cyclic quadrilateral", definition: "A four-sided shape whose vertices all lie on a circle" },
  ],
  practiceQuestions: mathQuestions,
  summaryPoints: [
    "Chapter 9: bivariate data and correlation — describe the trend, draw a line of best fit, and remember correlation is not causation",
    "Chapter 5: surface area and volume of prisms, cylinders, spheres and other 3D shapes",
    "Chapter 5: transformations — translation, rotation, reflection and enlargement; regular and semi-regular tessellation; one transformation can replace two",
    "Chapter 7: right-angled triangles — SOH CAH TOA, angles of elevation and depression, and bearings (three figures, clockwise from north)",
    "Chapter 7: circles — arc length and sector area as fractions of the whole circle, chord length, and the circle theorems including intersecting chords (AP × PB = CP × PD)",
    "Enlargement by scale factor k multiplies lengths by k, areas by k² and volumes by k³",
  ],
};

// ===== Psychology (Term 4, taught in the Science slot) =====
const scienceQuestions: PracticeQuestion[] = [
  // Week 1 — Introduction to Psychology; variables, hypothesis and correlation vs causation
  {
    id: "s1",
    question: "Psychology is defined as the scientific study of which of the following?",
    options: [
      "Human thoughts, feelings and behaviour",
      "Only behaviour that can be measured",
      "The structure of the brain in animals",
      "Mental illness and its treatment",
    ],
    answer: "Human thoughts, feelings and behaviour",
    solution: "The booklet defines psychology as the scientific study of human thoughts, feelings and behaviour. Psyche means mind and logos means knowledge.",
    type: "multiple-choice",
  },
  {
    id: "s2",
    question: "Which of these is one of the major branches of psychology listed in the booklet?",
    options: ["Forensic psychology", "Astrological psychology", "Veterinary psychology", "Forensic chemistry"],
    answer: "Forensic psychology",
    solution: "The booklet lists biological, cognitive, developmental, social, educational, forensic, sports and consumer psychology as the major branches.",
    type: "multiple-choice",
  },
  {
    id: "s3",
    question: "A student investigates whether the number of study hours influences exam scores. What is the independent variable?",
    options: [
      "The number of study hours",
      "The exam scores",
      "The number of students in the study",
      "The subject the exam is in",
    ],
    answer: "The number of study hours",
    solution: "The IV is what the researcher changes — the number of study hours. The exam scores are the DV, which is what is measured.",
    type: "multiple-choice",
  },
  {
    id: "s4",
    question: "Which four elements must be included in a hypothesis?",
    options: [
      "Population, IV (experimental condition), DV (direction of prediction) and IV (control condition)",
      "Aim, method, results and conclusion",
      "Population, sample, ethics and debriefing",
      "IV, DV, correlation and causation",
    ],
    answer: "Population, IV (experimental condition), DV (direction of prediction) and IV (control condition)",
    solution: "The booklet states that every hypothesis includes the population, the IV (experimental condition), the DV (direction of prediction) and the IV (control condition).",
    type: "multiple-choice",
  },
  {
    id: "s5",
    question: "What are extraneous variables?",
    options: [
      "Variables other than the IV that may have an unwanted effect on the DV and the results",
      "The variables that are held constant during an experiment",
      "The variable the researcher deliberately changes",
      "The variable that is measured at the end of the experiment",
    ],
    answer: "Variables other than the IV that may have an unwanted effect on the DV and the results",
    solution: "Extraneous variables may have an unwanted effect on the DV; controlled variables are held constant so that the only influence on the DV is the IV.",
    type: "multiple-choice",
  },
  {
    id: "s6",
    question: "A study compares students who study for four hours with students who study for zero hours. Which group is the experimental group?",
    options: [
      "The group that studies for four hours, because the IV is present",
      "The group that studies for zero hours, because the IV is absent",
      "Both groups, because both take the exam",
      "Neither group, because this is not an experiment",
    ],
    answer: "The group that studies for four hours, because the IV is present",
    solution: "The experimental group is exposed to the experimental condition in which the IV is present (studying 4 hours); the control group is exposed to the control condition in which the IV is absent (studying 0 hours).",
    type: "multiple-choice",
  },
  {
    id: "s7",
    question: "Students who sleep more hours often report feeling happier. What does this finding show?",
    options: [
      "The two variables are correlated, but that does not prove sleep causes happiness",
      "Sleep definitely causes happiness",
      "There is no relationship between sleep and happiness",
      "A controlled experiment has proven causation",
    ],
    answer: "The two variables are correlated, but that does not prove sleep causes happiness",
    solution: "Correlation means two variables are related — when one changes, the other tends to change too — but the link could be due to another factor, such as less stress. Causation means one variable directly affects another and can only be tested with a controlled experiment.",
    type: "multiple-choice",
  },

  // Week 2 — Regions of the brain; somatic and autonomic nervous systems
  {
    id: "s8",
    question: "Which part of the brain is the lowest part, located at the back of the skull, and controls breathing, heart rate and coordination?",
    options: ["The hindbrain", "The midbrain", "The forebrain", "The cerebral cortex"],
    answer: "The hindbrain",
    solution: "The hindbrain controls the vital functions that keep us alive, such as breathing, heart rate and coordination. The cerebellum, part of the hindbrain, helps us balance, move smoothly and maintain posture.",
    type: "multiple-choice",
  },
  {
    id: "s9",
    question: "Which description matches the midbrain?",
    options: [
      "A bridge between the lower and higher parts of the brain that controls basic eye movements",
      "The largest and most complex part of the brain",
      "The part that controls breathing and heart rate",
      "The wrinkled outer layer that processes touch",
    ],
    answer: "A bridge between the lower and higher parts of the brain that controls basic eye movements",
    solution: "The midbrain controls basic movements of the eyes, processes sensory information such as sight and sound, and lets you automatically turn your head towards a sudden noise or bright light.",
    type: "multiple-choice",
  },
  {
    id: "s10",
    question: "Which lobe of the cerebral cortex is responsible for hearing, memory and language?",
    options: ["The temporal lobe", "The frontal lobe", "The parietal lobe", "The occipital lobe"],
    answer: "The temporal lobe",
    solution: "The temporal lobe handles hearing, memory and language; the occipital lobe processes visual information from the eyes and the parietal lobe processes touch and spatial awareness.",
    type: "multiple-choice",
  },
  {
    id: "s11",
    question: "Which two structures make up the central nervous system (CNS)?",
    options: [
      "The brain and the spinal cord",
      "The somatic and autonomic nervous systems",
      "The sensory and motor neurons",
      "The receptors and the effectors",
    ],
    answer: "The brain and the spinal cord",
    solution: "The CNS is the brain and spinal cord; the peripheral nervous system (PNS) connects the CNS to the rest of the body and includes the somatic nervous system (SNS) and the autonomic nervous system (ANS).",
    type: "multiple-choice",
  },
  {
    id: "s12",
    question: "In the somatic nervous system pathway, what carries the message towards the CNS?",
    options: [
      "A sensory neuron along the afferent pathway",
      "A motor neuron along the efferent pathway",
      "The effector",
      "The receptor",
    ],
    answer: "A sensory neuron along the afferent pathway",
    solution: "The receptor detects the stimulus, a sensory neuron carries the message towards the CNS along the afferent pathway, the brain interprets the message and decides how to respond, a motor neuron carries the signal away from the CNS to the muscles, and the effector performs the action.",
    type: "multiple-choice",
  },
  {
    id: "s13",
    question: "After a stressful situation has passed, which system calms the body by slowing the heart rate and supporting digestion?",
    options: [
      "The parasympathetic nervous system",
      "The sympathetic nervous system",
      "The somatic nervous system",
      "The central nervous system",
    ],
    answer: "The parasympathetic nervous system",
    solution: "The parasympathetic nervous system is the 'rest and digest' system: it slows the heart rate, supports digestion, relaxes the muscles and returns the body to a steady, balanced state. The sympathetic system, the 'fight or flight' system, does the opposite.",
    type: "multiple-choice",
  },

  // Week 3 — Neuron structure and neurotransmission
  {
    id: "s14",
    question: "What is the function of the myelin sheath?",
    options: [
      "It insulates the axon and speeds up information transmission",
      "It stores and releases neurotransmitters",
      "It receives information from other neurons",
      "It processes information before it travels down the axon",
    ],
    answer: "It insulates the axon and speeds up information transmission",
    solution: "The myelin sheath covers most axons in the human body. It is a fatty substance that acts as insulation and helps speed up information transmission in the nervous system.",
    type: "multiple-choice",
  },
  {
    id: "s15",
    question: "Which structure receives information from other neurons and typically branches from the cell body?",
    options: ["The dendrite", "The axon", "The axon terminal", "The myelin sheath"],
    answer: "The dendrite",
    solution: "Dendrites receive information from other neurons. The soma (cell body) receives information from the dendrites and passes it down the axon, which transmits the signal to other cells.",
    type: "multiple-choice",
  },
  {
    id: "s16",
    question: "Which sequence correctly describes neurotransmission?",
    options: [
      "Electrical impulse → neurotransmitter release → synapse → receptor sites → reuptake",
      "Neurotransmitter release → electrical impulse → receptor sites → synapse → reuptake",
      "Reuptake → synapse → neurotransmitter release → receptor sites → electrical impulse",
      "Synapse → electrical impulse → reuptake → receptor sites → neurotransmitter release",
    ],
    answer: "Electrical impulse → neurotransmitter release → synapse → receptor sites → reuptake",
    solution: "When an impulse reaches the axon terminals it triggers the release of neurotransmitters, which cross the synapse and attach to receptor sites on the dendrites of the next neuron. Afterwards the neurotransmitters are broken down or reabsorbed by the original neuron.",
    type: "multiple-choice",
  },
  {
    id: "s17",
    question: "What happens during reuptake?",
    options: [
      "Neurotransmitters are broken down or reabsorbed by the original neuron",
      "Neurotransmitters remain in the synapse permanently",
      "The electrical impulse travels back up the axon",
      "The receptor sites release hormones into the blood",
    ],
    answer: "Neurotransmitters are broken down or reabsorbed by the original neuron",
    solution: "After the signal is passed on, the neurotransmitters are either broken down or reabsorbed by the original neuron. This process is called reuptake.",
    type: "multiple-choice",
  },
  {
    id: "s18",
    question: "What do inhibitory neurotransmitters do?",
    options: [
      "They decrease the likelihood that the next neuron will fire, calming neural activity",
      "They increase the likelihood that the next neuron will fire",
      "They speed up the electrical impulse along the axon",
      "They store information in long-term memory",
    ],
    answer: "They decrease the likelihood that the next neuron will fire, calming neural activity",
    solution: "Inhibitory neurotransmitters make it less likely the next neuron will fire, helping to slow down or calm neural activity so the brain does not become overloaded. Excitatory neurotransmitters do the opposite. Examples to know are dopamine, serotonin, acetylcholine, endorphins, GABA and glutamate.",
    type: "multiple-choice",
  },

  // Week 4 — Memory, schema and sampling methods
  {
    id: "s19",
    question: "Which sequence matches the three stages of memory in the Atkinson-Shiffrin model?",
    options: [
      "Sensory memory → short-term memory → long-term memory",
      "Short-term memory → sensory memory → long-term memory",
      "Long-term memory → short-term memory → sensory memory",
      "Sensory memory → long-term memory → short-term memory",
    ],
    answer: "Sensory memory → short-term memory → long-term memory",
    solution: "Sensory memory holds information from the senses for just a few seconds, short-term memory stores small amounts for about 20–30 seconds, and long-term memory stores information more permanently. Memory itself is the process of encoding, storing and retrieving information.",
    type: "multiple-choice",
  },
  {
    id: "s20",
    question: "A student recalls material better in the quiet room where she first studied it. Which factor is this?",
    options: ["Context-dependent memory", "Interference", "Maintenance rehearsal", "Schema"],
    answer: "Context-dependent memory",
    solution: "People often remember information better when they are in the same setting, mood or environment in which they first learned it. This is known as context-dependent memory.",
    type: "multiple-choice",
  },
  {
    id: "s21",
    question: "A student repeats a phone number over and over in their head to keep it active. Which type of rehearsal is this?",
    options: ["Maintenance rehearsal", "Elaborative rehearsal", "Organisation", "Interference"],
    answer: "Maintenance rehearsal",
    solution: "Maintenance rehearsal repeats information over and over to keep it active in short-term memory, but it does not usually make it stay for long. Elaborative rehearsal is deeper: it connects the information to something meaningful, such as an image or something you already know.",
    type: "multiple-choice",
  },
  {
    id: "s22",
    question: "A witness is certain she saw the thief wearing a hat, even though the thief wore none. Which concept best explains this?",
    options: ["Schema", "Reuptake", "Correlation", "Resilience"],
    answer: "Schema",
    solution: "A schema is a mental framework or template built from past experiences that guides how we interpret new situations. Sometimes the brain fills in missing information based on what we expect rather than what is actually there, causing misunderstandings, assumptions and false memories.",
    type: "multiple-choice",
  },
  {
    id: "s23",
    question: "A Year 9 cohort is 60% girls and 40% boys. A researcher selects 6 girls and 4 boys out of 10 students to keep those proportions. Which sampling method is this?",
    options: ["Stratified sampling", "Convenience sampling", "Random sampling", "Snowball sampling"],
    answer: "Stratified sampling",
    solution: "Stratified sampling divides the population into strata — categories or subgroups such as age, gender or year level — and selects participants from each subgroup in the same proportion they appear in the population. Convenience sampling selects whoever is easiest to reach, and random sampling gives everyone an equal chance of being chosen.",
    type: "multiple-choice",
  },

  // Week 5 — Research design and ethics
  {
    id: "s24",
    question: "Which statement describes a within-subject design?",
    options: [
      "All participants are involved in both the experimental and control conditions",
      "Participants are randomly allocated to either the experimental or control condition",
      "Each participant chooses which condition to take part in",
      "No control condition is used",
    ],
    answer: "All participants are involved in both the experimental and control conditions",
    solution: "In a within-subject design all participants in the sample take part in both the experimental and control conditions. In a between-subject design participants are randomly allocated to either the experimental or the control condition.",
    type: "multiple-choice",
  },
  {
    id: "s25",
    question: "Which of the following is one of the key ethical principles in psychology research?",
    options: [
      "The right to withdraw",
      "The right to be paid for taking part",
      "The right to see the results before they are published",
      "The right to choose the hypothesis",
    ],
    answer: "The right to withdraw",
    solution: "The principles are informed consent, right to withdraw, no harm, confidentiality and privacy, deception, debriefing and volunteer participation.",
    type: "multiple-choice",
  },
  {
    id: "s26",
    question: "At the end of a study, the researcher explains the true purpose of the research to the participants. Which ethical principle is this?",
    options: ["Debriefing", "Deception", "Informed consent", "Confidentiality and privacy"],
    answer: "Debriefing",
    solution: "Debriefing explains the study to participants afterwards and addresses any harm, especially where deception was used.",
    type: "multiple-choice",
  },
  {
    id: "s27",
    question: "Why does modern psychology follow strict ethical standards?",
    options: [
      "Historical studies showed what happens when ethical rules are not followed — participants were deceived, stressed or not given the choice to stop participating",
      "Strict standards make studies quicker to run",
      "All participants must be paid for their time",
      "Ethics guidelines are only needed for medical research",
    ],
    answer: "Historical studies showed what happens when ethical rules are not followed — participants were deceived, stressed or not given the choice to stop participating",
    solution: "The booklet notes that because of studies such as the Stanford Prison Experiment (Zimbardo, 1971), Milgram's Obedience Study (1963), the Little Albert Experiment (Watson & Rayner, 1920) and the Asch Conformity Experiment (1951), modern psychology developed strict ethical standards that every researcher must follow.",
    type: "multiple-choice",
  },

  // Week 6 — Biopsychosocial approach to wellbeing
  {
    id: "s28",
    question: "Which three types of factors does the biopsychosocial approach consider?",
    options: [
      "Biological, psychological and social",
      "Biological, chemical and physical",
      "Genetic, economic and cultural only",
      "Physical, emotional and financial",
    ],
    answer: "Biological, psychological and social",
    solution: "The approach explains wellbeing through the combined effects of biological factors (brain chemistry, hormones, sleep, nutrition, exercise, family medical history), psychological factors (thought patterns, beliefs, coping skills, personality, resilience) and social factors (family relationships, friendships, cultural background, school environment, community support, socioeconomic conditions).",
    type: "multiple-choice",
  },
  {
    id: "s29",
    question: "Mental health is described as falling on a continuum. What does this mean?",
    options: [
      "A person's mental health changes throughout life depending on their experiences and their resilience",
      "A person is either completely healthy or completely unwell for life",
      "Mental health is fixed at birth and never changes",
      "Mental health only changes if a person receives treatment",
    ],
    answer: "A person's mental health changes throughout life depending on their experiences and their resilience",
    solution: "The booklet describes mental health as falling on a spectrum or continuum that changes throughout life depending on the experiences a person has and their resilience — their ability to cope with their experiences, including adverse ones.",
    type: "multiple-choice",
  },
  {
    id: "s30",
    question: "The booklet asks whether a biopsychosocial approach sufficiently explains the experience of the Stolen Generations. What does that experience highlight?",
    options: [
      "Historical trauma, cultural disconnection and community harm that affect wellbeing across generations",
      "That biological factors are the only ones that matter",
      "That social factors never affect wellbeing",
      "That the model has no relevance to First Nations peoples",
    ],
    answer: "Historical trauma, cultural disconnection and community harm that affect wellbeing across generations",
    solution: "Wellbeing for Aboriginal and Torres Strait Islander peoples also includes cultural connection, connection to Country, spirituality and community, so the model is evaluated on whether it fully captures historical trauma and cultural disconnection.",
    type: "multiple-choice",
  },
];

const scienceContent: StudyContent = {
  type: "practice",
  vocabulary: [
    { term: "Psychology", definition: "The scientific study of human thoughts, feelings and behaviour; psyche means mind and logos means knowledge" },
    { term: "Aim", definition: "The purpose of a study; it includes the variables being studied" },
    { term: "Independent variable (IV)", definition: "The variable the researcher changes, for example zero, one or two cups of water" },
    { term: "Dependent variable (DV)", definition: "The variable that is measured, for example the size of the plants" },
    { term: "Experimental group", definition: "The group exposed to the experimental condition, in which the IV is present" },
    { term: "Control group", definition: "The group exposed to the control condition, in which the IV is absent" },
    { term: "Hypothesis", definition: "A prediction of whether the IV will affect the DV; it includes the population, IV (experimental condition), DV (direction of prediction) and IV (control condition)" },
    { term: "Extraneous variable", definition: "A variable other than the IV that may have an unwanted effect on the DV and the results" },
    { term: "Controlled variable", definition: "A variable held constant so the only influence on the DV is the IV" },
    { term: "Correlation", definition: "Two variables are related; when one changes, the other tends to change too — but not necessarily causally" },
    { term: "Causation", definition: "One variable directly affects another; tested with a controlled experiment that compares control and experimental groups" },
    { term: "Hindbrain", definition: "The lowest part of the brain, at the back of the skull; controls vital functions such as breathing, heart rate and coordination" },
    { term: "Cerebellum", definition: "The part of the hindbrain that helps us balance, move smoothly and maintain posture" },
    { term: "Midbrain", definition: "The small region that bridges the lower and higher parts of the brain, controls basic eye movements and processes sensory information" },
    { term: "Forebrain", definition: "The largest and most complex region; involved in thinking, learning, memory and emotion, and contains the thalamus, hypothalamus and cerebrum" },
    { term: "Cerebral cortex", definition: "The wrinkled outer layer covering much of the forebrain that allows humans to think, reason and make decisions" },
    { term: "Four cortical lobes", definition: "Frontal (reasoning, planning, movement, emotions), parietal (touch, spatial awareness), temporal (hearing, memory, language) and occipital (vision)" },
    { term: "Somatic nervous system (SNS)", definition: "The division of the PNS that controls all voluntary movements, using receptors, neurons and effectors" },
    { term: "Autonomic nervous system (ANS)", definition: "The division of the PNS that controls automatic functions such as heart rate, breathing, digestion and the release of hormones" },
    { term: "Sympathetic nervous system", definition: "The 'fight or flight' branch: increases heart rate, releases adrenaline, slows digestion and makes the body more alert" },
    { term: "Parasympathetic nervous system", definition: "The 'rest and digest' branch: slows the heart rate, supports digestion, relaxes the muscles and restores balance" },
    { term: "Neuron", definition: "An individual nerve cell specialised to receive, process and/or transmit information" },
    { term: "Dendrite", definition: "A projection that branches from the cell body and receives information from other neurons" },
    { term: "Myelin sheath", definition: "The fatty insulation covering most axons that speeds up information transmission" },
    { term: "Axon terminal", definition: "The structures at the end of the axon that store and release neurotransmitters" },
    { term: "Neurotransmission", definition: "The electrical and chemical process by which neurons communicate, sending messages throughout the brain and body" },
    { term: "Synapse", definition: "The small gap between neurons that neurotransmitters cross to reach the next neuron" },
    { term: "Reuptake", definition: "When neurotransmitters are broken down or reabsorbed by the original neuron after the signal is passed on" },
    { term: "Excitatory neurotransmitter", definition: "Increases the likelihood that the next neuron will fire an electrical signal" },
    { term: "Inhibitory neurotransmitter", definition: "Decreases the likelihood that the next neuron will fire, calming neural activity" },
    { term: "Encoding, storage and retrieval", definition: "The three steps of memory: taking information in, keeping it over time, and bringing it back into conscious mind" },
    { term: "Sensory memory", definition: "Holds information from the senses for just a few seconds" },
    { term: "Short-term memory", definition: "Stores small amounts of information you are actively thinking about, usually for 20–30 seconds" },
    { term: "Long-term memory", definition: "Where information is stored more permanently, allowing recall of past experiences, knowledge and skills" },
    { term: "Maintenance rehearsal", definition: "Repeating information over and over to keep it active in short-term memory" },
    { term: "Elaborative rehearsal", definition: "Deeper processing that connects new information to something meaningful so it is more likely to be stored" },
    { term: "Context-dependent memory", definition: "Remembering better in the same setting, mood or environment in which the information was first learned" },
    { term: "Interference", definition: "When new information disrupts old memories, or old information makes new learning harder" },
    { term: "Schema", definition: "A mental framework or template built from past experiences that guides interpretation and can cause false memories" },
    { term: "Sample", definition: "A smaller group of people who represent the larger population being studied" },
    { term: "Convenience sampling", definition: "Selecting people who are easy to reach; quick, simple and inexpensive but can be biased" },
    { term: "Random sampling", definition: "Everyone in the population has an equal chance of being chosen; more representative but takes more time to organise" },
    { term: "Stratified sampling", definition: "Dividing the population into strata and selecting participants from each subgroup in the same proportion" },
    { term: "Within-subject design", definition: "All participants in the sample are involved in both the experimental and control conditions" },
    { term: "Between-subject design", definition: "Participants are randomly allocated to either the experimental or the control condition" },
    { term: "Ethics", definition: "The moral principles and rules that guide how research should be conducted and protect participants" },
    { term: "Informed consent", definition: "Participants agree to take part after being told what the study involves" },
    { term: "Right to withdraw", definition: "Participants can leave a study at any time" },
    { term: "Debriefing", definition: "Explaining the true purpose of the study to participants afterwards and addressing any harm" },
    { term: "Resilience", definition: "The ability to cope with stress, adapt to change and bounce back after difficulties" },
    { term: "Biopsychosocial model", definition: "Explains wellbeing through the interaction of biological, psychological and social factors" },
    { term: "Protective factors", definition: "Positive influences in the biological, psychological and social areas that protect wellbeing and reduce the likelihood of mental illness" },
  ],
  practiceQuestions: scienceQuestions,
  summaryPoints: [
    "Week 1: psychology as the scientific study of thoughts, feelings and behaviour and its major branches; the aim, IV, DV, experimental and control groups; controlled and extraneous variables; the four elements of a hypothesis; correlation does not prove causation",
    "Week 2: the hindbrain, midbrain and forebrain and the four cortical lobes; the CNS and the PNS; the SNS pathway (receptor → sensory neuron → brain → motor neuron → effector); the ANS with its sympathetic ('fight or flight') and parasympathetic ('rest and digest') divisions",
    "Week 3: neuron structures and their functions (dendrite, soma, axon, myelin sheath, axon terminal); neurotransmission (electrical impulse → transmitter release → synapse → receptor sites → reuptake); excitatory and inhibitory neurotransmitters",
    "Week 4: memory as encoding, storage and retrieval; sensory, short-term and long-term memory; factors influencing recall (attention, rehearsal, organisation, context, interference); schemas and false memories; convenience, random and stratified sampling with their advantages and limitations",
    "Week 5: within-subject and between-subject research designs and their strengths and limitations; the seven ethical principles; the historical studies (Zimbardo, Milgram, Watson & Rayner, Asch) that drove ethical reform",
    "Week 6: the mental health continuum and resilience; the biopsychosocial model's biological, psychological and social factors and protective factors; First Nations wellbeing — cultural connection, Country, spirituality and community, and the Stolen Generations",
    "Week 7: SBA 2 — the rehearsal practical comparing maintenance and elaborative rehearsal (Group A vs Group B) plus application questions",
  ],
};

// ===== Legal Studies (Term 4, taught in the History/Humanities slot) =====
const historyQuestions: PracticeQuestion[] = [
  {
    id: "h1",
    question: "Which two houses make up the Commonwealth Parliament?",
    options: [
      "The House of Representatives and the Senate",
      "The House of Representatives and the High Court",
      "The Senate and the Governor-General",
      "The Legislative Assembly and the Legislative Council",
    ],
    answer: "The House of Representatives and the Senate",
    solution: "The Commonwealth Parliament is bicameral: the House of Representatives and the Senate, with the King represented by the Governor-General.",
    type: "multiple-choice",
  },
  {
    id: "h2",
    question: "Which house of the Commonwealth Parliament is formed on the basis of population?",
    options: ["The House of Representatives", "The Senate", "The High Court", "The Executive Council"],
    answer: "The House of Representatives",
    solution: "The House of Representatives is based on population, while the Senate gives equal representation to each state.",
    type: "multiple-choice",
  },
  {
    id: "h3",
    question: "Australia is a constitutional monarchy. What does this mean?",
    options: [
      "The King is head of state, represented by the Governor-General, and power is limited by a constitution",
      "The monarch makes all laws without parliament",
      "The Prime Minister is the head of state",
      "There is no head of state",
    ],
    answer: "The King is head of state, represented by the Governor-General, and power is limited by a constitution",
    solution: "In a constitutional monarchy the monarch is head of state but the constitution limits their power and parliament makes the laws.",
    type: "multiple-choice",
  },
  {
    id: "h4",
    question: "What is a concurrent power?",
    options: [
      "A power shared by both the Commonwealth and the states",
      "A power held only by the Commonwealth",
      "A power left with the states alone",
      "A power held only by local councils",
    ],
    answer: "A power shared by both the Commonwealth and the states",
    solution: "Concurrent powers are shared, for example taxation. Exclusive powers belong only to the Commonwealth and residual powers remain with the states.",
    type: "multiple-choice",
  },
  {
    id: "h5",
    question: "Which type of power is left with the states because it is not listed in the Constitution?",
    options: ["Residual power", "Exclusive power", "Concurrent power", "Specific power"],
    answer: "Residual power",
    solution: "Residual powers, such as education and health, stay with the states because they are not given to the Commonwealth.",
    type: "multiple-choice",
  },
  {
    id: "h6",
    question: "What does the rule of law mean?",
    options: [
      "No one is above the law and everyone is subject to the same laws",
      "The police can make the law when needed",
      "Judges are above the law",
      "Only parliament must obey the law",
    ],
    answer: "No one is above the law and everyone is subject to the same laws",
    solution: "The rule of law means the law applies equally to everyone, including governments and their officials.",
    type: "multiple-choice",
  },
  {
    id: "h7",
    question: "How is common law made?",
    options: [
      "By judges through their decisions in cases",
      "By parliament passing an Act",
      "By a vote of the people at a referendum",
      "By statutory authorities writing regulations",
    ],
    answer: "By judges through their decisions in cases",
    solution: "Common law (case law) develops through judges' decisions. Parliament makes legislation and statutory authorities make rules under it.",
    type: "multiple-choice",
  },
  {
    id: "h8",
    question: "What is precedent?",
    options: [
      "A past court decision that guides later courts deciding similar cases",
      "An Act passed by parliament this year",
      "A rule made by a local council",
      "A question put to the jury",
    ],
    answer: "A past court decision that guides later courts deciding similar cases",
    solution: "Under the doctrine of precedent, lower courts follow the decisions of higher courts in similar cases.",
    type: "multiple-choice",
  },
  {
    id: "h9",
    question: "Which body can make laws under an Act of parliament?",
    options: ["A statutory authority", "A jury", "The police", "The Governor-General alone"],
    answer: "A statutory authority",
    solution: "Statutory authorities are created by legislation and can make rules (delegated legislation) within their area.",
    type: "multiple-choice",
  },
  {
    id: "h10",
    question: "What does equality before the law mean?",
    options: [
      "Everyone is subject to the same laws, regardless of wealth or status",
      "Everyone gets the same sentence for every crime",
      "Everyone must be represented by the same lawyer",
      "The wealthy can pay for a different law",
    ],
    answer: "Everyone is subject to the same laws, regardless of wealth or status",
    solution: "Equality before the law means a person's wealth, power or status does not change how the law applies to them.",
    type: "multiple-choice",
  },
  {
    id: "h11",
    question: "What is judicial independence?",
    options: [
      "Courts decide cases free from influence by parliament or the government",
      "Judges must follow the government's opinion",
      "Parliament appoints judges for each case",
      "The police decide the outcome of trials",
    ],
    answer: "Courts decide cases free from influence by parliament or the government",
    solution: "Judicial independence allows judges to apply the law impartially, without pressure from the government of the day.",
    type: "multiple-choice",
  },
  {
    id: "h12",
    question: "What is Legal Aid?",
    options: [
      "Government-funded legal assistance for people who cannot afford a lawyer",
      "A free lawyer for everyone in every case",
      "A charity that writes new laws",
      "A court that hears appeals only",
    ],
    answer: "Government-funded legal assistance for people who cannot afford a lawyer",
    solution: "Legal Aid supports access to justice for disadvantaged groups who would otherwise be unable to afford representation.",
    type: "multiple-choice",
  },
  {
    id: "h13",
    question: "Which of these is a barrier to access to justice?",
    options: [
      "The cost of legal representation",
      "Having a clear written law",
      "Judges being independent",
      "Having a court hierarchy",
    ],
    answer: "The cost of legal representation",
    solution: "Cost, language barriers, distance from courts and lack of legal knowledge can all limit access to justice.",
    type: "multiple-choice",
  },
  {
    id: "h14",
    question: "Which participant decides the facts and reaches a verdict in a criminal trial?",
    options: ["The jury", "The judge", "The prosecutor", "The court officer"],
    answer: "The jury",
    solution: "In a jury trial the jury decides guilt beyond reasonable doubt, while the judge rules on the law and imposes the sentence.",
    type: "multiple-choice",
  },
  {
    id: "h15",
    question: "What role does a judge play in a trial?",
    options: [
      "Ruling on questions of law and imposing a sentence",
      "Investigating the crime and laying charges",
      "Representing the accused free of charge",
      "Deciding guilt in every type of case",
    ],
    answer: "Ruling on questions of law and imposing a sentence",
    solution: "The judge ensures the trial is fair, rules on the law, and sentences an offender after conviction.",
    type: "multiple-choice",
  },
  {
    id: "h16",
    question: "How does criminal law differ from civil law?",
    options: [
      "Criminal law involves the state prosecuting an offence and imposing a sanction; civil law settles disputes between parties with a remedy",
      "Criminal law is only about money; civil law is about prison",
      "Civil law is heard only in the High Court",
      "There is no difference between them",
    ],
    answer: "Criminal law involves the state prosecuting an offence and imposing a sanction; civil law settles disputes between parties with a remedy",
    solution: "In criminal law the state prosecutes and punishes; in civil law one party sues another and the court orders a remedy.",
    type: "multiple-choice",
  },
  {
    id: "h17",
    question: "What is the difference between a sanction and a remedy?",
    options: [
      "A sanction is a penalty imposed in criminal law; a remedy corrects a wrong in civil law",
      "A sanction is compensation; a remedy is a prison sentence",
      "Both are only used in civil law",
      "A remedy is given by the jury and a sanction by the judge",
    ],
    answer: "A sanction is a penalty imposed in criminal law; a remedy corrects a wrong in civil law",
    solution: "Sanctions (e.g. fines, imprisonment) punish criminal behaviour; remedies (e.g. damages) compensate or correct a civil wrong.",
    type: "multiple-choice",
  },
  {
    id: "h18",
    question: "Which is the highest court in the Australian court hierarchy?",
    options: ["The High Court of Australia", "The Supreme Court of Victoria", "The County Court", "The Magistrates' Court"],
    answer: "The High Court of Australia",
    solution: "The High Court is at the top of the hierarchy; it hears appeals and interprets the Constitution.",
    type: "multiple-choice",
  },
  {
    id: "h19",
    question: "Which court deals with the most minor criminal and civil matters?",
    options: ["The Magistrates' Court", "The Supreme Court", "The High Court", "The Court of Appeal"],
    answer: "The Magistrates' Court",
    solution: "The Magistrates' Court is the lowest court and hears minor matters, with the more serious cases going to higher courts.",
    type: "multiple-choice",
  },
  {
    id: "h20",
    question: "What is an appeal?",
    options: [
      "Asking a higher court to review a decision made by a lower court",
      "Asking the same judge to hear the case again",
      "Asking parliament to change the law",
      "Asking the police to drop the charges",
    ],
    answer: "Asking a higher court to review a decision made by a lower court",
    solution: "Appeals go up the court hierarchy, usually on a question of law or on the basis that the decision was wrong.",
    type: "multiple-choice",
  },
  {
    id: "h21",
    question: "What are tribunals mainly used for?",
    options: [
      "Resolving specific kinds of disputes, such as tenancy or workplace matters, more informally",
      "Deciding serious criminal charges",
      "Writing the Constitution",
      "Appointing judges",
    ],
    answer: "Resolving specific kinds of disputes, such as tenancy or workplace matters, more informally",
    solution: "Specialist courts and tribunals deal with particular matters, often with less formality and cost than a court.",
    type: "multiple-choice",
  },
  {
    id: "h22",
    question: "What is statutory interpretation?",
    options: [
      "Judges working out the meaning of the words in legislation",
      "Parliament rewriting an Act of parliament",
      "The police explaining the law to the public",
      "The jury deciding what the law means",
    ],
    answer: "Judges working out the meaning of the words in legislation",
    solution: "When legislation is unclear, judges interpret its words and apply them to the facts of the case.",
    type: "multiple-choice",
  },
  {
    id: "h23",
    question: "How do courts make law?",
    options: [
      "By applying precedent and interpreting legislation, which sets rules for later cases",
      "By passing new Acts in parliament",
      "By holding a referendum",
      "By issuing regulations through statutory authorities",
    ],
    answer: "By applying precedent and interpreting legislation, which sets rules for later cases",
    solution: "Through precedent and judicial reasoning, courts develop common law that binds lower courts in similar cases.",
    type: "multiple-choice",
  },
  {
    id: "h24",
    question: "What is judicial reasoning?",
    options: [
      "The explanation of how a judge reached a decision, including the reasons and the law applied",
      "The vote taken by the jury",
      "The speech made by the prosecutor",
      "The law passed by parliament after a case",
    ],
    answer: "The explanation of how a judge reached a decision, including the reasons and the law applied",
    solution: "Judicial reasoning shows the principles behind the decision, which later courts can follow as precedent.",
    type: "multiple-choice",
  },
  {
    id: "h25",
    question: "What did the High Court decide in Mabo v Queensland (No 2)?",
    options: [
      "That native title is recognised in Australian law",
      "That all land belongs to the Commonwealth",
      "That the Senate cannot pass laws about land",
      "That treaties must be signed with First Nations peoples",
    ],
    answer: "That native title is recognised in Australian law",
    solution: "Mabo (1992) recognised native title — Indigenous land rights that existed before colonisation and can survive it.",
    type: "multiple-choice",
  },
  {
    id: "h26",
    question: "What was the significance of the Wik decision?",
    options: [
      "It found that native title and pastoral leases can co-exist",
      "It abolished native title",
      "It created the Waitangi Tribunal",
      "It gave the states power over native title",
    ],
    answer: "It found that native title and pastoral leases can co-exist",
    solution: "Wik (1996) held that native title can co-exist with pastoral leases, although the lease rights prevail where they conflict.",
    type: "multiple-choice",
  },
  {
    id: "h27",
    question: "Which country's courts decided Delgamuukw?",
    options: ["Canada", "New Zealand", "Australia", "The United States"],
    answer: "Canada",
    solution: "Delgamuukw v British Columbia is a Canadian decision on Aboriginal title, useful for comparing approaches to Indigenous rights.",
    type: "multiple-choice",
  },
  {
    id: "h28",
    question: "What is the Waitangi Tribunal?",
    options: [
      "A New Zealand body that hears claims about breaches of the Treaty of Waitangi",
      "An Australian court that hears native title claims",
      "A Canadian commission on Aboriginal title",
      "A United Nations human rights committee",
    ],
    answer: "A New Zealand body that hears claims about breaches of the Treaty of Waitangi",
    solution: "The Waitangi Tribunal investigates claims that the Crown breached the Treaty of Waitangi and recommends remedies.",
    type: "multiple-choice",
  },
  {
    id: "h29",
    question: "Why is a comparative study of Indigenous rights across Australia, Canada and New Zealand useful?",
    options: [
      "It shows how different legal systems have responded to Indigenous rights, and what each can learn",
      "It proves that Australian law is identical to Canadian law",
      "It replaces the need to study Australian cases",
      "It only matters to international courts",
    ],
    answer: "It shows how different legal systems have responded to Indigenous rights, and what each can learn",
    solution: "Comparing Mabo, Delgamuukw and the Waitangi Tribunal reveals different legal pathways to recognising Indigenous rights.",
    type: "multiple-choice",
  },
  {
    id: "h30",
    question: "What skills does a mock trial practise?",
    options: [
      "Applying court procedure, presenting an argument and taking the roles of legal participants",
      "Writing new legislation for parliament",
      "Reporting on a contemporary legal issue as a podcast",
      "Conducting a referendum",
    ],
    answer: "Applying court procedure, presenting an argument and taking the roles of legal participants",
    solution: "A mock trial puts the roles of judges, barristers, witnesses and the jury into practice in a simulated case.",
    type: "multiple-choice",
  },
];

const historyContent: StudyContent = {
  type: "review",
  vocabulary: [
    { term: "Constitutional monarchy", definition: "A system where the monarch is head of state but their power is limited by a constitution" },
    { term: "Bicameral", definition: "A parliament with two houses" },
    { term: "Exclusive power", definition: "A power held only by the Commonwealth Parliament" },
    { term: "Concurrent power", definition: "A power shared by the Commonwealth and the states" },
    { term: "Residual power", definition: "A power left with the states because it is not listed in the Constitution" },
    { term: "Rule of law", definition: "No one is above the law; the law applies equally to everyone" },
    { term: "Legislation", definition: "Law made by parliament, also called an Act" },
    { term: "Statutory authority", definition: "A body created by legislation that can make rules in its area" },
    { term: "Common law", definition: "Law developed by judges through their decisions in cases" },
    { term: "Precedent", definition: "A past decision that guides later courts in similar cases" },
    { term: "Judicial independence", definition: "Courts decide cases free from government influence" },
    { term: "Access to justice", definition: "People being able to use the legal system, including help such as Legal Aid" },
    { term: "Legal Aid", definition: "Government-funded legal help for those who cannot afford a lawyer" },
    { term: "Criminal law", definition: "The state prosecutes an offence and a sanction is imposed" },
    { term: "Civil law", definition: "Disputes between parties, resolved with a remedy" },
    { term: "Sanction", definition: "A penalty imposed in criminal law, such as a fine or imprisonment" },
    { term: "Remedy", definition: "A civil order that compensates or corrects a wrong, such as damages" },
    { term: "Jurisdiction", definition: "The power of a court to hear a particular type of matter" },
    { term: "Court hierarchy", definition: "The ranking of courts from the Magistrates' Court to the High Court" },
    { term: "Appeal", definition: "Asking a higher court to review a decision of a lower court" },
    { term: "Statutory interpretation", definition: "Judges working out the meaning of the words in legislation" },
    { term: "Judicial reasoning", definition: "The reasons a judge gives for reaching a decision" },
    { term: "Native title", definition: "Indigenous land rights that existed before colonisation and can survive it" },
    { term: "Waitangi Tribunal", definition: "A New Zealand body that hears claims about breaches of the Treaty of Waitangi" },
  ],
  practiceQuestions: historyQuestions,
  flashcards: [
    {
      question: "Which house of the Commonwealth Parliament gives each state equal representation?",
      options: ["The Senate", "The House of Representatives", "The High Court", "The Executive Council"],
      answer: "The Senate",
      type: "multiple-choice",
    },
    {
      question: "Which court sits directly above the Magistrates' Court in Victoria?",
      options: ["The County Court", "The High Court", "The Court of Appeal", "The Supreme Court"],
      answer: "The County Court",
      type: "multiple-choice",
    },
    {
      question: "Which case recognised native title in Australia?",
      options: ["Mabo v Queensland (No 2)", "Wik v Queensland", "Delgamuukw v British Columbia", "R v Murrell"],
      answer: "Mabo v Queensland (No 2)",
      type: "multiple-choice",
    },
    {
      question: "Who prosecutes a criminal case in Australia?",
      options: ["The state, through the prosecution", "The victim personally", "The jury", "The judge"],
      answer: "The state, through the prosecution",
      type: "multiple-choice",
    },
    {
      question: "What is the name for government-funded legal help for people who cannot afford a lawyer?",
      options: ["Legal Aid", "Legal service guarantee", "Public defence fund", "Court duty scheme"],
      answer: "Legal Aid",
      type: "multiple-choice",
    },
    {
      question: "What is the correct term for the power to hear a particular type of case?",
      options: ["Jurisdiction", "Precedent", "Sanction", "Remedy"],
      answer: "Jurisdiction",
      type: "multiple-choice",
    },
  ],
  summaryPoints: [
    "Week 1: the Commonwealth Parliament — constitutional monarchy, the House of Representatives and the Senate, and specific, residual, exclusive and concurrent powers; the rule of law (pp. 548–551)",
    "Week 2: how laws are made — legislation, statutory authorities, common law and precedent (pp. 574–575)",
    "Week 3: principles of the legal system — equality before the law, judicial independence, and access to justice through Legal Aid; the report and podcast project launches (pp. 576–579)",
    "Week 4: participants in the legal system — judges, lawyers, juries and police; criminal vs civil law; sanctions vs remedies; the topic test (pp. 580–585)",
    "Week 5: court jurisdictions and the court hierarchy — Magistrates' Court to the High Court, specialist courts and tribunals, and the appeals process (pp. 582–592)",
    "Week 6: courts and tribunals making law — precedent, statutory interpretation and judicial reasoning (pp. 592–596)",
    "Week 7: Indigenous rights and comparative legal systems — Mabo, Wik, Delgamuukw and the Waitangi Tribunal, plus a mock trial",
  ],
};

// ===== English (Term 4, War Poetry) =====
const englishQuestions: PracticeQuestion[] = [
  { id: "e1", question: "What is a symbol?", answer: "An object, image or action that represents a bigger idea", type: "short" },
  { id: "e2", question: "Name two structural features a poet can use", answer: "Stanzas, enjambment, line length or repetition", type: "short" },
  { id: "e3", question: "What is a sonnet?", answer: "A 14-line poem, often with a set rhyme scheme", type: "short" },
  { id: "e4", question: "What is tone?", answer: "The poet's attitude towards the subject or the reader", type: "short" },
  { id: "e5", question: "What is the speaker (persona) in a poem?", answer: "The voice that narrates the poem, which may not be the poet", type: "short" },
  { id: "e6", question: "Which senses does imagery appeal to?", answer: "The five senses, creating a vivid picture for the reader", type: "short" },
  { id: "e7", question: "What is enjambment?", answer: "A sentence or thought that runs over the end of a line without punctuation", type: "short" },
  { id: "e8", question: "What makes a strong thesis?", answer: "A clear, arguable claim that directly answers the prompt", type: "short" },
  { id: "e9", question: "How should a quotation be used in an analytical paragraph?", answer: "Integrate it into your sentence, then explain how it creates meaning", type: "short" },
  { id: "e10", question: "What does TEEL stand for?", answer: "Topic, Explain, Evidence, Link", type: "short" },
  { id: "e11", question: "What are the parts of a comparative paragraph?", answer: "A point of similarity or difference, evidence from both poems, and a link to the thesis", type: "short" },
  { id: "e12", question: "Why might a poet use a fragmented structure to show trauma?", answer: "It mirrors the disrupted way traumatic memories return", type: "short" },
  { id: "e13", question: "What is the difference between identify and analyse?", answer: "Identifying names a technique; analysing explains how and why it creates meaning", type: "short" },
  { id: "e14", question: "What does a comparative connective do?", answer: "It links two poems, for example 'similarly' or 'in contrast'", type: "short" },
  { id: "e15", question: "What is the purpose of repetition in a poem?", answer: "To emphasise an idea and create rhythm", type: "short" },
  { id: "e16", question: "What does 'patriotism' mean in the context of war poetry?", answer: "Devotion to one's country, which some poets question or critique", type: "short" },
  { id: "e17", question: "What is moral responsibility in the context of war?", answer: "The question of who is accountable for the decisions and suffering of war", type: "short" },
  { id: "e18", question: "What is the purpose of the conclusion in an analytical essay?", answer: "To synthesise your argument and answer the prompt", type: "short" },
];

const englishContent: StudyContent = {
  type: "reading",
  vocabulary: [
    { term: "Symbolism", definition: "Using an object or image to represent a bigger idea" },
    { term: "Imagery", definition: "Language that creates a picture using the senses" },
    { term: "Tone", definition: "The poet's attitude towards the subject" },
    { term: "Enjambment", definition: "A sentence running over the end of a line without punctuation" },
    { term: "Persona", definition: "The voice or speaker of a poem" },
    { term: "Thesis", definition: "The main arguable claim of an essay" },
    { term: "Trauma", definition: "Deep psychological harm, a common theme in war poetry" },
    { term: "Comparative", definition: "Analysis that links two texts through similarities or differences" },
  ],
  practiceQuestions: englishQuestions,
  writingPrompts: [
    {
      prompt: "Analyse how two war poems present trauma and memory",
      requirements: ["Clear thesis", "Comparison of both poems", "Analysis of at least two techniques", "Integrated quotations"],
      structure: ["Introduction with thesis", "Comparative paragraph 1", "Comparative paragraph 2", "Comparative paragraph 3", "Conclusion"],
    },
    {
      prompt: "Analyse how a poet uses symbolism and form to critique war",
      requirements: ["Identify the symbolism", "Explain how form supports meaning", "Use TEEL in each paragraph", "Link back to the thesis"],
      structure: ["Introduction", "Symbolism paragraph", "Form paragraph", "Link to context", "Conclusion"],
    },
  ],
  summaryPoints: [
    "Analyse means explaining how a technique creates meaning, not just naming it",
    "Comparative writing connects a similarity or difference across both poems",
    "TEEL: Topic, Explain, Evidence, Link",
    "Themes: power, patriotism, resistance, trauma, memory and moral responsibility",
    "SBA 3 is a full analytical response on War Poetry, completed in Week 7 (16 Nov)",
  ],
};

// ===== Weekly notes (Term 4, Weeks 1-9) =====
// Titles and key knowledge follow the Semester 2 Student Weekly Outline for
// each subject, so the notes match what is being taught that week.
type WeeklyReadings = Record<number, ReadingContent>;

const mathReadingByWeek: WeeklyReadings = {
  1: {
    title: "Chapter 9: Sampling technique and Bivariate data",
    content:
      "Bivariate data records two variables for each individual, such as hours slept and test score. A scatter plot displays the pairs as points so the relationship between the variables can be seen. The correlation describes the direction and strength of that relationship: positive (both increase together), negative (one increases as the other decreases) or no correlation. A line of best fit is drawn by eye through the middle of the points to describe the overall trend and to make predictions. Sampling matters here: a larger, more representative sample makes any conclusion drawn from the data more reliable. Correlation only shows that two variables are related — it is not proof that one causes the other, because a third variable could explain both.",
    keyPoints: [
      "Understand and interpret the correlation between two sets of data",
      "Positive, negative or no correlation; strength is shown by how closely the points follow a line",
      "Draw a line of best fit by eye and use it to describe the trend",
      "Correlation is not causation",
      "Calculate a response rate and consider sampling size and method",
    ],
  },
  2: {
    title: "Chapter 5: Surface area and Volume",
    content:
      "Surface area is the total area of every face of a 3D shape, measured in square units. Volume is the space inside it, measured in cubic units. A prism has a constant cross-section, so its volume is the area of the base multiplied by the height — this covers rectangular prisms, triangular prisms and cylinders (V = πr²h). Surface area is found face by face, or by using the known formulas: a cube has 6 identical square faces, a sphere has SA = 4πr² and a cylinder has two circular ends plus the curved surface (2πr² + 2πrh). Always check the units and whether the answer should be exact (in terms of π) or rounded.",
    keyPoints: [
      "Find the surface area of any 3D shape by adding the area of every face",
      "Find the volume of any 3D shape; prism volume = area of base × height",
      "Cylinder: V = πr²h and SA = 2πrh + 2πr²",
      "Sphere: SA = 4πr²",
      "Use square units for area and cubic units for volume",
    ],
  },
  3: {
    title: "Chapter 5: Geometric Transformation",
    content:
      "Transformations move or resize a 2D shape on the Cartesian plane. A translation slides the shape by a vector, a rotation turns it about a point (usually the origin), a reflection flips it in a mirror line, and an enlargement changes its size by a scale factor. Reflection and rotation preserve size and shape (congruence); enlargement creates a similar shape, multiplying lengths by k, areas by k² and volumes by k³. Tessellation is the tiling of a plane with shapes that fit with no gaps or overlaps: the only regular polygons that tessellate alone are the equilateral triangle, square and regular hexagon, because their interior angles divide 360°. Semi-regular tessellations use two or more regular polygons in a repeating pattern. Some combinations of transformations can be replaced by a single transformation that has the same effect, for example two reflections producing a translation or rotation.",
    keyPoints: [
      "Transform 2D shapes by translation, rotation, reflection and enlargement",
      "Regular and semi-regular tessellation; interior angles must meet 360° at a point",
      "Replace transformations by other transformations where possible",
      "Enlargement by scale factor k multiplies area by k²",
    ],
  },
  4: {
    title: "Chapter 7: The Right-angle triangle",
    content:
      "Trigonometry links the sides and angles of right-angled triangles: sin θ = opposite ÷ hypotenuse, cos θ = adjacent ÷ hypotenuse and tan θ = opposite ÷ adjacent (SOH CAH TOA), where θ is a given acute angle. Problems in two dimensions include angles of elevation (looking up from the horizontal), angles of depression (looking down from the horizontal) and bearings, which are directions measured clockwise from north and written with three figures, such as 135°. Set out a clear diagram, label the sides relative to the angle, choose the ratio that uses the information you have, and round to the accuracy asked for. This week is also the summative measurement project, so apply these skills to a real measurement task.",
    keyPoints: [
      "Solve problems in right-angled triangles using the trigonometric ratios",
      "Solve problems involving angles of elevation and depression",
      "Solve problems using bearings (three figures, measured clockwise from north)",
      "Draw a diagram, choose the correct ratio, then round as required",
      "Summative assessment: Measurement project",
    ],
  },
  5: {
    title: "Chapter 7: Properties of Circles and Circle Theorem 1",
    content:
      "A circle's circumference is 2πr and its area is πr². An arc is part of the circumference and a sector is the region between two radii: the angle at the centre tells you what fraction of the whole circle you have. Arc length = (θ ÷ 360) × 2πr, perimeter of a sector = arc length + 2r, and sector area = (θ ÷ 360) × πr². A chord is a straight line joining two points on the circumference, and perpendiculars from the centre bisect chords. Circle theorems let you find unknown angles and lengths and prove results: the angle at the centre is twice the angle at the circumference standing on the same arc, the angle in a semicircle is 90°, angles in the same segment are equal, and a tangent is perpendicular to the radius at the point of contact. Each step must be justified by naming the theorem.",
    keyPoints: [
      "Find the length of an arc of a circle",
      "Find the angle in a sector of a circle",
      "Find the perimeter and area of a sector",
      "Find the length of a chord",
      "Find angles and lengths using circle theorems, and prove results by naming the theorem used",
    ],
  },
  6: {
    title: "Chapter 7: Circle theorem 2",
    content:
      "The circle theorems from last week are used here to find chord lengths and to prove further relationships. For two chords that intersect inside a circle, AP × PB = CP × PD, where P is the point of intersection. A perpendicular from the centre to a chord bisects the chord, which turns a chord problem into a right-angled triangle problem that can be solved with Pythagoras or trigonometry. Opposite angles in a cyclic quadrilateral add to 180°, and the exterior angle of a cyclic quadrilateral equals the interior opposite angle. This week includes the summative topic test, so practise choosing the right theorem, writing a reason for each statement, and showing every step of the working.",
    keyPoints: [
      "Use circle theorems to find the lengths of chords",
      "Intersecting chords: AP × PB = CP × PD",
      "A perpendicular from the centre bisects a chord",
      "Opposite angles of a cyclic quadrilateral add to 180°",
      "Summative assessment: Topic test",
    ],
  },
  7: {
    title: "Revision",
    content:
      "Revise every Term 4 chapter: sampling and bivariate data (Ch 9), surface area and volume (Ch 5), transformations and tessellation (Ch 5), right-angled triangles and trigonometry (Ch 7), and circles with the circle theorems (Ch 7). Work through mixed problems rather than single topics, check your working against the summary points, and fix the topics you find hardest first. Practise questions under timed conditions so you know how long each type takes.",
    keyPoints: [
      "Revision of all Term 4 chapters: sampling and bivariate data (Ch 9), surface area and volume (Ch 5), transformations and tessellation (Ch 5), right-angled triangles (Ch 7) and circles (Ch 7)",
      "Practise mixed questions across all Term 4 chapters",
      "Check each answer against the working, not just the final value",
      "Focus on the topics you find hardest and time yourself on exam-style questions",
    ],
  },
  8: {
    title: "Revision Week (End of Semester Examinations)",
    content:
      "The end of semester examination period runs from Monday 23 November to Thursday 26 November with revision week. Consolidate your summary points, repeat the questions you got wrong, and make sure you can state every circle theorem and trigonometric ratio without notes.",
    keyPoints: [
      "Revision week: 23 - 26 November",
      "Repeat the questions you got wrong",
      "Be able to state each theorem and ratio from memory",
      "Check the exam date, time and equipment",
    ],
  },
  9: {
    title: "End of Semester Examination Period",
    content:
      "The examination period runs from Friday 27 November to Thursday 3 December. Arrive early with the correct equipment, read each question twice, show all working, and check units and rounding before you finish.",
    keyPoints: [
      "Exam period: 27 November - 3 December",
      "Show all working and check units and rounding",
      "Bring the required equipment",
    ],
  },
};

const scienceReadingByWeek: WeeklyReadings = {
  1: {
    title: "Introduction to Psychology, Variables, Hypothesis & Correlation vs Causation",
    content:
      "Psychology is defined as the scientific study of human thoughts, feelings and behaviour. The word comes from psyche, meaning mind, and logos, meaning knowledge. Thoughts and feelings are mental processes that cannot be directly observed, while behaviour refers to any externally expressed actions that can be directly observed. Psychology is a science because it relies on systematic research: researchers collect data, test ideas and draw evidence-based conclusions about why people think, feel and act the way they do. The major branches of psychology include biological, cognitive, developmental, social, educational, forensic, sports and consumer psychology, and each studies a different aspect of behaviour and mental processes.\n\nWhen a researcher has an idea about a study they wish to investigate, they decide on an investigation aim, which is the purpose of the study, and the aim includes the variables being studied. In the simplest form of an experiment there is one independent variable (IV), which is what the researcher changes (for example zero, one or two cups of water), and one dependent variable (DV), which is what is measured (for example the size of the plants). The experimental group is exposed to the experimental condition in which the IV under investigation is present (for example studying 4 hours for the exam), while the control group is exposed to the control condition in which the IV is absent (for example studying 0 hours).\n\nResearchers begin an investigation with an idea of the possible outcomes. The hypothesis predicts whether the IV will affect the DV, and the investigation will test whether the hypothesis is supported, partly supported or refuted (not supported). Every hypothesis must include four elements: the population, the IV (experimental condition), the DV (direction of prediction) and the IV (control condition). Extraneous variables are variables other than the IV that may have an unwanted effect on the DV and the results of the investigation, while controlled variables are variables held constant to ensure that the only influence on the DV is the IV.\n\nIn psychology, researchers often look for relationships between variables — for example between sleep and concentration, or between screen time and mood. Correlation means two things are related: when one changes, the other tends to change too. For example, students who sleep more hours often report feeling happier. However, correlation does not mean that one causes the other, because the relationship could be due to another factor such as less stress or better time management. Causation means one variable directly affects another, a cause-and-effect link, for example drinking caffeine causes an increase in heart rate. Psychologists use experiments to test causation by controlling variables and using comparisons (control versus experimental groups). When researchers only observe data without controlling conditions, they can usually show correlation, not causation.",
    keyPoints: [
      "Psychology: the scientific study of human thoughts, feelings and behaviour; psyche means mind and logos means knowledge",
      "Thoughts and feelings are mental processes that cannot be directly observed; behaviour can be directly observed",
      "Major branches: biological, cognitive, developmental, social, educational, forensic, sports and consumer psychology",
      "Aim: the purpose of the study, including the variables being studied",
      "IV is what the researcher changes; DV is what is measured; the experimental group has the IV present and the control group has the IV absent",
      "A hypothesis has four elements — population, IV (experimental condition), DV (direction of prediction), IV (control condition) — and is supported, partly supported or refuted",
      "Extraneous variables may have an unwanted effect on the DV; controlled variables are held constant",
      "Correlation: two variables are related but not necessarily causally; causation requires a controlled experiment",
      "Correlation vs causation: the ice-cream-and-drowning example shows a link without cause",
    ],
  },
  2: {
    title: "Regions of the Brain, Somatic & Autonomic Nervous Systems",
    content:
      "The brain is the body's main control centre, responsible for everything we think, feel and do, and it is divided into three main regions: the hindbrain, midbrain and forebrain. The hindbrain is the lowest part of the brain, located at the back of the skull, and controls vital functions that keep us alive, such as breathing, heart rate and coordination. The cerebellum, which is part of the hindbrain, helps us balance, move smoothly and maintain posture — for example when you ride a bike or catch a ball. Above the hindbrain lies the midbrain, a small but important region that acts as a bridge between the lower and higher parts of the brain. It controls basic movements of the eyes, processes sensory information like sight and sound, and helps the body respond to things happening around us, letting you automatically turn your head towards a sudden noise or bright light.\n\nThe largest and most complex part of the brain is the forebrain, which is involved in higher mental processes such as thinking, learning, memory and emotion. It contains important structures such as the thalamus and hypothalamus, which help regulate body temperature, sleep and motivation, as well as the cerebrum, the part responsible for conscious thought. Covering much of the forebrain is the cerebral cortex, a wrinkled outer layer that allows humans to think, reason and make decisions. It is divided into four lobes: the frontal lobe, involved in reasoning, planning, movement and emotions; the parietal lobe, which processes touch and spatial awareness; the temporal lobe, responsible for hearing, memory and language; and the occipital lobe, which processes visual information from the eyes.\n\nThe nervous system is divided into the central nervous system (CNS) — made up of the brain and spinal cord — and the peripheral nervous system (PNS), which connects the CNS to the rest of the body. The PNS itself has two main parts: the somatic nervous system (SNS) and the autonomic nervous system (ANS).\n\nThe SNS controls all voluntary movements, meaning the actions you choose to make, such as walking, writing or picking up an object. Its pathway involves receptors, neurons and effectors: a receptor detects a change or stimulus; a sensory neuron sends the message along the afferent pathway towards the CNS (the spinal cord and brain); the brain processes and interprets the message and decides how to respond; a motor neuron carries the signal away from the CNS (the efferent pathway) to the muscles that need to act; and the effector (the muscle) responds by performing the action. For example, the sight of a cat is detected by receptors in the eyes, travels along sensory neurons to the brain, and the brain decides to move your hand to pat it.\n\nThe autonomic nervous system is the part of the peripheral nervous system that controls the automatic functions of the body — the things we do without thinking — including heart rate, breathing, digestion and the release of certain hormones. It has two main branches that work together like opposites. The sympathetic nervous system, often called the 'fight or flight' system, prepares the body for action when it senses danger or stress: it increases heart rate, releases adrenaline, slows digestion and makes the body more alert and ready to respond. The parasympathetic nervous system, known as the 'rest and digest' system, calms the body down after the stressful situation has passed: it slows the heart rate, supports digestion, relaxes the muscles and helps the body return to a steady, balanced state. When one system becomes active, the other helps restore normal functioning once the situation changes.",
    keyPoints: [
      "Three brain regions: hindbrain (breathing, heart rate, coordination), midbrain and forebrain",
      "Cerebellum (part of the hindbrain): balance, smooth movement and posture",
      "Midbrain: bridges the lower and higher brain, controls basic eye movements, processes sensory information",
      "Forebrain: the largest region — thinking, learning, memory and emotion; contains the thalamus, hypothalamus and cerebrum",
      "Cerebral cortex lobes: frontal (reasoning, planning, movement, emotions), parietal (touch, spatial awareness), temporal (hearing, memory, language), occipital (vision)",
      "CNS: the brain and spinal cord; PNS: connects the CNS to the body and includes the SNS and ANS",
      "SNS controls voluntary movements; pathway: receptor → sensory neuron (afferent) → brain → motor neuron (efferent) → effector",
      "ANS controls automatic functions such as heart rate, breathing and digestion",
      "Sympathetic ('fight or flight'): increases heart rate, releases adrenaline, slows digestion",
      "Parasympathetic ('rest and digest'): slows heart rate, supports digestion, restores balance",
    ],
  },
  3: {
    title: "Neuron Structure; Neurotransmission and Neurotransmitter Types",
    content:
      "The entire nervous system is comprised of neurons organised into networks that form neural circuits and pathways of varying complexity, through which information is continuously transmitted. A neuron is an individual nerve cell that is specialised to receive, process and/or transmit information, and neurons communicate not only with each other but also with muscles and glands. Each structure has a specific function: dendrites are projections that typically branch from the cell body and are able to receive information from other neurons; the soma, or cell body, receives information from the dendrites and then passes it down the axon; the axon transmits signals, allowing the neuron to send information to multiple other cells, and the signals that travel along it are referred to as electrical messages, nerve impulses or action potential; the myelin sheath covers most of the axons in the human body and is a fatty substance that can be thought of as insulation that helps speed up information transmission; and the axon terminals are the structures at the end of the axon that store and release neurotransmitters.\n\nNeurotransmission is the process by which neurons, or nerve cells, communicate with each other to send messages throughout the brain and body. It is both an electrical and chemical process that allows us to think, move, feel and respond to our surroundings. When a neuron is activated by a stimulus, an electrical impulse travels down its axon. When this impulse reaches the axon terminals, it triggers the release of tiny chemical messengers called neurotransmitters. These neurotransmitters cross a small gap between neurons called the synapse and attach to receptor sites on the dendrites of the next neuron, allowing the message to continue. After the signal is passed on, the neurotransmitters are either broken down or reabsorbed by the original neuron in a process called reuptake. This entire process happens extremely quickly — for example, when you decide to wave, neurons send messages through neurotransmission to activate your arm muscles. Without neurotransmission, the brain and body would not be able to communicate or function properly.\n\nNeurotransmitters can have different effects on the next neuron they connect with. Excitatory neurotransmitters increase the likelihood that the next neuron will fire an electrical signal, which means they help 'activate' brain pathways. Inhibitory neurotransmitters make it less likely that the next neuron will fire; these chemicals help slow down or calm neural activity so the brain does not become overloaded. Neurotransmitters to know include dopamine, serotonin, acetylcholine, endorphins, GABA and glutamate. This week you also submit SBA 1, the Reaction Time Practical and its application questions.",
    keyPoints: [
      "Neuron: an individual nerve cell specialised to receive, process and/or transmit information",
      "Dendrite: receives information from other neurons; soma: passes it down the axon",
      "Axon: transmits signals, allowing the neuron to send information to other cells (electrical message, nerve impulse or action potential)",
      "Myelin sheath: fatty insulation that speeds up information transmission; axon terminal: stores and releases neurotransmitters",
      "Neurotransmission: electrical impulse → neurotransmitter release → synapse → receptor sites → reuptake",
      "Reuptake: neurotransmitters are broken down or reabsorbed by the original neuron",
      "Excitatory neurotransmitters increase the likelihood of the next neuron firing; inhibitory neurotransmitters decrease it",
      "Neurotransmitters include dopamine, serotonin, acetylcholine, endorphins, GABA and glutamate",
      "SBA 1 due: Reaction Time Practical + Application Questions",
    ],
  },
  4: {
    title: "Memory, Schema and Sampling Methods",
    content:
      "Memory is one of the most important mental processes in psychology, allowing us to take in information from our environment, store it and use it later. In simple terms, memory is the process of encoding, storing and retrieving information. Encoding is the first step: it happens when we take in information through our senses — what we see, hear or experience — and convert it into a form the brain can understand. Storage is the second step, where the brain keeps information over time, some for only a few seconds and some for years. Retrieval is the final step, when we access stored information and bring it back into our conscious mind, for example recalling an answer to a question during an exam.\n\nPsychologists describe memory as having three main stages or types. Sensory memory holds information from the senses for just a few seconds, like the image you still 'see' right after looking away from a bright light. Short-term memory stores small amounts of information that you are actively thinking about, usually for 20–30 seconds, such as remembering a set of instructions. Long-term memory is where information is stored more permanently, allowing you to recall past experiences, knowledge and skills. Memory is not always perfect: it can fade, change, or be influenced by emotions and experiences.\n\nRecall — remembering information stored in the brain and bringing it back into conscious mind, which means retrieving it from long-term memory into short-term memory — can be influenced by several factors. Attention matters because information you are not fully focused on is less likely to be stored properly in the first place; studying while scrolling on your phone divides your attention. Rehearsal means actively practising or repeating information so it stays in memory longer. Maintenance rehearsal involves repeating information over and over to keep it active in short-term memory, but it usually does not make it stay for long. Elaborative rehearsal is a deeper form of processing: instead of just repeating the information, you connect it to something meaningful, such as an image, an example or something you already know, so it is more likely to stay in long-term memory. Organisation also helps, because information grouped or connected in a meaningful way is easier to recall. The context in which learning takes place matters through context-dependent memory: people often remember information better when they are in the same setting, mood or environment in which they first learned it. Finally, interference makes recall more difficult when new information disrupts old memories, or when old information makes it harder to learn something new.\n\nA schema is a mental framework or 'template' that helps us organise information and understand the world. Schemas are built from past experiences and they guide how we interpret new situations — for example, you have schemas for things like 'classroom', 'friendship' or 'teacher'. Schemas are useful because they help us make fast decisions, but they can also lead to mistakes: sometimes our brain fills in missing information based on what we expect rather than what is actually there, which can cause misunderstandings, false memories or assumptions.\n\nWhen psychologists conduct research they usually cannot study every single person in a population, so they select a sample — a smaller group of people who represent the larger population. Convenience sampling is when researchers select people who are easy to reach or available at the time, for example a student surveying their classmates; it is quick, simple and inexpensive, but it can lead to bias because the people chosen may not represent the wider population. Random sampling gives everyone in the population an equal chance of being chosen, for example randomly selecting student names from the whole school list; this makes the sample more representative and reduces bias, but it can take more time and planning to organise. Stratified sampling divides the population into strata — categories or subgroups such as age, gender, year level or background — and then selects participants from each subgroup in the same proportion that they appear in the population. For example, if a school has 60% girls and 40% boys, a stratified sample of 50 students would include 30 girls and 20 boys.",
    keyPoints: [
      "Memory is the process of encoding, storing and retrieving information",
      "Encoding: taking information in through the senses; storage: keeping it over time; retrieval: bringing it back into conscious mind",
      "Sensory memory holds information for a few seconds; short-term memory holds small amounts for 20–30 seconds; long-term memory stores information more permanently",
      "Factors influencing recall: attention, rehearsal, organisation, context and interference",
      "Maintenance rehearsal repeats information; elaborative rehearsal connects it to something meaningful",
      "Context-dependent memory: remembering better in the setting, mood or environment where you learned it",
      "Interference: new information disrupts old memories, or old information makes new learning harder",
      "Schema: a mental framework built from past experience that guides interpretation and can cause false memories",
      "Convenience sampling: easy to reach, quick and inexpensive, but can be biased",
      "Random sampling: everyone has an equal chance, more representative, but takes more time and planning",
      "Stratified sampling: divides the population into strata and samples in proportion (e.g. 30 girls and 20 boys out of 50)",
    ],
  },
  5: {
    title: "Research Design and Ethics in Psychology",
    content:
      "Research designs determine how participants experience the experimental and control conditions. The design chosen depends on the goals of the study, the type of data being collected and which variables are most important to control. In this unit you focus on two designs. Within-subject design is where all participants in the sample are involved in both the experimental AND control conditions. Between-subject design is where participants are randomly allocated to either the experimental OR control conditions.\n\nIn psychology, ethics refers to the moral principles and rules that guide how research should be conducted. Ethical guidelines are designed to protect the rights, safety and wellbeing of participants, and to make sure that research is carried out fairly and responsibly. The key ethical principles are informed consent, the right to withdraw, no harm, confidentiality and privacy, deception, debriefing and volunteer participation. Psychologists must follow these guidelines so that their studies are respectful, honest and do not cause harm.\n\nThroughout history, some studies have shown what can happen when ethical rules are not followed — participants were sometimes deceived, stressed or not given the choice to stop participating. Famous examples studied in this course are the Stanford Prison Experiment (Zimbardo, 1971), Milgram's Obedience Study (1963), the Little Albert Experiment (Watson & Rayner, 1920) and the Asch Conformity Experiment (1951). Because of these studies, modern psychology has developed strict ethical standards that every researcher must follow.",
    keyPoints: [
      "Within-subject design: all participants take part in both the experimental and control conditions",
      "Between-subject design: participants are randomly allocated to either the experimental or the control condition",
      "Ethics: the moral principles and rules that guide how research should be conducted",
      "Ethical guidelines protect the rights, safety and wellbeing of participants",
      "Key ethical principles: informed consent, right to withdraw, no harm, confidentiality and privacy, deception, debriefing, volunteer participation",
      "Historical studies: Stanford Prison Experiment (Zimbardo, 1971), Milgram's Obedience Study (1963), Little Albert (Watson & Rayner, 1920), Asch Conformity Experiment (1951)",
      "Because ethical rules were broken in these studies, modern psychology uses strict ethical standards",
    ],
  },
  6: {
    title: "Biopsychosocial Model of Wellbeing and First Nations Perspectives",
    content:
      "Mental health and wellbeing is a complex combination of a person's physical, social, emotional, mental and spiritual health that is linked to happiness and life satisfaction. The mental health of an individual falls on a spectrum, or continuum, and this will change throughout their life depending on the experiences they have and their resilience — their ability to cope with their experiences, including adverse ones.\n\nThe biopsychosocial approach is a model used by psychologists to understand how biological, psychological and social factors all interact to influence a person's overall wellbeing. It recognises that mental health and physical health are not determined by just one cause; instead, they result from the combined effects of the body, mind and environment.\n\nBiological factors are the physical and genetic influences on our wellbeing. They include brain chemistry, hormones, sleep, nutrition, exercise and family medical history — for example, lack of sleep or a poor diet can reduce energy and focus, while regular exercise and balanced meals can improve mood and mental clarity. Psychological factors refer to the mental and emotional processes that shape how we think, feel and behave, including thought patterns, beliefs, coping skills, personality and resilience; a person with a positive outlook and strong problem-solving skills may cope better with stress, while unhelpful thinking patterns such as negative self-talk or overthinking can make challenges feel more overwhelming. Social factors are the environmental and relational influences that come from the people and world around us, including family relationships, friendships, cultural background, school environment, community support and socioeconomic conditions; strong supportive relationships protect mental health, while isolation, bullying or financial stress can increase vulnerability.\n\nThe biopsychosocial model also helps psychologists understand what helps people stay mentally healthy and recover when challenges arise. These positive influences are called protective factors: they protect a person's mental wellbeing and reduce the likelihood of developing a mental illness. Protective factors exist in all three areas of the model — biological, psychological and social — and each area contributes to building resilience, which is the ability to cope with stress, adapt to change and bounce back after difficulties. Wellbeing for Aboriginal and Torres Strait Islander peoples also includes cultural connection, connection to Country, spirituality and community, and the Stolen Generations experience of historical trauma and cultural disconnection continues to affect wellbeing across generations. Evaluating the model means asking whether a biopsychosocial approach sufficiently explains that experience, or whether culture and Country must also be considered.",
    keyPoints: [
      "Mental health and wellbeing: a combination of physical, social, emotional, mental and spiritual health linked to happiness and life satisfaction",
      "Mental health falls on a continuum and changes throughout life depending on experiences and resilience",
      "Resilience: the ability to cope with experiences, including adverse ones",
      "Biopsychosocial approach: biological, psychological and social factors interact to influence overall wellbeing",
      "Biological factors: brain chemistry, hormones, sleep, nutrition, exercise, family medical history",
      "Psychological factors: thought patterns, beliefs, coping skills, personality and resilience",
      "Social factors: family relationships, friendships, cultural background, school environment, community support, socioeconomic conditions",
      "Protective factors exist in all three areas and build resilience, reducing the likelihood of mental illness",
      "First Nations wellbeing: cultural connection, Country, spirituality and community; the Stolen Generations' historical trauma and cultural disconnection",
      "Evaluate whether the biopsychosocial approach sufficiently explains the impact of that experience",
    ],
  },
  7: {
    title: "Assessment Week — Memory & Biopsychosocial Model",
    content:
      "This week completes the rehearsal practical, which compares maintenance rehearsal (repeating information over and over to keep it active in short-term memory) with elaborative rehearsal (connecting the information to something meaningful so it lasts) — Group A compared with Group B. Process and analyse the recall data, then write a conclusion that links your results back to the Atkinson-Shiffrin model: explain what the data shows about encoding, storage and retrieval, and acknowledge any limitations of the design, such as how attention, organisation, context or interference may have influenced what participants could recall. The application questions cover schema and false memories, stratified sampling, research design, ethics, and the biopsychosocial model alongside Aboriginal and Torres Strait Islander wellbeing, including the Stolen Generations. This is SBA 2: the Rehearsal Practical plus Application Questions.",
    keyPoints: [
      "Rehearsal practical: maintenance vs elaborative rehearsal (Group A vs Group B)",
      "Process and analyse the recall data",
      "Write a conclusion using the Atkinson-Shiffrin model",
      "Application questions: schema, stratified sampling, research design, ethics, the biopsychosocial model and ATSI wellbeing",
      "SBA 2 due: Rehearsal Practical + Application Questions",
    ],
  },
  8: {
    title: "Revision Week (End of Semester Examinations)",
    content:
      "Revision week runs from Monday 23 November to Thursday 26 November. Revise the whole Term 4 course using the booklet: introduction to psychology, variables and hypotheses, correlation and causation, the regions of the brain, the somatic and autonomic nervous systems, neurons and neurotransmission, memory and schema, sampling methods, research designs and ethics, and the biopsychosocial model with First Nations perspectives. Practise the booklet's own activities and application questions so you can explain the concepts, not just define them.",
    keyPoints: [
      "Revision week: 23 - 26 November",
      "Revise each Term 4 topic with its key terms",
      "Practise the booklet's activities and application questions in full sentences",
      "Check the exam date, time and room",
    ],
  },
  9: {
    title: "End of Semester Examination Period",
    content: "The examination period runs from Friday 27 November to Thursday 3 December.",
    keyPoints: [
      "Exam period: 27 November - 3 December",
      "Check the exam time and room",
      "Review your summary points the night before",
    ],
  },
};

const historyReadingByWeek: WeeklyReadings = {
  1: {
    title: "The Commonwealth Parliament",
    content:
      "Australia is a constitutional monarchy: the King is head of state, represented by the Governor-General, but the Constitution limits that power and parliament makes the laws. The Commonwealth Parliament is bicameral. The House of Representatives is formed on the basis of population and forms government; the Senate gives each state equal representation and acts as a house of review. Powers are divided between the Commonwealth and the states: specific powers are listed in the Constitution, exclusive powers belong only to the Commonwealth (such as defence), concurrent powers are shared (such as taxation), and residual powers stay with the states because they are not listed (such as education and health). The rule of law underpins all of this — no one, including the government, is above the law. (pp. 548–551)",
    keyPoints: [
      "Constitutional monarchy: the King is head of state, represented by the Governor-General, with power limited by the Constitution",
      "House of Representatives (population) and Senate (equal state representation)",
      "Specific, residual, exclusive and concurrent powers",
      "The rule of law: no one is above the law",
      "Textbook: pp. 548–551",
    ],
  },
  2: {
    title: "How Laws Are Made in Australia",
    content:
      "Laws are made in two main ways. Parliament makes legislation: a bill is introduced, debated and voted on in both houses, then receives royal assent and becomes an Act. Parliament can also create statutory authorities, which make detailed rules (delegated legislation) within the area the Act gives them. Courts make common law through their decisions: when a judge decides a case, the legal reasoning can become a precedent that lower courts must follow in similar cases. The rule of law requires that these laws are published, apply equally, and can be changed through proper process. (pp. 574–575)",
    keyPoints: [
      "Legislation is made by parliament (bill → debate → vote → royal assent → Act)",
      "Statutory authorities make rules under an Act",
      "Common law is made by courts through their decisions",
      "Precedent: a past decision guides later courts in similar cases",
      "Textbook: pp. 574–575",
    ],
  },
  3: {
    title: "Principles of Australia's Legal System",
    content:
      "Three principles shape Australia's legal system. Equality before the law means everyone is subject to the same laws and treated equally by them, regardless of wealth, power or status. Judicial independence means courts decide cases free from influence by parliament, the government or the parties, so that decisions are impartial and based on the law and evidence. Access to justice means people can actually use the legal system: cost, language barriers, distance, disability and lack of legal knowledge all get in the way, and Legal Aid provides government-funded help for people who cannot afford a lawyer, alongside community legal centres and pro bono services. Disadvantages often overlap, which is why disadvantaged groups are least able to use the system. This week the Report and Podcast project is launched. (pp. 576–579)",
    keyPoints: [
      "Equality before the law",
      "Judicial independence",
      "Access to justice, Legal Aid and the barriers faced by disadvantaged groups",
      "Assessment launch: Report and Podcast project on a contemporary legal issue",
      "Textbook: pp. 576–579",
    ],
  },
  4: {
    title: "Participants in the Legal System and Types of Legal Disputes",
    content:
      "Judges rule on questions of law, ensure a fair trial and impose sentences; barristers and solicitors argue the case and advise clients; the jury decides the facts and reaches a verdict in serious criminal trials; and police investigate offences, lay charges and keep order. Disputes are either criminal or civil. In criminal law the state prosecutes a person accused of an offence and, on conviction, a sanction is imposed — for example a fine, a community correction order or imprisonment — to punish, deter and protect the community. In civil law one party sues another to resolve a dispute, and the court orders a remedy — damages, an injunction or specific performance — to compensate or correct the wrong. The standard of proof also differs: beyond reasonable doubt in criminal cases, and on the balance of probabilities in civil cases. This week includes the Legal Studies topic test. (pp. 580–585)",
    keyPoints: [
      "Roles of judges, lawyers, juries and police",
      "Criminal law: the state prosecutes; sanctions punish and deter",
      "Civil law: parties resolve disputes; remedies compensate or correct",
      "Standard of proof: beyond reasonable doubt (criminal) vs balance of probabilities (civil)",
      "Legal Studies topic test this week; textbook pp. 580–585",
    ],
  },
  5: {
    title: "Court Jurisdictions and Court Hierarchy",
    content:
      "Courts are ranked in a hierarchy, and each court has a jurisdiction — the types of matters it can hear, which depends on the seriousness of the offence and the amount in dispute. The Magistrates' Court hears minor criminal and civil matters; the County Court hears more serious matters including most serious criminal trials; the Supreme Court (Trial Division) hears the most serious cases such as murder; the Court of Appeal hears appeals from the County and Supreme Courts; and the High Court of Australia is at the top, hearing appeals and interpreting the Constitution. Specialist courts and tribunals, such as the Children's Court, Family Court, VCAT and the Fair Work Commission, deal with particular kinds of disputes more informally. Appeals move upwards and are usually based on an error of law or an unfair trial. This is the project research week. (pp. 582–592)",
    keyPoints: [
      "Court hierarchy from the Magistrates' Court to the High Court of Australia",
      "Jurisdiction: the seriousness of the offence or the amount in dispute",
      "Specialist courts and tribunals",
      "The appeals process moves to a higher court",
      "Project research week; textbook pp. 582–592",
    ],
  },
  6: {
    title: "Courts and Tribunals and the Role of Courts in Making Laws",
    content:
      "Courts do not only apply the law — they make it. When a judge decides a case, the reasoning becomes a precedent that binds lower courts in similar cases (the doctrine of precedent, with lower courts distinguishing cases where the facts are different). Courts also make law through statutory interpretation, working out what the words in legislation mean when they are unclear and applying them to the facts. Judicial reasoning explains the decision: the judge sets out the material facts, the relevant law and the reasons, which is what later courts follow. Tribunals, by contrast, are usually created by statute to resolve particular disputes and do not set binding precedents in the same way. This is the project drafting week. (pp. 592–596)",
    keyPoints: [
      "Precedent: binding decisions of higher courts",
      "Statutory interpretation: judges determining the meaning of legislation",
      "Judicial reasoning: the reasons a decision is based on",
      "The difference between courts and tribunals",
      "Project drafting week; textbook pp. 592–596",
    ],
  },
  7: {
    title: "Indigenous Rights and Comparative Legal Systems",
    content:
      "Indigenous rights have been recognised in different ways across legal systems. In Australia, Mabo v Queensland (No 2) (1992) rejected terra nullius and recognised native title — Indigenous land rights that existed before colonisation and can survive it — and the Wik decision (1996) found that native title can co-exist with pastoral leases. In Canada, Delgamuukw v British Columbia (1997) recognised Aboriginal title, including the right to use and control the land, and set out how it must be proven. In New Zealand, the Treaty of Waitangi (1840) is the founding document, and the Waitangi Tribunal hears claims that the Crown has breached it, recommending remedies. Comparing these systems shows different legal pathways to recognising Indigenous rights, and each raises questions about how well the law protects them. This week also includes a mock trial, and the Report and Podcast project is due Friday 13 November. (pp. 596+)",
    keyPoints: [
      "Mabo v Queensland: native title recognised in Australia",
      "Wik decision: native title can co-exist with pastoral leases",
      "Delgamuukw: Aboriginal title in Canada",
      "Waitangi Tribunal: claims about breaches of the Treaty of Waitangi in New Zealand",
      "Mock trial; Report and Podcast project due Friday 13 November",
    ],
  },
  8: {
    title: "Revision Week (End of Semester Examinations)",
    content:
      "Revision week runs from Monday 23 November to Thursday 26 November. Revise the parliamentary and federal structure, how laws are made, the principles of the legal system, the participants and dispute types, the court hierarchy and appeals, courts making law, and the comparative Indigenous rights cases. Practise explaining each principle with an example.",
    keyPoints: [
      "Revision week: 23 - 26 November",
      "Revise each Term 4 topic with an example",
      "Know the court hierarchy and the appeals process",
      "Review the comparative Indigenous rights cases",
    ],
  },
  9: {
    title: "End of Semester Examination Period",
    content: "The examination period runs from Friday 27 November to Thursday 3 December.",
    keyPoints: [
      "Exam period: 27 November - 3 December",
      "Check the exam time and room",
      "Review your summary points the night before",
    ],
  },
};

const englishReadingByWeek: WeeklyReadings = {
  1: {
    title: "Close Analysis: Symbolism & Form",
    content: "Poets use symbols, structure and poetic form to create meaning. Analysis explains how these choices affect the reader in war poetry.",
    keyPoints: ["Symbolism represents a bigger idea", "Structure and form shape meaning", "Explain how, not just what"],
  },
  2: {
    title: "Comparative Study I",
    content: "Comparing poems means looking at how they represent power, patriotism and resistance. Use connectives such as 'similarly' or 'in contrast' to link the poems.",
    keyPoints: ["Power, patriotism and resistance", "Use comparative connectives", "Link evidence from both poems"],
  },
  3: {
    title: "Comparative Study II",
    content: "This study looks at trauma, memory and moral responsibility. Contrasting perspectives in two poems can strengthen a comparative argument.",
    keyPoints: ["Trauma and memory", "Moral responsibility", "Contrast perspectives"],
  },
  4: {
    title: "Developing Analytical Skills",
    content: "A strong analytical paragraph starts with a clear topic sentence, explains the technique, integrates a quotation and links back to the thesis.",
    keyPoints: ["Refine your thesis", "Integrate quotations", "Use TEEL in each paragraph"],
  },
  5: {
    title: "Exam-Style Writing & Topic Test",
    content: "Under timed conditions, respond to a prompt with a clear thesis and well-organised paragraphs. The poetry analysis topic test checks these skills.",
    keyPoints: ["Plan your response before writing", "Keep to the time limit", "Answer the prompt directly"],
  },
  6: {
    title: "Drafting & Feedback",
    content: "Write a full analytical response on War Poetry and use the teacher feedback to improve it. This is the first draft of SBA 3.",
    keyPoints: ["Draft the full response", "Act on feedback", "SBA 3 is an analytical response"],
  },
  7: {
    title: "Refining the Analytical Response",
    content: "Complete the analytical response on War Poetry, focusing on sophisticated interpretation and evidence-based argument. This is SBA 3, due in Week 7.",
    keyPoints: ["Sophisticated interpretation", "Evidence-based argument", "Edit for clarity and precision"],
  },
  8: {
    title: "Revision Week",
    content: "Revise the poetry techniques and the comparative structure before the end of semester examinations.",
    keyPoints: ["Revise poetic techniques", "Practise comparative paragraphs", "Review TEEL"],
  },
  9: {
    title: "End of Semester Exams",
    content: "The end of semester exam period runs from Friday 27 November to Thursday 3 December.",
    keyPoints: ["Exam period: 27 Nov - 3 Dec", "Check the exam time and room", "Review your summary points"],
  },
};

export function getStudyContent(subjectId: SubjectId, taskTitle: string, week: number): StudyContent {
  const taskType = getTaskType(taskTitle);
  const safeWeek = Math.max(1, Math.min(TOTAL_WEEKS, week));

  switch (subjectId) {
    case "math":
      return { ...mathContent, type: taskType, reading: mathReadingByWeek[safeWeek] };

    case "science":
      return { ...scienceContent, type: taskType, reading: scienceReadingByWeek[safeWeek] };

    case "history":
      return { ...historyContent, type: taskType, reading: historyReadingByWeek[safeWeek] };

    case "english":
      return { ...englishContent, type: taskType, reading: englishReadingByWeek[safeWeek] };

    default:
      return { type: taskType };
  }
}
