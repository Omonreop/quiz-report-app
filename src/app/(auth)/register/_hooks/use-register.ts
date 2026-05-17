"use client";

import { getErrorMessage } from "@/lib/error";
import authServices from "@/services/auth.service";
import { RegisterPayload, registerSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function useRegister() {
  const router = useRouter();

  const form = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    mutate: mutateRegister,
    isPending: isPendingRegister,
    isSuccess: isSuccessRegister,
  } = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      await authServices.register(payload);
      await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });
    },
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Register failed", {
        description: getErrorMessage(
          error.message,
          "Unable to register. Please try again.",
        ),
      });
    },
  });

  const handleRegister = (payload: RegisterPayload) => {
    mutateRegister(payload);
  };

  return {
    control: form.control,
    errors: form.formState.errors,
    reset: form.reset,
    handleSubmitForm: form.handleSubmit,
    handleRegister,
    isPendingRegister,
    isSuccessRegister,
  };
}
