import { ModeToggle } from "@/components/common/mode-toggle";
import { Brain } from "lucide-react";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-teal-500/15 via-background to-background" />
        <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="absolute right-4 top-4 z-20">
        <ModeToggle />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-3 self-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-500/20 bg-teal-500/10 text-teal-700 shadow-sm dark:text-teal-300">
            <Brain className="size-8" />
          </div>

          <p className="text-2xl font-bold tracking-tight">Quiz App</p>
        </div>

        {children}
      </div>
    </main>
  );
}
