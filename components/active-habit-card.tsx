import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, Check, LoaderCircle, Pencil, RotateCcw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "./ui/dialog";
import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { HABIT_COLOR_CLASSES, HabitColor } from "@/db/schemas/habit.schema";
import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "./ui/progressive-blur";

interface ActiveHabitCardProps {
  name: string;
  emoji: string;
  habitName: string;
  color: HabitColor;
  goal: number;
  unit: string;
  onArchive: () => void;
  onDelete: () => void;
  onEdit: (data: { name: string; emoji: string; color: HabitColor; goal: number; unit: string }) => Promise<void>;
  onReset: () => void;
}

export function ActiveHabitCard({ name, emoji, habitName, color, goal, unit, onArchive, onDelete, onEdit, onReset }: ActiveHabitCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-root-sm">
        {/* Archive */}
        <Dialog>
          <DialogTrigger>
            <Button variant='outline'><Archive />Archive</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Archive this habit?</DialogTitle>
              <DialogDescription>You can restore this habit anytime from your archived habits.</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose><Button variant='outline'>Cancel</Button></DialogClose>
              <Button onClick={onArchive}>Archive</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger>
            <Button variant='outline'><Pencil />Edit</Button>
          </DialogTrigger>

          <EditDialogContent
            initialName={habitName}
            initialEmoji={emoji}
            initialColor={color}
            initialGoal={goal}
            initialUnit={unit}
            onEdit={onEdit}
            onClose={() => setEditOpen(false)}
          />
        </Dialog>

        <Dialog open={resetOpen} onOpenChange={setResetOpen}>
          <DialogTrigger>
            <Button variant='destructive'><RotateCcw />Reset Data</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset habit progress?</DialogTitle>
              <DialogDescription>This will permanently delete all your progress data for this habit. This action cannot be undone.</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose><Button variant='outline'>Cancel</Button></DialogClose>
              <Button
                onClick={() => {
                  onReset();
                  setResetOpen(false);
                }}
                variant='destructive'
              >
                Reset Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

interface EditDialogContentProps {
  initialName: string;
  initialEmoji: string;
  initialColor: HabitColor;
  initialGoal: number;
  initialUnit: string;
  onEdit: (data: { name: string; emoji: string; color: HabitColor; goal: number; unit: string }) => Promise<void>;
  onClose: () => void;
}

function EditDialogContent({ initialName, initialEmoji, initialColor, initialGoal, initialUnit, onEdit, onClose }: EditDialogContentProps) {
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState(initialName);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());
    data.goal = Number(data.goal);

    await onEdit(data);
    setLoading(false);
    onClose();
  };

  return (
    <DialogContent className='overflow-hidden p-0'>
      {/* Top Fade Effect */}
      <div className="absolute top-0 z-20 w-full h-20 bg-linear-to-b from-background/60 to-transparent pointer-events-none" />

      {/* Progressive blur (bottom) */}
      <ProgressiveBlur className="z-0 h-40! lg:h-28!" preset="sm" />

      <form onSubmit={handleSubmit} className="h-130 lg:h-140">
        {/* Content */}
        <div className="pt-root-3xl pb-28 flex flex-col h-full overflow-y-scroll no-scrollbar space-y-8 px-root-lg">
          <div className="flex flex-col items-center justify-center gap-root-lg text-center px-root-md">
            {/* Header */}
            <div className="space-y-root-sm">
              <div className="text-xl font-semibold max-w-52 tracking-tighter">Edit your <span className="text-primary">habit</span></div>
              <p className="tracking-tight text-muted-foreground">Make your habit work even better for you</p>
            </div>

            {/* Fields */}
            <div className="space-y-root-xl px-px mt-root-md w-full">
              {/* Habit Name */}
              <Field>
                <Label>Habit Name<span className="text-red-500 -ml-1">*</span></Label>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Workout, Read book..."
                    required
                    maxLength={30}
                    defaultValue={initialName}
                    onChange={e => setName(e.target.value)}
                    name="name"
                  />
                  <InputGroupAddon align="inline-end">
                    {name.length}/30
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              {/* Color */}
              <Field>
                <Label className="tracking-tight">Color<span className="text-red-500 -ml-1">*</span></Label>
                <RadioGroup
                  name="color"
                  required
                  className='flex items-center flex-wrap'
                  defaultValue={initialColor}
                >
                  {Object.values(HabitColor).map(color => (
                    <FieldLabel key={color} htmlFor={`edit-${color}`}>
                      <div className={cn("rounded-full size-7 cursor-pointer has-data-checked:outline-2 outline-offset-3 flex items-center justify-center", HABIT_COLOR_CLASSES[color])}>
                        <RadioGroupItem value={color} id={`edit-${color}`} className='hidden' />
                        <Check className="size-3 peer-data-unchecked:hidden text-white animate-in zoom-in fade-in ease-out duration-150" />
                      </div>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </Field>

              {/* Emoji */}
              <Field>
                <Label>Emoji<span className="text-red-500 -ml-1">*</span></Label>
                <Input name="emoji" placeholder="😁🚀✅💻⚙️⚡" defaultValue={initialEmoji} required />
              </Field>

              {/* Goal */}
              <Field>
                <Label>Daily Goal<span className="text-red-500 -ml-1">*</span></Label>
                <div className="flex items-center gap-root-sm">
                  <Input
                    name="goal"
                    placeholder="e.g. 30"
                    type="number"
                    defaultValue={initialGoal}
                    required
                  />
                  <Input
                    name="unit"
                    placeholder="Calories, Km, Min"
                    defaultValue={initialUnit}
                    required
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="w-full h-fit absolute bottom-0 left-0 px-root-lg py-root-md bg-linear-to-b from-transparent to-background">
          <Button type="button" variant='outline' onClick={onClose} className='w-full sm:w-fit'>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (<><LoaderCircle className="animate-spin" />Saving...</>) : <><Pencil />Save Changes</>}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}