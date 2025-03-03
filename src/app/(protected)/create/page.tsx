"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {toast} from 'sonner';

type FormProps = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormProps>();
  const createProject = api.project.createProject.useMutation();

  function onSubmit(data: FormProps) {
    window.alert(JSON.stringify(data, null, 2));
    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          reset();
        },
        onError: () => {
          toast.error('Failed to create project, Please try again')
        },
      },
    );
    return true;
  }

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
            <div className="h-4"></div>
            <Button type="submit" disabled={createProject.isPending}>Create Project</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
