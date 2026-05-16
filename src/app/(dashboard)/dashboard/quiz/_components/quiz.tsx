"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { onErrorHandler } from "@/libs/axios/response-handler";
import attemptServices from "@/services/attempt.service";
import quizServices from "@/services/quiz.service";
import {
  SubmitQuizPayload,
  submitQuizSchema,
} from "@/validations/quiz-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import QuestionCard from "./question-card";

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

  const submitMutation = useMutation({
    mutationFn: submitAttempt,
    onSuccess: (data) => {
      router.push(`/result/${data.attemptId}`);
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
    return (
      <Card>
        <CardContent className="flex min-h-60 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (quizQuery.isError || !quizQuery.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Failed to load quiz</CardTitle>
          <CardDescription>
            Please make sure the database is running and seeded.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const quiz = quizQuery.data;
  const maxScore = quiz.questions.reduce(
    (total, question) => total + question.pointValue,
    0,
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardDescription>
                {quiz.questions.length} questions
              </CardDescription>
              <CardTitle className="mt-1 text-3xl">{quiz.title}</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                {quiz.description}
              </CardDescription>
            </div>
            <div className="rounded-lg bg-muted px-3 py-2 text-sm font-medium">
              {maxScore} max score
            </div>
          </div>
        </CardHeader>
      </Card>

      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((payload) =>
          submitMutation.mutate(payload),
        )}
      >
        <Card>
          <CardHeader>
            <CardTitle>Participant</CardTitle>
            <CardDescription>
              This information is used to save your quiz attempt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Your account is used automatically for this attempt.
            </CardDescription>
          </CardContent>
        </Card>

        <input type="hidden" {...form.register("quizId")} />

        {quiz.questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            index={index}
            question={question}
            control={form.control}
            errors={form.formState.errors}
          />
        ))}

        {submitMutation.isError ? (
          <Card className="border-destructive/40 text-destructive">
            <CardContent>{onErrorHandler(submitMutation.error)}</CardContent>
          </Card>
        ) : null}

        <Card>
          <CardFooter className="justify-end">
            <Button type="submit" size="lg" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Submitting
                </>
              ) : (
                "Submit quiz"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
