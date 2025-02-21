"use client";

import { Application } from "@/types/application";
import { use } from "react";
import { Button } from "./ui/button";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ApplicationsProps {
  applicationsPromise: Promise<Application[] | null>;
}

function Applications({ applicationsPromise }: ApplicationsProps) {
  const applications = use(applicationsPromise);

  return (
    <div className="mt-6 space-y-4">
      {applications?.map((app) => (
        <div
          key={app.id}
          className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm"
        >
          <div>
            <p className="font-medium text-gray-800">
              Registro - {format(new Date(app.created_at), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-2xl font-bold text-gray-500 hover:text-gray-700"
          >
            ...
          </Button>
        </div>
      ))}
    </div>
  );
}

export { Applications };
