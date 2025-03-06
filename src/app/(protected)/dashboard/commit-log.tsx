import { useProject } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

const CommitLog = () => {
  const { projectId, project } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });

  if (!commits?.length) {
    return <p className="text-gray-500">No commits found.</p>;
  }

  return (
    <ul className="space-y-6">
      {commits.map((commit, ind) => (
        <li key={commit.id} className="relative flex gap-x-4">
          <div
            className={cn(
              ind === commits.length - 1 ? "h-6" : "-bottom-6",
              "absolute left-3 top-0 w-px bg-gray-300 dark:bg-gray-600",
            )}
          >
            <div className="w-px translate-x-1 bg-gray-200"></div>
          </div>
          <>
            <img
              src={commit.commitAuthorAvatar}
              alt="avatar"
              className="relative mt-4 size-8 flex-none rounded-full bg-gray-50 dark:bg-gray-800"
            />
            <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
              <div className="flex justify-between gap-x-4">
                <Link
                  target="_blank"
                  href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:underline dark:text-gray-300"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {commit.commitAuthorName}
                  </span>{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    committed
                  </span>
                  <ExternalLink className="w-4" />
                </Link>
              </div>
            <span className="font-semibold">{commit.commitMessage}</span>
            <pre className="mt-2 whitespace-pre-wrap text-sm leading-0 text-gray-500">{commit.summary}</pre>
            </div>
          </>
        </li>
      ))}
    </ul>
  );
};

export default CommitLog;
