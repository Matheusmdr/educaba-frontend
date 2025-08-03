// lib/api-fetch.ts
import { env } from "@/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ApiFetchOptions
  extends Omit<RequestInit, "headers" | "body"> {
  /** JWT/Bearer recebido do Next-Auth */
  token: string;
  /** Corpo JSON a ser enviado (serializado automaticamente) */
  body?: unknown;
}

/**
 * Faz uma request autenticada ao backend.
 *  - Adiciona cabeçalhos padrão.
 *  - Se receber 401/403, limpa cookie de sessão e força login.
 *  - Caso `!res.ok`, lança erro com texto da resposta.
 */
export async function apiFetch<T>(
  path: string,
  { token, body, ...init }: ApiFetchOptions,
): Promise<T> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_HOST}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    // ⚠️ sessão expirou → remove cookie e manda pro login
    const c = cookies();
    // cookie pode ter nomes diferentes em prod/dev; delete todos que começam com "next-auth"
    c.getAll().forEach((ck) => {
      if (ck.name.startsWith("next-auth")) c.delete(ck.name);
    });

    // redireciona para tela de login do Next-Auth
    redirect("/api/auth/signin?error=SessionExpired");
  }

  if (!res.ok) {
    // devolve texto legível p/ quem chamar
    throw new Error((await res.text()) || "Erro inesperado");
  }

  return (await res.json()) as T;
