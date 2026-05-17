export type QuizApiResponse = {
  id: string;
  title: string;
  description: string | null;
  questions: {
    id: string;
    text: string;
    category: string;
    pointValue: number;
    options: {
      id: string;
      text: string;
    }[];
  }[];
};

export type SubmitAttemptApiResponse = {
  attemptId: string;
};

export type AttemptApiResponse = {
  id: string;
  participant: {
    name: string;
    email: string;
  };
  quiz: {
    title: string;
  };
  score: number;
  maxScore: number;
  percentage: number;
  performanceCategory: string;
  correctCount: number;
  incorrectCount: number;
  createdAt: string;
  categoryBreakdown: {
    category: string;
    correctCount: number;
    totalCount: number;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
  insights: {
    title: string;
    description: string;
    tone: string;
  }[];
  answers: {
    questionId: string;
    question: string;
    category: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    pointValue: number;
  }[];
};

export type AttemptListApiResponse = {
  attempts: {
    id: string;
    quizTitle: string;
    score: number;
    maxScore: number;
    percentage: number;
    performanceCategory: string;
    createdAt: string;
  }[];
  pagination: {
    currentPage: number;
    currentLimit: number;
    totalItems: number;
    totalPages: number;
  };
};
