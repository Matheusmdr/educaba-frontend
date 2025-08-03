"use server";

import { env } from "@/env";
import { Program } from "@/types/program";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getPrograms(
  accessToken?: string,
  patientId?: string,
  limit?: number
): Promise<Program[] | null> {
  if (!accessToken) return null;

  if (!patientId) return null;

  const res = await fetch(
    `${env.NEXT_PUBLIC_API_HOST}/api/program?patient_id=${patientId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-cache",
    }
  );

  if (!res.ok) {
    return null;
  }

  const programs: Program[] = await res.json();

  if (limit) {
    return programs
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, limit);
  }

  return programs;
}

const goalSchema = z.object({ name: z.string().min(1) });

const setSchema = z.object({
  name: z.string().min(1),
  goals: z.array(goalSchema).min(1),
  program_set_status_id: z.string().min(1),
});

const inputSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["number", "text", "email", "date"]),
});

const programSchema = z.object({
  name: z.string().min(1),
  patient_id: z.string().min(1),
  inputs: z.array(inputSchema).min(1),
  sets: z.array(setSchema).min(1),
  accessToken: z.string().optional(),
});

export type ProgramPayload = z.infer<typeof programSchema>;

export async function createProgram(data: ProgramPayload) {
  programSchema.parse(data);

  const { accessToken, ...programData } = data;

  const res = await fetch(`${env.NEXT_PUBLIC_API_HOST}/api/program`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(programData),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erro ao criar programa: ${await res.text()}`);
  }

  revalidatePath("/programs");

  return res.json();
}

export async function updateProgram(id: string, data: ProgramPayload) {
  const payload = { ...data, id };
  programSchema.parse(payload);

  const { accessToken, ...body } = payload;

  const res = await fetch("https://ellyzeul.com/api/program", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Update falhou (${res.status}): ${msg}`);
  }

  return res.json() as Promise<{ message: string; program: unknown }>;
}

export async function deleteProgram(
  token: string,
  programId: string,
  patientId: string
) {
  const url = new URL(`${env.NEXT_PUBLIC_API_HOST}/api/program`);
  url.searchParams.set("id", programId);
  url.searchParams.set("patient_id", patientId);

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
    throw new Error(`Falha ao excluir programa (${res.status}): ${msg}`);
  }

  return res.json() as Promise<{ message: string }>;
}
