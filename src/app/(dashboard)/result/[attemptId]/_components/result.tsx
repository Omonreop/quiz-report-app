"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import attemptServices from "@/services/attempt.service";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

async function fetchAttempt(attemptId: string) {
  const { data } = await attemptServices.getAttemptById(attemptId);
  return data;
}

function formatCategory(category: string) {
  return category.toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function Result({ attemptId }: { attemptId: string }) {
  const attemptQuery = useQuery({
    queryKey: ["attempt", attemptId],
    queryFn: () => fetchAttempt(attemptId),
  });

  if (attemptQuery.isLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-60 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (attemptQuery.isError || !attemptQuery.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Failed to load result</CardTitle>
          <CardDescription>
            The attempt may not exist or the database is unavailable.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const attempt = attemptQuery.data;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardDescription>{attempt.quiz.title}</CardDescription>
              <CardTitle className="mt-1 text-3xl">
                {attempt.participant.name} - Quiz Results
              </CardTitle>
              <CardDescription className="mt-2">
                Completed {new Date(attempt.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="rounded-lg bg-primary px-4 py-3 text-primary-foreground">
              <p className="text-sm opacity-80">Performance</p>
              <p className="text-2xl font-semibold">
                {formatCategory(attempt.performanceCategory)}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total score", `${attempt.score}/${attempt.maxScore}`],
          ["Correct", attempt.correctCount],
          ["Incorrect", attempt.incorrectCount],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-3xl">{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Score percentage</CardTitle>
            <span className="text-sm font-semibold">{attempt.percentage}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${attempt.percentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Per-question breakdown</CardTitle>
          <CardDescription>
            Review selected answers and correct answers.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {attempt.answers.map((answer, index) => (
            <div key={answer.questionId} className="rounded-lg border p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-medium">
                    <span className="mr-2 text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {answer.question}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selected: {answer.selectedAnswer}
                  </p>
                  {!answer.isCorrect ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Correct: {answer.correctAnswer}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {answer.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs font-semibold">
                    {answer.isCorrect ? (
                      <CheckCircle2 className="size-3 text-emerald-600" />
                    ) : (
                      <XCircle className="size-3 text-destructive" />
                    )}
                    {answer.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Link href="/dashboard/quiz" className={buttonVariants()}>
            Retake quiz
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
