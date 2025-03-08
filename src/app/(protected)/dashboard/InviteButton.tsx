"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProject } from "@/hooks/use-projects";
import { ClipboardCopy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const InviteButton = () => {
  const { projectId } = useProject();
  const [open, setOpen] = useState(false);

  // Handle the case when projectId is unavailable
  const invitationLink = projectId
    ? `${window.location.origin}/join/${projectId}`
    : "";

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite your team members</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            Ask them to copy and paste this link into their browser:
          </p>
          <div className="flex items-center justify-between mt-4">
            <Input readOnly value={invitationLink} />
            <ClipboardCopy
              className="ml-2 size-6 cursor-pointer"
              onClick={() => {
                if (invitationLink) {
                  navigator.clipboard.writeText(invitationLink);
                  toast.success("Link copied to clipboard");
                } else {
                  toast.error("No project ID available");
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Button size="sm" onClick={() => setOpen(true)}>
        Invite Members
      </Button>
    </>
  );
};

export default InviteButton;
