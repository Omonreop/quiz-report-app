import { FileText, LayoutDashboard } from "lucide-react";

export const SIDEBAR_MENU_LIST = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    activePaths: ["/dashboard"],
  },
  {
    title: "Result",
    url: "/result",
    icon: FileText,
    activePaths: ["/result"],
  },
];
