import AppSidebar from "@/components/common/app-sidebar";
import { ModeToggle } from "@/components/common/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import DashboardBreadCrumb from "./_components/dashboard-breadcrumb";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
        }}
      />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="cursor-pointer" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadCrumb />
          </div>
          <div className="px-4">
            <ModeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
