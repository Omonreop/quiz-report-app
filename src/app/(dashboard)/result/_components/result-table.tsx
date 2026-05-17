"use client";

import DataTable from "@/components/common/data-table";
import StateCard from "@/components/common/state-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-table-constant";
import { getErrorMessage } from "@/lib/error";
import { formatCategoryLabel, formatTableDate } from "@/lib/format";
import attemptServices from "@/services/attempt.service";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  CalendarDays,
  Eye,
  History,
  Loader2,
  RefreshCcw,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

async function fetchAttempts(page: number, limit: number) {
  const { data } = await attemptServices.getMyAttempts({ page, limit });
  return data;
}

function getPerformanceBadgeClass(category: string) {
  const value = category.toLowerCase();

  if (value.includes("excellent") || value.includes("great")) {
    return "border-teal-500/20 bg-teal-500/10 text-teal-700 dark:text-teal-300";
  }

  if (value.includes("good")) {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }

  if (value.includes("average")) {
    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
  }

  return "border-muted bg-muted text-muted-foreground";
}

export default function ResultTable() {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT);

  const attemptsQuery = useQuery({
    queryKey: ["attempts", currentPage, currentLimit],
    queryFn: () => fetchAttempts(currentPage, currentLimit),
  });

  useEffect(() => {
    if (!attemptsQuery.isError) return;

    toast.error("Load results failed", {
      description: getErrorMessage(
        attemptsQuery.error,
        "Unable to load your quiz results.",
      ),
    });
  }, [attemptsQuery.error, attemptsQuery.isError]);

  const attempts = useMemo(
    () => attemptsQuery.data?.attempts ?? [],
    [attemptsQuery.data],
  );

  const totalPages = attemptsQuery.data?.pagination.totalPages ?? 1;
  const summary = attemptsQuery.data?.summary;
  const latestAttempt = summary?.latestAttempt ?? null;
  const bestAttempt = summary?.bestAttempt ?? null;
  const averagePercentage = summary?.averagePercentage ?? 0;
  const totalAttempts = summary?.totalAttempts ?? 0;

  const tableData = useMemo(() => {
    return attempts.map((attempt) => [
      <div key={`${attempt.id}-quiz`} className="space-y-1">
        <p className="font-medium">{attempt.quizTitle}</p>
        <p className="text-xs text-muted-foreground">
          Attempt ID: {attempt.id.slice(0, 8)}
        </p>
      </div>,

      <div key={`${attempt.id}-score`} className="min-w-35 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">
            {attempt.score}/{attempt.maxScore}
          </span>
          <span className="text-sm text-teal-700 dark:text-teal-300">
            {attempt.percentage}%
          </span>
        </div>
        <Progress value={attempt.percentage} className="h-2" />
      </div>,

      <Badge
        key={`${attempt.id}-performance`}
        variant="outline"
        className={getPerformanceBadgeClass(attempt.performanceCategory)}
      >
        {formatCategoryLabel(attempt.performanceCategory)}
      </Badge>,

      <div
        key={`${attempt.id}-date`}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <CalendarDays className="h-4 w-4" />
        {formatTableDate(attempt.createdAt)}
      </div>,

      <Link
        key={attempt.id}
        href={`/result/${attempt.id}`}
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className:
            "border-teal-500/20 hover:bg-teal-500/10 hover:text-teal-700 dark:hover:text-teal-300",
        })}
      >
        <Eye className="mr-2 h-4 w-4" />
        View detail
      </Link>,
    ]);
  }, [attempts]);

  if (attemptsQuery.isError) {
    return (
      <StateCard
        title="Failed to load results"
        description={getErrorMessage(
          attemptsQuery.error,
          "Unable to load your quiz results.",
        )}
      />
    );
  }

  return (
    <section className="space-y-6">
      <Card className="relative overflow-hidden border-teal-500/20 bg-linear-to-br from-teal-500/20 via-background to-background">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-20 h-56 w-56 rounded-full bg-teal-500/10 blur-3xl" />

        <CardHeader className="relative space-y-6 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <Badge className="w-fit border border-teal-500/20 bg-teal-500/10 text-teal-700 hover:bg-teal-500/15 dark:text-teal-300">
                Result History
              </Badge>

              <div className="space-y-3">
                <CardTitle className="text-3xl font-bold tracking-tight md:text-5xl">
                  Quiz results
                </CardTitle>
                <CardDescription className="text-base leading-7">
                  Review your previous quiz attempts, compare your scores, and
                  open detailed reports from each submission.
                </CardDescription>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => attemptsQuery.refetch()}
              disabled={attemptsQuery.isFetching}
              className="w-fit border-teal-500/20 hover:bg-teal-500/10 hover:text-teal-700 dark:hover:text-teal-300"
            >
              {attemptsQuery.isFetching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-teal-500/10 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div>
              <CardDescription>Latest score</CardDescription>
              <CardTitle className="mt-2 text-3xl">
                {latestAttempt ? `${latestAttempt.percentage}%` : "-"}
              </CardTitle>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-700 dark:text-teal-300">
              <History className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {latestAttempt
                ? `${latestAttempt.score}/${latestAttempt.maxScore} on ${formatTableDate(
                    latestAttempt.createdAt,
                  )}`
                : "No attempt submitted yet."}
            </p>
          </CardContent>
        </Card>

        <Card className="border-teal-500/10 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div>
              <CardDescription>Best score</CardDescription>
              <CardTitle className="mt-2 text-3xl">
                {bestAttempt ? `${bestAttempt.percentage}%` : "-"}
              </CardTitle>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-700 dark:text-teal-300">
              <Trophy className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {bestAttempt
                ? `${bestAttempt.quizTitle} - ${bestAttempt.score}/${bestAttempt.maxScore}`
                : "Your best attempt will appear here."}
            </p>
          </CardContent>
        </Card>

        <Card className="border-teal-500/10 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div>
              <CardDescription>Average score</CardDescription>
              <CardTitle className="mt-2 text-3xl">
                {totalAttempts ? `${averagePercentage}%` : "-"}
              </CardTitle>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-700 dark:text-teal-300">
              <BarChart3 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Based on {totalAttempts} attempt
              {totalAttempts > 1 ? "s" : ""} across your history.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-teal-500/10 bg-card/80">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle>Attempt history</CardTitle>
              <CardDescription>
                Open a result detail to see your full quiz report.
              </CardDescription>
            </div>

            <Badge variant="outline" className="w-fit">
              Page {currentPage} of {totalPages}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            header={["Quiz", "Score", "Performance", "Date", "Action"]}
            data={tableData}
            isLoading={attemptsQuery.isLoading}
            totalPages={totalPages}
            currentPage={currentPage}
            currentLimit={currentLimit}
            onChangePage={setCurrentPage}
            onChangeLimit={(limit) => {
              setCurrentLimit(limit);
              setCurrentPage(DEFAULT_PAGE);
            }}
          />
        </CardContent>
      </Card>
    </section>
  );
}
