import ProgramForm from "@/components/forms/program-form";


interface PageProps {
  params: Promise<{ organizationId: string; patientId: string }>;

}

export default async function Page({ params }: PageProps) {
  const {patientId } = await params


  return (
    <>
      <ProgramForm patientId={patientId}/>
    </>
  );
}
