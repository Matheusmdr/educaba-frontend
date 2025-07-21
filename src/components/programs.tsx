"use client"

import { use, useTransition } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Calendar, MoreHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Program } from "@/types/program"
import { AppParams } from "@/types/app"
import { deleteProgram } from "@/server/actions/programs"
import { toast } from "sonner"

interface ProgramsProps {
  programsPromise: Promise<Program[] | null>
}

function Programs({ programsPromise }: ProgramsProps) {
  const programs = use(programsPromise)
  const router = useRouter()
  const params: AppParams = useParams()
  const { data } = useSession()
  const token = data?.user.token ?? ""
  const [isPending, startTransitionDel] = useTransition()

  const basePath = `/${params.organizationId}/${params.patientId}/programs`

  const handleDelete = (programId: string) =>
    startTransitionDel(async () => {
      try {
        await deleteProgram(token, programId, params.patientId ?? "")
        toast.success("Programa excluído!")
        router.refresh()
      } catch (err) {
        toast.error("Falha ao excluir programa")
        console.error(err)
      }
    })

  return (
    <div className="mt-6 space-y-4">
      {programs?.map(program => (
        <DropdownMenu key={program.id}>
          <Card
            className="flex flex-row items-center justify-between cursor-pointer hover:border-primary border-2 border-white rounded-md bg-white transition-colors"
            onClick={() => router.push(`${basePath}/${program.id}/records`)}
          >
            <CardContent className="flex w-full items-center justify-between gap-4 py-4">
              <div className="flex flex-col gap-2">
                <p className="font-medium text-gray-800">{program.name}</p>
                <p className="text-sm text-gray-500 inline-flex items-center gap-2">
                  <Calendar className="size-4" />
                  {new Date(program.updated_at).toLocaleDateString()}
                </p>
              </div>

              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={e => e.stopPropagation()}
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
            </CardContent>
          </Card>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`${basePath}/${program.id}/edit`)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`${basePath}/${program.id}/records`)}>
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`${basePath}/${program.id}/chart`)}>
              Ver gráfico
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              disabled={isPending}
              onSelect={() => handleDelete(program.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isPending ? "Excluindo…" : "Excluir"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  )
}

export { Programs }
