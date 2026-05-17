import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Clock,
  History,
  Landmark,
  Lock,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const quizCategories = [
  {
    title: "General Knowledge",
    description: "Test your knowledge across mixed topics and facts.",
    icon: Brain,
    href: "/dashboard/quiz",
    available: true,
  },
  {
    title: "History",
    description: "Explore historical events, people, and timelines.",
    icon: History,
    href: "#",
    available: false,
  },
  {
    title: "Science",
    description: "Challenge yourself with basic science questions.",
    icon: Sparkles,
    href: "#",
    available: false,
  },
  {
    title: "Culture",
    description: "Questions about art, society, places, and traditions.",
    icon: Landmark,
    href: "#",
    available: false,
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/20 via-background to-background p-6 shadow-sm md:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div className="space-y-5">
            <Badge className="w-fit bg-teal-500/15 text-teal-300 hover:bg-teal-500/20">
              General Knowledge Quiz
            </Badge>

            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
                Sharpen your brain with a quick knowledge challenge.
              </h1>

              <p className="max-w-xl text-muted-foreground">
                Start the available quiz, submit your answers, and get an
                instant result report after finishing your attempt.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/quiz"
                className={buttonVariants({
                  className:
                    "bg-teal-500 text-white hover:bg-teal-600 dark:text-white",
                })}
              >
                Start General Quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/result"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-teal-500/30 hover:bg-teal-500/10 hover:text-teal-300",
                })}
              >
                View results
              </Link>
            </div>
          </div>

          <Card className="relative border-teal-500/20 bg-background/70 backdrop-blur">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300">
                <Trophy className="h-6 w-6" />
              </div>

              <CardTitle>Instant Result Report</CardTitle>
              <CardDescription>
                Your score and attempt detail will be available after
                submission.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3">
              <div className="rounded-2xl border border-teal-500/10 bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Available quiz</p>
                <p className="mt-1 text-2xl font-bold">1</p>
              </div>

              <div className="rounded-2xl border border-teal-500/10 bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Report type</p>
                <p className="mt-1 font-semibold">Auto generated</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Choose quiz category
          </h2>
          <p className="text-sm text-muted-foreground">
            More categories will be available soon.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quizCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Card
                key={category.title}
                className={`group relative overflow-hidden border-teal-500/10 bg-card transition ${
                  category.available
                    ? "hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/10"
                    : "opacity-70"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300">
                      <Icon className="h-5 w-5" />
                    </div>

                    {category.available ? (
                      <Badge className="bg-teal-500/15 text-teal-300 hover:bg-teal-500/20">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Coming soon
                      </Badge>
                    )}
                  </div>

                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {category.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent>
                  {category.available ? (
                    <Button className="w-full bg-teal-500 text-white hover:bg-teal-600">
                      <Link href={category.href}>
                        Start quiz
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled variant="outline" className="w-full">
                      <Lock className="mr-2 h-4 w-4" />
                      Locked
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
