import ProgramRecordForm from "@/components/forms/program-record-form";
import { getPrograms } from "@/server/actions/programs";
import { auth } from "@/server/auth";

interface PageProps {
  params: Promise<{ programId: string; patientId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { patientId, programId } = await params;
  const session = await auth();
  const programs = await getPrograms(session?.user.token, patientId);
  const program = programs?.find((program) => program.id === programId);

  return <>{program && <ProgramRecordForm program={program} />}</>;
}
