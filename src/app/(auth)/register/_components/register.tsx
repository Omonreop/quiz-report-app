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
import useRegister from "../_hooks/use-register";

export default function Register() {
  const { control, handleSubmitForm, handleRegister, isPendingRegister } =
    useRegister();

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Create an account to keep your quiz results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitForm(handleRegister)}>
          <FieldGroup>
            <FormInput control={control} name="name" label="Name" />
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
            <FormInput
              control={control}
              name="confirmPassword"
              label="Confirm password"
              type="password"
            />
            <Button type="submit" disabled={isPendingRegister}>
              {isPendingRegister ? (
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
