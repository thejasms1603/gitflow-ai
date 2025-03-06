import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents"; 
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";
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

