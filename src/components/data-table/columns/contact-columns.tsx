"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "../components/data-table-row-actions";
import { Contact } from "@/types/contact";
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
import { deleteContact } from "@/server/actions/contacts";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { AppParams } from "@/types/app";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { parseAndFormat } from "@/utils/parse-and-format";
import { RELATIONSHIPS } from "@/constants/relationship";

export function useContactColumns(): ColumnDef<Contact>[] {
  const params: AppParams = useParams();
  const patientIdFromUrl = params?.patientId ?? "";
  const session = useSession();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id, patientIdFromUrl, session.data?.user.token ?? "");
      toast.success("Contato excluído!");
      router.refresh();
    } catch (err) {
      toast.error("Falha ao excluir contato");
      console.error(err);
    }
  };

  return useMemo<ColumnDef<Contact>[]>(
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
      },

      { accessorKey: "name", header: "Nome" },
      { accessorKey: "cpf", header: "CPF" },
      {
        accessorKey: "relationship",
        header: "Parentesco",
        cell: ({ row }) => {
          const relationship =
            row.getValue<string | null>("relationship") ?? "";
          return (
            <div>
              {relationship &&
                RELATIONSHIPS[relationship as keyof typeof RELATIONSHIPS]}
            </div>
          );
        },
      },
      { accessorKey: "email", header: "E‑mail" },
      { accessorKey: "phone_primary", header: "Telefone 1" },
      { accessorKey: "phone_secondary", header: "Telefone 2" },

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
        cell: ({ row }) => {
          const pid = patientIdFromUrl || row.original.patient_id; // fallback se URL não tiver
          return (
            <DataTableRowActions
              row={row}
              editUrl={`/${params.organizationId}/${pid}/contacts/${row.original.id}/edit`}
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
            />
          );
        },
      },
    ],
    [patientIdFromUrl]
  );
}
