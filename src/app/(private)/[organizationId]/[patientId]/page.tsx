import { notFound } from "next/navigation";
import { format } from "date-fns";

import { getPrograms } from "@/server/actions/programs";
import { getPatients, getApplications } from "@/server/actions/patient";
import { listContacts } from "@/server/actions/contacts";
import { auth } from "@/server/auth";

import { DashboardClient } from "./_components/dashboard-client";

interface Props {
  params: Promise<{ patientId: string }>;
}

export default async function Page({ params }: Props) {
  const { patientId } = await params;
  const data = await auth();
  const accessToken = data?.user.token;
  if (!accessToken) notFound();

  const patients = await getPatients(accessToken);
  const patient = patients?.find((p) => p.id === patientId);
  if (!patient) notFound();

  const programs = await getPrograms(accessToken, patientId);

  const applicationsArr = await Promise.all(
    (programs ?? []).map(async (p) => ({
      programId: p.id,
      programName: p.name,
      applications: (await getApplications(accessToken, p.id)) ?? [],
    }))
  );

  const contacts = await listContacts(patientId, accessToken);

  const totalPrograms = programs?.length ?? 0;
  const completedApplications = applicationsArr.reduce(
    (sum, { applications }) => sum + applications.length,
    0
  );

  const recentActivity = applicationsArr
    .flatMap(({ programName, applications }) =>
      applications.map((a) => ({
        id: a.id,
        user: patient.name,
        action: "Registrou aplicação",
        program: programName,
        time: format(
          new Date(a.updated_at ?? a.created_at),
          "yyyy-MM-dd HH:mm"
        ),
      }))
    )
    .sort((a, b) => (a.time < b.time ? 1 : -1))
    .slice(0, 10);

  return (
    <DashboardClient
      patient={patient}
      metrics={{
        totalPrograms,
        completedApplications,
        contacts: contacts.length,
        activities: recentActivity.length,
      }}
      programs={programs ?? []}
      contacts={contacts}
      recentActivity={recentActivity}
    />
  );
}
