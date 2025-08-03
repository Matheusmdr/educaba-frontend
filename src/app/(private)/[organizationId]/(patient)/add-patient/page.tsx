import { PatientForm } from "@/components/forms/patient-form";
import { ChevronRight } from "lucide-react";


interface PatientPageProps { 
  params: Promise <{ organizationId: string }>
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { organizationId } = await params;

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
      <PatientForm organizationId={organizationId} />
    </div>
  );
}
