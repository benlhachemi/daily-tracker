import { Dialog, DialogClose, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Box, Check, Cpu, LoaderCircle, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "./ui/progressive-blur";
import Image from "next/image";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useState } from "react";
import { useHabits } from "@/hooks/use-habits";
import { HABIT_COLOR_CLASSES, HabitColor } from "@/db/schemas/habit.schema";

interface CreateProjectDialogProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateProjectDialog({ isOpen, setOpen }: CreateProjectDialogProps) {
  const [isLoading, setLoading] = useState<boolean>(false)
  const { addHabit } = useHabits()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());

    data.goal = Number(data.goal);
    data.isArchived = false;
    data.archivedAt = '';

    await addHabit(data)
    setLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className='overflow-hidden p-0'>
        {/* Top Fade Effect */}
        <div className="absolute top-0 z-20 w-full h-20 bg-linear-to-b from-background/60 to-transparent pointer-events-none" />

        {/* Progressive blur (bottom) */}
        <ProgressiveBlur className="z-0 h-40! lg:h-28!" preset="sm" />

        <form onSubmit={handleSubmit} className="h-130 lg:h-160">
          {/* Content */}
          <div className="pt-root-3xl pb-28 flex flex-col h-full overflow-y-scroll no-scrollbar space-y-8 px-root-lg">
            <Content />
          </div>

          {/* Footer */}
          <DialogFooter
            className="w-full h-fit absolute bottom-0 left-0 px-root-lg py-root-md bg-linear-to-b from-transparent to-background"
          >
            <DialogClose className='w-full sm:w-fit'><Button variant='outline' className='w-full'>Cancel</Button></DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (<><LoaderCircle className="animate-spin" />Creating...</>) : <><Plus />Create Habit</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Content() {
  const [name, setName] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-center justify-center gap-root-lg text-center px-root-md">
      {/* Logo */}
      <div className="relative w-60 h-40 z-10">
        <Image
          alt='illustration'
          src='/images/backpack.png'
          width={500}
          height={500}
          className='object-cover object-center absolute z-10 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 rounded-3xl size-28 shadow-sm'
        />
        <div className="absolute z-0 top-2/4 left-3/4 -translate-x-2/6 -translate-y-3/5 mt-1 rounded-3xl size-24 blur-[0.7px] rotate-3">
          <Image
            alt='illustration'
            src='/images/chocolate.png'
            width={500}
            height={500}
            className='object-cover object-center rounded-3xl motion-preset-oscillate motion-duration-15000 motion-delay-150 motion-ease-linear'
          />
        </div>
        <div className="absolute z-0 top-2/4 left-1/4 -translate-x-4/6 -translate-y-3/5 mt-1 rounded-3xl size-24 blur-[0.7px] -rotate-3">
          <Image
            alt='illustration'
            src='/images/lamp2.png'
            width={500}
            height={500}
            className='object-cover object-center rounded-3xl motion-preset-oscillate motion-duration-10000 motion-ease-linear'
          />
        </div>
      </div>

      {/* Header */}
      <div className="space-y-root-sm">
        <div className="text-xl font-semibold max-w-52 tracking-tighter">Create a new <span className="text-primary">habit</span></div>
        <p className="tracking-tight text-muted-foreground">Small steps lead to big changes!</p>
      </div>

      {/* fields */}
      <div className="space-y-root-xl px-px mt-root-md w-full">
        {/* Habit Name */}
        <Field>
          <Label>What's your habit's name?<span className="text-red-500 -ml-1">*</span></Label>
          <InputGroup>
            <InputGroupInput
              placeholder="Workout, Read book..."
              required
              maxLength={30}
              onChange={e => setName(e.target.value)}
              name="name"
            />
            <InputGroupAddon align="inline-end">
              {name ? name.length : 0}/30
            </InputGroupAddon>
          </InputGroup>
        </Field>

        {/* Color */}
        <Field>
          <Label className="tracking-tight">Choose a color for your habit<span className="text-red-500 -ml-1">*</span></Label>
          <RadioGroup
            name="color"
            required
            className='flex items-center flex-wrap'
            defaultValue={HabitColor.red}
          >
            {Object.values(HabitColor).map(color => (
              <FieldLabel key={color} htmlFor={color}>
                <div className={cn("rounded-full size-7 cursor-pointer has-data-checked:outline-2 outline-offset-3 flex items-center justify-center", HABIT_COLOR_CLASSES[color])}>
                  {/* Don't remove this - if you do, the radio item will stop working */}
                  <RadioGroupItem value={color} id={color} className='hidden' />

                  {/* Check Icon */}
                  <Check className="size-3 peer-data-unchecked:hidden text-white animate-in zoom-in fade-in ease-out duration-150" />
                </div>
              </FieldLabel>
            ))}
          </RadioGroup>
        </Field>

        {/* Emoji */}
        <Field>
          <Label>Pick an emoji to represent your habit<span className="text-red-500 -ml-1">*</span></Label>
          <Input name="emoji" placeholder="😁🚀✅💻⚙️⚡" required />
        </Field>

        {/* Goal */}
        <Field>
          <Label>Set a daily goal for your habit<span className="text-red-500 -ml-1">*</span></Label>
          <div className="flex items-center gap-root-sm">
            <Input
              name="goal"
              placeholder="e.g., 30"
              type="number"
              required
            />
            <Input
              name="unit"
              placeholder="e.g., calories, km, minutes"
              required
            />
          </div>
        </Field>
      </div>
    </div>
  )
}