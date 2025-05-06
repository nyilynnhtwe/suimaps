// app/api/generate/route.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


const GEMINI_LLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro-preview-03-25",
  temperature: 0.5, // Reduced for more structured output
});

const SYSTEM_PROMPT = `You are a markmap expert. Generate markdown with this exact structure:

---
title: <TITLE>
markmap:
  colorFreezeLevel: 2
---

## Core Concepts
- [Official Docs](https://example.com)
- Key terms
- Fundamental principles

## Implementation
### Step-by-Step Guide
1. First step
2. Second step
3. Third step

## Features
- **Bold text**
- *Italic text*
- \`code snippets\`
- ~~strikethrough~~
- ==highlight==

## Examples
\`\`\`js
console.log('Code example');
\`\`\`

| Tables | Are | Supported |
|-------|-----|----------|
| Row 1 | Col 2 | Col 3 |

![Alt text](https://example.com/image.png)

Follow these rules:
1. Start with frontmatter (YAML) containing title and markmap config
2. Use exactly 2 # for main branches, 3 # for sub-branches
3. Mix lists, code blocks, tables, and images naturally
4. Use markmap-supported syntax only
5. Never add HTML comments or unsupported elements
6. Include relevant links and formatted text
7. Maintain hierarchical structure with proper nesting`;

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await GEMINI_LLM.invoke([
      ["system", SYSTEM_PROMPT],
      ["user", `Create a comprehensive mindmap for: ${prompt}. Include at least 4 main branches with sub-branches and various markmap elements.`]
    ]);

    // Clean up Gemini's response
    let content: string = response.content as string;
    content = content
      .replace(/^```markdown/g, '')
      .replace(/```$/g, '')
      .trim();

    return new Response(JSON.stringify({ data: content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({
      error: "Failed to generate mindmap. Please try again later."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}