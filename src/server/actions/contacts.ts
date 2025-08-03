"use server";

import { env } from "@/env";
import { revalidatePath } from "next/cache";

/* === TYPES ====================================================== */
type ContactPayload = {
  name: string;
  cpf: string;
  relationship: "father" | "mother" | "relative" | "responsible" | "other";
  email: string;
  phone_primary: string;
  phone_secondary?: string;
  patient_id: string;
};
type Contact = ContactPayload & {
  id: string;
  created_at: string;
  updated_at: string;
};

/* === LIST  ====================================================== */
export async function listContacts(
  patientId: string,
  token?: string
): Promise<Contact[]> {
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_HOST}/api/contact?patient_id=${patientId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Falha ao buscar contatos");
  return res.json();
}

/* === CREATE  ==================================================== */
export async function createContact(
  data: ContactPayload,
  token?: string
): Promise<Contact> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_HOST}/api/contact`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Falha ao criar contato");
  revalidatePath(`/patients/${data.patient_id}/contacts`);
  return res.json();
}

export async function updateContact(
  id: string,
  data: ContactPayload,
  token?: string
): Promise<Contact> {
  console.log("Updating contact with ID:", id, "and data:", data);
  const res = await fetch(`${env.NEXT_PUBLIC_API_HOST}/api/contact?id=${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ ...data, id }),
  });

  const resData = await res.json();
  console.log("resData", resData);
  if (!res.ok) throw new Error("Falha ao atualizar contato");
  revalidatePath(`/patients/${data.patient_id}/contacts`);
  return res.json();
}

export async function deleteContact(
  id: string,
  patientId: string,
  token?: string
) {
  const params = new URLSearchParams({ id, patient_id: patientId });
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_HOST}/api/contact?${params.toString()}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!res.ok) throw new Error("Falha ao excluir contato");
  revalidatePath(`/patients/${patientId}/contacts`);
}
