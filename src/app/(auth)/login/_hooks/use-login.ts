"use client";

import { getErrorMessage } from "@/lib/error";
import { LoginPayload, loginSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function getSafeCallbackUrl(callbackUrl: string | null) {
  if (!callbackUrl?.startsWith("/")) return "/dashboard";
  if (callbackUrl.startsWith("//")) return "/dashboard";

  return callbackUrl;
}

export default function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutate: mutateLogin,
    isPending: isPendingLogin,
    isSuccess: isSuccessLogin,
  } = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const result = await signIn("credentials", {
        ...payload,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid email or password");
      }

      return result;
    },
    onSuccess: () => {
      router.push(callbackUrl);
      router.refresh();
    },
    onError: (error) => {
      toast.error("Login failed", {
        description: getErrorMessage(
          error,
          "Unable to login. Please try again.",
        ),
      });
    },
  });

  const handleLogin = (payload: LoginPayload) => {
    mutateLogin(payload);
  };

  return {
    control: form.control,
    errors: form.formState.errors,
    handleSubmitForm: form.handleSubmit,
    handleLogin,
    isPendingLogin,
    isSuccessLogin,
  };
}
