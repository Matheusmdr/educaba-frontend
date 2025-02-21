import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Patient } from "@/types/patient";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { Patients } from "@/components/patients";

async function getPatients(accessToken?: string): Promise<Patient[] | null> {
  if (!accessToken) return null;

  const res = await fetch(`${env.NEXT_PUBLIC_API_HOST}/api/patient`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store", // Evita cache para sempre pegar os dados mais recentes
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar pacientes");
  }

  return res.json();
}

export default async function SelectPatientPage() {
  const session = await auth();
  const patientsPromise = getPatients(session?.user.token);
  

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-4">
      <div className="w-full max-w-md md:max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Selecione um paciente
        </h1>

        <div className="my-4">
          <form action="/select-patient" className="flex gap-2 items-center">
            <Input placeholder="Pesquisar" name="query" defaultValue={""} />
            <Button type="submit" className="ml-2">
              Buscar
            </Button>
          </form>
        </div>

        <Patients patientsPromise={patientsPromise} />

        <div className="mt-6">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Adicionar Paciente
          </Button>
        </div>
      </div>
    </div>
  );
}
