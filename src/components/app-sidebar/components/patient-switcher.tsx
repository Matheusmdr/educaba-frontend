"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { env } from "@/env";
import { Patient } from "@/types/patient";
import { useParams } from "next/navigation";
import { AppParams } from "@/types/app";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";

export function PatientSwitcher() {
  const { isMobile } = useSidebar();
  const { patientId, organizationId }: AppParams = useParams();
  const [patient, setPatient] = React.useState<Patient | undefined>(undefined);
  const session = useSession();
  const accessToken = session?.data?.user?.token;

  React.useEffect(() => {
    async function getPatients(accessToken?: string) {
      if (!accessToken) return null;

      const res = await fetch(`${env.NEXT_PUBLIC_API_HOST}/api/patient`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar pacientes");
      }

      const patients = (await res.json()) as Patient[];
      const selectedPatient = patients.find((p) => p.id === patientId);
      setPatient(selectedPatient);
    }
    getPatients(accessToken);
  }, [patientId, accessToken]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                {patient?.image ? (
                  <Image
                    src={`${env.NEXT_PUBLIC_API_HOST}${patient.image}`}
                    alt={patient.name}
                    fill
                  />
                ) : (
                  <AvatarFallback className="text-3xl">
                    {patient?.name[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs">{patient?.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuItem asChild className="gap-2 p-2">
              <Link
                href={`/${organizationId}`}
                className="text-muted-foreground font-medium"
              >
                Alterar Paciente
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
