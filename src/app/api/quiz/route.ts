import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";
import { formatPublicQuiz, publicQuizInclude } from "@/lib/quiz";

export async function GET() {
  const quiz = await prisma.quiz.findFirst({
    where: {
      slug: "general-knowledge",
    },
    include: publicQuizInclude,
  });

  if (!quiz) {
    return errorResponse({ message: "Quiz not found", status: 404 });
  }

  return successResponse(formatPublicQuiz(quiz));
}
