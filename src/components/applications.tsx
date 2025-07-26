"use client";

import { use } from "react";
import { Application } from "@/types/application";
import { DataTable } from "./data-table";
import { useRecordsColumns } from "./data-table/columns/records-columns";

interface ApplicationsProps {
  applicationsPromise: Promise<Application[] | null>;
}

function Applications({ applicationsPromise }: ApplicationsProps) {
  const applications = use(applicationsPromise);

  const recordColumns = useRecordsColumns();

  return (
    <div className="mt-6 space-y-4">
      <div className="mt-6 space-y-4">
        {applications && (
          <DataTable data={applications} columns={recordColumns} />
        )}
      </div>
    </div>
  );
}

export { Applications };
