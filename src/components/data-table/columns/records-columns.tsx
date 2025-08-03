"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "../components/data-table-row-actions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { AppParams } from "@/types/app";
import { Button } from "@/components/ui/button";
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
import { Application } from "@/types/application";
import { deleteRecord } from "@/server/actions/record";
import { ArrowUpDown } from "lucide-react";
import { parseAndFormat } from "@/utils/parse-and-format";


export function useRecordsColumns(): ColumnDef<Application>[] {
  const params: AppParams = useParams();
  const patientIdFromUrl = params?.patientId ?? "";
  const session = useSession();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await deleteRecord(
        session.data?.user.token ?? "",
        id,
        params.programId ?? ""
      );
      toast.success("Aplicação excluída!");
      router.refresh();
    } catch (err) {
      toast.error("Falha ao excluir aplicação");
      console.error(err);
    }
  };

  return useMemo<ColumnDef<Application>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Selecionar todos"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Selecionar linha"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
      },

      /* principais campos */
      { accessorKey: "program_name", header: "Programa" },
      { accessorKey: "goal_name", header: "Meta" },

      {
        accessorKey: "inputs",
        header: "Inputs",
        cell: ({ row }) => {
          const inputs = row.original.inputs ?? {};
          const count = Object.keys(inputs).length;
          return (
            <div className="text-sm">
              {count > 0 ? `${count} campo${count > 1 ? "s" : ""}` : "-"}
            </div>
          );
        },
        enableSorting: false,
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
          <div>
             {parseAndFormat(row.getValue<string | null>("created_at"))}
          </div>
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

      /* ações */
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DataTableRowActions
              row={row}
              editUrl={`/${params.organizationId}/${params.patientId}/programs/${row.original.id}/records/${row.original.id}/edit`}
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
                        Deseja realmente deletar esta aplicação?
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
            />
          );
        },
      },
    ],
    [patientIdFromUrl, session.data?.user.token, router]
  );
}
