import { DynamicStackedBarChart } from "@/components/dynamic-stacked-bar-chart";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { AppParams } from "@/types/app";
import { Application } from "@/types/application";

async function getApplications(
  accessToken?: string,
  programId?: string
): Promise<Application[] | null> {
  if (!accessToken) return null;

  const res = await fetch(
    `${env.NEXT_PUBLIC_API_HOST}/api/application?program_id=${programId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "force-cache",
    }
  );

  if (!res.ok) {
    return null;
  }

  const applications: Application[] = await res.json();

  console.log(applications);

  return applications;
}

interface PageProps {
  params: Promise<AppParams>;
}

export default async function Page({ params }: PageProps) {
  const { programId } = await params;
  const session = await auth();

  const applicationsPromise = getApplications(session?.user.token, programId);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full max-w-6xl px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Gráfico do Programa
          </h1>
          <p className="mt-2 text-gray-600">
            Visualize os dados do aplicativo do seu programa com o gráfico
            interativo abaixo.
          </p>
        </header>
        <div className="bg-white shadow-md rounded-lg p-6">
          <DynamicStackedBarChart applicationsPromise={applicationsPromise} />
        </div>
      </div>
    </div>
  );
}
