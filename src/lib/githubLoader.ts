import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents"; 
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";
import { Octokit } from "octokit";


const getFileCount = async (path: string, octokit: Octokit, githubOwner:string, githubRepo:string, acc:number = 0) =>{
  const {data} = await octokit.rest.repos.getContent({
    owner:githubOwner,
    repo:githubRepo,
    path
  })
  if(!Array.isArray(data) && data.type === "file")
  {
    return acc + 1
  }
  if(Array.isArray(data)){
    let fileCount = 0
    const directories : string[] = []
    for(const item of data){
      if(item.type === "dir")
      {
       directories.push(item.path)
      } else{
        fileCount++
      }
    }
    if(directories.length > 0)
    {
      const directoryCounts = await Promise.all(directories.map(dirPath => getFileCount(dirPath, octokit, githubOwner, githubRepo, 0)))
      fileCount += directoryCounts.reduce((acc, count) => acc + count, 0)
    }
    return acc + fileCount
  }
  
  return acc
}
export const checkFileCount = async (githubUrl:string, githubToken?:string) =>{
  //find out how many files are in the repo
  const octokit = new Octokit({
    auth: githubToken || process.env.GITHUB_TOKEN,
  });
  const githubOwner = githubUrl.split("/")[3]
  const githubRepo = githubUrl.split("/")[4]
  if(!githubOwner || !githubRepo)
  {
    throw new Error("Invalid GitHub URL")
  }
  const fileCount = await getFileCount('/', octokit, githubOwner, githubRepo, 0)
  return fileCount
}


// const getFileCount = async (
//   path: string,
//   octokit: Octokit,
//   githubOwner: string,
//   githubRepo: string,
// ): Promise<number> => {
//   try {
//     const { data } = await octokit.rest.repos.getContent({
//       owner: githubOwner,
//       repo: githubRepo,
//       path,
//     });

//     if (!data) {
//       console.error("GitHub API returned no data for path:", path);
//       return 0;
//     }

//     if (!Array.isArray(data) && data.type === "file") {
//       return 1;
//     }

//     if (Array.isArray(data)) {
//       let fileCount = 0;
//       const directories: string[] = [];

//       for (const item of data) {
//         item.type === "dir" ? directories.push(item.path) : fileCount++;
//       }

//       const directoryCounts = await Promise.all(
//         directories.map((dirPath) =>
//           getFileCount(dirPath, octokit, githubOwner, githubRepo),
//         ),
//       );

//       return fileCount + directoryCounts.reduce((acc, count) => acc + count, 0);
//     }
//   } catch (error) {
//     console.error("Error fetching GitHub content:", error);
//     return 0;
//   }

//   return 0;
// };

// export const checkFileCount = async (
//   githubUrl: string,
//   githubToken?: string,
// ): Promise<number> => {
//   try {
//     if (!githubUrl.includes("github.com"))
//       throw new Error("Invalid GitHub URL");

//     const octokit = new Octokit({
//       auth: githubToken || process.env.GITHUB_TOKEN,
//     });

//     const [githubOwner, githubRepo] = githubUrl.split("/").slice(3, 5);
//     if (!githubOwner || !githubRepo)
//       throw new Error("Invalid GitHub URL format");

//     console.log("Fetching file count for:", { githubOwner, githubRepo });
//     return await getFileCount("/", octokit, githubOwner, githubRepo);
//   } catch (error) {
//     console.error("Error in checkFileCount:", error);
//     return 0;
//   }
// };


export const loadGithubRepo = async (githubUrl: string, githubToken?:string) => {
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


export const indexGithubRepo = async (projectId:string, githubUrl:string, githubToken?:string) =>{
  try {
    const docs = await loadGithubRepo(githubUrl, githubToken);
    const allEmbeddings = await generateEmbeddings(docs);
    await Promise.allSettled(allEmbeddings.map(async (embedding, ind) =>{
        console.log(`Processing ${ind} of ${allEmbeddings.length}`)
        if(!embedding)
        {
            throw new Error("No Embeddings")
        }
        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data:{
                summary:embedding.summary,
                fileName:embedding.fileName,
                sourceCode:embedding.sourceCode,
                projectId,
            }
        })

        await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embeddings}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
        `;

    }))
     console.log(`✅ Successfully indexed ${allEmbeddings.length} files.`);
    } catch(error){
         console.error("Error in indexGithubRepo:", error);
    }
}

export const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      try {
        const summary = await summariseCode(doc);
        const embeddings = await generateEmbedding(summary);
        return {
          summary,
          embeddings,
          sourceCode: doc.pageContent, 
          fileName: doc.metadata.source,
        };
      } catch (error) {
        console.error(
          `Error processing document ${doc.metadata.source}:`,
          error,
        );
        return null; 
      }
    }),
  );
};

