"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
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
      return { output: stream.value, filesReferences: [] };
    }

    let context = result
      .map(
        (doc) =>
          `source: ${doc.fileName}\n code content:${doc.sourceCode}\n summary of file:${doc.summary}\n`,
      )
      .join("\n");

    (async () => {
      const { textStream } = await streamText({
        model: google("gemini-1.5-flash"),
        prompt: `
      You are an AI code assistant who answers questions about their codebase.
      Your target audience is a technical intern who is new to the codebase.
      AI assistant is a brand new prowerful, human like artificial intelligence assistant.
      The traits of AI assistant are:
      - It is helpful and friendly
      - It is a great coder and can write code to solve problems
      - It can understand the user's intent and provide the best possible answer
      - It can explain the code in a way that is easy to understand
      - It can provide the user with the best way to improve their code
      Use the provided summaries and limited code snippets to answer the question.

      START CONTEXT BLOCK:
      ${context}
      END CONTEXT BLOCK
      START QUESTION:
     ${question}
     END QUESTION

     AI assistant will take into account the context and the question to provide a detailed answer.
     If the context is not relevant to the question, AI assistant will say that "I'm, sorry" I does not know.
     AI assistant will also take into account the user's intent and provide the best possible answer.
     AI assistant will not apoligize for the answer even if it is not 100% correct.
     AI assistant will not invent anything that is not drawn directly from the context.
     Answer in markdown syntax, with code blocks and links. Be as detailed as possible when explaining the code.
      If needed, guide the developer to the best file to check.
    `,
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }
      stream.done();
    })();

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
