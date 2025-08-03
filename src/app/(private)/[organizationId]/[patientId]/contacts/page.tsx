import { listContacts } from "@/server/actions/contacts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppParams } from "@/types/app";
import { auth } from "@/server/auth";
import ContactList from "./_components/contact-list";
import { SearchInput } from "@/components/search-input";

interface Props {
  params: Promise<AppParams>;
  searchParams: Promise<{ contactName?: string }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { patientId } = await params;
  const session = await auth();

  const { contactName } = await searchParams;

  const contacts = listContacts(patientId ?? "", session?.user.token);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full">
       <h1 className="mb-4 text-2xl font-semibold text-text-title">
          Contatos
        </h1>
        <div className="flex gap-2 items-center justify-between h-12">
          <div>
            <SearchInput
              placeholder="Pesquisar por nome"
              defaultValue={contactName}
              searchParamName="contactName"
              showSearchButton={true}
              className="flex-1"
            />
          </div>
          <Button asChild className="bg-blue-primary hover:bg-blue-primary/90">
            <Link href={`/patients/${patientId}/contacts/new`}>
              Adicionar Contato
            </Link>
          </Button>
        </div>
        <ContactList contactsPromise={contacts} filter={contactName} />
      </div>
    </div>
  );
}
