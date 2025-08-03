/* components/status-dialog.tsx */
"use client"

import { useState, startTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"

interface Status {
  id: string
  name: string
  color: string
}

interface Props {
  open: boolean
  onClose: () => void
  statuses: Status[]
  setStatuses: (s: Status[]) => void
  token: string
}

export default function StatusDialog({
  open,
  onClose,
  statuses,
  setStatuses,
  token,
}: Props) {
  const [newName, setNewName] = useState("")

  const createStatus = () =>
    startTransition(async () => {
      if (!newName.trim()) return
      const res = await fetch("https://ellyzeul.com/api/program-set-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      })
      const json: Status = await res.json()
      setStatuses([...statuses, json])
      setNewName("")
    })

  const removeStatus = (id: string) =>
    startTransition(async () => {
      await fetch(`https://ellyzeul.com/api/program-set-status/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setStatuses(statuses.filter(s => s.id !== id))
    })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {statuses.map(s => (
            <div key={s.id} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeStatus(s.id)}
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
            />
            <Button onClick={createStatus}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
