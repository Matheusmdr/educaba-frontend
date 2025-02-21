"use client";

import { Program } from "@/types/program";
import { use } from "react";
import { Button } from "./ui/button";
import { useParams, useRouter } from "next/navigation";
import { AppParams } from "@/types/app";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ProgramsProps {
  programsPromise: Promise<Program[] | null>;
}

function Programs({ programsPromise }: ProgramsProps) {
  const programs = use(programsPromise);
  const router = useRouter();
  const params: AppParams = useParams();

  const handleClick = (programId: string) => {
    router.push(
      `/${params.organizationId}/${params.patientId}/programs/${programId}/records`
    );
  };

  const handleViewChart = (programId: string) => {
    router.push(
      `/${params.organizationId}/${params.patientId}/programs/${programId}/chart`
    );
  };

  return (
    <div className="mt-6 space-y-4">
      {programs?.map((program) => (
        <DropdownMenu key={program.id}>
          <div
            className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm cursor-pointer hover:border-blue-500 border-2 border-white transition-colors duration-300"
            onClick={() => handleClick(program.id)}
          >
            <div>
              <p className="font-medium text-gray-800">{program.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(program.updated_at).toLocaleDateString()}
              </p>
            </div>

            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-2xl font-bold text-gray-500 hover:text-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                ...
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent>
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewChart(program.id)}>
              Ver gráfico
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
}

export { Programs };
