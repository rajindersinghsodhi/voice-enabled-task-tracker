"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export type TaskType = {
  title: string
  priority: "low" | "medium" | "high"
  dueDate: string // YYYY-MM-DD
  status: "todo" | "done"
}

type TaskProps = TaskType

const priorityStyles = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-700"
}

const statusStyles = {
  todo: "",
  done: "bg-green-50 border border-green-200"
}

const Task = ({ title, priority, dueDate, status }: TaskProps) => {
  const isDone = status === "done"

  return (
    <Card className={`w-full max-w-md ${isDone ? "opacity-80" : ""} ${statusStyles[status]}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span className="truncate">{title}</span>

          <div className="flex gap-2 items-center">
            <Badge className={priorityStyles[priority]}>
              {priority.toUpperCase()}
            </Badge>
            {isDone && <Badge variant="secondary">DONE</Badge>}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center gap-2 text-muted-foreground">
        <CalendarIcon size={16} />
        <span>{format(new Date(dueDate), "dd MMM yyyy")}</span>
      </CardContent>
    </Card>
  )
}

export default Task
