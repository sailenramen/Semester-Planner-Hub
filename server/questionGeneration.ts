import { Request, Response, Express } from "express";
import Anthropic from "@anthropic-ai/sdk";
import multer from "multer";
import * as pdfjs from "pdfjs-dist";
import mammoth from "mammoth";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, PPTX, and DOCX files are allowed."));
    }
  },
});

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = new Uint8Array(buffer);
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;
  
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(" ");
    text += pageText + "\n\n";
  }
  
  return text;
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export interface GeneratedQuestion {
  id: string;
  type: "multiple_choice" | "short_answer" | "extended_response";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface GeneratedQuestionsResponse {
  questions: GeneratedQuestion[];
  fileName: string;
  topic: string;
  generatedAt: string;
}

export function registerQuestionGenerationRoutes(app: Express): void {
  app.post("/api/generate-questions", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { subject, topic } = req.body;
      
      if (!subject || !topic) {
        return res.status(400).json({ error: "Subject and topic are required" });
      }

      let extractedText = "";
      
      if (req.file.mimetype === "application/pdf") {
        extractedText = await extractTextFromPDF(req.file.buffer);
      } else if (
        req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        req.file.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        extractedText = await extractTextFromDocx(req.file.buffer);
      }

      if (!extractedText.trim()) {
        return res.status(400).json({ error: "Could not extract text from file" });
      }

      const truncatedText = extractedText.substring(0, 15000);

      const prompt = `You are a Year 9/10 Victorian Curriculum tutor. Based on this content about ${subject} - ${topic}, generate 8-10 study questions suitable for Year 9/10 students.

Include:
- 3 multiple choice questions (with 4 options each, label correct answer)
- 3 short answer questions (1-2 sentence answers expected)
- 2-4 extended response questions (paragraph answers expected)

For each question, provide:
- The question text
- For multiple choice: the 4 options (A, B, C, D) and correct answer
- For all types: a detailed answer/explanation

Content to base questions on:
${truncatedText}

Format your response as valid JSON with this structure:
{
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "Question text here",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A) Option 1",
      "explanation": "Explanation of why this is correct"
    },
    {
      "id": "q2",
      "type": "short_answer",
      "question": "Question text here",
      "correctAnswer": "Expected answer here",
      "explanation": "Additional context"
    },
    {
      "id": "q3",
      "type": "extended_response",
      "question": "Question text here",
      "correctAnswer": "Model answer here",
      "explanation": "Key points to include"
    }
  ]
}

Return ONLY the JSON object, no additional text.`;

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });

      const responseText = message.content[0].type === "text" ? message.content[0].text : "";
      
      let questions: GeneratedQuestion[];
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          questions = parsed.questions;
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        return res.status(500).json({ error: "Failed to parse generated questions" });
      }

      const response: GeneratedQuestionsResponse = {
        questions,
        fileName: req.file.originalname,
        topic,
        generatedAt: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate questions" 
      });
    }
  });

  app.post("/api/regenerate-questions", async (req: Request, res: Response) => {
    try {
      const { extractedText, subject, topic } = req.body;
      
      if (!extractedText || !subject || !topic) {
        return res.status(400).json({ error: "Extracted text, subject, and topic are required" });
      }

      const truncatedText = extractedText.substring(0, 15000);

      const prompt = `You are a Year 9/10 Victorian Curriculum tutor. Based on this content about ${subject} - ${topic}, generate 8-10 NEW and DIFFERENT study questions suitable for Year 9/10 students. Make these questions different from any previously generated questions.

Include:
- 3 multiple choice questions (with 4 options each, label correct answer)
- 3 short answer questions (1-2 sentence answers expected)
- 2-4 extended response questions (paragraph answers expected)

For each question, provide:
- The question text
- For multiple choice: the 4 options (A, B, C, D) and correct answer
- For all types: a detailed answer/explanation

Content to base questions on:
${truncatedText}

Format your response as valid JSON with this structure:
{
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "Question text here",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A) Option 1",
      "explanation": "Explanation of why this is correct"
    },
    {
      "id": "q2",
      "type": "short_answer",
      "question": "Question text here",
      "correctAnswer": "Expected answer here",
      "explanation": "Additional context"
    },
    {
      "id": "q3",
      "type": "extended_response",
      "question": "Question text here",
      "correctAnswer": "Model answer here",
      "explanation": "Key points to include"
    }
  ]
}

Return ONLY the JSON object, no additional text.`;

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });

      const responseText = message.content[0].type === "text" ? message.content[0].text : "";
      
      let questions: GeneratedQuestion[];
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          questions = parsed.questions;
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        return res.status(500).json({ error: "Failed to parse generated questions" });
      }

      res.json({
        questions,
        topic,
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error regenerating questions:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to regenerate questions" 
      });
    }
  });
}
