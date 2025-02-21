import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/env";

/**
 * Module augmentation para os tipos do NextAuth, permitindo adicionar propriedades customizadas
 * à sessão.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      token?: string;
      expiresAt?: string;
    } & DefaultSession["user"];
  }

  interface User {
    token?: string;
    expiresAt?: string;
  }
}

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  
  providers: [
    Credentials({
      credentials: {
        email: { type: "email", required: true },
        password: { type: "password", required: true },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        const response = await fetch(
          `${env.NEXT_PUBLIC_API_HOST}/api/auth/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await response.json();

        // Caso ocorra algum erro, a API retorna { message: string }
        if (!response.ok) {
          throw new Error(data.message || "Erro ao efetuar login");
        }

        // Em caso de sucesso, a API retorna { token: string, expiresAt: string }
        return { token: data.token, expiresAt: data.expiresAt };
      },
    }),
  ],
  callbacks: {
    // No callback do JWT, adiciona as propriedades token e expiresAt ao token
    jwt: async ({ token, user }) => {
      if (user) {
        token.token = user.token;
        token.expiresAt = user.expiresAt;
      }
      return token;
    },
    // No callback da sessão, transfere as informações do token para a sessão
    session: async ({ session, token }) => {
      session.user.token = token.token as string;
      session.user.expiresAt = token.expiresAt as string;
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
} satisfies NextAuthConfig;
