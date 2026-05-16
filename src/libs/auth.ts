import { prisma } from "@/libs/prisma";
import { loginSchema } from "@/validations/auth-validation";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedCredentials = loginSchema.safeParse(credentials);

        if (!validatedCredentials.success) return null;

        const user = await prisma.user.findUnique({
          where: {
            email: validatedCredentials.data.email,
          },
        });

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          validatedCredentials.data.password,
          user.passwordHash,
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }

      return session;
    },
  },
};
