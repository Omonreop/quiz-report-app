import { prisma } from "@/lib/prisma";
import { scoreQuiz } from "@/lib/scoring";
import {
  attemptDetailInclude,
  attemptSummaryInclude,
  formatAttemptDetail,
  formatAttemptSummary,
} from "@/lib/attempt";
import {
  formatPublicQuiz,
  publicQuizInclude,
  scoringQuizInclude,
  validateSubmittedAnswers,
} from "@/lib/quiz";
import { SubmitQuizPayload } from "@/validations/quiz-validation";

export async function getPublicQuiz() {
  const quiz = await prisma.quiz.findFirst({
    where: {
      slug: "general-knowledge",
    },
    include: publicQuizInclude,
  });

  if (!quiz) return null;

  return formatPublicQuiz(quiz);
}

export async function getAttemptDetail(attemptId: string, userId?: string) {
  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
      ...(userId ? { userId } : {}),
    },
    include: attemptDetailInclude,
  });

  if (!attempt) return null;

  return formatAttemptDetail(attempt);
}

export async function getAttemptSummariesByUserId({
  userId,
  page,
  limit,
}: {
  userId: string;
  page: number;
  limit: number;
}) {
  const where = {
    userId,
  };

  const [attempts, totalItems, latestAttempt, bestAttempt, averageResult] =
    await prisma.$transaction([
      prisma.attempt.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
        include: attemptSummaryInclude,
      }),
      prisma.attempt.count({
        where,
      }),
      prisma.attempt.findFirst({
        where,
        orderBy: {
          createdAt: "desc",
        },
        include: attemptSummaryInclude,
      }),
      prisma.attempt.findFirst({
        where,
        orderBy: [
          {
            percentage: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        include: attemptSummaryInclude,
      }),
      prisma.attempt.aggregate({
        where,
        _avg: {
          percentage: true,
        },
      }),
    ]);

  return {
    attempts: attempts.map(formatAttemptSummary),
    pagination: {
      currentPage: page,
      currentLimit: limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
    summary: {
      latestAttempt: latestAttempt ? formatAttemptSummary(latestAttempt) : null,
      bestAttempt: bestAttempt ? formatAttemptSummary(bestAttempt) : null,
      averagePercentage: Math.round(averageResult._avg.percentage ?? 0),
      totalAttempts: totalItems,
    },
  };
}

export async function createQuizAttempt({
  userId,
  quizId,
  answers,
}: SubmitQuizPayload & { userId: string }) {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: scoringQuizInclude,
  });

  if (!quiz) {
    return {
      status: "error" as const,
      message: "Quiz not found",
      statusCode: 404,
    };
  }

  const answerError = validateSubmittedAnswers({
    answers,
    questions: quiz.questions,
  });

  if (answerError) {
    return {
      status: "error" as const,
      message: answerError,
      statusCode: 400,
    };
  }

  const result = scoreQuiz({
    answers,
    questions: quiz.questions,
  });

  const attempt = await prisma.$transaction(async (tx) => {
    return tx.attempt.create({
      data: {
        userId,
        quizId,
        score: result.score,
        maxScore: result.maxScore,
        percentage: result.percentage,
        correctCount: result.correctCount,
        incorrectCount: result.incorrectCount,
        performanceCategory: result.performanceCategory,
        answers: {
          create: result.scoredAnswers.map((answer) => ({
            questionId: answer.questionId,
            selectedOptionId: answer.selectedOptionId,
            isCorrect: answer.isCorrect,
            pointsEarned: answer.pointsEarned,
          })),
        },
      },
      select: {
        id: true,
      },
    });
  });

  return {
    status: "success" as const,
    data: {
      attemptId: attempt.id,
    },
  };
}
