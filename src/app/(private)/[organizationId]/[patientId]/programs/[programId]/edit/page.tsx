import ProgramForm from "@/components/forms/program-form";
import { getPrograms } from "@/server/actions/programs";
import { auth } from "@/server/auth";
import { AppParams } from "@/types/app";

interface PageProps {
  params: Promise<AppParams>;
}

export default async function Page({ params }: PageProps) {
  const { patientId, programId } = await params;
  const session = await auth();
  const programs = await getPrograms(session?.user.token, patientId);

  const program = programs?.filter((program) => program.id === programId)[0];

  return (
    program && <ProgramForm patientId={patientId ?? ""} program={program} />
  );
}
