import ContactForm, {
  ContactFormValues,
} from "@/components/forms/contact-form";
import { listContacts } from "@/server/actions/contacts";
import { auth } from "@/server/auth";
import { AppParams } from "@/types/app";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<AppParams>;
}

export default async function Page({ params }: PageProps) {
  const { patientId, contactId } = await params;
  const session = await auth();
  const contacts = await listContacts(patientId ?? "", session?.user.token);
  const contact = contacts.find((c) => c.id === contactId);
  if (!contact) notFound();

  const defaults: ContactFormValues = {
    ...contact,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Editar Contato</h1>
      <ContactForm defaultValues={defaults} />
    </div>
  );
}
