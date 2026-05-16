import instance from "@/libs/axios/instance";
import {
  AttemptApiResponse,
  AttemptListApiResponse,
  SubmitAttemptApiResponse,
} from "@/types/quiz";
import {
  AttemptListQuery,
  SubmitQuizPayload,
} from "@/validations/quiz-validation";
import endpoint from "./endpoint.constant";

const attemptServices = {
  createAttempt: (payload: SubmitQuizPayload) =>
    instance.post<SubmitAttemptApiResponse>(endpoint.ATTEMPTS, payload),
  getAttemptById: (attemptId: string) =>
    instance.get<AttemptApiResponse>(`${endpoint.ATTEMPTS}/${attemptId}`),
  getMyAttempts: (params: AttemptListQuery) =>
    instance.get<AttemptListApiResponse>(endpoint.ATTEMPTS, {
      params,
    }),
};

export default attemptServices;
