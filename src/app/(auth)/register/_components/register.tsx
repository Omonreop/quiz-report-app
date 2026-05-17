"use client";

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { getErrorMessage } from "@/lib/error";
import authServices from "@/services/auth.service";
import { RegisterPayload, registerSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Register() {
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

  const registerMutation = useMutation({
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

  const onSubmit = (payload: RegisterPayload) => {
    registerMutation.mutate(payload);
  };
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Create an account to keep your quiz results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInput control={form.control} name="name" label="Name" />
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
            />
            <FormInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
            />
            <FormInput
              control={form.control}
              name="confirmPassword"
              label="Confirm password"
              type="password"
            />
            <Button type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Register"
              )}
            </Button>
            <p className="text-center text-base text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-base text-foreground"
              >
                Login
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
