import { Programs } from "@/components/programs";
import { Button} from "@/components/ui/button";
import { getPrograms } from "@/server/actions/programs";
import { auth } from "@/server/auth";
import type { AppParams } from "@/types/app";
import Link from "next/link";
import { SearchInput } from "@/components/search-input";

interface PageProps {
  params: Promise<AppParams>;
  searchParams: Promise<{ programName?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { patientId, organizationId } = await params;
  const { programName } = await searchParams;
  const session = await auth();

  const programsPromise = getPrograms(session?.user.token, patientId);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full">
        <h1 className="mb-4 text-2xl font-semibold text-text-title">
          Programas
        </h1>
        <div className="flex gap-2 items-center justify-between h-12">
          <div>
            <SearchInput
              placeholder="Pesquisar por nome"
              defaultValue={programName}
              searchParamName="programName"
              showSearchButton={true}
              className="flex-1"
            />
          </div>

           <Button asChild className="bg-blue-primary hover:bg-blue-primary/90">
            <Link href={`/${organizationId}/${patientId}/programs/create`}>
              Adicionar Programa
            </Link>
          </Button>
        </div>
        <Programs programsPromise={programsPromise} filter={programName} />
      </div>
    </div>
  );
}
