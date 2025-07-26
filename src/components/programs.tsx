"use client";

import { use } from "react";
import { Program } from "@/types/program";
import { DataTable } from "./data-table";
import { useProgramColumns } from "./data-table/columns/program-columns";

interface ProgramsProps {
  programsPromise: Promise<Program[] | null>;
  filter?: string;
}

function Programs({ programsPromise, filter }: ProgramsProps) {
  const programs = use(programsPromise);
  const filteredPrograms = programs?.filter((program) =>
    program.name.toLowerCase().includes(filter ?? "")
  );

  console.log("filter", filter);
  const columns = useProgramColumns();

  return (
    <div className="mt-6 space-y-4">
      {filteredPrograms && (
        <DataTable data={filteredPrograms} columns={columns} />
      )}
    </div>
  );
}

export { Programs };
