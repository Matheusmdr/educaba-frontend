"use client";

import { useEffect, useState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Program } from "@/types/program";
import {
  createRecord,
  updateRecord,
  RecordFormValues,
} from "@/server/actions/record";
import { RecordSchema } from "@/schemas/record";
import { BackButton } from "../back-button";

interface RecordEntry {
  id: string;
  goal_id: string;
  inputs: { name: string; value: string | number }[];
}

interface Props {
  program: Program;
  record?: RecordEntry;
}
export default function ProgramRecordForm({ program, record }: Props) {
  const { data } = useSession();
  const token = data?.user.token ?? "";
  const [goals, setGoals] = useState<{ id: string; name: string }[]>([]);

  const parentSetId = record
    ? program.sets.find((s) => s.goals.some((g) => g.id === record.goal_id))
        ?.id ?? ""
    : "";

  const baseInputs = Object.fromEntries(
    program.inputs.map((i) => [i.name, i.type === "number" ? 0 : ""])
  );
  const defaultInputs = record
    ? record.inputs.reduce(
        (acc, cur) => ({ ...acc, [cur.name]: cur.value }),
        baseInputs
      )
    : baseInputs;

  const methods = useForm<RecordFormValues>({
    resolver: zodResolver(RecordSchema),
    defaultValues: {
      setId: parentSetId ?? "",
      goalId: record?.goal_id ?? "",
      inputs: defaultInputs,
    },
  });

  const { control, watch, setValue, handleSubmit } = methods;
  const selectedSet = watch("setId");

  useEffect(() => {
    const foundSet = program.sets.find((s) => s.id === selectedSet);
    const newGoals = foundSet ? foundSet.goals : [];

    setGoals(newGoals);

    const currentGoal = watch("goalId");
    console.log("newGoals", newGoals);

    if (currentGoal && !newGoals.some((g) => g.id === currentGoal)) {
      setValue("goalId", "");
    }
  }, [selectedSet, program.sets, setValue, methods, watch]);

  const onSubmit = (values: RecordFormValues) =>
    startTransition(async () => {
      try {
        if (record?.id) {
          await updateRecord(token, record.id, program.id, values);
          toast.success("Registro atualizado!");
        } else {
          await createRecord(token, program.id, values);
          toast.success("Registro criado!");
        }
      } catch {
        toast.error("Falha ao salvar registro");
      }
    });

  return (
    <Form {...methods}>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              {record ? "Editar Registro" : "Novo Registro"} – {program.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={control}
              name="setId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conjunto</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {program.sets.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="goalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!goals.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {goals.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {program.inputs.map((input) => (
              <FormField
                key={input.name}
                control={control}
                name={`inputs.${input.name}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{input.name}</FormLabel>
                    <FormControl>
                      {input.type === "number" ? (
                        <Input type="number" {...field} />
                      ) : (
                        <Input type="text" {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-end gap-2 items-center mt-4">
              <BackButton label="Cancelar" />
              <Button
                type="submit"
                className="bg-blue-primary hover:bg-blue-primary/90"
              >
                {record ? "Atualizar Registro" : "Salvar Registro"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
