import { registerUser } from "@/server/auth";
import { errorResponse, successResponse } from "@/libs/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await registerUser(body);

  if (result.status === "error") {
    return errorResponse({
      message: result.message,
      errors: "errors" in result ? result.errors : undefined,
      status: result.message === "Email is already registered" ? 409 : 400,
    });
  }

  return successResponse(result.data, 201);
}
