import { NextRequest } from "next/server";

export async function parseJsonBody(request: NextRequest) {
  try {
    return {
      data: await request.json(),
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Invalid JSON body",
    };
  }
}
