import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function ParticipantCard() {
  return (
    <Card className="border-teal-500/10 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-teal-700 dark:text-teal-300" />
          Participant
        </CardTitle>
        <CardDescription>
          Your account is used automatically for this attempt.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
