import { db } from "@/server/db";
import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
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
    const { data } = await octokit.rest.repos.listCommits({
      owner: "code100x",
      repo: "cms",
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
    // Process commits here (e.g., store in DB, notify users, etc.)
  } catch (error) {
    console.error("Error occurred while polling the commits:", error);
  }
};

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
      select: { commitHash: true }, // Fetch only commitHash
    });

    const processedCommitHashes = new Set(
      processedCommits.map((commit) => commit.commitHash),
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

// Top-level function to call `pollCommits`
const runPolling = async () => {
  await pollCommits("cm7upm5wc00031q596yqoolvk");
  console.log("Executed successfully");
};

runPolling().catch((error) => console.error("Error in runPolling:", error));
