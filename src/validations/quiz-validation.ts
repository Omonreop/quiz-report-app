import z from "zod";

const quizAnswerSchema = z.object({
  questionId: z.string().min(1, "Question is required"),
  selectedOptionId: z.string().min(1, "Answer is required"),
});

export const submitQuizSchema = z.object({
  quizId: z.string().min(1, "Quiz is required"),
  answers: z.array(quizAnswerSchema).min(1, "At least one answer is required"),
});

export const attemptListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type SubmitQuizPayload = z.infer<typeof submitQuizSchema>;
export type AttemptListQuery = z.infer<typeof attemptListQuerySchema>;
