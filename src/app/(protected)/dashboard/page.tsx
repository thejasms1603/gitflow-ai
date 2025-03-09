"use client";

import Skeleton from "@/components/Skeleton";
import { useProject } from "@/hooks/use-projects";
import { ExternalLink, File, Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommitLog from "./commit-log";
import QuestionCard from "./QuestionCard";
import MeetingCard from "./MeetingCard";
import ArchiveButton from "./ArchiveButton";
import InviteButton from "./InviteButton";
import TeamMembers from "./TeamMembers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const { projects, project, projectId, setProjectId } = useProject();
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    if (project) {
      setLoading(false);
    }
  }, [project]);

  if (!projects || loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500">No projects found</p>
        <Skeleton/> 
      </div>
    );
  }
  return (
    <div className="">
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger
          onMouseEnter={() => setOpenDropdown(true)}
          onMouseLeave={() => setOpenDropdown(false)}
          className="w-full max-w-fit cursor-pointer"
          asChild
        >
          <Button variant="default" className="dark:bg-white dark:text-black">
            <File className="size-4" />
            <span className="ml-2">Projects</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-48"
          onMouseEnter={() => setOpenDropdown(true)}
          onMouseLeave={() => setOpenDropdown(false)}
        >
          {projects && projects.length > 0 ? (
            projects.map((p) => (
              <DropdownMenuItem
                key={p.id}
                onClick={() => setProjectId(p.id)} // ✅ Set Project ID
                className={`cursor-pointer hover:bg-primary hover:text-white ${
                  p.id === projectId ? "bg-primary text-white" : ""
                }`}
              >
                {p.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem className="text-gray-500">
              No Projects
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-y-4">
        <div className="inline-flex w-fit items-center rounded-md bg-primary px-4 py-3">
          <Github className="size-5 text-white dark:text-black" />
          <div className="ml-2">
            <p className="text-sm font-medium text-white dark:text-black">
              This project is linked to {""}
              <Link
                href={project?.githubUrl ?? "#"}
                className="inline-flex items-center text-white/80 hover:underline dark:text-black"
              >
                {project?.githubUrl || "No link available"}{" "}
                <ExternalLink className="ml-1 size-4" />
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-4"></div>
        <div className="flex items-center gap-4">
          <TeamMembers />
          <InviteButton />
          <ArchiveButton />
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <QuestionCard />
          <MeetingCard />
        </div>
      </div>
      <div className="mt-8"></div>
      <CommitLog />
    </div>
  );
};

export default DashboardPage;
