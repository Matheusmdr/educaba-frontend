'use client'
import { MoreVertical } from 'lucide-react'
import { startTransition } from 'react'
import { toast } from 'sonner'
import { deleteContact } from '@/server/actions/contacts'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function ContactActions({
  patientId,
  contactId,
}: {
  patientId: string
  contactId: string
}) {

  const remove = () =>
    startTransition(async () => {
      try {
        await deleteContact(contactId, patientId)
        toast.success('Excluído!')
      } catch {
        toast.error('Erro ao excluir')
      }
    })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/patients/${patientId}/contacts/${contactId}/edit`}>
            Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={remove} className="text-destructive">
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export { ContactActions }