"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { patientSchema } from "@/schemas/patient";
import {
  createPatientAction,
  editPatientAction,
} from "@/server/actions/patient";
import Image from "next/image";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Patient } from "@/types/patient";

interface PatientFormProps {
  organizationId: string;
  patient?: Patient | undefined;
}

type PatientFormValues = z.infer<typeof patientSchema>;

export function PatientForm({ organizationId, patient }: PatientFormProps) {
  const session = useSession();
  const [isPending, startTransition] = useTransition();
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: patient?.name || "",
      sex: patient?.sex || "",
      birth_date: patient?.birth_date || "",
      image: { file: undefined, preview: patient?.image },
      organization_id: organizationId,
    },
  });

  const onSubmit = (data: PatientFormValues) => {
    startTransition(async () => {
      try {
        if (!patient) {
          createPatientAction(
            {
              ...data,
              organization_id: organizationId,
              image: data.image.file || undefined,
            },
            session.data?.user.token
          );
        } else {
          editPatientAction(
            {
              ...data,
              id: patient.id,
              organization_id: organizationId,
              image: data.image.file || undefined,
            },
            session.data?.user.token
          );
        }

        form.reset();
        toast.success("Paciente criado com sucesso!");
      } catch (error) {
        toast.error("Erro ao criar paciente");
        console.error("Erro ao criar paciente", error);
      }
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const preview = URL.createObjectURL(file);
        form.setValue("image", { file, preview }, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="border border-[#eaeaea] rounded-lg bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-[#eaeaea]">
            <h2 className="text-base font-medium">Informações Básicas</h2>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Foto do Paciente
                      </FormLabel>
                      <div className="space-y-4">
                        {field.value.preview && (
                          <div className="flex items-center gap-4 p-4 border border-[#eaeaea] rounded-lg bg-[#fafafa]">
                            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#eaeaea]">
                              <Image
                                src={field.value.preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                width={64}
                                height={64}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                Foto selecionada
                              </p>
                              <p className="text-xs text-[#666]">
                                Preview da imagem do paciente
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                form.setValue(
                                  "image",
                                  { file: undefined, preview: "" },
                                  { shouldValidate: true }
                                );
                              }}
                              className="border-[#eaeaea] text-[#666] hover:text-black"
                            >
                              Remover
                            </Button>
                          </div>
                        )}
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border-[#eaeaea] focus-visible:ring-black"
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-xs text-[#666]">
                        Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 2MB.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nome Completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex.: Claudio Bezerra Silva"
                          {...field}
                          className="border-[#eaeaea] focus-visible:ring-black"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-[#666]">
                        Digite o nome completo do paciente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm font-medium">
                          Sexo
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="border-[#eaeaea] focus:ring-black w-full">
                              <SelectValue placeholder="Selecione o sexo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Masculino</SelectItem>
                              <SelectItem value="female">Feminino</SelectItem>
                              <SelectItem value="other">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-medium">
                          Data de Nascimento
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal border-[#eaeaea] focus:ring-black",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "dd/MM/yyyy")
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                date && field.onChange(date.toISOString())
                              }
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-black hover:bg-black/90 text-white"
                  >
                    {isPending ? "Salvando..." : "Cadastrar Paciente"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
