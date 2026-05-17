import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ClipboardList, HelpCircle, Trophy } from "lucide-react";

type QuizHeroCardProps = {
  title: string;
  description: string | null;
  totalQuestions: number;
  maxScore: number;
  answeredCount: number;
  progressValue: number;
};

export default function QuizHeroCard({
  title,
  description,
  totalQuestions,
  maxScore,
  answeredCount,
  progressValue,
}: QuizHeroCardProps) {
  return (
    <Card className="relative overflow-hidden border-teal-500/20 bg-linear-to-br from-teal-500/20 via-background to-background">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="absolute -bottom-24 left-20 h-56 w-56 rounded-full bg-teal-500/10 blur-3xl" />

      <CardHeader className="relative space-y-6 p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-sm font-medium text-teal-700 dark:text-teal-300">
              <ClipboardList className="h-4 w-4" />
              General Knowledge Quiz
            </div>

            <div className="space-y-3">
              <CardTitle className="text-3xl font-bold tracking-tight md:text-5xl">
                {title}
              </CardTitle>

              {description ? (
                <CardDescription className="max-w-2xl text-base leading-7">
                  {description}
                </CardDescription>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-90">
            <HeroMetric
              icon={
                <HelpCircle className="mb-3 h-5 w-5 text-teal-700 dark:text-teal-300" />
              }
              label="Questions"
              value={totalQuestions}
            />
            <HeroMetric
              icon={
                <Trophy className="mb-3 h-5 w-5 text-teal-700 dark:text-teal-300" />
              }
              label="Max score"
              value={maxScore}
            />
            <HeroMetric
              icon={
                <CheckCircle2 className="mb-3 h-5 w-5 text-teal-700 dark:text-teal-300" />
              }
              label="Answered"
              value={answeredCount}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quiz progress</span>
            <span className="font-medium text-teal-700 dark:text-teal-300">
              {progressValue}%
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      </CardHeader>
    </Card>
  );
}

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-teal-500/10 bg-background/60 p-4 backdrop-blur">
      {icon}
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
