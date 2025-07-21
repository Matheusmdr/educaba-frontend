"use server";

import { env } from "@/env";
import { Application } from "@/types/application";
import { Patient } from "@/types/patient";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { fileToBase64 } from "@/utils/file-to-base-64";
import { createPatientSchema } from "@/schemas/patient";
import { format } from "date-fns";

export async function getPatients(
  accessToken?: string
): Promise<Patient[] | null> {
  if (!accessToken) return null;

  const res = await fetch(`${env.NEXT_PUBLIC_API_HOST}/api/patient`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar pacientes");
  }

  return res.json();
}

export async function getApplications(
  accessToken?: string,
  programId?: string
): Promise<Application[] | null> {
  if (!accessToken) return null;

  const res = await fetch(
    `${env.NEXT_PUBLIC_API_HOST}/api/application?program_id=${programId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-cache",
    }
  );

  if (!res.ok) {
    return null;
  }

  const applications: Application[] = await res.json();

  return applications;
}

type PatientFormValues = z.infer<typeof createPatientSchema>;

export async function createPatientAction(
  values: PatientFormValues,
  accessToken?: string
) {
  const parsed = createPatientSchema.parse(values);

  const file = parsed.image;
  let img: { base64: string; extension: string } | null = null;
  if (file) {
    img = await fileToBase64(file);
  }

  const body = {
    name: parsed.name,
    sex: parsed.sex,
    birth_date: format(new Date(parsed.birth_date), "yyyy-MM-dd"),
    organization_id: parsed.organization_id,
    image: img ? { base64: img.base64, extension: img.extension } : null,
  };

  const endpoint = `${env.NEXT_PUBLIC_API_HOST}/api/patient`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-cache",
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Falha ao criar paciente");
  }

  revalidatePath("/patient");
}


export async function editPatientAction(
  values: PatientFormValues & { id: string },
  accessToken?: string
) {
  const parsed = createPatientSchema.parse(values);

  const file = parsed.image;
  let img: { base64: string; extension: string } | null = null;
  if (file) {
    img = await fileToBase64(file);
  }

  const body = {
    id: values.id,
    name: parsed.name,
    sex: parsed.sex,
    birth_date: format(new Date(parsed.birth_date), "yyyy-MM-dd"),
    organization_id: parsed.organization_id,
    image: img ? { base64: img.base64, extension: img.extension } : null,
  };

  const endpoint = `${env.NEXT_PUBLIC_API_HOST}/api/patient`;

  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-cache",
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Falha ao criar paciente");
  }

  revalidatePath("/patient");
}

