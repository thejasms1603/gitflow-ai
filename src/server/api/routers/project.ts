import { string, z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { toast } from "sonner";
import { pollCommits } from "@/lib/github";
import { checkFileCount, indexGithubRepo } from "@/lib/githubLoader";

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
        const user = await ctx.db.user.findUnique({
          where: {
            id: ctx.user.userId!,
          },
        });
        if (!user) {
          throw new Error("User not found");
        }
        const fileCount = await checkFileCount(
          input.githubUrl,
          input.githubToken,
        );
        if (fileCount > user.tokens) {
          throw new Error("Not enough tokens");
        }
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
        await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
        await pollCommits(project.id);
        await ctx.db.user.update({
          where: {
            id: ctx.user.userId!,
          },
          data: {
            tokens: {
              decrement: fileCount,
            },
          },
        });
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
      throw error;
    }
  }),
  getCommits: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      pollCommits(input.projectId)
        .then()
        .catch((err) => {
          console.error(err);
        });
      return await ctx.db.commitlog.findMany({
        where: { projectId: input.projectId },
      });
    }),
  saveAnswer: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        answer: z.string(),
        projectId: z.string(),
        filesReferences: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.question.create({
        data: {
          projectId: input.projectId,
          question: input.question,
          answer: input.answer,
          filesReferences: input.filesReferences,
          userId: ctx.user.userId!,
        },
      });
    }),
  getQuestions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.question.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  uploadMeeting: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        meetingUrl: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const meeting = await ctx.db.meeting.create({
        data: {
          name: input.name,
          projectId: input.projectId,
          meetingUrl: input.meetingUrl,
          status: "PROCESSING",
        },
      });
      return meeting;
    }),
  getMeetings: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.meeting.findMany({
        where: {
          projectId: input.projectId,
        },
        include: { issues: true },
      });
    }),
  deleteMeeting: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.issue.deleteMany({
        where: { meetingId: input.meetingId },
      });

      return await ctx.db.meeting.delete({
        where: { id: input.meetingId },
      });
    }),
  getMeetingById: protectedProcedure
    .input(z.object({ meetingId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.meeting.findUnique({
        where: { id: input.meetingId },
        include: { issues: true },
      });
    }),
  archiveProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.project.update({
        where: { id: input.projectId },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
  getTeamMembers: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const teamMembers = await ctx.db.userToProject.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          user: true,
        },
      });
      return teamMembers;
    }),
  getMyTokens: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: {
        id: ctx.user.userId!,
      },
      select: {
        tokens: true,
      },
    });
  }),
  checkTokens: protectedProcedure
    .input(
      z.object({
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const fileCount = await checkFileCount(
          input.githubUrl,
          input.githubToken,
        );

        console.log("File count received:", fileCount);

        if (!ctx.user?.userId) {
          console.warn("User ID is undefined");
          return { fileCount, userTokens: 0 };
        }

        const user = await ctx.db.user.findUnique({
          where: { id: ctx.user.userId },
          select: { tokens: true },
        });

        console.log("User tokens found:", user?.tokens);

        return {
          fileCount: fileCount,
          userTokens: user?.tokens,
        };
      } catch (error) {
        console.error("Error in checkTokens procedure:", error);
        return { fileCount: 0, userTokens: 0 };
      }
    }),
});
