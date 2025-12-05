import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CircleCheckBig, Edit2 } from "lucide-react"
import { format } from "date-fns"

export type TaskType = {
  taskId: string,
  title: string
  priority: "low" | "medium" | "high"
  dueDate: string // YYYY-MM-DD
  status: "todo" | "done"
}

type TaskProps = TaskType & {
  onEdit?: (task: TaskType) => void
}

const priorityStyles = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-700"
}

const statusStyles = {
  todo: "",
  done: "bg-green-50 border border-green-200"
}

const Task = ({ taskId, title, priority, dueDate, status, onEdit }: TaskProps) => {
  const isDone = status === "done"

  return (
    <Card className={`w-full ${isDone ? "opacity-80" : ""} ${statusStyles[status]}`}>
        <CardContent className="flex w-full justify-between items-center gap-2 text-muted-foreground p-3">
          <div className="task flex flex-col gap-2 items-start">
            <p>{title}</p>
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} />
              <span>{format(new Date(dueDate), "dd MMM yyyy")}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Badge className={priorityStyles[priority]}>{priority.toUpperCase()}</Badge>
            {isDone && <CircleCheckBig height={16} strokeWidth={3} />}
            {onEdit && (
              <button onClick={() => onEdit({ taskId, title, priority, dueDate, status })}>
                <Edit2 size={16} />
              </button>
            )}
          </div>
      </CardContent>
    </Card>
  )
}

export default Task
