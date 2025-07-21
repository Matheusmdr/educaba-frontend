"use server";

import { env } from "@/env";
import { UserResponse } from "@/types/user";


export async function getUser(accessToken?: string): Promise<UserResponse | null> {
  if (!accessToken) return null;

  const res = await fetch(`${env.NEXT_PUBLIC_API_HOST}/api/user/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "force-cache",
  });

  if (!res.ok) return null;

  return res.json();
}
