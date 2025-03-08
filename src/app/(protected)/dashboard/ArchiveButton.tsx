"use client";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/use-projects";
import { useRefetch } from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { Archive } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const ArchiveButton = () => {
  const archiveProject = api.project.archiveProject.useMutation();
  const { projectId } = useProject();
  const refetch = useRefetch();
  return (
    <Button
      variant="destructive"
      disabled={archiveProject.isPending}
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to archive this project?",
        );
        if (confirm) {
          archiveProject.mutate(
            { projectId },
            {
              onSuccess: () => {
                toast.success("Project archived successfully");
                refetch();
              },
              onError: () => {
                toast.error("Failed to archive project");
              },
            },
          );
        }
      }}
    >
      <Archive />
      Archive
    </Button>
  );
};

export default ArchiveButton;
