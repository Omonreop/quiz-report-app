import { PerformanceCategory } from "@/generated/prisma/client";

type ScoreAnswerInput = {
  questionId: string;
  selectedOptionId: string;
};

type ScoreQuestionInput = {
  id: string;
  pointValue: number;
  answerOptions: {
    id: string;
    isCorrect: boolean;
  }[];
};

export type ScoredAnswer = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsEarned: number;
};

export function getPerformanceCategory(percentage: number) {
  if (percentage >= 80) return PerformanceCategory.ADVANCED;
  if (percentage >= 60) return PerformanceCategory.INTERMEDIATE;

  return PerformanceCategory.BEGINNER;
}

export function scoreQuiz({
  answers,
  questions,
}: {
  answers: ScoreAnswerInput[];
  questions: ScoreQuestionInput[];
}) {
  const answerByQuestion = new Map(
    answers.map((answer) => [answer.questionId, answer.selectedOptionId]),
  );

  const scoredAnswers = questions.map((question) => {
    const selectedOptionId = answerByQuestion.get(question.id) ?? "";
    const selectedOption = question.answerOptions.find(
      (option) => option.id === selectedOptionId,
    );
    const isCorrect = Boolean(selectedOption?.isCorrect);

    return {
      questionId: question.id,
      selectedOptionId,
      isCorrect,
      pointsEarned: isCorrect ? question.pointValue : 0,
    };
  });

  const score = scoredAnswers.reduce(
    (total, answer) => total + answer.pointsEarned,
    0,
  );
  const maxScore = questions.reduce(
    (total, question) => total + question.pointValue,
    0,
  );
  const correctCount = scoredAnswers.filter((answer) => answer.isCorrect).length;
  const incorrectCount = scoredAnswers.length - correctCount;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return {
    score,
    maxScore,
    percentage,
    correctCount,
    incorrectCount,
    performanceCategory: getPerformanceCategory(percentage),
    scoredAnswers,
  };
}
