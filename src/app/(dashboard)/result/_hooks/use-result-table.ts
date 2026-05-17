"use client";

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-table-constant";
import { getErrorMessage } from "@/lib/error";
import attemptServices from "@/services/attempt.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

async function fetchAttempts(page: number, limit: number) {
  const { data } = await attemptServices.getMyAttempts({ page, limit });
  return data;
}

export default function useResultTable() {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT);

  const {
    data: dataAttempts,
    error: errorAttempts,
    isError: isErrorAttempts,
    isFetching: isFetchingAttempts,
    isLoading: isLoadingAttempts,
    refetch: refetchAttempts,
  } = useQuery({
    queryKey: ["attempts", currentPage, currentLimit],
    queryFn: () => fetchAttempts(currentPage, currentLimit),
  });

  useEffect(() => {
    if (!isErrorAttempts) return;

    toast.error("Load results failed", {
      description: getErrorMessage(
        errorAttempts,
        "Unable to load your quiz results.",
      ),
    });
  }, [errorAttempts, isErrorAttempts]);

  const attempts = useMemo(
    () => dataAttempts?.attempts ?? [],
    [dataAttempts],
  );

  const totalPages = dataAttempts?.pagination.totalPages ?? 1;
  const summary = dataAttempts?.summary;

  function handleChangeLimit(limit: number) {
    setCurrentLimit(limit);
    setCurrentPage(DEFAULT_PAGE);
  }

  return {
    dataAttempts,
    errorAttempts,
    isErrorAttempts,
    isFetchingAttempts,
    isLoadingAttempts,
    refetchAttempts,
    attempts,
    currentPage,
    currentLimit,
    totalPages,
    latestAttempt: summary?.latestAttempt ?? null,
    bestAttempt: summary?.bestAttempt ?? null,
    averagePercentage: summary?.averagePercentage ?? 0,
    totalAttempts: summary?.totalAttempts ?? 0,
    setCurrentPage,
    handleChangeLimit,
  };
}
