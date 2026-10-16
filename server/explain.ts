/**
 * "Why was that wrong?" — answered without a paid AI service.
 *
 * Every multiple-choice question in the content library already ships with an
 * authored solution, so a useful explanation is always available with no
 * account, no API key and no network call. When a free Cloudflare Workers AI
 * account is configured as well, the explanation is upgraded to one that speaks
 * directly to the option the student picked.
 *
 * Either way the answer key is never re-decided here: the model is only ever
 * asked to explain the given answer, so a bad model response cannot teach the
 * wrong thing.
 */

/** Free tier, no credit card: Cloudflare states it does not train on content. */
const WORKERS_AI_MODEL = "@cf/meta/llama-3.1-8b-instruct";

/** Keeps a slow or hanging provider from holding the request open. */
const AI_TIMEOUT_MS = 9000;

export interface ExplainInput {
  question: string;
  options: string[];
  answer: string;
  chosen: string;
  solution: string;
}

export interface Explanation {
  explanation: string;
  /** Where the text came from, so the UI can say when it is AI-written. */
  source: "ai" | "authored";
  aiEnabled: boolean;
}

/** Reading an env value, treating blank as unset. */
function setting(name: string): string {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
}

/**
 * The AI tier needs both an account id and a token, which a free Workers AI
 * account provides without a payment method.
 */
export function aiConfigured(): boolean {
  return Boolean(setting("CLOUDFLARE_ACCOUNT_ID") && setting("CLOUDFLARE_API_TOKEN"));
}

/**
 * The explanation that always works: the question's own authored solution,
 * framed around what the student picked.
 */
export function authoredExplanation(input: ExplainInput): string {
  const parts = [`The correct answer is “${input.answer}”.`];

  if (input.solution) {
    parts.push(input.solution);
  }

  if (input.chosen && input.chosen !== input.answer) {
    parts.push(
      input.solution
        ? `You picked “${input.chosen}” — compare it with the reasoning above to see where it parts company.`
        : `“${input.chosen}” is not the answer the question is after, so check what it is actually asking for.`,
    );
  }

  return parts.join(" ");
}

/** The instruction given to the model, kept strict so it only explains. */
export function explainPrompt(input: ExplainInput): string {
  return [
    "A student answered a multiple-choice question incorrectly.",
    "",
    `Question: ${input.question}`,
    `Options: ${input.options.join(" | ")}`,
    `Correct answer: ${input.answer}`,
    input.solution ? `Reference explanation: ${input.solution}` : "",
    `The student chose: ${input.chosen}`,
    "",
    "Explain in two or three short sentences why the student's choice is wrong and why the correct answer is right.",
    'Address the student directly as "you". Use plain prose with no markdown and no lists.',
    "Never change, contradict or re-decide the correct answer given above.",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

interface WorkersAiResponse {
  result?: { response?: unknown };
  success?: boolean;
}

/**
 * Calls the free Workers AI endpoint. Any failure returns null, so the caller
 * falls back to the authored explanation rather than showing the student an
 * error where an explanation should be.
 */
async function explainWithAi(input: ExplainInput): Promise<string | null> {
  const accountId = setting("CLOUDFLARE_ACCOUNT_ID");
  const token = setting("CLOUDFLARE_API_TOKEN");
  if (!accountId || !token) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${WORKERS_AI_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [{ role: "user", content: explainPrompt(input) }] }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      console.error(`Workers AI responded ${response.status}; using the authored explanation`);
      return null;
    }

    const body = (await response.json()) as WorkersAiResponse;
    const text = typeof body.result?.response === "string" ? body.result.response.trim() : "";
    return text.length > 0 ? text : null;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error("Workers AI explanation failed; using the authored explanation:", reason);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * The explanation to show. The authored text is the guaranteed path; AI only
 * ever replaces it when it produced something usable.
 */
export async function explainAnswer(input: ExplainInput): Promise<Explanation> {
  const fallback = authoredExplanation(input);
  if (!aiConfigured()) {
    return { explanation: fallback, source: "authored", aiEnabled: false };
  }

  const written = await explainWithAi(input);
  return written
    ? { explanation: written, source: "ai", aiEnabled: true }
    : { explanation: fallback, source: "authored", aiEnabled: true };
}

/** Pulls the request body into the shape the explainer expects. */
export function parseExplainBody(body: unknown): ExplainInput | null {
  if (!body || typeof body !== "object") return null;
  const { question, answer, chosen, solution, options } = body as Record<string, unknown>;

  const asText = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  const questionText = asText(question);
  const answerText = asText(answer);
  const chosenText = asText(chosen);

  // Without a question and both answers there is nothing to explain.
  if (!questionText || !answerText || !chosenText) return null;

  return {
    question: questionText,
    answer: answerText,
    chosen: chosenText,
    solution: asText(solution),
    options: Array.isArray(options) ? options.map(asText).filter((option) => option.length > 0) : [],
  };
}
