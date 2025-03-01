"use client"

import { useUser } from "@clerk/nextjs"

const DashboardPage = () => {
  const {user} = useUser();
  return (
    <div className="">{user?.firstName}</div>
  )
}

export default DashboardPage