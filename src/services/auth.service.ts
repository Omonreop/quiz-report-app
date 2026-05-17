import instance from "@/lib/axios/instance";
import { RegisterPayload } from "@/validations/auth-validation";

const authServices = {
  register: (payload: RegisterPayload) =>
    instance.post("/auth/register", payload),
};

export default authServices;
