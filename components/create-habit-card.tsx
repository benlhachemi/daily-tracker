'use client'

import { useState } from "react"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { CreateProjectDialog } from "./create-project-dialog"
import { Card } from "./ui/card"

export function CreateHabitCard() {
  const [createProjectOpen, setCreateProjectOpen] = useState<boolean>(false)

  return (
    <>
      <CreateProjectDialog isOpen={createProjectOpen} setOpen={setCreateProjectOpen} />
      <Card className="w-full h-full min-h-40 border-2 shadow-none! border-dashed bg-transparent flex items-center justify-center">
        <Button size='icon-lg' variant='outline' onClick={() => setCreateProjectOpen(true)}><Plus /></Button>
      </Card>
    </>
  )
}