import ProgramRecordForm from "@/components/forms/program-record-form";
import { getApplications } from "@/server/actions/patient";
import { getPrograms } from "@/server/actions/programs";
import { auth } from "@/server/auth";
import { AppParams } from "@/types/app";

interface PageProps {
  params: Promise<AppParams>;
}

export default async function Page({ params }: PageProps) {
  const { patientId, recordId, programId } = await params;
  const session = await auth();

  const programs = await getPrograms(session?.user.token, patientId);
  const program = programs?.find((program) => program.id === programId);

  const records = await getApplications(session?.user.token, programId);

  const record = records?.find((record) => record.id === recordId);

  const inputs = record?.inputs
    ? Array.isArray(record.inputs)
      ? record.inputs 
      : Object.entries(record.inputs).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full">
        <h1 className="mb-4 text-2xl font-semibold text-text-title">
          Criar Programa
        </h1>
        {program && record && (
          <ProgramRecordForm
            program={program}
            record={{
              goal_id: record?.goal_id ?? "",
              id: record?.id ?? "",
              inputs: inputs,
            }}
          />
        )}
      </div>
    </div>
  );
}
