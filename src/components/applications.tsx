"use client";

import { use } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Application } from "@/types/application";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import { AppParams } from "@/types/app";
import { toast } from "sonner";
import { deleteRecord } from "@/server/actions/record";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ApplicationsProps {
  applicationsPromise: Promise<Application[] | null>;
}

function Applications({ applicationsPromise }: ApplicationsProps) {
  const applications = use(applicationsPromise);
  const params = useParams<AppParams>();
  const { programId, patientId, organizationId } = params;
  const session = useSession();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteRecord(
        session.data?.user.token ?? "",
        id,
        programId ?? ""
      );
      router.refresh();
      toast.success(res.message);
    } catch (error) {
      toast.error("Erro ao excluir o registro");
      console.log("Erro ao excluir o registro:", error);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {applications?.map((app) => (
        <div
          key={app.id}
          className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm"
        >
          <p className="font-medium text-gray-800">
            Registro –{" "}
            {format(new Date(app.created_at), "dd/MM/yyyy", { locale: ptBR })}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/${organizationId}/${patientId}/programs/${programId}/records/${app.id}/edit`}
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => handleDelete(app.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}

export { Applications };
