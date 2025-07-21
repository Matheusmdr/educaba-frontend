'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

import { ChevronLeft, Plus, Trash2, Settings, Target, SlidersHorizontal } from 'lucide-react'
import { useForm, useFieldArray, Control } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, startTransition } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { createProgram, updateProgram } from '@/server/actions/programs'
import { createProgramSetStatus, deleteProgramSetStatus, listProgramSetStatus } from '@/server/actions/program‑set‑status'
import { Program } from '@/types/program'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

const InputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.enum(['number', 'text']),
})
const GoalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
})
const SetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  program_set_status_id: z.string().min(1),
  goals: z.array(GoalSchema).min(1),
})
const FormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  inputs: z.array(InputSchema).min(1),
  sets: z.array(SetSchema).min(1),
})
type FormValues = z.infer<typeof FormSchema>
const typeLabel = { number: 'Numérico', text: 'Texto' } as const
const typeBadge = { number: 'default', text: 'secondary' } as const

/* ═════════ StatusDialog ═════════ */
function StatusDialog({
  open,
  onOpenChange,
  statuses,
  setStatuses,
  token,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  statuses: { id: string; name: string }[]
  setStatuses: (s: { id: string; name: string }[]) => void
  token: string
}) {
  const [newName, setNewName] = useState('')

  const add = () =>
    startTransition(async () => {
      if (!newName.trim()) return
      try {
        const created = await createProgramSetStatus({
          accessToken: token,
          name: newName,
        })
        setStatuses([...statuses, created])
        setNewName('')
      } catch {
        toast.error('Erro ao criar status')
      }
    })

  const remove = (id: string) =>
    startTransition(async () => {
      try {
        await deleteProgramSetStatus(token, id)
        setStatuses(statuses.filter(s => s.id !== id))
      } catch {
        toast.error('Erro ao remover status')
      }
    })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar status</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {statuses.map(s => (
            <div key={s.id} className="flex items-center justify-between">
              <span className="truncate">{s.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(s.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2">
            <Input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Novo status"
              className="flex-1"
            />
            <Button onClick={add} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ═════════ SetCard ═════════ */
interface SetCardProps {
  index: number
  control: Control<FormValues>
  removeSet: (idx: number) => void
  statuses: { id: string; name: string }[]
}
function SetCard({ index, control, removeSet, statuses }: SetCardProps) {
  const { fields: goals, append, remove } = useFieldArray({
    control,
    name: `sets.${index}.goals`,
  })

  return (
    <Card className="relative border">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => removeSet(index)}
        className="absolute -right-3 -top-3 rounded-full bg-background shadow text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <CardHeader className="pb-4 space-y-4">
        {/* Nome do conjunto */}
        <FormField
          control={control}
          name={`sets.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Conjunto</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome do conjunto" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={control}
          name={`sets.${index}.program_set_status_id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => (
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
      </CardHeader>

      <CardContent className="space-y-3">
        {goals.map((goal, gIdx) => (
          <div key={goal.id ?? gIdx} className="flex items-center gap-3 group">
            <FormField
              control={control}
              name={`sets.${index}.goals.${gIdx}.name`}
              render={({ field }) => (
                <Input {...field} placeholder="Meta" className="flex-1" />
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(gIdx)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ name: '' })}
          className="w-full border border-dashed"
        >
          <Plus className="mr-2 h-3 w-3" />
          Adicionar meta
        </Button>
      </CardContent>
    </Card>
  )
}

/* ═════════ Main component ═════════ */
interface Props {
  patientId: string
  program?: Program
}

export default function ProgramForm({ patientId, program }: Props) {
  const { data } = useSession()
  const token = data?.user.token ?? ''
  const [statuses, setStatuses] = useState<{ id: string; name: string }[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  /* carregar status */
  useEffect(() => {
    if (!token) return
    listProgramSetStatus(token)
      .then(setStatuses)
      .catch(() => toast.error('Falha ao carregar status'))
  }, [token])

  /* react-hook-form */
  const methods = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: '', inputs: [], sets: [] },
  })
  const { control, handleSubmit, reset, formState } = methods
  const { isSubmitting } = formState

  const { fields: inputs, append: addInput, remove: delInput } = useFieldArray({
    control,
    name: 'inputs',
  })
  const { fields: sets, append: addSet, remove: delSet } = useFieldArray({
    control,
    name: 'sets',
  })

  /* se vier programa para editar, mapeia status name -> id */
  useEffect(() => {
    if (!program || !statuses.length) return
    const mappedSets = program.sets.map(s => ({
      ...s,
      program_set_status_id:
        statuses.find(st => st.name === s.status)?.id ?? '',
    }))
    reset({ ...program, sets: mappedSets, inputs: [] })
  }, [program, statuses, reset])

  const onSubmit = (values: FormValues) => {
    const payload = { ...values, patient_id: patientId, accessToken: token }
    startTransition(async () => {
      try {
        if (values.id) {
          await updateProgram(values.id, payload)
          toast.success('Programa atualizado!')
        } else {
          await createProgram(payload)
          toast.success('Programa criado!')
        }
      } catch {
        toast.error('Erro ao salvar programa')
      }
    })
  }

  return (
    <>
      {/* dialog */}
      <StatusDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        statuses={statuses}
        setStatuses={setStatuses}
        token={token}
      />

      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto max-w-5xl space-y-8 p-6">
            {/* header */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold">
                  {program ? 'Editar Programa' : 'Novo Programa'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {program
                    ? 'Altere as informações do programa'
                    : 'Configure a estrutura do programa'}
                </p>
              </div>
            </div>

            {/* info básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Programa</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite o nome" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* inputs */}
            <Card>
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Settings className="h-4 w-4 text-blue-600" />
                        </div>
                        <CardTitle>Campos</CardTitle>
                      </div>
                      <Badge variant="secondary">{inputs.length}</Badge>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {inputs.map((input, idx) => (
                      <div
                        key={input.id ?? idx}
                        className="relative rounded-lg border p-4"
                      >
                        {/* Nome */}
                        <FormField
                          control={control}
                          name={`inputs.${idx}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Campo" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Tipo */}
                        <FormField
                          control={control}
                          name={`inputs.${idx}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="number">
                                      Numérico
                                    </SelectItem>
                                    <SelectItem value="text">
                                      Texto
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* badge + delete */}
                        <Badge
                          variant={typeBadge[input.type as 'number' | 'text']}
                          className="absolute top-2 right-11"
                        >
                          {typeLabel[input.type as 'number' | 'text']}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => delInput(idx)}
                          className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addInput({ name: '', type: 'number' })}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar campo
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* sets */}
            <Card>
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <Target className="h-4 w-4 text-green-600" />
                        </div>
                        <CardTitle>Conjuntos</CardTitle>
                      </div>

                      {/* botão GERENCIAR STATUS aqui faz mais sentido */}
                      <div className="flex gap-3">
                        <Badge variant="secondary">{sets.length}</Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDialogOpen(true)}
                          className="shrink-0"
                        >
                          <SlidersHorizontal className="mr-2 h-4 w-4" />
                          Gerenciar status
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    {sets.map((set, idx) => (
                      <SetCard
                        key={set.id ?? idx}
                        index={idx}
                        control={control}
                        removeSet={delSet}
                        statuses={statuses}
                      />
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        addSet({
                          name: '',
                          program_set_status_id: '',
                          goals: [{ name: '' }],
                        })
                      }
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar conjunto
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-11"
              >
                {program ? 'Atualizar' : 'Salvar'} Programa
              </Button>
              <Button type="button" variant="outline" className="h-11">
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}