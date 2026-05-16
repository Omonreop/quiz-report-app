import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Take the quiz</CardTitle>
          <CardDescription>
            Start a new attempt and get an instant result report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/quiz" className={buttonVariants()}>
            Start quiz
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>View results</CardTitle>
          <CardDescription>
            Review previous quiz attempts and open result details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/result"
            className={buttonVariants({ variant: "outline" })}
          >
            Open results
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
