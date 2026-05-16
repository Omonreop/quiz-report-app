"use client";

import DataTable from "@/components/common/data-table";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-table-constant";
import { onErrorHandler } from "@/libs/axios/response-handler";
import attemptServices from "@/services/attempt.service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";

async function fetchAttempts(page: number, limit: number) {
  const { data } = await attemptServices.getMyAttempts({ page, limit });
  return data;
}

function formatCategory(category: string) {
  return category
    .toLowerCase()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function ResultTable() {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT);
  const attemptsQuery = useQuery({
    queryKey: ["attempts", currentPage, currentLimit],
    queryFn: () => fetchAttempts(currentPage, currentLimit),
  });

  const attempts = useMemo(
    () => attemptsQuery.data?.attempts ?? [],
    [attemptsQuery.data],
  );
  const totalPages = attemptsQuery.data?.pagination.totalPages ?? 1;
  const tableData = useMemo(() => {
    return attempts.map((attempt) => [
      attempt.quizTitle,
      `${attempt.score}/${attempt.maxScore} (${attempt.percentage}%)`,
      formatCategory(attempt.performanceCategory),
      new Date(attempt.createdAt).toLocaleDateString(),
      <Link
        key={attempt.id}
        href={`/result/${attempt.id}`}
        className={buttonVariants({
          variant: "outline",
          size: "sm",
        })}
      >
        View detail
      </Link>,
    ]);
  }, [attempts]);

  if (attemptsQuery.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Failed to load results</CardTitle>
          <CardDescription>
            {onErrorHandler(attemptsQuery.error)}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Quiz results</CardTitle>
          <CardDescription>
            Your previous quiz attempts are saved here after each submission.
          </CardDescription>
        </CardHeader>
      </Card>

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
    </section>
  );
}
