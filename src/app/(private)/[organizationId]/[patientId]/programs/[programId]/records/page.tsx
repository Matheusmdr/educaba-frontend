import { Applications } from "@/components/applications";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getApplications } from "@/server/actions/patient";
import { auth } from "@/server/auth";
import { AppParams } from "@/types/app";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
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
        <div className="flex items-center justify-between">
          <h1 className="mb-4 text-2xl font-semibold text-text-title">
            Reconhecer cores
          </h1>
          <Link
            href={`/${organizationId}/${patientId}/programs/${programId}/records/create`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-blue-primary text-white rounded-full p-2"
            )}
          >
            <Plus size={18} />
            Adicionar Registro
          </Link>
        </div>

        <div className="relative mt-4 flex items-center space-x-2 rounded-lg bg-white p-3 shadow-sm">
          <Search className="text-gray-500" size={20} />
          <Input
            placeholder="Pesquisar"
            className="flex-1 border-none focus:ring-0 shadow-none"
          />
          <SlidersHorizontal className="text-gray-500" size={20} />
        </div>
        <ScrollArea className="h-[70vh]">
          <Applications applicationsPromise={applicationsPromise} />
        </ScrollArea>
      </div>
    </div>
  );
}
