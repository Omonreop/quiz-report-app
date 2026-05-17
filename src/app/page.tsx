import { ModeToggle } from "@/components/common/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileText,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: ClipboardList,
    title: "10 questions",
    description: "Answer multiple-choice questions.",
  },
  {
    icon: BarChart3,
    title: "Instant score",
    description: "See your score and percentage.",
  },
  {
    icon: FileText,
    title: "Result report",
    description: "Review your attempt breakdown.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-10">
        <div className="absolute right-5 top-5">
          <ModeToggle />
        </div>

        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
        </div>

        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                <CheckCircle2 className="h-4 w-4" />
                General Knowledge Assessment
              </div>

              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                Take a quiz and get your result instantly.
              </h1>

              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                Login first, answer the quiz, then review your score, category
                breakdown, and performance report.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 bg-teal-600 text-white hover:bg-teal-700",
                )}
              >
                Login to start
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-teal-500/20",
                )}
              >
                Create account
              </Link>
            </div>
          </div>

          <Card className="border-teal-500/10 bg-card/80">
            <CardHeader>
              <CardTitle>What you can do</CardTitle>
              <CardDescription>
                A simple quiz flow with saved attempts and result reports.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 rounded-xl border border-teal-500/10 bg-background/50 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300">
                    <feature.icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{feature.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
