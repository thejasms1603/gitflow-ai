import { ModeToggle } from "@/components/ModeToggle"
import Navbar from "@/components/Navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import AppSideBar from "./app-sidebar"
import Footer from "@/components/Footer"

const layout = ({children} : {children : React.ReactNode}) => {
  return (
    <SidebarProvider className="">
      <AppSideBar />
      <main className="m-2 w-full">
        <Navbar />
        <div className="h-4"></div>
        {/* main content */}
        <div className="h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border border-sidebar-border bg-sidebar p-4 shadow-md dark:border-white">
          {children}
        </div>
        <Footer />
      </main>
    </SidebarProvider>
  );
}

export default layout