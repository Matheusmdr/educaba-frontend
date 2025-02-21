"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookCheck,
  Command,
  GalleryVerticalEnd,
  Home,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { AppParams } from "@/types/app";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const params: AppParams = useParams()

  const data = {

    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Inicio",
        url: `/${params.organizationId}/${params.patientId}`,
        icon: Home,
        isActive: true,
      },
      {
        title: "Programas",
        url: `/${params.organizationId}/${params.patientId}/programs`,
        icon: BookCheck,
        isActive: true,
      },
    ],
  };
  


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
