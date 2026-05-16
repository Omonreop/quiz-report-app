import Result from "./_components/result";

export const metadata = {
  title: "Quiz Report App | Result",
};

type ResultPageProps = {
  params: Promise<{
    attemptId: string;
  }>;
};

export default async function ResultPage({ params }: ResultPageProps) {
  const { attemptId } = await params;

  return <Result attemptId={attemptId} />;
}
