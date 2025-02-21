"use client";

import { env } from "@/env";
import { Patient } from "@/types/patient";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { use } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AppParams } from "@/types/app";

interface PatientsProps {
  patientsPromise: Promise<Patient[] | null>;
}

function Patients({ patientsPromise }: PatientsProps) {
  const patients = use(patientsPromise);
  const searchParams = useSearchParams();
  const params: AppParams = useParams();
  const query = searchParams.get("query");

  const filteredPatients = patients?.filter((p) =>
    p.name.toLowerCase().includes(query?.toLowerCase() || "")
  );

  const router = useRouter();

  const handleClick = (patientId: string) => {
    router.push(`/${params.organizationId}/${patientId}`);
  };

  return (
    <div className="space-y-4">
      {filteredPatients && filteredPatients.length > 0 ? (
        filteredPatients?.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm cursor-pointer hover:border-blue-500 border-2 border-white transition-colors duration-300"
            onClick={() => handleClick(patient.id)}
          >
            <div className="flex items-center">
              <div className="relative mr-3 h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={`${env.NEXT_PUBLIC_API_HOST}${patient.image}`}
                  alt={patient.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">{patient.name}</p>
                <p className="text-sm text-gray-500">
                  {patient.sex === "male" ? "Masculino" : "Feminino"}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-2xl font-bold text-gray-500 hover:text-gray-700">
                ...
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert(`Editar ${patient.id}`)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert(`Remover ${patient.id}`)}
                >
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))
      ) : (
        <p>Nenhum paciente encontrado.</p>
      )}
    </div>
  );
}

export { Patients };
