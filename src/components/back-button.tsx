"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function BackButton({
  label = "Voltar",
  fallback = "/",
}: {
  label?: string;
  fallback?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (window?.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <Button type="button" onClick={handleBack} variant="outline">
      {label}
    </Button>
  );
}
