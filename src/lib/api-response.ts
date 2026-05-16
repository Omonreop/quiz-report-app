import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse({
  message,
  status = 400,
  errors,
}: {
  message: string;
  status?: number;
  errors?: unknown;
}) {
  return NextResponse.json({ message, errors }, { status });
}
