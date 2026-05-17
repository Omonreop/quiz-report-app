"use client";

import DataTable from "@/components/common/data-table";
import PageHeaderCard from "@/components/common/page-header-card";
import StateCard from "@/components/common/state-card";
import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-table-constant";
import { getErrorMessage } from "@/lib/error";
import attemptServices from "@/services/attempt.service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
    <section className="flex flex-col gap-4">
      <PageHeaderCard
        title="Quiz results"
        description="Your previous quiz attempts are saved here after each submission."
      />

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
