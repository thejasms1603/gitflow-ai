"use server";
import { streamText } from "ai";
import { createStreamableValue} from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askQuestion = async (question: string, projectId: string) => {
  const stream = createStreamableValue();
  try {
    const queryVector = await generateEmbedding(question);
    const vectorQuery = `[${queryVector.join(",")}]`;

    const result = await db.$queryRaw<
      { fileName: string; sourceCode: string; summary: string }[]
    >`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10
  `;

    if (result.length === 0) {
      stream.update("No relevant files found for this question.");
      stream.done();
      return { output: stream, filesReferences: [] };
    }

    let context = result
      .map(
        (doc) =>
          `source: ${doc.fileName}\n code content:${doc.sourceCode}\n summary of file:${doc.summary}
          )}...\n`,
      )
      .join("\n");

    (async () => {
      const { textStream } = await streamText({
        model: google("gemini-1.5-flash"),
        prompt: `
      You are an AI assistant helping a developer understand their codebase.
      Use the provided summaries and limited code snippets to answer the question.

      Question: "${question}"

      Project Context:
      ${context}

      If needed, guide the developer to the best file to check.
    `,
      });
      for await (const delta of textStream) {
        stream.update(delta);
      }
      stream.done();
    })()

    return {
      output: stream.value,
      filesReferences: result,
    };
  } catch (error) {
    console.error("Error in askQuestion:", error);
    stream.update("An error occurred while processing your request.");
    stream.done();
    return { output: stream.value, filesReferences: [] };
  }
};