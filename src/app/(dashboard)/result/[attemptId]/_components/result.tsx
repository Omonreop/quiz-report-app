"use client";

import StateCard from "@/components/common/state-card";
import attemptServices from "@/services/attempt.service";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Target, Trophy, Waves, XCircle } from "lucide-react";
import CategoryScoreChart from "./category-score-chart";
import ScoreRadialChart from "./score-radial-chart";

async function fetchAttempt(attemptId: string) {
  const { data } = await attemptServices.getAttemptById(attemptId);
  return data;
}

function formatCategory(category: string) {
  return category
    .toLowerCase()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

function InsightIcon({ tone }: { tone: string }) {
  if (tone === "success") return <Trophy className="size-5 text-amber-600" />;
  if (tone === "danger") return <Target className="size-5 text-red-600" />;
  return <Waves className="size-5 text-blue-600" />;
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
    <article className="[--chart-maximum:var(--muted-foreground)] [--chart-score:oklch(0.62_0.17_155)] dark:[--chart-maximum:oklch(0.55_0_0)] dark:[--chart-score:oklch(0.72_0.17_155)] mx-auto w-full max-w-5xl rounded-lg bg-card px-5 py-5 text-card-foreground shadow-sm ring-1 ring-border md:px-8">
      <header className="mb-20 flex items-center justify-between text-xs font-medium text-foreground">
        <span>{formatDateTime(attempt.createdAt)}</span>
        <span>Quiz Results - {attempt.participant.name}</span>
      </header>

      <section className="mb-16 flex flex-col gap-8 md:flex-row md:items-center">
        <ScoreRadialChart percentage={attempt.percentage} />

        <div className="min-w-0 flex-1">
          <p className="mb-2 text-sm font-bold text-amber-800">
            {formatCategory(attempt.performanceCategory)}
          </p>
          <h1 className="text-3xl font-semibold tracking-normal">
            {attempt.participant.name} - Quiz Results
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {attempt.quiz.title} • {attempt.answers.length} questions •
            Completed {formatDate(attempt.createdAt)}
          </p>
        </div>
      </section>

      <section className="mb-11 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Total score</p>
          <p className="text-3xl font-semibold">
            {attempt.score} / {attempt.maxScore}
          </p>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Correct</p>
          <p className="text-3xl font-semibold text-emerald-700 dark:text-emerald-400">
            {attempt.correctCount} / {attempt.answers.length}
          </p>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Incorrect</p>
          <p className="text-3xl font-semibold text-red-700 dark:text-red-400">
            {attempt.incorrectCount} / {attempt.answers.length}
          </p>
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-base font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Score by category
          </h2>
          <div className="mt-3 ml-10 flex gap-8 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-sm bg-(--chart-score)" />
              Score
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-sm bg-(--chart-maximum)" />
              Max possible
            </span>
          </div>
        </div>

        <CategoryScoreChart data={attempt.categoryBreakdown} />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-base font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Per-question breakdown
        </h2>
        <div className="grid gap-2">
          {attempt.answers.map((answer, index) => (
            <div
              key={answer.questionId}
              className="grid min-h-12 grid-cols-[2rem_1fr_auto_1.5rem] items-center gap-4 rounded-lg border px-4 py-2"
            >
              <span className="text-base font-medium text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-semibold">{answer.question}</p>
              <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                {formatCategory(answer.category)}
              </span>
              {answer.isCorrect ? (
                <CheckCircle2 className="size-4 text-emerald-700 dark:text-emerald-400" />
              ) : (
                <XCircle className="size-4 text-red-700 dark:text-red-400" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Insights
        </h2>
        <div className="grid gap-3">
          {attempt.insights.map((insight) => (
            <div
              key={insight.title}
              className="flex min-h-20 gap-4 rounded-lg border px-4 py-4"
            >
              <InsightIcon tone={insight.tone} />
              <p className="text-sm leading-6 text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {insight.title}.
                </span>{" "}
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
