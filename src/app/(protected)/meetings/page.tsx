"use client";
import React from "react";
import MeetingCard from "../dashboard/MeetingCard";
import { useProject } from "@/hooks/use-projects";
import { api } from "@/trpc/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Delete, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRefetch } from "@/hooks/use-refetch";

const MeetingsPage = () => {
  const { projectId } = useProject();
  const refetch = useRefetch();
  const { data: meetings, isLoading } = api.project.getMeetings.useQuery(
    {
      projectId,
    },
    {
      refetchInterval: 4000,
    },
  );
  const deleteMeeting = api.project.deleteMeeting.useMutation();
  return (
    <>
      <MeetingCard />
      <div className="h-6"></div>
      <h1 className="text-xl font-semibold">Meetings</h1>
      {meetings && meetings.length == 0 && <div>No Meetings found</div>}
      {isLoading && <div>Loading...</div>}
      <ul className="divide-y divide-gray-200">
        {meetings?.map((meeting) => (
          <li
            key={meeting.id}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/meetings/${meeting.id}`}
                    className="text-sm font-semibold"
                  >
                    {meeting.name}
                  </Link>
                  {meeting.status === "PROCESSING" && (
                    <Badge className="ml-3 bg-yellow-500 text-white">
                      Processing...
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-x-2 text-xs">
                <p className="whitespace-nowrap">
                  {meeting.createdAt.toDateString()}
                </p>
                <p className="truncate">{meeting.issues.length} issues</p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <Link href={`/meetings/${meeting.id}`}>
                <Button variant="default">View Meeting</Button>
              </Link>
              <Button
                disabled={deleteMeeting.isPending}
                variant="destructive"
                onClick={() =>
                  deleteMeeting.mutate(
                    { meetingId: meeting.id },
                    {
                      onSuccess: () => {
                        toast.success("Meeting deleted successfully");
                        refetch();
                      },
                      onError: () => {
                        toast.error("Failed to delete meeting");
                      },
                    },
                  )
                }
              >
                <Trash2 />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MeetingsPage;
