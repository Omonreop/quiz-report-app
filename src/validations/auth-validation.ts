import z from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Email must be valid"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Email must be valid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
