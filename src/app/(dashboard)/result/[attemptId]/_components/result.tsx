"use client";

import StateCard from "@/components/common/state-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCategoryLabel,
  formatReportDate,
  formatReportDateTime,
} from "@/lib/format";
import attemptServices from "@/services/attempt.service";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Target,
  Download,
  Trophy,
  Waves,
  XCircle,
} from "lucide-react";
import CategoryScoreChart from "./category-score-chart";
import ScoreRadialChart from "./score-radial-chart";
import Link from "next/link";

async function fetchAttempt(attemptId: string) {
  const { data } = await attemptServices.getAttemptById(attemptId);
  return data;
}

function getPerformanceBadgeClass(category: string) {
  const value = category.toLowerCase();

  if (value.includes("advanced") || value.includes("excellent")) {
    return "border-teal-500/20 bg-teal-500/10 text-teal-700 dark:text-teal-300";
  }

  if (value.includes("intermediate") || value.includes("good")) {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }

  if (value.includes("beginner") || value.includes("average")) {
    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
  }

  return "border-red-500/20 bg-red-500/10 text-red-300";
}

function InsightIcon({ tone }: { tone: string }) {
  if (tone === "success") {
    return <Trophy className="h-5 w-5 text-teal-700 dark:text-teal-300" />;
  }

  if (tone === "danger") {
    return <Target className="h-5 w-5 text-red-400" />;
  }

  return <Waves className="h-5 w-5 text-sky-400" />;
}

export default function Result({ attemptId }: { attemptId: string }) {
  const attemptQuery = useQuery({
    queryKey: ["attempt", attemptId],
    queryFn: () => fetchAttempt(attemptId),
  });

  if (attemptQuery.isLoading) {
    return <StateCard isLoading />;
  }

  if (attemptQuery.isError || !attemptQuery.data) {
    return (
      <StateCard
        title="Failed to load result"
        description="The attempt may not exist or the database is unavailable."
      />
    );
  }

  const attempt = attemptQuery.data;

  return (
    <article className="space-y-6 [--chart-maximum:var(--muted-foreground)] [--chart-score:oklch(0.72_0.17_155)]">
      <Card className="relative overflow-hidden border-teal-500/20 bg-linear-to-br from-teal-500/20 via-background to-background">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-20 h-56 w-56 rounded-full bg-teal-500/10 blur-3xl" />

        <CardHeader className="relative p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>{formatReportDateTime(attempt.createdAt)}</span>
            <span>Quiz Results - {attempt.participant.name}</span>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex justify-center lg:w-55 lg:justify-start">
              <ScoreRadialChart percentage={attempt.percentage} />
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={getPerformanceBadgeClass(
                    attempt.performanceCategory,
                  )}
                >
                  {formatCategoryLabel(attempt.performanceCategory)}
                </Badge>

                <Badge className="border border-teal-500/20 bg-teal-500/10 text-teal-700 hover:bg-teal-500/15 dark:text-teal-300">
                  Quiz Result
                </Badge>

                <Link
                  href={`/api/attempts/${attempt.id}/pdf`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className:
                      "border-teal-500/20 hover:bg-teal-500/10 hover:text-teal-700 dark:hover:text-teal-300",
                  })}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Link>
              </div>

              <div className="space-y-3">
                <CardTitle className="text-3xl font-bold tracking-tight md:text-5xl">
                  {attempt.participant.name} - Quiz Results
                </CardTitle>

                <CardDescription className="max-w-3xl text-base leading-7">
                  {attempt.quiz.title} - {attempt.answers.length} questions -
                  Completed {formatReportDate(attempt.createdAt)}
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/10 bg-background/60 px-3 py-1">
                  <CalendarDays className="h-4 w-4 text-teal-700 dark:text-teal-300" />
                  {formatReportDate(attempt.createdAt)}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/10 bg-background/60 px-3 py-1">
                  <ClipboardList className="h-4 w-4 text-teal-700 dark:text-teal-300" />
                  {attempt.quiz.title}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-teal-500/10 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div>
              <CardDescription>Total score</CardDescription>
              <CardTitle className="mt-2 text-3xl">
                {attempt.score} / {attempt.maxScore}
              </CardTitle>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-700 dark:text-teal-300">
              <Trophy className="h-5 w-5" />
            </div>
          </CardHeader>
        </Card>

        <Card className="border-teal-500/10 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div>
              <CardDescription>Correct</CardDescription>
              <CardTitle className="mt-2 text-3xl text-emerald-400">
                {attempt.correctCount} / {attempt.answers.length}
              </CardTitle>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardHeader>
        </Card>

        <Card className="border-teal-500/10 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div>
              <CardDescription>Incorrect</CardDescription>
              <CardTitle className="mt-2 text-3xl text-red-400">
                {attempt.incorrectCount} / {attempt.answers.length}
              </CardTitle>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
              <XCircle className="h-5 w-5" />
            </div>
          </CardHeader>
        </Card>
      </section>

      <Card className="border-teal-500/10 bg-card/80">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-teal-700 dark:text-teal-300" />
                Score by category
              </CardTitle>
              <CardDescription>
                Your score compared with the maximum possible score for each
                category.
              </CardDescription>
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-(--chart-score)" />
                Score
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-(--chart-maximum)" />
                Max possible
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <CategoryScoreChart data={attempt.categoryBreakdown} />
        </CardContent>
      </Card>

      <Card className="border-teal-500/10 bg-card/80">
        <CardHeader>
          <CardTitle>Per-question breakdown</CardTitle>
          <CardDescription>
            Review which questions you answered correctly or incorrectly.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3">
            {attempt.answers.map((answer, index) => (
              <div
                key={answer.questionId}
                className="grid gap-3 rounded-2xl border border-teal-500/10 bg-background/50 p-4 transition hover:border-teal-500/30 sm:grid-cols-[2.5rem_1fr_auto_auto] sm:items-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/15 text-sm font-bold text-teal-700 dark:text-teal-300">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-semibold leading-6">
                    {answer.question}
                  </p>

                  <p className="text-xs text-muted-foreground sm:hidden">
                    {formatCategoryLabel(answer.category)}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="hidden w-fit border-teal-500/20 bg-teal-500/10 text-teal-700 dark:text-teal-300 sm:inline-flex"
                >
                  {formatCategoryLabel(answer.category)}
                </Badge>

                {answer.isCorrect ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-300">
                    <XCircle className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-500/10 bg-card/80">
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <CardDescription>
            Quick feedback based on your quiz performance.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {attempt.insights.map((insight) => (
              <div
                key={insight.title}
                className="flex gap-4 rounded-2xl border border-teal-500/10 bg-background/50 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-muted/60">
                  <InsightIcon tone={insight.tone} />
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {insight.title}.
                  </span>{" "}
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
