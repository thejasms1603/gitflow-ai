"use client";

import Skeleton from "@/components/Skeleton";
import { useProject } from "@/hooks/use-projects";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommitLog from "./commit-log";
import QuestionCard from "./QuestionCard";
import MeetingCard from "./MeetingCard";
import ArchiveButton from "./ArchiveButton";
import InviteButton from "./InviteButton";
import TeamMembers from "./TeamMembers";

const DashboardPage = () => {
  const { project } = useProject();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (project) {
      setLoading(false);
    }
  }, [project]);
  if (loading) {
    return <Skeleton />;
  }
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <div className="inline-flex w-fit items-center rounded-md bg-primary px-4 py-3">
          <Github className="size-5 text-white dark:text-black" />
          <div className="ml-2">
            <p className="text-sm font-medium text-white dark:text-black">
              This project is linked to {""}
              <Link
                href={project?.githubUrl ?? ""}
                className="inline-flex items-center text-white/80 hover:underline dark:text-black"
              >
                {project?.githubUrl} <ExternalLink className="ml-1 size-4" />
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
