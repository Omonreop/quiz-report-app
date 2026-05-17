import { createQuizAttempt, getAttemptSummariesByUserId } from "@/server/quiz";
import { errorResponse, successResponse } from "@/lib/api-response";
import { authOptions } from "@/lib/auth";
import { parseJsonBody } from "@/lib/request";
import {
  attemptListQuerySchema,
  submitQuizSchema,
} from "@/validations/quiz-validation";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return errorResponse({ message: "Unauthorized", status: 401 });
  }

  const validatedQuery = attemptListQuerySchema.safeParse({
    page: request.nextUrl.searchParams.get("page") ?? undefined,
    limit: request.nextUrl.searchParams.get("limit") ?? undefined,
  });

  if (!validatedQuery.success) {
    return errorResponse({
      message: "Invalid attempt query",
      errors: validatedQuery.error.flatten().fieldErrors,
    });
  }

  const result = await getAttemptSummariesByUserId({
    userId: session.user.id,
    ...validatedQuery.data,
  });

  return successResponse(result);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return errorResponse({ message: "Unauthorized", status: 401 });
  }

  const parsedBody = await parseJsonBody(request);

  if (parsedBody.error) {
    return errorResponse({ message: parsedBody.error, status: 400 });
  }

  const validatedBody = submitQuizSchema.safeParse(parsedBody.data);

  if (!validatedBody.success) {
    return errorResponse({
      message: "Invalid quiz submission",
      errors: validatedBody.error.flatten().fieldErrors,
    });
  }

  const result = await createQuizAttempt({
    ...validatedBody.data,
    userId: session.user.id,
  });

  if (result.status === "error") {
    return errorResponse({
      message: result.message,
      status: result.statusCode,
    });
  }

  return successResponse(result.data, 201);
}
