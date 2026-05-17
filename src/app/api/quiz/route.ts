import { getPublicQuiz } from "@/server/quiz";
import { errorResponse, successResponse } from "@/lib/api-response";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return errorResponse({ message: "Unauthorized", status: 401 });
  }

  const quiz = await getPublicQuiz();

  if (!quiz) {
    return errorResponse({ message: "Quiz not found", status: 404 });
  }

  return successResponse(quiz);
}
