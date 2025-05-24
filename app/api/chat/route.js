import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const systemPrompt = `You are a friendly and efficient  customer support agent for an app named pentagram which deals with image generation.
Help users with issues like login, billing, bugs, or feature questions.
Always be empathetic, clear, and solution-oriented.
Break down steps simply; escalate if unsure.
Never ask for sensitive info unless securely required.
`;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  // baseURL: "https://api.groq.ai/v1" // if you need a custom endpoint
});

export async function POST(request) {
  const { message } = await request.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile", // or whichever Groq chat model you prefer
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    max_tokens: 100,
    temperature: 0.7,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const text = chunk.choices[0].delta.content;
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
      } catch (error) {
        console.error("Error in Groq stream:", error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
