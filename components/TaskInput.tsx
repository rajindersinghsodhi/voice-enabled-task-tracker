"use client"

import { useState, useRef, useEffect } from "react"
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
import { CalendarIcon, Mic, Podcast } from "lucide-react"
import { cn } from "@/lib/utils"
import { TaskType } from "./Task"
import taskService from "@/services/taskService"
import { useAppDispatch } from "@/store/hooks"
import { createTask, updateTask } from "@/store/tasksSlice"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string(),
})

interface TaskInputProps {
  editTask?: TaskType | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const TaskInput = ({ editTask = null, open: controlledOpen, onOpenChange }: TaskInputProps) => {
  const dispatch = useAppDispatch()
  const [internalOpen, setInternalOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [date, setDate] = useState<Date | undefined>()
  const [error, setError] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)

  const isEditMode = !!editTask
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  // ✅ VOICE RECOGNITION REF
  const recognitionRef = useRef<any>(null)

  // Populate form when editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setPriority(editTask.priority)
      setDate(new Date(editTask.dueDate))
    } else {
      // Reset form when not editing
      setTitle("")
      setPriority("medium")
      setDate(undefined)
    }
  }, [editTask])

  // ✅ FUNCTION TO GET SPOKEN TEXT
  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser")
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = async (event: any) => {
      const sentence = event.results[0][0].transcript

      console.log(sentence)
      const { taskPayload } = await taskService.parseSpeechToTask({ speechText: sentence })

      console.log(taskPayload)

      if (taskPayload?.title) {
        setTitle(taskPayload.title)
      }

      if (taskPayload?.priority) {
        setPriority(taskPayload.priority)
      }

      if (taskPayload?.dueDate) {
        setDate(new Date(taskPayload.dueDate))
      }
    }

    recognition.onerror = (err: any) => {
      console.error("Voice error:", err)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
    recognitionRef.current = recognition
  }

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

    if (isEditMode && editTask) {
      // Update existing task
      dispatch(updateTask({
        taskId: editTask.taskId,
        updates: result.data
      }))
    } else {
      // Create new task
      const task: TaskType = { ...result.data, status: "todo" }
      dispatch(createTask(task))
    }

    setTitle("")
    setPriority("medium")
    setDate(undefined)
    setOpen(false)
  }

  useEffect(() => {
    console.log("listening is", isListening)
  }, [isListening])

  return (
    <div className="task-input-flex">
      <Dialog open={open} onOpenChange={setOpen}>
        {!isEditMode && (
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>
        )}

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit your task" : "Add your task below"}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center w-full">
            <Button
              size="icon"
              variant="outline"
              onClick={startVoiceRecognition}
              type="button"
              className={`p-5 rounded-full transition ${
                isListening ? "animate-pulse ring-2 ring-black ring-offset-2" : ""
              }`}
            >
              {!isListening ? (
                <Mic size={16} />
              ) : (
                <Podcast size={16} className="animate-bounce" />
              )}
            </Button>
          </div>
          <div className="grid gap-4">
            {/* TITLE */}
            <div className="grid gap-2">
              <Label>Title</Label>
              <div className="flex gap-2 items-center">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Buy groceries..."
                />
              </div>
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

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button onClick={submitTask}>
              {isEditMode ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskInput