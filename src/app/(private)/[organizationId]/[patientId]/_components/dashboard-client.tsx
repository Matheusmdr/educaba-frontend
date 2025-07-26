"use client";

import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, CheckCircle2, Users2, Activity, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { env } from "@/env";
import Image from "next/image";

interface Patient {
  id: string;
  name: string;
  sex: string;
  birth_date?: string;
  birthDate?: string;
  image?: string | null;
}

interface Program {
  id: string;
  name: string;
  description?: string;
}

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone_primary: string;
}

interface DashboardProps {
  patient: Patient;
  metrics: {
    totalPrograms: number;
    completedApplications: number;
    contacts: number;
    activities: number;
  };
  programs: Program[];
  contacts: Contact[];
  recentActivity: {
    id: string;
    user: string;
    action: string;
    program: string;
    time: string;
  }[];
}

const calcAge = (iso?: string) =>
  iso
    ? Math.floor(
        (Date.now() - new Date(iso).getTime()) / 1000 / 60 / 60 / 24 / 365.25
      )
    : "—";

function IconBox({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span
      className={`${className} inline-flex h-10 w-10 items-center justify-center rounded-lg text-white shadow`}
    >
      {children}
    </span>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card className={`relative overflow-hidden bg-gradient-to-b p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-4xl font-extrabold leading-tight">{value}</p>
        </div>
        <IconBox className="bg-white/20 backdrop-blur">{icon}</IconBox>
      </div>
    </Card>
  );
}

function ListCard({
  title,
  icon,
  accent,
  items,
}: {
  title: string;
  icon: ReactNode;
  accent: string;
  items: {
    id: string;
    primary: string;
    secondary?: string;
    badge?: string;
    rowIcon?: ReactNode;
  }[];
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-3">
        <IconBox className={accent}>{icon}</IconBox>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      {items.length === 0 ? (
        <CardContent>
          <p className="text-sm text-muted-foreground py-6">
            Não há registros.
          </p>
        </CardContent>
      ) : (
        <CardContent className="p-0">
          <ScrollArea className="h-[270px]">
            <ul className="divide-y">
              {items.map(({ id, primary, secondary, badge, rowIcon }) => (
                <li
                  key={id}
                  className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    {rowIcon && (
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-muted/50 text-muted-foreground">
                        {rowIcon}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {primary}
                      </p>
                      {secondary && (
                        <p className="text-xs text-muted-foreground">
                          {secondary}
                        </p>
                      )}
                    </div>
                  </div>
                  {badge && (
                    <Badge
                      variant="secondary"
                      className="whitespace-nowrap text-xs"
                    >
                      {badge}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}

export function DashboardClient({
  patient,
  metrics,
  programs,
  contacts,
  recentActivity,
}: DashboardProps) {
  const birthIso = patient.birth_date ?? patient.birthDate;

  /* prettier-ignore */
  const metricData = [ 
    { label: "Total de Programas", value: metrics.totalPrograms, icon: <BookOpen className="h-5 w-5 text-primary" />,},
    { label: "Aplicações Concluídas", value: metrics.completedApplications, icon: <CheckCircle2 className="h-5 w-5 text-primary" />,  },
    { label: "Contatos Cadastrados", value: metrics.contacts, icon: <Users2 className="h-5 w-5 text-primary" />,  },
    { label: "Atividades Recentes", value: metrics.activities, icon: <Activity className="h-5 w-5 text-primary" />, },
  ]

  return (
    <main className="mx-auto w-full space-y-8 px-4 py-8">
      <Card className="overflow-hidden p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <Avatar className="h-24 w-24 ring-4 ring-muted">
            {patient.image ? (
              <Image
                src={`${env.NEXT_PUBLIC_API_HOST}${patient.image}`}
                alt={patient.name}
                fill
              />
            ) : (
              <AvatarFallback className="text-3xl">
                {patient.name[0]}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              {patient.name}
            </h2>
            <p className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
              {patient.sex === "male" ? "Masculino" : "Feminino"} •{" "}
              {calcAge(birthIso)} anos •{" "}
              {birthIso &&
                `Data de nascimento: ${new Date(birthIso).toLocaleDateString(
                  "pt-BR"
                )}`}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricData.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ListCard
          title="Programas"
          icon={<BookOpen className="h-5 w-5" />}
          accent="bg-blue-600"
          items={programs.map((p) => ({
            id: p.id,
            primary: p.name,
            secondary: p.description ?? "—",
            badge: "Ativo",
            rowIcon: <BookOpen className="h-4 w-4" />,
          }))}
        />

        <ListCard
          title="Contatos"
          icon={<Users2 className="h-5 w-5" />}
          accent="bg-emerald-600"
          items={contacts.map((c) => ({
            id: c.id,
            primary: c.name,
            secondary: c.relationship,
            badge: c.phone_primary,
            rowIcon: <Phone className="h-4 w-4" />,
          }))}
        />

        <ListCard
          title="Atividade Recente"
          icon={<Activity className="h-5 w-5" />}
          accent="bg-violet-600"
          items={recentActivity.map((a) => ({
            id: a.id,
            primary: `${a.action} – ${a.program}`,
            secondary: format(new Date(a.time), "dd/MM/yyyy HH:mm"),
            badge: a.user,
            rowIcon: <Activity className="h-4 w-4" />,
          }))}
        />
      </div>
    </main>
  );
}
