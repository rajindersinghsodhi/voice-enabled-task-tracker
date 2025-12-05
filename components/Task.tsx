import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CircleCheckBig, Edit2, Trash2, GripVertical } from "lucide-react"
import { format } from "date-fns"
import { useAppDispatch } from "@/store/hooks"
import { deleteTask } from "@/store/tasksSlice"
import { useState } from "react"
import TaskInput from "./TaskInput"

export type TaskType = {
  taskId: string,
  title: string
  priority: "low" | "medium" | "high"
  dueDate: string // YYYY-MM-DD
  status: "todo" | "done"
}

type TaskProps = TaskType & {
  dragHandleProps?: any
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

const Task = ({ taskId, title, priority, dueDate, status, dragHandleProps }: TaskProps) => {
  const dispatch = useAppDispatch()
  const isDone = status === "done"
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    console.log("Delete clicked for taskId:", taskId)
    if (!taskId) {
      console.error("TaskId is undefined!")
      return
    }
    if (window.confirm("Are you sure you want to delete this task?")) {
      console.log("Dispatching delete for:", taskId)
      dispatch(deleteTask(taskId))
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setEditDialogOpen(true)
  }

  return (
    <>
      <Card className={`w-full ${isDone ? "opacity-80" : ""} ${statusStyles[status]}`}>
        <CardContent className="flex w-full justify-between items-center gap-2 text-muted-foreground p-3">
          {/* Drag Handle */}
          <div 
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing hover:text-gray-700"
          >
            <GripVertical size={20} />
          </div>

          <div className="task flex flex-col gap-2 items-start flex-1">
            <p>{title}</p>
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} />
              <span>{format(new Date(dueDate), "dd MMM yyyy")}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Badge className={priorityStyles[priority]}>{priority.toUpperCase()}</Badge>
            {isDone && <CircleCheckBig height={16} strokeWidth={3} />}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleEdit}
                className="hover:text-blue-600 transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={handleDelete}
                className="hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <TaskInput 
        editTask={{ taskId, title, priority, dueDate, status }}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  )
}

export default Task