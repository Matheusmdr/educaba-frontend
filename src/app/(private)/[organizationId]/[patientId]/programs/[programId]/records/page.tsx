import { Applications } from "@/components/applications";
import { Button } from "@/components/ui/button";
import { getApplications } from "@/server/actions/patient";
import { auth } from "@/server/auth";
import { AppParams } from "@/types/app";
import Link from "next/link";

interface PageProps {
  params: Promise<AppParams>;
}

export default async function Page({ params }: PageProps) {
  const { programId, organizationId, patientId } = await params;
  const session = await auth();
  const applicationsPromise = getApplications(session?.user.token, programId);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full">
        <div className="flex gap-2 items-center justify-between h-12">
          <h1 className="mb-4 text-2xl font-semibold text-text-title">
            Registros
          </h1>
          <Button asChild className="bg-blue-primary hover:bg-blue-primary/90">
            <Link
              href={`/${organizationId}/${patientId}/programs/${programId}/records/create`}
            >
              Adicionar Registro
            </Link>
          </Button>
        </div>
        <Applications applicationsPromise={applicationsPromise} />
      </div>
    </div>
  );
}
