import { Programs } from "@/components/programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPrograms } from "@/server/actions/programs";
import { auth } from "@/server/auth";
import { AppParams } from "@/types/app";
import { Search, SlidersHorizontal } from "lucide-react";

interface PageProps {
  params: Promise<AppParams>;
}

export default async function Page({ params }: PageProps) {
  const { patientId } = await params;
  const session = await auth();

  const programsPromise = getPrograms(session?.user.token, patientId, 3);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full">
        <h1 className="mb-4 text-2xl font-semibold text-text-title">
          Dashboard
        </h1>

        <div className="relative mt-4 flex items-center space-x-2 rounded-lg bg-white p-3 shadow-sm">
          <Search className="text-gray-500" size={20} />
          <Input
            placeholder="Pesquisar"
            className="flex-1 border-none focus:ring-0 shadow-none"
          />
          <SlidersHorizontal className="text-gray-500" size={20} />
        </div>

        <div className="mt-4 flex space-x-2">
          <Button variant="default" className="bg-blue-primary text-white">
            Visão Geral
          </Button>
          <Button variant="ghost">Analytics</Button>
        </div>

        <Programs programsPromise={programsPromise} />
      </div>
    </div>
  );
}
