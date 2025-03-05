import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY|| "");

const model = genAI.getGenerativeModel({
    model:"gemini-2.0-flash"
})

export const aiSummarizeCommit = async (diff: string) =>{
   const response = await model.generateContent([
     `You are an AI assistant that summarizes GitHub commit diffs. 
    Given a commit diff, analyze the changes and generate a concise summary.

    **Instructions:**
    - Identify what was added, removed, or modified.
    - Summarize the key purpose of the changes in a developer-friendly manner.
    - If possible, infer the intent behind the modifications (e.g., bug fix, feature addition, refactor).
    - Keep the summary concise (2-3 sentences).
    - Maintain a neutral, professional tone.

    **Example:**
    **Diff:**
    \`\`\`diff
    - function calculateTotal(price, tax) {
    -   return price + tax;
    + function calculateTotal(price, taxRate) {
    +   return price + (price * taxRate);
    \`\`\`
    **Summary:**  
    Refactored the \`calculateTotal\` function to use a tax rate instead of a fixed tax value, improving flexibility.

    **Now summarize this commit diff:**
    ${diff}`,
   ]);
return response.response.text();
}