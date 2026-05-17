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
import { Loader } from "lucide-react";
import Link from "next/link";
import useLogin from "../_hooks/use-login";

export default function Login() {
  const { control, handleSubmitForm, handleLogin, isPendingLogin } = useLogin();

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Welcome</CardTitle>
        <CardDescription>Login to access your dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitForm(handleLogin)} className="space-y-4">
          <FieldGroup>
            <FormInput
              control={control}
              name="email"
              label="Email"
              type="email"
            />
            <FormInput
              control={control}
              name="password"
              label="Password"
              type="password"
            />
            <Button type="submit" disabled={isPendingLogin}>
              {isPendingLogin ? <Loader className="animate-spin" /> : "Login"}
            </Button>
            <p className="text-center text-base text-muted-foreground">
              No account yet?{" "}
              <Link
                href="/register"
                className="font-medium text-base text-foreground"
              >
                Register
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
