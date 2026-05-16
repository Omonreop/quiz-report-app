import { getAttemptDetail } from "@/server/quiz";
import { errorResponse, successResponse } from "@/libs/api-response";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{
    attemptId: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return errorResponse({ message: "Unauthorized", status: 401 });
  }

  const { attemptId } = await context.params;
  const attempt = await getAttemptDetail(attemptId, session.user.id);

  if (!attempt) {
    return errorResponse({ message: "Attempt not found", status: 404 });
  }

  return successResponse(attempt);
}
