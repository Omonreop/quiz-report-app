import AttemptReportDocument from "@/server/pdf/attempt-report-document";
import { getAttemptDetail } from "@/server/quiz";
import { authOptions } from "@/lib/auth";
import { pdf } from "@react-pdf/renderer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { createElement } from "react";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    attemptId: string;
  }>;
};

async function streamToBuffer(stream: NodeJS.ReadableStream) {
  const chunks: Buffer[] = [];

  for await (const chunk of stream as AsyncIterable<Buffer | string>) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

function createPdfFilename(name: string) {
  const sanitizedName = name
    .trim()
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, " ");

  return `Quiz Result - ${sanitizedName || "Report"}.pdf`;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { attemptId } = await context.params;
  const attempt = await getAttemptDetail(attemptId, session.user.id);

  if (!attempt) {
    return NextResponse.json({ message: "Attempt not found" }, { status: 404 });
  }

  const reportDocument = createElement(AttemptReportDocument, {
    attempt,
  }) as Parameters<typeof pdf>[0];

  const stream = await pdf(reportDocument).toBuffer();
  const buffer = await streamToBuffer(stream);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${createPdfFilename(
        attempt.participant.name,
      )}"`,
      "Cache-Control": "no-store",
    },
  });
}
