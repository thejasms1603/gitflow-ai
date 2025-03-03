import { ModeToggle } from "@/components/ModeToggle"
import Navbar from "@/components/Navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import AppSideBar from "./app-sidebar"

const layout = ({children} : {children : React.ReactNode}) => {
  return (
    <SidebarProvider className="">
      <AppSideBar/>
        <main className="w-full m-2">
            <Navbar/>
            <div className="h-4"></div>
            {/* main content */}
            <div className="border-sidebar-border border bg-sidebar shadow-md rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4 dark:border-white">
                {children}
            </div>
        </main>
    </SidebarProvider>
  )
}

export default layout