import { Programs } from "@/components/programs";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getPrograms } from "@/server/actions/programs";
import { auth } from "@/server/auth";
import { AppParams } from "@/types/app";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<AppParams>;
}

export default async function Page({ params }: PageProps) {
  const { patientId, organizationId } = await params;
  const session = await auth();

  const programsPromise = getPrograms(session?.user.token, patientId);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full">
        <h1 className="mb-4 text-2xl font-semibold text-text-title">
          Programas
        </h1>

        <div className="flex gap-2 items-center justify-between h-12">
          <div className="relative flex items-center space-x-2 rounded-lg bg-white shadow-sm w-full p-2">
            <Search className="text-gray-500" size={20} />
            <Input
              placeholder="Pesquisar"
              className="flex-1 border-none focus:ring-0 shadow-none"
            />
            <SlidersHorizontal className="text-gray-500" size={20} />
          </div>
          <Link
            href={`/${organizationId}/${patientId}/programs/create`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 shadow-md bg-blue-primary hover:bg-blue-primary/90 h-full"
            )}
          >
            <Plus className="h-5 w-5" />
            Adicionar Programa
          </Link>
        </div>

        <Programs programsPromise={programsPromise} />
      </div>
    </div>
  );
}
