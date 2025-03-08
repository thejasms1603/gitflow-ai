import { Octokit } from "octokit";
import axios from 'axios';
import { aiSummarizeCommit } from "./gemini";
import { db } from "@/server/db";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN!,
});

type CommitResponse = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHash = async (
  githubUrl: string,
): Promise<CommitResponse[]> => {
  try {
    const urlParts = new URL(githubUrl);
    const [owner, repo] = urlParts.pathname.split("/").slice(1, 3);
    if(!owner || !repo)
    {
      throw new Error('Invalid github url')
    }
    const { data } = await octokit.rest.repos.listCommits({
      owner: owner,
      repo: repo,
      per_page: 15,
    });
    return data.map((commit) => ({
      commitHash: commit.sha,
      commitMessage: commit.commit.message ?? "",
      commitAuthorName: commit.commit.author?.name ?? "Unknown",
      commitAuthorAvatar: commit.author?.avatar_url ?? "",
      commitDate: commit.commit.author?.date ?? "",
    }));
  } catch (error) {
    console.error("Error fetching commit data:", error);
    return [];
  }
};

export const pollCommits = async (projectId: string) => {
  try {
    const project = await fetchProjectGithubUrl(projectId);
    if (!project?.githubUrl) return;

    const commitHashes = await getCommitHash(project.githubUrl);
    if (!commitHashes.length) {
      console.log("No commits found.");
      return;
    }

    const unProcessedCommits = await filterUnprocessedCommits(
      projectId,
      commitHashes,
    );
    if (unProcessedCommits.length === 0) {
      console.log("No new unprocessed commits.");
      return;
    }
    console.log("New commits to be processed:", unProcessedCommits);
    const summaryResponse = await Promise.allSettled(unProcessedCommits.map((commit: any) => {
      return summarizeCommit(project.githubUrl, commit.commitHash)
    }))
    const summarises = summaryResponse.map((response: any) =>{
      if(response.status === 'fulfilled')
      {
        return response.value
      }
      return ""
    })
    // Process commits here (e.g., store in DB, notify users, etc.)
    const commits = await db.commitlog.createMany({
      data: summarises
        .map((summary: any, index:any) => {
          const commit = unProcessedCommits[index];
          console.log(`processing commit ${index}`)
          if (!commit) return null;
          return {
            projectId,
            commitHash: commit.commitHash,
            commitMessage: commit.commitMessage,
            commitAuthorName: commit.commitAuthorName,
            commitAuthorAvatar: commit.commitAuthorAvatar,
            commitDate: commit.commitDate,
            summary,
          };
        })
        .filter((commit): commit is NonNullable<typeof commit> => commit !== null),
    });
    return commits;
  } catch (error) {
    console.error("Error occurred while polling the commits:", error);
  }
};

async function summarizeCommit(githubUrl: string, commitHash: string) {
  try {
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
      headers: {
        Accept: "application/vnd.github.v3.diff",
      },
    });

    if (!data || typeof data !== "string" || data.trim() === "") {
      throw new Error("Invalid commit diff received");
    }

    return await aiSummarizeCommit(data);
  } catch (error) {
    console.error("Error in summarizeCommit:", error);
    return "Error fetching or summarizing commit.";
  }
}

const fetchProjectGithubUrl = async (projectId: string) => {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { githubUrl: true },
    });

    if (!project?.githubUrl) {
      throw new Error("Project has no GitHub URL.");
    }

    return project;
  } catch (error) {
    console.error("Error while finding project URL:", error);
    return null;
  }
};

const filterUnprocessedCommits = async (
  projectId: string,
  commitHashes: CommitResponse[],
) => {
  try {
    const processedCommits = await db.commitlog.findMany({
      where: { projectId },
      select: { commitHash: true },
    });

    const processedCommitHashes = new Set(
      processedCommits.map((commit: any) => commit.commitHash),
    );

    // Filter commits not in the processed set
    return commitHashes.filter(
      (commit) => !processedCommitHashes.has(commit.commitHash),
    );
  } catch (error) {
    console.error("Error filtering unprocessed commits:", error);
    return [];
  }
};

