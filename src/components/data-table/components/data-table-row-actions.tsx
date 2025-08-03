import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { type Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { type PropsWithChildren } from "react";
import Link from "next/link";

interface DataTableRowActionsProps<TData extends { id: string }>
  extends PropsWithChildren {
  row: Row<TData>;
  editUrl?: string;
  DeleteDialog?: React.ReactNode;
}

export function DataTableRowActions<TData extends { id: string }>({
  editUrl,
  DeleteDialog,
  children,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          <Link href={`${editUrl}`}>Editar</Link>
        </DropdownMenuItem>
        {children}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>{DeleteDialog}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
