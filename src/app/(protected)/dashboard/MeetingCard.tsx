"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { uploadFile } from "@/lib/firebase";
import { Presentation, Upload } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { api } from "@/trpc/react";
import { useProject } from "@/hooks/use-projects";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const MeetingCard = () => {
  const { project } = useProject();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const processMeeting = useMutation({
    mutationFn: async (data: {
      meetingUrl: string;
      meetingId: string;
      projectId: string;
    }) => {
      const { meetingUrl, meetingId, projectId } = data;
      const response = await axios.post("/api/process-meeting", {
        meetingUrl,
        meetingId,
        projectId,
      });
      return response.data;
    },
  });
  const uploadMeeting = api.project.uploadMeeting.useMutation();
  const [isUploading, setIsUploading] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
    },
    multiple: false,
    maxSize: 50_000_000,
    onDrop: async (acceptedFiles) => {
      if (!project) return;
      setIsUploading(true);

      try {
        const file = acceptedFiles[0];
        if (!file) return;
        const downloadUrl = (await uploadFile(
          file as File,
          setProgress,
        )) as string;

        uploadMeeting.mutate(
          {
            projectId: project.id,
            meetingUrl: downloadUrl,
            name: file.name,
          },
          {
            onSuccess: (meeting) => {
              toast.success("Meeting uploaded successfully");
              router.push("/meetings");
              processMeeting.mutateAsync({meetingUrl:downloadUrl, meetingId:meeting.id, projectId:project.id})
            },
            onError: () => {
              toast.error("Failed to upload meeting");
            },
          },
        );
      } catch (error) {
        console.log(error);
        toast.error("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
  });
  return (
    <Card
      className="col-span-2 flex flex-col items-center justify-center p-10 dark:bg-gray-900 dark:ring-gray-700"
      {...getRootProps()}
    >
      {!isUploading && (
        <>
          <Presentation className="h-10 w-10 animate-bounce" />
          <h3 className="mt-2 text-sm font-semibold">Create a new meeting</h3>
          <p className="mt-1 text-center text-sm">
            Analyse your meeting with Gitflow AI <br /> Powered by AI
          </p>
          <div className="mt-6">
            <Button disabled={isUploading}>
              <Upload className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Upload Meeting
              <input className="hidden" {...getInputProps()} />
            </Button>
          </div>
        </>
      )}
      {isUploading && (
        <div className="flex flex-col items-center justify-center gap-3">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            className="size-20"
            styles={buildStyles({
              pathColor: "#000",
              textColor: "#000",
            })}
          />
          <p className="text-center text-sm">Uploading you meeting...</p>
        </div>
      )}
    </Card>
  );
};

export default MeetingCard;
