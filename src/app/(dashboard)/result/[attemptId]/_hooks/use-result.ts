"use client";

import attemptServices from "@/services/attempt.service";
import { useQuery } from "@tanstack/react-query";

async function fetchAttempt(attemptId: string) {
  const { data } = await attemptServices.getAttemptById(attemptId);
  return data;
}

export default function useResult(attemptId: string) {
  const {
    data: dataAttempt,
    isLoading: isLoadingAttempt,
    isError: isErrorAttempt,
  } = useQuery({
    queryKey: ["attempt", attemptId],
    queryFn: () => fetchAttempt(attemptId),
  });

  return {
    dataAttempt,
    isLoadingAttempt,
    isErrorAttempt,
  };
}
