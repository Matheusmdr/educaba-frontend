"use client";

import * as React from "react";
import { Contact, Home, List } from "lucide-react";

import { NavMain } from "@/components/app-sidebar/components/nav-main";
import { NavUser } from "@/components/app-sidebar/components/nav-user";
import { PatientSwitcher } from "@/components/app-sidebar/components/patient-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { AppParams } from "@/types/app";
import Image from "next/image";
import EducabaLogo from "@/assets/educaba-logo.png";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params: AppParams = useParams();

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: `/${params.organizationId}/${params.patientId}`,
        icon: Home,
        isActive: true,
      },
      {
        title: "Programas",
        url: `/${params.organizationId}/${params.patientId}/programs`,
        icon: List,
        isActive: true,
      },

      {
        title: "Contatos",
        url: `/${params.organizationId}/${params.patientId}/contacts`,
        icon: Contact,
        isActive: true,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <Image
          src={EducabaLogo}
          alt="Logo Educaba"
          className="max-w-10/12 mx-auto"
        />
        <PatientSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
