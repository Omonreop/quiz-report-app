import { Prisma } from "@/generated/prisma/client";

export const attemptSummaryInclude = {
  quiz: {
    select: {
      title: true,
    },
  },
} satisfies Prisma.AttemptInclude;

export const attemptDetailInclude = {
  participant: {
    select: {
      name: true,
      email: true,
    },
  },
  quiz: {
    select: {
      title: true,
    },
  },
  answers: {
    orderBy: {
      question: {
        order: "asc",
      },
    },
    include: {
      selectedOption: {
        select: {
          text: true,
        },
      },
      question: {
        select: {
          id: true,
          text: true,
          category: true,
          pointValue: true,
          answerOptions: {
            where: {
              isCorrect: true,
            },
            select: {
              text: true,
            },
            take: 1,
          },
        },
      },
    },
  },
} satisfies Prisma.AttemptInclude;

type AttemptSummary = Prisma.AttemptGetPayload<{
  include: typeof attemptSummaryInclude;
}>;

type AttemptDetail = Prisma.AttemptGetPayload<{
  include: typeof attemptDetailInclude;
}>;

export function formatAttemptSummary(attempt: AttemptSummary) {
  return {
    id: attempt.id,
    quizTitle: attempt.quiz.title,
    score: attempt.score,
    maxScore: attempt.maxScore,
    percentage: attempt.percentage,
    performanceCategory: attempt.performanceCategory,
    createdAt: attempt.createdAt.toISOString(),
  };
}

export function formatAttemptDetail(attempt: AttemptDetail) {
  return {
    id: attempt.id,
    participant: attempt.participant,
    quiz: attempt.quiz,
    score: attempt.score,
    maxScore: attempt.maxScore,
    percentage: attempt.percentage,
    performanceCategory: attempt.performanceCategory,
    correctCount: attempt.correctCount,
    incorrectCount: attempt.incorrectCount,
    createdAt: attempt.createdAt.toISOString(),
    answers: attempt.answers.map((answer) => ({
      questionId: answer.question.id,
      question: answer.question.text,
      category: answer.question.category,
      selectedAnswer: answer.selectedOption.text,
      correctAnswer: answer.question.answerOptions[0]?.text ?? "",
      isCorrect: answer.isCorrect,
      pointsEarned: answer.pointsEarned,
      pointValue: answer.question.pointValue,
    })),
  };
}
