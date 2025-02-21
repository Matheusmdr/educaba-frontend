import { Programs } from "@/components/programs";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { AppParams } from "@/types/app";
import { Program } from "@/types/program";
import { Search, SlidersHorizontal } from "lucide-react";

async function getPrograms(
  accessToken?: string,
  patientId?: string
): Promise<Program[] | null> {
  if (!accessToken) return null;

  if (!patientId) return null;

  const res = await fetch(
    `${env.NEXT_PUBLIC_API_HOST}/api/program?patient_id=${patientId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "force-cache",
    }
  );

  if (!res.ok) {
    return null;
  }

  const programs: Program[] = await res.json();

  return programs;
}

interface PageProps {
  params: Promise<AppParams>;
}

export default async function Page({ params }: PageProps) {
  const { patientId } = await params;
  const session = await auth();

  const programsPromise = getPrograms(session?.user.token, patientId);

  return (
    <div className="flex min-h-screen flex-col items-center  p-4">
      <div className="w-full max-w-md md:max-w-4xl">
        <h1 className="mb-4 text-2xl font-semibold text-text-title">
          Programas
        </h1>

        <div className="relative mt-4 flex items-center space-x-2 rounded-lg bg-white p-3 shadow-sm">
          <Search className="text-gray-500" size={20} />
          <Input
            placeholder="Pesquisar"
            className="flex-1 border-none focus:ring-0 shadow-none"
          />
          <SlidersHorizontal className="text-gray-500" size={20} />
        </div>
        <Programs programsPromise={programsPromise} />
      </div>
    </div>
  );
}
