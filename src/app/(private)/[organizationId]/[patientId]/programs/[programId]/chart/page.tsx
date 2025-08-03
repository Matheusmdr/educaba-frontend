import { DynamicStackedBarChart } from "@/components/dynamic-stacked-bar-chart";
import { getApplications } from "@/server/actions/patient";
import { auth } from "@/server/auth";
import { AppParams } from "@/types/app";

interface PageProps {
  params: Promise<AppParams>;
}

export default async function Page({ params }: PageProps) {
  const { programId } = await params;
  const session = await auth();

  const applicationsPromise = getApplications(session?.user.token, programId);
  return (
    <div className="min-h-screen flex flex-col items-center py-8">
      <div className="w-full px-4">
        <header className="flex flex-col items-start mb-4">
          <h1  className="mb-1 text-2xl font-semibold text-text-title">Gráfico do Programa</h1>
          <p className="text-sm text-muted-foreground">
            Visualize os dados do aplicativo do seu programa com o gráfico
            interativo abaixo.
          </p>
        </header>
        <div className="bg-white rounded-lg p-6">
          <DynamicStackedBarChart applicationsPromise={applicationsPromise} />
        </div>
      </div>
    </div>
  );
}
