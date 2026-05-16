"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { onErrorHandler } from "@/libs/axios/response-handler";
import { LoginPayload, loginSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Login() {
  const router = useRouter();
  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
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
      router.push("/dashboard");
      router.refresh();
    },
  });
  const onSubmit = (payload: LoginPayload) => {
    loginMutation.mutate(payload);
  };
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription>Login to access your dashboard</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CardContent>
          <FieldGroup>
            <Field data-invalid={Boolean(form.formState.errors.email)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" {...form.register("email")} />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.password)}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>
            {loginMutation.isError ? (
              <FieldError>{onErrorHandler(loginMutation.error)}</FieldError>
            ) : null}
            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Signing in..." : "Login"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              No account yet?{" "}
              <Link href="/register" className="font-medium  text-foreground">
                Register
              </Link>
            </p>
          </FieldGroup>
        </CardContent>
      </form>
    </Card>
  );
}
