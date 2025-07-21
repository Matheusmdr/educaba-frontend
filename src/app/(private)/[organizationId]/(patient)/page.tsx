import { auth } from "@/server/auth";
import { Patients } from "@/components/patients";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { getPatients } from "@/server/actions/patient";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ organizationId: string }>;
}

export default async function SelectPatientPage({ params }: PageProps) {
  const { organizationId } = await params;
  const session = await auth();
  const patientsPromise = getPatients(session?.user.token);

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Selecione um paciente
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Gerencie e visualize informações dos seus pacientes
          </p>
        </div>
        <Link
          href={`/${organizationId}/add-patient`}
          className={cn(
            buttonVariants({ size: "lg" }),
            "gap-2 shadow-md bg-blue-primary hover:bg-blue-primary/90"
          )}
        >
          <Plus className="h-5 w-5" />
          Adicionar Paciente
        </Link>
      </div>

      <Patients patientsPromise={patientsPromise} />
    </main>
  );
}
