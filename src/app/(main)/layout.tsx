import { ModeToggle } from "@/components/ModeToggle"
import { SidebarProvider } from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"

const layout = ({children} : {children : React.ReactNode}) => {
  return (
    <SidebarProvider>
        <main className="w-full m-2">
            <div className="flex items-center justify-between border-sidebar-background dark:border-white bg-sidebar border shadow rounded-md p-2 px-4">
                <p>GitFlow AI</p>
                {/* SearchBar */}
                <div className="items-center flex gap-3">
                <ModeToggle/>
                <UserButton/>
                </div>
            </div>
            <div className="h-4"></div>
            {/* main content */}
            <div className="border">
                {children}
            </div>
        </main>
    </SidebarProvider>
  )
}

export default layout