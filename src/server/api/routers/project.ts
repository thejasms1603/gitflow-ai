import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { toast } from "sonner";
import { pollCommits } from "@/lib/github";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log(ctx.user.userId);

        const project = await ctx.db.project.create({
          data: {
            githubUrl: input.githubUrl,
            name: input.name,
            userToProjects: {
              create: {
                userId: ctx.user.userId!,
              },
            },
          },
        });
        await pollCommits(project.id);
        return project;
      } catch (error) {
        console.error("Error creating project:", error);
        throw error;
      }
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    try {
      const projects = await ctx.db.project.findMany({
        where: {
          userToProjects: {
            some: {
              userId: ctx.user.userId!,
            },
          },
          deletedAt: null,
        },
      });

      return projects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects. Please try again.");
      throw error; // Re-throw the error for further handling
    }
  }),
  getCommits: protectedProcedure.input(z.object({
    projectId: z.string()
  })).query(async ({ctx, input}) =>{
    return await ctx.db.commitlog.findMany({
      where:{projectId:input.projectId}

    })
  })
});
