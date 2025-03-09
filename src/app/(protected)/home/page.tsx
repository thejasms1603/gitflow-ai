import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@clerk/nextjs/server";
import {
  Bot,
  CreditCard,
  Folder,
  LayoutDashboard,
  Plus,
  Presentation,
} from "lucide-react";
import { redirect } from "next/navigation";
import DashboardPage from "../dashboard/page";
import MeetingsPage from "../meetings/page";
import BillingPage from "../billing/page";
import CreatePage from "../create/page";

const HomePage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }
  return (
    <div className="container mx-auto min-h-screen px-4 py-24">
      <div className="mx-auto max-w-6xl space-y-8">
        <Tabs defaultValue="Dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-4 rounded-lg bg-muted/20 p-2 md:grid-cols-4">
            <TabsTrigger
              value="Dashboard"
              className="cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard />
                <span className="hidden sm:inline">Dashboard</span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="Create Project"
              className="cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span className="flex items-center gap-2">
                <Plus />
                <span className="hidden sm:inline">Create Project</span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="Meetings"
              className="cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span className="flex items-center gap-2">
                <Presentation />
                <span className="hidden sm:inline">Meetings</span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="Billing"
              className="cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span className="flex items-center gap-2">
                <CreditCard />
                <span className="hidden sm:inline">Billing</span>
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 rounded-lg border bg-card p-4 shadow-sm">
            <TabsContent
              value="Dashboard"
              className="mt-0 focus-visible:outline-none"
            >
              <DashboardPage />
            </TabsContent>
            <TabsContent
              value="Create Project"
              className="mt-0 focus-visible:outline-none"
            >
              <CreatePage />
            </TabsContent>
            <TabsContent
              value="Meetings"
              className="mt-0 focus-visible:outline-none"
            >
              <MeetingsPage />
            </TabsContent>
            <TabsContent
              value="Billing"
              className="mt-0 focus-visible:outline-none"
            >
              <BillingPage />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default HomePage;
