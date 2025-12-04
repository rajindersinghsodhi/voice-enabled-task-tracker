"use client"

import { useState } from "react"
import { z } from "zod"
import { format } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Label } from "./ui/label"
import { Input } from "./ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { TaskType } from "./Task"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string(),
})

type TaskInputProps = {
  addTask: (task: TaskType) => void
}

const TaskInput = ({ addTask }: TaskInputProps) => {
  const [open, setOpen] = useState(false)   // ✅ CONTROL DIALOG
  const [title, setTitle] = useState("")
  const [priority, setPriority] =
    useState<"low" | "medium" | "high">("medium")
  const [date, setDate] = useState<Date | undefined>()
  const [error, setError] = useState<string | null>(null)

  const submitTask = () => {
    const payload = {
      title: title.trim(),
      priority,
      dueDate: format(date ?? new Date(), "yyyy-MM-dd"),
    }

    const result = taskSchema.safeParse(payload)

    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setError(null)

    const task: TaskType = { ...result.data, status: "todo" }

    addTask(task)

    // ✅ RESET FORM
    setTitle("")
    setPriority("medium")
    setDate(undefined)

    // ✅ CLOSE DIALOG
    setOpen(false)
  }

  return (
    <div className="task-input-flex">

      {/* ✅ CONTROLLED DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>

        <DialogTrigger asChild>
          <Button>Add Task</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add your task below</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">

            {/* TITLE */}
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Buy groceries..."
              />
            </div>

            {/* PRIORITY */}
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(val) =>
                  setPriority(val as "low" | "medium" | "high")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* DUE DATE */}
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-fit p-2" align="start">
                  <Calendar
                    className="w-full"
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* ERROR */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* SUBMIT */}
            <Button onClick={submitTask}>Create Task</Button>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskInput
