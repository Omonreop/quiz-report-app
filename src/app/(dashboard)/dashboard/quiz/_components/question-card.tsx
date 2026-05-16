"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/libs/utils";
import { QuizApiResponse } from "@/types/quiz";
import { SubmitQuizPayload } from "@/validations/quiz-validation";
import { Control, Controller, FieldErrors } from "react-hook-form";

type Question = QuizApiResponse["questions"][number];

export default function QuestionCard({
  index,
  question,
  control,
  errors,
}: {
  index: number;
  question: Question;
  control: Control<SubmitQuizPayload>;
  errors: FieldErrors<SubmitQuizPayload>;
}) {
  const answerError = errors.answers?.[index]?.selectedOptionId;

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <CardTitle className="leading-6">
            <span className="mr-2 text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            {question.text}
          </CardTitle>
          <span className="w-fit rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {question.category}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <FieldSet>
          <FieldLegend className="sr-only">
            Select an answer for question {index + 1}
          </FieldLegend>
          <Controller
            control={control}
            name={`answers.${index}.selectedOptionId`}
            render={({ field }) => (
              <RadioGroup
                value={field.value ?? ""}
                onValueChange={field.onChange}
                aria-invalid={Boolean(answerError)}
              >
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/60",
                      field.value === option.id &&
                        "border-primary bg-primary/5",
                    )}
                  >
                    <RadioGroupItem value={option.id} />
                    <span>{option.text}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
          <FieldError errors={[answerError]} />
        </FieldSet>
      </CardContent>
    </Card>
  );
}
