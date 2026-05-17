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
import { ArrowRight, Loader } from "lucide-react";
import Link from "next/link";
import useRegister from "../_hooks/use-register";

export default function Register() {
  const { control, handleSubmitForm, handleRegister, isPendingRegister } =
    useRegister();

  return (
    <Card className="w-full overflow-hidden border-teal-500/20 bg-card/90 py-0 shadow-xl backdrop-blur">
      <CardHeader className=" bg-linear-to-br from-teal-500/15 via-card to-card px-6 pb-3 pt-6 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Create account
        </CardTitle>

        <CardDescription>
          Register to save your quiz results and view your dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-4">
        <form onSubmit={handleSubmitForm(handleRegister)}>
          <FieldGroup className="gap-4">
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

            <Button
              type="submit"
              disabled={isPendingRegister}
              className="mt-2 w-full gap-2 bg-teal-600 text-white hover:bg-teal-700"
            >
              {isPendingRegister ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Register
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
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
