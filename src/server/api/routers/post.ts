import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const newPost = await ctx.db.post.create({
          data: {
            name: input.name,
            createdAt: new Date(), // Ensure timestamp
          },
        });
        return newPost;
      } catch (error) {
        throw new Error("Failed to create post");   
      }
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    try {
      const post = await ctx.db.post.findFirst({
        orderBy: { createdAt: "desc" },
      });
      return post ?? null;
    } catch (error) {
      throw new Error("Failed to fetch latest post");
    }
  }),
});
