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
      <div className="w-full max-w-6xl px-4">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-2xl font-semibold text-text-title">
            Gráfico do Programa
          </h1>
          <p className="mb-6 text-sm text-text-light">
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
