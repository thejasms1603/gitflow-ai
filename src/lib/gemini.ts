import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";
import { string } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export const aiSummarizeCommit = async (diff: string) => {
  const response = await model.generateContent([
    `You are an AI assistant that summarizes GitHub commit diffs. 
    Given a commit diff, analyze the changes and generate a concise summary.

    **Instructions:**
    - Identify what was added, removed, or modified.
    - Summarize the key purpose of the changes in a developer-friendly manner.
    - If possible, infer the intent behind the modifications (e.g., bug fix, feature addition, refactor).
    - Keep the summary concise (2-3 sentences).
    - Maintain a neutral, professional tone.

    **Example:**
    **Diff:**
    \`\`\`diff
    - function calculateTotal(price, tax) {
    -   return price + tax;
    + function calculateTotal(price, taxRate) {
    +   return price + (price * taxRate);
    \`\`\`
    **Summary:**  
    Refactored the \`calculateTotal\` function to use a tax rate instead of a fixed tax value, improving flexibility.

    **Now summarize this commit diff:**
    ${diff}`,
  ]);
  return response.response.text();
};

export const summariseCode = async (doc: Document) => {
  console.log("Getting summary for", doc.metadata.source);
  const code = doc.pageContent.slice(0, 10000);
  // generate a prompt
  const prompt = `You are an AI that summarizes code. Summarize the following code snippet in simple terms, preserving its logic and intent:

  Code:
  ${code}

  Provide a concise summary:`;
  const response = await model.generateContent(prompt);

  return response.response.text();
  // try {
  //   const response = await someLLMModel.generateContent(prompt);
  //   return response.response?.text() ?? "No summary generated.";
  // } catch (error) {
  //   console.error("Error generating summary:", error);
  //   return "Error generating summary.";
  // }
};

export const generateEmbedding = async (summary: string) => {
  try {
    if (!summary) {
      throw new Error("Summary cannot be empty.");
    }

    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    const result = await model.embedContent(summary);

    if (!result?.embedding) {
      throw new Error("Failed to generate embedding.");
    }

    return result.embedding.values ?? [];
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return [];
  }
};
