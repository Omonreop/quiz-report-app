import { AxiosError } from "axios";

type ErrorResponseData = {
  message?: string;
};

export function onErrorHandler(error: Error) {
  const { response } = error as AxiosError;
  const data = response?.data as ErrorResponseData | undefined;

  return data?.message || error.message || "Something went wrong";
}
