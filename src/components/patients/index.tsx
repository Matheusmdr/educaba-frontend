"use client";

import type { Patient } from "@/types/patient";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { use, useMemo, useState } from "react";
import { User } from "lucide-react";
import type { AppParams } from "@/types/app";
import { PatientCard } from "./components/patient-card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface PatientsProps {
  patientsPromise: Promise<Patient[] | null>;
}

function Patients({ patientsPromise }: PatientsProps) {
  const [tabValue, setTabValue] = useState<"todos" | "masculino" | "feminino">(
    "todos"
  );

  const patients = use(patientsPromise);
  const searchParams = useSearchParams();
  const params: AppParams = useParams();
  const query = searchParams.get("query") || "";
  const router = useRouter();

  const filteredPatients = useMemo(() => {
    if (!patients) return null;

    return patients
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .filter((p) => {
        if (tabValue === "todos") return true;

        const gender = p.sex?.toLowerCase();

        if (tabValue === "masculino") return gender === "male";
        if (tabValue === "feminino") return gender === "female";

        return true;
      });
  }, [patients, query, tabValue]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Pesquisar por nome"
            className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={query}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              if (e.target.value) {
                newParams.set("query", e.target.value);
              } else {
                newParams.delete("query");
              }
              router.push(`/${params.organizationId}?${newParams.toString()}`);
            }}
          />
        </div>
        <Tabs
          value={tabValue}
          onValueChange={(v) => setTabValue(v as typeof tabValue)}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="masculino">Masculino</TabsTrigger>
            <TabsTrigger value="feminino">Feminino</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredPatients && filteredPatients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhum paciente encontrado</h3>
          <p className="mt-1 text-muted-foreground">
            Tente ajustar sua pesquisa ou adicione um novo paciente.
          </p>
        </div>
      )}
    </div>
  );
}

export { Patients };
