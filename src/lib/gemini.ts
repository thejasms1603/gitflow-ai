import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const aiSummarizeCommit = async (diff: string) => {
  try {
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
    const textResponse = response?.response?.text();
    if (!textResponse) {
      throw new Error("Invalid response from API.");
    }
    return textResponse;
  } catch (error) {
    console.log("Error summarizing commit:", error);
    return "Error summarizing commit";
  }
};

export const summariseCode = async (doc: Document) => {
  console.log("Getting summary for", doc.metadata.source);
  const code = doc.pageContent.slice(0, 10000);
  const prompt = `You are an AI that summarizes code. Summarize the following code snippet in simple terms, preserving its logic and intent:

  Code:
  ${code}

  Provide a concise summary:`;
  try {
    const response = await model.generateContent(prompt);
    return response.response?.text() ?? "No Summary Generated";
  } catch (error) {
    console.log("Error generating summary:", error);
    return "Error generating summary";
  }
};

export const generateEmbedding = async (summary: string) => {
  try {
    if (!summary || summary.trim() === "") {
      throw new Error("Summary cannot be empty.");
    }

    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(summary);

    if (!result || !result.embedding || !result.embedding.values) {
      throw new Error(
        "Failed to generate embedding: No embedding values found.",
      );
    }

    const embedding = result.embedding.values ?? [];

    if (embedding.length === 0) {
      throw new Error("Generated embedding is empty.");
    }

    return embedding;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
};
