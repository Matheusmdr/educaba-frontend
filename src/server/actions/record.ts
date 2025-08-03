"use server";

import { env } from "@/env";
import { RecordSchema } from "@/schemas/record";
import { z } from "zod";

export type RecordFormValues = z.infer<typeof RecordSchema>;

export async function createRecord(
  token: string,
  programId: string,
  data: RecordFormValues
) {
  const body = {
    program_id: programId,
    goal_id: data.goalId,
    inputs: Object.entries(data.inputs).map(([name, value]) => ({
      name,
      value,
    })),
  };
  const res = await fetch(`${env.NEXT_PUBLIC_API_HOST}/api/application`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.json();
    console.error("Failed to create record:", errorText);
    throw new Error(`Erro ao registrar: ${errorText}`);
  }

  if (!res.ok) throw new Error("Erro ao registrar");
  return res.json();
}

export async function updateRecord(
  token: string,
  recordId: string,
  programId: string,
  data: RecordFormValues
) {
  const body = {
    id: recordId,
    program_id: programId,
    inputs: Object.entries(data.inputs).map(([name, value]) => ({
      name,
      value,
    })),
  };
  const res = await fetch(`${env.NEXT_PUBLIC_API_HOST}/api/application`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const ss = await res.json();
  console.log("Updating record with body:", body, "Response:", ss);

  if (!res.ok) throw new Error("Erro ao atualizar registro");
  return res.json();
}

export async function deleteRecord(
  token: string,
  recordId: string,
  programId: string
) {
  const url = new URL(`${env.NEXT_PUBLIC_API_HOST}/api/application`);
  url.searchParams.set("id", recordId);
  url.searchParams.set("program_id", programId);

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
    throw new Error(`Falha ao excluir registro (${res.status}): ${msg}`);
  }

  return res.json() as Promise<{ message: string }>;
}
