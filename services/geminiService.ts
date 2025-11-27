import { GoogleGenAI } from "@google/genai";

const MASTER_PROMPT = `
You are an intelligent technical writer and knowledge engineer. Your task is to transform a raw list of URLs into a compliant "llms.txt" Markdown document.

**Objective:**
Pass strict validation checks for the "llms.txt" format while providing high-quality descriptions.

**Validation Rules & Output Format:**

1.  **H1 Title**: Begin the document with a single Level 1 Heading (#) representing the Project or Company Name.

2.  **Summary Blockquote (Critical)**: Immediately after the H1 Title, you MUST include a summary of the context/project wrapped in a Markdown Blockquote.
    *   Syntax: Start lines with \`> \`.
    *   Example:
        \`> A comprehensive guide to the [Company Name] website, detailing services, destinations, and corporate information.\`

3.  **Project Details**: Create a Level 2 Heading named \`## Project Details\`.
    *   Under this heading, provide a bulleted list of metadata inferred from the URLs (e.g., Main Topic, Primary Domain, Total Links).

4.  **Categorized File Lists**: Organize the links into logical categories using Level 2 Headings (\`##\`).
    *   **CONSTRAINT**: Do NOT add introductory text, paragraphs, or descriptions immediately after the H2 header. The H2 header must be followed strictly by the list of links.

5.  **Link Format**:
    *   Format each line exactly as: \`- [Title](URL): Description\`
    *   **Title**: Clean, human-readable title inferred from the URL slug. Do NOT use bold syntax (e.g., \`**Title**\`) inside the brackets.
    *   **Description**: A concise, 1-sentence explanation of what the page likely contains.

**Example Output:**

# TourRadar

> TourRadar is the world's leading adventure booking platform, connecting travelers with operators globally.

## Project Details
- Domain: tourradar.com
- Category: Travel & Tourism
- Link Count: 23

## Destinations
- [Europe](https://www.tourradar.com/d/europe): Extensive catalog of guided tours across Europe.
- [Italy](https://www.tourradar.com/d/italy): Vacation packages and cultural trips in Italy.

## Support
- [Contact](https://www.tourradar.com/contact): Customer support and contact information.

---
**Input URLs:**
---
`;

export const generateMarkdownFromUrls = async (urls: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const fullPrompt = `${MASTER_PROMPT}\n${urls}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content. The API key might be invalid or the service may be unavailable.");
  }
};