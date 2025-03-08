"use client";

import { useProject } from "@/hooks/use-projects";
import { api } from "@/trpc/react";
import Image from "next/image";

const TeamMembers = () => {
  const { projectId } = useProject();
  const { data: teamMembers } = api.project.getTeamMembers.useQuery({
    projectId: projectId!,
  });
  return (
    <div className="flex items-center gap-2">
      {teamMembers?.map((member) => (
        <img
          src={member.user.imageUrl ?? member.user.firstName[0]}
          alt={member.user.firstName}
          key={member.id}
          className="w-6 h-6 rounded-full"
        />
      ))}
    </div>
  );
};

export default TeamMembers;
