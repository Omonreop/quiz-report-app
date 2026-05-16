import { prisma } from "@/libs/prisma";
import { registerSchema } from "@/validations/auth-validation";
import bcrypt from "bcryptjs";

export async function registerUser(payload: unknown) {
  const validatedPayload = registerSchema.safeParse(payload);

  if (!validatedPayload.success) {
    return {
      status: "error" as const,
      message: "Invalid registration data",
      errors: validatedPayload.error.flatten().fieldErrors,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: validatedPayload.data.email,
    },
  });

  if (existingUser) {
    return {
      status: "error" as const,
      message: "Email is already registered",
    };
  }

  const passwordHash = await bcrypt.hash(validatedPayload.data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: validatedPayload.data.name,
      email: validatedPayload.data.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return {
    status: "success" as const,
    data: user,
  };
}
