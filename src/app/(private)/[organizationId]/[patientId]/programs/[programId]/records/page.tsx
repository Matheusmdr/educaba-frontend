import { Applications } from "@/components/applications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { AppParams } from "@/types/app";
import { Application } from "@/types/application";
import { ChevronLeft, Plus, Search, SlidersHorizontal } from "lucide-react";

async function getApplications(
  accessToken?: string,
  programId?: string
): Promise<Application[] | null> {
  if (!accessToken) return null;

  const res = await fetch(
    `${env.NEXT_PUBLIC_API_HOST}/api/application?program_id=${programId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "force-cache",
    }
  );

  if (!res.ok) {
    return null;
  }

  const applications: Application[] = await res.json();


  return applications;
}

interface PageProps {
  params: Promise<AppParams>;
}

export default async function Page({ params }: PageProps) {
  const { programId } = await params;
  const session = await auth();

  const applicationsPromise = getApplications(session?.user.token, programId);

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-md md:max-w-4xl">
        <div className="flex items-center justify-between">
          <Button variant="ghost">
            <ChevronLeft size={24} />
          </Button>
          <h1 className="mb-4 text-2xl font-semibold text-text-title">
            Reconhecer cores
          </h1>
          <Button
            variant="default"
            className="bg-blue-primary text-white rounded-full p-2"
          >
            <Plus size={18} />
            Adicionar Registro
          </Button>
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
