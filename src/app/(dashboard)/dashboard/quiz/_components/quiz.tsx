"use client";

import StateCard from "@/components/common/state-card";
import useQuiz from "../_hooks/use-quiz";
import AttemptSummaryCard from "./attempt-summary-card";
import ParticipantCard from "./participant-card";
import QuestionCard from "./question-card";
import QuizHeroCard from "./quiz-hero-card";

export default function Quiz() {
  const {
    form,
    control,
    errors,
    handleSubmitForm,
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
  } = useQuiz();

  if (isLoadingQuiz) {
    return <StateCard isLoading />;
  }

  if (isErrorQuiz || !dataQuiz) {
    return (
      <StateCard
        title="Failed to load quiz"
        description="Please make sure the database is running and seeded."
      />
    );
  }

  const summaryCard = (
    <AttemptSummaryCard
      answeredCount={answeredCount}
      totalQuestions={totalQuestions}
      remainingCount={remainingCount}
      maxScore={maxScore}
      progressValue={progressValue}
      isComplete={isComplete}
      isSubmitting={isPendingSubmitQuiz}
    />
  );

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmitForm(handleSubmitQuiz)}
    >
      <QuizHeroCard
        title={dataQuiz.title}
        description={dataQuiz.description}
        totalQuestions={totalQuestions}
        maxScore={maxScore}
        answeredCount={answeredCount}
        progressValue={progressValue}
      />

      <input type="hidden" {...form.register("quizId")} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <ParticipantCard />

          {dataQuiz.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              index={index}
              question={question}
              control={control}
              errors={errors}
            />
          ))}
        </div>

        <aside className="hidden md:sticky md:top-24 md:block md:h-fit">
          {summaryCard}
        </aside>
      </div>

      {isMobile ? summaryCard : null}
    </form>
  );
}
