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
import authServices from "@/services/auth.service";
import { RegisterPayload, registerSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
  });

  const onSubmit = (payload: RegisterPayload) => {
    registerMutation.mutate(payload);
  };
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Register</CardTitle>
        <CardDescription>
          Create an account to keep your quiz results.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CardContent>
          <FieldGroup>
            <Field data-invalid={Boolean(form.formState.errors.name)}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" {...form.register("name")} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
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
            <Field
              data-invalid={Boolean(form.formState.errors.confirmPassword)}
            >
              <FieldLabel htmlFor="confirmPassword">
                Confirm password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword")}
              />
              <FieldError errors={[form.formState.errors.confirmPassword]} />
            </Field>
            {registerMutation.isError ? (
              <FieldError>{onErrorHandler(registerMutation.error)}</FieldError>
            ) : null}
            <Button type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating account..." : "Register"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-foreground">
                Login
              </Link>
            </p>
          </FieldGroup>
        </CardContent>
      </form>
    </Card>
  );
}
