"use client"

import { api } from "@/trpc/react"

const Tokens = () => {
    const {data : users} = api.project.getMyTokens.useQuery();
  return (
    <div>
      <p className="font-semibold text-lg">{users?.tokens} tokens</p>
    </div>
  )
}

export default Tokens
