import { useProject } from '@/hooks/use-projects'
import { api } from '@/trpc/react';
import React from 'react'

const CommitLog = () => {
    const {projectId} = useProject();
    const {data: commits} = api.project.getCommits.useQuery({projectId})
  return (
    <pre>
        {JSON.stringify(commits,null,2)}
    </pre>
  )
}

export default CommitLog