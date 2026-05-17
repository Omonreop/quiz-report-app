import { Prisma } from "@/generated/prisma/client";

export const attemptSummaryInclude = {
  quiz: {
    select: {
      title: true,
    },
  },
} satisfies Prisma.AttemptInclude;

export const attemptDetailInclude = {
  user: {
    select: {
      name: true,
      email: true,
    },
  },
  quiz: {
    select: {
      title: true,
    },
  },
  answers: {
    orderBy: {
      question: {
        order: "asc",
      },
    },
    include: {
      selectedOption: {
        select: {
          text: true,
        },
      },
      question: {
        select: {
          id: true,
          text: true,
          category: true,
          pointValue: true,
          answerOptions: {
            where: {
              isCorrect: true,
            },
            select: {
              text: true,
            },
            take: 1,
          },
        },
      },
    },
  },
} satisfies Prisma.AttemptInclude;

type AttemptSummary = Prisma.AttemptGetPayload<{
  include: typeof attemptSummaryInclude;
}>;

type AttemptDetail = Prisma.AttemptGetPayload<{
  include: typeof attemptDetailInclude;
}>;

export function formatAttemptSummary(attempt: AttemptSummary) {
  return {
    id: attempt.id,
    quizTitle: attempt.quiz.title,
    score: attempt.score,
    maxScore: attempt.maxScore,
    percentage: attempt.percentage,
    performanceCategory: attempt.performanceCategory,
    createdAt: attempt.createdAt.toISOString(),
  };
}

export function formatAttemptDetail(attempt: AttemptDetail) {
  const categoryMap = new Map<
    string,
    {
      category: string;
      correctCount: number;
      totalCount: number;
      score: number;
      maxScore: number;
    }
  >();

  attempt.answers.forEach((answer) => {
    const current = categoryMap.get(answer.question.category) ?? {
      category: answer.question.category,
      correctCount: 0,
      totalCount: 0,
      score: 0,
      maxScore: 0,
    };

    current.correctCount += answer.isCorrect ? 1 : 0;
    current.totalCount += 1;
    current.score += answer.pointsEarned;
    current.maxScore += answer.question.pointValue;
    categoryMap.set(answer.question.category, current);
  });

  const categoryBreakdown = Array.from(categoryMap.values()).map((category) => ({
    ...category,
    percentage:
      category.maxScore > 0
        ? Math.round((category.score / category.maxScore) * 100)
        : 0,
  }));

  const strongestCategory = categoryBreakdown.reduce(
    (best, category) =>
      !best || category.percentage > best.percentage ? category : best,
    categoryBreakdown[0],
  );
  const weakestCategory = categoryBreakdown.reduce(
    (weakest, category) =>
      !weakest || category.percentage < weakest.percentage ? category : weakest,
    categoryBreakdown[0],
  );

  return {
    id: attempt.id,
    participant: attempt.user,
    quiz: attempt.quiz,
    score: attempt.score,
    maxScore: attempt.maxScore,
    percentage: attempt.percentage,
    performanceCategory: attempt.performanceCategory,
    correctCount: attempt.correctCount,
    incorrectCount: attempt.incorrectCount,
    createdAt: attempt.createdAt.toISOString(),
    categoryBreakdown,
    insights: buildAttemptInsights({
      percentage: attempt.percentage,
      performanceCategory: attempt.performanceCategory,
      strongestCategory,
      weakestCategory,
      correctCount: attempt.correctCount,
      incorrectCount: attempt.incorrectCount,
    }),
    answers: attempt.answers.map((answer) => ({
      questionId: answer.question.id,
      question: answer.question.text,
      category: answer.question.category,
      selectedAnswer: answer.selectedOption.text,
      correctAnswer: answer.question.answerOptions[0]?.text ?? "",
      isCorrect: answer.isCorrect,
      pointsEarned: answer.pointsEarned,
      pointValue: answer.question.pointValue,
    })),
  };
}

function buildAttemptInsights({
  percentage,
  performanceCategory,
  strongestCategory,
  weakestCategory,
  correctCount,
  incorrectCount,
}: {
  percentage: number;
  performanceCategory: string;
  strongestCategory?: {
    category: string;
    percentage: number;
  };
  weakestCategory?: {
    category: string;
    percentage: number;
  };
  correctCount: number;
  incorrectCount: number;
}) {
  const insights = [];

  if (strongestCategory) {
    insights.push({
      title: `Strongest area: ${formatCategory(strongestCategory.category)}`,
      description: `You scored ${strongestCategory.percentage}% here. Keep it up and use this area as your confidence base.`,
      tone: "success",
    });
  }

  insights.push({
    title: `Performance tier: ${formatCategory(performanceCategory)}`,
    description: `Your overall accuracy is ${percentage}%, with ${correctCount} correct answers and ${incorrectCount} incorrect answers.`,
    tone: "info",
  });

  if (weakestCategory && weakestCategory.category !== strongestCategory?.category) {
    insights.push({
      title: `Focus area: ${formatCategory(weakestCategory.category)}`,
      description: `This category scored ${weakestCategory.percentage}%, so it is the best place to review before the next retake.`,
      tone: "danger",
    });
  }

  insights.push({
    title: "Next step",
    description:
      percentage >= 80
        ? "Try harder questions or timed practice to keep improving beyond this result."
        : percentage >= 50
          ? "Review incorrect answers, then retake the quiz to improve consistency."
          : "Start by revisiting the basic concepts in the lowest scoring category.",
    tone: "info",
  });

  return insights;
}

function formatCategory(category: string) {
  return category.toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase());
}
