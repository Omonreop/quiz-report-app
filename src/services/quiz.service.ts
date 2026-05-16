import instance from "@/libs/axios/instance";
import { QuizApiResponse } from "@/types/quiz";
import endpoint from "./endpoint.constant";

const quizServices = {
  getQuiz: () => instance.get<QuizApiResponse>(endpoint.QUIZ),
};

export default quizServices;
