import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "./ui/dialog";

interface ArchivedHabitCardProps {
  name: string;
  date: string;
  onRestore: () => {}
  onDelete: () => {}
}

export function ArchivedHabitCard({ date, name, onRestore, onDelete }: ArchivedHabitCardProps) {
  return (
    <Card className="opacity-70 hover:opacity-100 transition-all ease-default">
      <CardHeader>
        <CardTitle className="flex gap-root-sm items-baseline">
          <div aria-label="habit-name">{name}</div>
          <div aria-label="archive-date" className="text-xs text-muted-foreground">{date}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-root-sm">
        <Button variant='outline' onClick={onRestore}><RotateCcw />Restore</Button>
        {/* Delete */}
        <Dialog>
          <DialogTrigger>
            <Button variant='destructive'><Trash />Delete</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>This action cannot be undone. This will permanently delete this habit and all its data.</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose><Button variant='outline'>Cancel</Button></DialogClose>
              <Button onClick={onDelete} variant='destructive'>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}