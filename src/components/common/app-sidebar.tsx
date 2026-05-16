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
import { BookOpenCheck, EllipsisVertical, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

type AppSidebarProps = {
  user: {
    name?: string | null;
    email?: string | null;
  };
};

function getInitial(name?: string | null, email?: string | null) {
  return (name?.[0] ?? email?.[0] ?? "U").toUpperCase();
}

export default function AppSidebar({ user }: AppSidebarProps) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const userName = user.name ?? "User";
  const userEmail = user.email ?? "";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <div className="font-semibold">
                  <div className="flex p-2 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <BookOpenCheck className="size-4" />
                  </div>
                  Quiz
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
                const isActive = item.activePaths.some((path) =>
                  path === "/dashboard"
                    ? pathname === path
                    : pathname.startsWith(path),
                );

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={
                        <a href={item.url} className="h-auto px-4 py-3">
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
                    className="h-auto data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
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
