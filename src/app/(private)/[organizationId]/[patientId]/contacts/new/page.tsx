import ContactForm, {
  ContactFormValues,
} from "@/components/forms/contact-form";
import { AppParams } from "@/types/app";

interface PageProps {
  params: Promise<AppParams>;
}

export default async function Page({ params }: PageProps) {
  const { patientId } = await params;
  const defaults: ContactFormValues = {
    name: "",
    cpf: "",
    relationship: "other",
    email: "",
    phone_primary: "",
    phone_secondary: "",
    patient_id: patientId ?? "",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Novo Contato</h1>
      <ContactForm defaultValues={defaults} />
    </div>
  );
}
