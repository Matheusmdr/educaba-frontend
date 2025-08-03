"use client";

import { DataTable } from "@/components/data-table";
import { useContactColumns } from "@/components/data-table/columns/contact-columns";
import { Contact } from "@/types/contact";
import { use } from "react";

interface ContactListProps {
  contactsPromise: Promise<Contact[] | null>;
  filter?: string;
}

export default function ContactList({
  contactsPromise,
  filter,
}: ContactListProps) {
  const columns = useContactColumns();

  const contacts = use(contactsPromise);

  const filteredContacts = contacts?.filter((contact) =>
    contact.name.toLowerCase().includes(filter ?? "")
  );

  return (
    <div className="mt-6 space-y-4">
      <DataTable columns={columns} data={filteredContacts ?? []} />
    </div>
  );
}
