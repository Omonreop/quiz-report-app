import { Prisma } from "@/generated/prisma/client";

export const publicQuizInclude = {
  questions: {
    orderBy: {
      order: "asc",
    },
    include: {
      answerOptions: {
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          text: true,
        },
      },
    },
  },
} satisfies Prisma.QuizInclude;

export const scoringQuizInclude = {
  questions: {
    include: {
      answerOptions: {
        select: {
          id: true,
          isCorrect: true,
        },
      },
    },
  },
} satisfies Prisma.QuizInclude;

type PublicQuiz = Prisma.QuizGetPayload<{
  include: typeof publicQuizInclude;
}>;

export function formatPublicQuiz(quiz: PublicQuiz) {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      text: question.text,
      category: question.category,
      pointValue: question.pointValue,
      options: question.answerOptions,
    })),
  };
}

export function validateSubmittedAnswers({
  answers,
  questions,
}: {
  answers: {
    questionId: string;
    selectedOptionId: string;
  }[];
  questions: {
    id: string;
    answerOptions: {
      id: string;
    }[];
  }[];
}) {
  const questionIds = new Set(questions.map((question) => question.id));
  const hasInvalidQuestion = answers.some(
    (answer) => !questionIds.has(answer.questionId),
  );

  if (hasInvalidQuestion || answers.length !== questions.length) {
    return "Please answer all quiz questions";
  }

  const optionIds = new Set(
    questions.flatMap((question) =>
      question.answerOptions.map((option) => option.id),
    ),
  );
  const hasInvalidOption = answers.some(
    (answer) => !optionIds.has(answer.selectedOptionId),
  );

  if (hasInvalidOption) {
    return "Selected answer is invalid";
  }

  return null;
}
