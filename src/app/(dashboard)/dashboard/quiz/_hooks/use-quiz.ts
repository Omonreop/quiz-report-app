"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { getErrorMessage } from "@/lib/error";
import attemptServices from "@/services/attempt.service";
import quizServices from "@/services/quiz.service";
import {
  SubmitQuizPayload,
  submitQuizSchema,
} from "@/validations/quiz-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

async function fetchQuiz() {
  const { data } = await quizServices.getQuiz();
  return data;
}

async function submitAttempt(payload: SubmitQuizPayload) {
  const { data } = await attemptServices.createAttempt(payload);
  return data;
}

export default function useQuiz() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const {
    data: dataQuiz,
    isLoading: isLoadingQuiz,
    isError: isErrorQuiz,
  } = useQuery({
    queryKey: ["quiz"],
    queryFn: fetchQuiz,
  });

  const form = useForm<SubmitQuizPayload>({
    resolver: zodResolver(submitQuizSchema),
    defaultValues: {
      quizId: "",
      answers: [],
    },
  });

  const answers = useWatch({
    control: form.control,
    name: "answers",
  });

  const {
    mutate: mutateSubmitQuiz,
    isPending: isPendingSubmitQuiz,
    isSuccess: isSuccessSubmitQuiz,
  } = useMutation({
    mutationFn: submitAttempt,
    onSuccess: (data) => {
      router.push(`/result/${data.attemptId}`);
    },
    onError: (error) => {
      toast.error("Submit quiz failed", {
        description: getErrorMessage(
          error,
          "Unable to submit your quiz. Please try again.",
        ),
      });
    },
  });

  useEffect(() => {
    if (!dataQuiz) return;

    form.reset({
      quizId: dataQuiz.id,
      answers: dataQuiz.questions.map((question) => ({
        questionId: question.id,
        selectedOptionId: "",
      })),
    });
  }, [dataQuiz, form]);

  const totalQuestions = dataQuiz?.questions.length ?? 0;
  const answeredCount = answers.filter(
    (answer) => answer.selectedOptionId,
  ).length;
  const remainingCount = totalQuestions - answeredCount;
  const isComplete = remainingCount === 0;
  const progressValue =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const maxScore =
    dataQuiz?.questions.reduce(
      (total, question) => total + question.pointValue,
      0,
    ) ?? 0;

  const handleSubmitQuiz = (payload: SubmitQuizPayload) => {
    mutateSubmitQuiz(payload);
  };

  return {
    form,
    control: form.control,
    errors: form.formState.errors,
    handleSubmitForm: form.handleSubmit,
    handleSubmitQuiz,
    dataQuiz,
    isLoadingQuiz,
    isErrorQuiz,
    isMobile,
    answeredCount,
    totalQuestions,
    remainingCount,
    isComplete,
    progressValue,
    maxScore,
    isPendingSubmitQuiz,
    isSuccessSubmitQuiz,
  };
}
