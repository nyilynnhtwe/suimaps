import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const GEMINI_LLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro-preview-03-25",
  temperature: 0.5,
  apiKey: process.env.GOOGLE_API_KEY,
  safetySettings:
    [
      {
        "category": HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        "threshold": HarmBlockThreshold.BLOCK_NONE,
      },
      {
        "category": HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        "threshold": HarmBlockThreshold.BLOCK_NONE,
      },
      {
        "category": HarmCategory.HARM_CATEGORY_HARASSMENT,
        "threshold": HarmBlockThreshold.BLOCK_NONE,
      },
      {
        "category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        "threshold": HarmBlockThreshold.BLOCK_NONE,
      },
      {
        "category": HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
        "threshold": HarmBlockThreshold.BLOCK_NONE,
      }
    ]
});

// app/api/generate/route.ts
const SYSTEM_PROMPT = `Generate STRICTLY VALID Mermaid mindmap syntax using these rules:

1. Start with root node: id(shape)"text"
2. Shapes: circle, rounded, square, bang, cloud, hexagon
3. Indentation hierarchy (2 spaces per level)
4. Icons: ::icon(fa fa-icon)
5. Remove opening and closing square brackets
6. Remove opening and closing curly brackets
7. Remove opening and closing triple brackets
8. Valid Example:
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
Now create for:`;

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
      });
    }

    const response = await GEMINI_LLM.invoke([
      ["system", SYSTEM_PROMPT],
      ["user", prompt]
    ]);

    let content = response.content as string;
    content = content
      .replace(/```mermaid/g, '')
      .replace(/```/g, '')
      .trim();

    return new Response(JSON.stringify({ data: content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({
      error: "Generation failed. Please try again."
    }), { status: 500 });
  }
}