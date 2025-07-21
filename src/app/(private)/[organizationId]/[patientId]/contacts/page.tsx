import { listContacts } from "@/server/actions/contacts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ContactActions } from "./_components/contact-actions";
import { Button } from "@/components/ui/button";
import { AppParams } from "@/types/app";
import { auth } from "@/server/auth";

interface Props {
  params: Promise<AppParams>;
}

export default async function Page({ params }: Props) {
  const { patientId } = await params;
  const session = await auth();

  const contacts = await listContacts(patientId ?? "", session?.user.token);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contatos</h1>
        <Button asChild>
          <Link href={`/patients/${patientId}/contacts/new`}>Novo contato</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>E‑mail</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.cpf}</TableCell>
              <TableCell>{c.phone_primary}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>
                <ContactActions patientId={patientId} contactId={c.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
