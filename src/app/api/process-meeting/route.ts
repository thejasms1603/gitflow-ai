import { processMeeting } from "@/lib/assembly";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodyParser = z.object({
  meetingUrl: z.string(),
  projectId: z.string(),
  meetingId: z.string(),
});

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { meetingUrl, projectId, meetingId } = bodyParser.parse(body);

    setTimeout(async () => {
      const { summaries } = await processMeeting(meetingUrl);
      if (!summaries || summaries.length === 0) {
        return NextResponse.json(
          { error: "No summaries found" },
          { status: 400 },
        );
      }

      const issues = summaries
        .map((summary) => {
          if (
            !summary.start ||
            !summary.end ||
            !summary.headline ||
            !summary.summary ||
            !summary.gist
          ) {
            console.error("Invalid summary:", summary);
            return null;
          }
          return {
            start: summary.start,
            end: summary.end,
            headline: summary.headline,
            summary: summary.summary,
            gist: summary.gist,
            meetingId,
          };
        })
        .filter((issue) => issue !== null);

      if (issues.length === 0) {
        return NextResponse.json(
          { error: "No valid summaries found" },
          { status: 400 },
        );
      }

      await db.issue.createMany({ data: issues });
      const existingMeeting = await db.meeting.findUnique({
        where: { id: meetingId },
      });
      if (!existingMeeting) {
        return NextResponse.json(
          { error: "Meeting not found" },
          { status: 404 },
        );
      }

      await db.meeting.update({
        where: { id: meetingId },
        data: {
          status: "COMPLETED",
          name: summaries[0]?.headline,
        },
      });

      return NextResponse.json({ success: true }, { status: 200 });
    }, 0);
  } catch (error) {
    console.error("Error in POST /meeting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
