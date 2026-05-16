import { attemptDetailInclude, formatAttemptDetail } from "@/lib/attempt";
import { errorResponse, successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{
    attemptId: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { attemptId } = await context.params;
  const attempt = await prisma.attempt.findUnique({
    where: {
      id: attemptId,
    },
    include: attemptDetailInclude,
  });

  if (!attempt) {
    return errorResponse({ message: "Attempt not found", status: 404 });
  }

  return successResponse(formatAttemptDetail(attempt));
}
