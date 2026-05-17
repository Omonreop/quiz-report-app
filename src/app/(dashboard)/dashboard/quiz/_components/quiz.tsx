"use client";

import StateCard from "@/components/common/state-card";
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
import AttemptSummaryCard from "./attempt-summary-card";
import ParticipantCard from "./participant-card";
import QuestionCard from "./question-card";
import QuizHeroCard from "./quiz-hero-card";

async function fetchQuiz() {
  const { data } = await quizServices.getQuiz();
  return data;
}

async function submitAttempt(payload: SubmitQuizPayload) {
  const { data } = await attemptServices.createAttempt(payload);
  return data;
}

export default function Quiz() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const quizQuery = useQuery({
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

  const submitMutation = useMutation({
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
    if (!quizQuery.data) return;

    form.reset({
      quizId: quizQuery.data.id,
      answers: quizQuery.data.questions.map((question) => ({
        questionId: question.id,
        selectedOptionId: "",
      })),
    });
  }, [form, quizQuery.data]);

  if (quizQuery.isLoading) {
    return <StateCard isLoading />;
  }

  if (quizQuery.isError || !quizQuery.data) {
    return (
      <StateCard
        title="Failed to load quiz"
        description="Please make sure the database is running and seeded."
      />
    );
  }

  const quiz = quizQuery.data;

  const totalQuestions = quiz.questions.length;

  const answeredCount = answers.filter(
    (answer) => answer.selectedOptionId,
  ).length;

  const remainingCount = totalQuestions - answeredCount;
  const isComplete = remainingCount === 0;

  const progressValue =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const maxScore = quiz.questions.reduce(
    (total, question) => total + question.pointValue,
    0,
  );

  const summaryCard = (
    <AttemptSummaryCard
      answeredCount={answeredCount}
      totalQuestions={totalQuestions}
      remainingCount={remainingCount}
      maxScore={maxScore}
      progressValue={progressValue}
      isComplete={isComplete}
      isSubmitting={submitMutation.isPending}
    />
  );

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((payload) => submitMutation.mutate(payload))}
    >
      <QuizHeroCard
        title={quiz.title}
        description={quiz.description}
        totalQuestions={totalQuestions}
        maxScore={maxScore}
        answeredCount={answeredCount}
        progressValue={progressValue}
      />

      <input type="hidden" {...form.register("quizId")} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <ParticipantCard />

          {quiz.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              index={index}
              question={question}
              control={form.control}
              errors={form.formState.errors}
            />
          ))}
        </div>

        <aside className="hidden xl:sticky xl:top-24 xl:block xl:h-fit">
          {summaryCard}
        </aside>
      </div>

      {isMobile ? summaryCard : null}
    </form>
  );
}
