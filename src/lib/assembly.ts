import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_API_KEY!,
});

function msToTime(ms: number) {
  const seconds = ms / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export const processMeeting = async (meetingUrl: string) => {
  try {
    const transcript = await client.transcripts.transcribe({
      audio: meetingUrl,
      auto_chapters: true,
      language_code: "en",
    });

    const summaries =
      transcript.chapters?.map((chapter) => ({
        start: msToTime(chapter.start),
        end: msToTime(chapter.end),
        gist: chapter.gist,
        headline: chapter.headline,
        summary: chapter.summary,
      })) || [];
    if (!transcript.text) throw new Error("No Transcript found");
    return {
      summaries,
    };
  } catch (error) {
    throw new Error("Error while summarising the meeting");
  }
};
