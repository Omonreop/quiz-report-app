import z from "zod";

export const participantSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Email must be valid"),
});

export const quizAnswerSchema = z.object({
  questionId: z.string().min(1, "Question is required"),
  selectedOptionId: z.string().min(1, "Answer is required"),
});

export const submitQuizSchema = participantSchema.extend({
  quizId: z.string().min(1, "Quiz is required"),
  answers: z.array(quizAnswerSchema).min(1, "At least one answer is required"),
});

export const attemptListQuerySchema = z.object({
  email: z.string().trim().email("Email must be valid"),
});

export type ParticipantForm = z.infer<typeof participantSchema>;
export type QuizAnswer = z.infer<typeof quizAnswerSchema>;
export type SubmitQuizPayload = z.infer<typeof submitQuizSchema>;
