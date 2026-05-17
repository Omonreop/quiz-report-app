import { registerUser } from "@/server/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { parseJsonBody } from "@/lib/request";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const parsedBody = await parseJsonBody(request);

  if (parsedBody.error) {
    return errorResponse({ message: parsedBody.error, status: 400 });
  }

  const result = await registerUser(parsedBody.data);

  if (result.status === "error") {
    return errorResponse({
      message: result.message,
      errors: "errors" in result ? result.errors : undefined,
      status: result.message === "Email is already registered" ? 409 : 400,
    });
  }

  return successResponse(result.data, 201);
}
