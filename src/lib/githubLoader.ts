import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
export const loadGithubRepo = async (githubUrl: string) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken:process.env.GITHUB_TOKEN || "",
    branch: "main",
    recursive: false,
    ignoreFiles:['package-lock.json', 'yarn.lock','pnpm-lock.yaml','bun-lockb'],
    unknown:"warn",
    maxConcurrency:5
  });  
  const docs = await loader.load();
  return docs;
};

console.log(await loadGithubRepo("https://github.com/code100x/photo-ai"));