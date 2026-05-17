import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Loader2 } from "lucide-react";

type AttemptSummaryCardProps = {
  answeredCount: number;
  totalQuestions: number;
  remainingCount: number;
  maxScore: number;
  progressValue: number;
  isComplete: boolean;
  isSubmitting: boolean;
};

export default function AttemptSummaryCard({
  answeredCount,
  totalQuestions,
  remainingCount,
  maxScore,
  progressValue,
  isComplete,
  isSubmitting,
}: AttemptSummaryCardProps) {
  return (
    <Card className="border-teal-500/20 bg-card/90 shadow-lg shadow-teal-500/5">
      <CardHeader>
        <CardTitle>Attempt summary</CardTitle>
        <CardDescription>
          {isComplete
            ? "All questions are answered. You can submit your quiz."
            : "Complete every question before submitting."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Answered</span>
            <span className="font-medium">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <div className="grid gap-3">
          <SummaryMetric label="Remaining" value={remainingCount} />
          <SummaryMetric label="Max score" value={maxScore} />
        </div>
      </CardContent>

      <CardFooter>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !isComplete}
          className="w-full bg-teal-500 text-white hover:bg-teal-600"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting
            </>
          ) : (
            <>
              {isComplete ? "Submit quiz" : "Answer all questions"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-teal-500/10 bg-muted/30 p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
