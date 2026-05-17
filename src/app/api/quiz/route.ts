import { getPublicQuiz } from "@/server/quiz";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET() {
  const quiz = await getPublicQuiz();

  if (!quiz) {
    return errorResponse({ message: "Quiz not found", status: 404 });
  }

  return successResponse(quiz);
}
