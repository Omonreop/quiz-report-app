import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, BarChart3, Database, FileText } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="flex flex-col justify-center gap-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              General Knowledge Assessment
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
              Take a quiz and get an instant performance report.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Login first, answer 10 multiple-choice questions, and review every
              attempt from your dashboard result table.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className={buttonVariants({ size: "lg" })}>
              Login to start
              <ArrowRight />
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Create account
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What is included</CardTitle>
            <CardDescription>
              The core flow is backed by PostgreSQL, Prisma, and authenticated
              quiz attempts.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              [BarChart3, "Score analysis", "Total score and percentage"],
              [Database, "Persistent attempts", "Every retake is stored"],
              [FileText, "Report ready", "Structured result breakdown"],
            ].map(([Icon, title, description]) => (
              <div
                key={title as string}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <Icon className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{title as string}</p>
                  <p className="text-sm text-muted-foreground">
                    {description as string}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
