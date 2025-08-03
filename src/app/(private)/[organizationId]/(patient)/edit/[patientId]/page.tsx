import { PatientForm } from "@/components/forms/patient-form";
import { getPatients } from "@/server/actions/patient";
import { auth } from "@/server/auth";
import { ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ organizationId: string; patientId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { organizationId, patientId } = await params;
  const session = await auth();

  const patients = await getPatients(session?.user.token);
  const patient = patients?.find((p) => p.id === patientId);

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center space-x-1 text-sm text-[#666]">
        <span>Pacientes</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-black">Novo Paciente</span>
      </div>

      <div>
        <h1 className="text-3xl font-medium tracking-tight">Novo Paciente</h1>
        <p className="text-[#666] mt-1">
          Preencha os dados para cadastrar um novo paciente.
        </p>
      </div>
      <PatientForm organizationId={organizationId} patient={patient} />
    </div>
  );
}
