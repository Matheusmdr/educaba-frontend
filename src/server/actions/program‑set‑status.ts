"use server";

import { env } from "@/env";
import { z } from "zod";

const statusSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

export async function createProgramSetStatus(params: {
  name: string;
  accessToken: string;
}) {
  const { name, accessToken } = z
    .object({ name: z.string().min(1), accessToken: z.string().min(1) })
    .parse(params);

  const res = await fetch(
    `${env.NEXT_PUBLIC_API_HOST}/api/program-set-status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name }),
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Falha ao criar status do conjunto");
  return statusSchema.parse(await res.json());
}

export async function listProgramSetStatus(accessToken: string) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_HOST}/api/program-set-status`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Falha ao obter lista de status");
  const json = await res.json();
  return z.array(statusSchema).parse(json);
}

export async function deleteProgramSetStatus(token: string, statusId: string) {
  const url = new URL(`${env.NEXT_PUBLIC_API_HOST}/api/program-set-status`);
  url.searchParams.set("id", statusId);

  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Falha ao excluir status (${res.status}): ${msg}`);
  }

  return res.json() as Promise<{ message: string }>;
}
