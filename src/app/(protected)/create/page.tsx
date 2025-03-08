"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRefetch } from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { Info } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormProps = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormProps>();
  const createProject = api.project.createProject.useMutation();
  const checkTokens = api.project.checkTokens.useMutation();
  const refetch = useRefetch();

  function onSubmit(data: FormProps) {
    checkTokens.mutate(
      {
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      },
      {
        onSuccess: (response) => {
          console.log("File Count:", response.fileCount);
          console.log("User Tokens:", response.userTokens);

          if (!response || response.userTokens === undefined) {
            toast.error("Failed to fetch token data");
            return;
          }

          if (response.userTokens < response.fileCount) {
            toast.error("Not enough tokens to create the project.");
            return;
          }

          createProject.mutate(
            {
              githubUrl: data.repoUrl,
              name: data.projectName,
              githubToken: data.githubToken,
            },
            {
              onSuccess: () => {
                toast.success("Project created successfully");
                refetch();
                reset();
              },
              onError: () => {
                toast.error("Failed to create project, Please try again");
              },
            },
          );
        },
        onError: () => {
          toast.error("Failed to check tokens, Please try again");
        },
      },
    );
  }

  const hasEnoughTokens = checkTokens.data?.userTokens ? checkTokens.data?.fileCount <= checkTokens.data?.userTokens : true;

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img
        src="/undraw_dev-productivity.svg"
        alt="Productivity Image"
        className="h-56 w-auto"
      />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your GitHub Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your repository to link it to Gitflow AI
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("projectName", { required: true })}
              placeholder="Enter your project name"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("repoUrl", { required: true })}
              placeholder="Enter your Github repository URL"
              required
              type="url"
            />
            <div className="h-2"></div>

            <Input
              {...register("githubToken")}
              placeholder="Enter your GitHub token (optional)"
            />
            {!!checkTokens.data && (
              <>
              <div className="mt-4 bg-orange-50 px-4 py-2 rounded-md border border-orange-200 text-orange-700">
                <div className="flex items-center gap-2">
                  <Info className="size-4" />
                  <p className="text-sm"> 
                    You wll be charged <strong> {checkTokens.data?.fileCount} </strong> tokens for this project
                  </p>
                </div>
                <p className="text-sm text-blue-600 ml-6">
                  You have <strong>{checkTokens.data?.userTokens}</strong> tokens remaining
                </p>
              </div>
              </>
            )}
            <div className="h-4"></div>
            <Button type="submit" disabled={checkTokens.isPending || createProject.isPending || !hasEnoughTokens} >
              {!!checkTokens.data ? "Create Project" : "Check Token"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
