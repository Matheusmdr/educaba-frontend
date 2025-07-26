"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "../components/data-table-row-actions";
import { Program } from "@/types/program";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteProgram } from "@/server/actions/programs";
import { AppParams } from "@/types/app";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { parseAndFormat } from "@/utils/parse-and-format";

export function useProgramColumns(): ColumnDef<Program>[] {
  const params: AppParams = useParams();
  const orgId = params?.organizationId ?? "";
  const session = useSession();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await deleteProgram(
        session.data?.user.token ?? "",
        id,
        params.patientId ?? ""
      );
      toast.success("Programa excluído!");
      router.refresh();
    } catch (err) {
      toast.error("Falha ao excluir programa");
      console.error(err);
    }
  };

  return useMemo<ColumnDef<Program>[]>(
    () => [
      {
        id: "id",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: "Título",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
      },
      {
        accessorKey: "sets",
        header: "Número de conjuntos",
        cell: ({ row }) => {
          const sets = row.getValue("sets") as Program["sets"];
          return <div>{sets.length ?? 0}</div>;
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Criado em
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div>{parseAndFormat(row.getValue<string | null>("created_at"))}</div>
        ),
      },
      {
        accessorKey: "updated_at",
        header: () => <div className="text-right">Atualizado em</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {parseAndFormat(row.getValue<string | null>("updated_at"))}
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <DataTableRowActions
            row={row}
            /* usa o param para montar as rotas dinamicamente */
            editUrl={`/${orgId}/${params.patientId}/programs/${row.original.id}/edit`}
            DeleteDialog={
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full justify-start text-left"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Deseja realmente deletar o programa?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(row.original.id)}
                    >
                      Deletar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            }
          >
            <DropdownMenuItem>
              <Link
                href={`/${orgId}/${params.patientId}/programs/${row.original.id}/records`}
              >
                Registros
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/${orgId}/${params.patientId}/programs/${row.original.id}/chart`}
              >
                Gráfico
              </Link>
            </DropdownMenuItem>
          </DataTableRowActions>
        ),
      },
    ],
    [orgId]
  );
}
