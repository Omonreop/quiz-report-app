"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SIDEBAR_MENU_LIST } from "@/constants/sidebar-constant";
import { cn } from "@/lib/utils";
import { Brain, EllipsisVertical, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

function getInitial(name?: string | null, email?: string | null) {
  return (name?.[0] ?? email?.[0] ?? "U").toUpperCase();
}

export default function AppSidebar() {
  const { data: session } = useSession();
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-teal-500/10"
              render={
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-teal-500/20 bg-teal-500/10 text-teal-700 dark:text-teal-300">
                    <Brain className="size-4" />
                  </div>

                  <span className="font-bold tracking-tight group-data-[collapsible=icon]:hidden">
                    Quiz App
                  </span>
                </div>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {SIDEBAR_MENU_LIST.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      render={
                        <a
                          href={item.url}
                          className={cn(
                            "px-4 py-3 h-auto transition-colors",
                            "hover:bg-teal-500/10 hover:text-teal-700",
                            "dark:hover:bg-teal-500/10 dark:hover:text-teal-300",
                            {
                              "bg-linear-to-r from-teal-500/20 to-emerald-500/15 text-teal-700 ring-1 ring-teal-500/20 hover:bg-teal-500/15 dark:text-teal-300":
                                isActive,
                            },
                          )}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {getInitial(userName, userEmail)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{userName}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {userEmail}
                      </span>
                    </div>
                    <EllipsisVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          {getInitial(userName, userEmail)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid text-sm leading-tight">
                        <span className="truncate font-medium">{userName}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {userEmail}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
