import { scoreQuiz } from "@/lib/scoring";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";
import { attemptSummaryInclude, formatAttemptSummary } from "@/lib/attempt";
import { scoringQuizInclude, validateSubmittedAnswers } from "@/lib/quiz";
import {
  attemptListQuerySchema,
  submitQuizSchema,
} from "@/validations/quiz-validation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const validatedQuery = attemptListQuerySchema.safeParse({
    email: searchParams.get("email"),
  });

  if (!validatedQuery.success) {
    return errorResponse({
      message: "Invalid query",
      errors: validatedQuery.error.flatten().fieldErrors,
    });
  }

  const attempts = await prisma.attempt.findMany({
    where: {
      participant: {
        email: validatedQuery.data.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: attemptSummaryInclude,
  });

  return successResponse({
    attempts: attempts.map(formatAttemptSummary),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validatedBody = submitQuizSchema.safeParse(body);

  if (!validatedBody.success) {
    return errorResponse({
      message: "Invalid quiz submission",
      errors: validatedBody.error.flatten().fieldErrors,
    });
  }

  const { name, email, quizId, answers } = validatedBody.data;
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: scoringQuizInclude,
  });

  if (!quiz) {
    return errorResponse({ message: "Quiz not found", status: 404 });
  }

  const answerError = validateSubmittedAnswers({
    answers,
    questions: quiz.questions,
  });

  if (answerError) {
    return errorResponse({ message: answerError });
  }

  const result = scoreQuiz({
    answers,
    questions: quiz.questions,
  });

  const attempt = await prisma.$transaction(async (tx) => {
    const participant = await tx.participant.upsert({
      where: {
        email,
      },
      update: {
        name,
      },
      create: {
        name,
        email,
      },
    });

    return tx.attempt.create({
      data: {
        participantId: participant.id,
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

  return successResponse({ attemptId: attempt.id }, 201);
}
