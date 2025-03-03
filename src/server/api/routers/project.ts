import { z } from "zod";
import { createTRPCRouter, protectedProcedure} from "../trpc";
import { db } from "@/server/db";
import { toast } from "sonner";

export const projectRouter = createTRPCRouter({
    createProject : protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl:z.string(),
            githubToken: z.string().optional()
        })
    ).mutation(async ({ctx, input}) => {
        if(!ctx.user.userId)
        {
            toast.error("User not authorized");
        }
        const project = await db.project.create({
            data:{
                githubUrl:input.githubUrl,
                name:input.name,
                userToProjects:{
                    create:{
                        userId:ctx.user.userId!,
                    }
                }
            }
        });
        return project;
    })
})