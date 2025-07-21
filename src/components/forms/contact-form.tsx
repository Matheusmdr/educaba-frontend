"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { startTransition } from "react";
import { createContact, updateContact } from "@/server/actions/contacts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { withMask } from "use-mask-input";

const ContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  cpf: z.string().min(11).max(14),
  relationship: z.enum([
    "father",
    "mother",
    "relative",
    "responsible",
    "other",
  ]),
  email: z.string().email(),
  phone_primary: z.string().min(8),
  phone_secondary: z.string().optional(),
  patient_id: z.string().min(26).max(26),
});
export type ContactFormValues = z.infer<typeof ContactSchema>;

export default function ContactForm({
  defaultValues,
}: {
  defaultValues: ContactFormValues;
}) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues,
  });
  const { handleSubmit, formState } = form;
  const router = useRouter();
  const session = useSession();

  const onSubmit = (values: ContactFormValues) =>
    startTransition(async () => {
      try {
        if (values.id)
          await updateContact(values.id, values, session.data?.user.token);
        else await createContact(values, session.data?.user.token);
        toast.success("Contato salvo!");
        router.push(`/patients/${values.patient_id}/contacts`);
      } catch {
        toast.error("Erro ao salvar contato");
      }
    });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-lg space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome completo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl ref={withMask("99999999999")}>
                <Input {...field} placeholder="000.000.000-00" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parentesco</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Pai</SelectItem>
                    <SelectItem value="mother">Mãe</SelectItem>
                    <SelectItem value="relative">Parente</SelectItem>
                    <SelectItem value="responsible">Responsável</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone_primary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone 1</FormLabel>
                <FormControl ref={withMask("(99) 99999-9999")}>
                  <Input {...field} placeholder="(00) 00000‑0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_secondary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone 2</FormLabel>
                <FormControl ref={withMask("(99) 99999-9999")}>
                  <Input {...field} placeholder="Opcional" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E‑mail</FormLabel>
              <FormControl>
                <Input {...field} placeholder="email@exemplo.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full h-11"
        >
          Salvar
        </Button>
      </form>
    </Form>
  );
}
