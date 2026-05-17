"use client";

import { Check } from "lucide-react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { QuizApiResponse } from "@/types/quiz";
import { SubmitQuizPayload } from "@/validations/quiz-validation";

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
    <Card className="overflow-hidden border-teal-500/10 bg-card/80 transition hover:border-teal-500/30">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-500/15 text-sm font-bold text-teal-700 dark:text-teal-300">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="space-y-2">
              <CardTitle className="text-base leading-7 md:text-lg">
                {question.text}
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Choose one correct answer from the options below.
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-700 dark:text-teal-300">
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
                className="grid gap-3"
              >
                {question.options.map((option, optionIndex) => {
                  const isSelected = field.value === option.id;
                  const optionLabel = String.fromCharCode(65 + optionIndex);

                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "group flex cursor-pointer items-center gap-3 rounded-2xl border bg-background/50 p-4 text-sm transition",
                        "hover:border-teal-500/40 hover:bg-teal-500/5",
                        isSelected &&
                          "border-teal-500/60 bg-teal-500/10 shadow-sm shadow-teal-500/10",
                      )}
                    >
                      <RadioGroupItem value={option.id} className="sr-only" />

                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold transition",
                          "border-border bg-muted text-muted-foreground",
                          isSelected &&
                            "border-teal-500 bg-teal-500 text-white",
                        )}
                      >
                        {isSelected ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          optionLabel
                        )}
                      </div>

                      <span
                        className={cn(
                          "flex-1 leading-6 text-muted-foreground transition",
                          isSelected && "font-medium text-foreground",
                        )}
                      >
                        {option.text}
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            )}
          />

          <FieldError errors={[answerError]} />
        </FieldSet>
      </CardContent>
    </Card>
  );
}
