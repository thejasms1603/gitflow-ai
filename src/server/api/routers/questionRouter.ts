// src/server/trpc/router/askQuestion.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { askQuestion } from "@/app/(protected)/dashboard/actions"; // your existing askQuestion function

export const askQuestionRouter = createTRPCRouter({
  askQuestion: publicProcedure
    .input(
      z.object({
        question: z.string(),
        projectId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { question, projectId } = input;
      try {
        const { output, filesReferences } = await askQuestion(
          question,
          projectId,
        );
        return { output, filesReferences };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to process the question");
      }
    }),
});
