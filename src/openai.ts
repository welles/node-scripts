import { OpenAI } from "openai";

export async function getEmojiFromTitle(
  content: string,
  defaultEmoji: string,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not defined in environment variables");
  }

  const client = new OpenAI({ apiKey });

  const prompt = `You are an assistant that outputs a single emoji representing the following title of a task, note or idea: "${content}".
     If the title does not suggest any specific emoji, respond with the default emoji "${defaultEmoji}".
     Only respond with the emoji, nothing else.`;

  const response = await client.responses.create({
    input: prompt,
    model: "gpt-5-mini",
  });

  return response.output_text;
}
