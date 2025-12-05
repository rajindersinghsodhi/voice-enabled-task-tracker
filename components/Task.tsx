import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CalendarIcon, CircleCheckBig, Edit2, Trash2, GripVertical } from "lucide-react"
import { format } from "date-fns"
import { useAppDispatch } from "@/store/hooks"
import { deleteTask } from "@/store/tasksSlice"
import { useState } from "react"
import TaskInput from "./TaskInput"

export type TaskType = {
  taskId: string,
  title: string
  priority: "low" | "high"
  dueDate: string
  status: "todo" | "done"
}

type TaskProps = TaskType & {
  dragHandleProps?: any
}

const priorityStyles = {
  low: "bg-white font-medium border shadow-[0_0_8px_rgba(0,0,0,0.3)] text-green-700",
  high: "bg-white font-medium border shadow-[0_0_8px_rgba(0,0,0,0.3)] text-red-700"
}

const Task = ({ taskId, title, priority, dueDate, status, dragHandleProps }: TaskProps) => {
  const dispatch = useAppDispatch();
  const isDone = status === "done";
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!taskId) {
      console.error("TaskId is undefined!")
      return
    }
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    dispatch(deleteTask(taskId))
    setDeleteDialogOpen(false)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setEditDialogOpen(true)
  }

  return (
    <>
      <Card className={`min-w-80 max-w-full`}>
        <CardContent className="flex w-full justify-between items-stretch gap-2 text-muted-foreground p-3">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing hover:text-gray-700 flex items-center">
            <GripVertical size={20} />
          </div>
          <div className="task flex flex-col gap-2 items-start justify-center flex-1">
            <p className="text-base">{title}</p>
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon size={16} />
              <span className={isDone ? "text-gray-400" : ""}>{format(new Date(dueDate), "dd MMM yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Priority:</p>
              <Badge className={priorityStyles[priority]}>{priority.toUpperCase()}</Badge>
            </div>
          </div>
          <div className={`flex flex-col self-stretch ${isDone ? 'justify-between items-end' : 'items-center justify-end gap-2'}`}>
            {isDone && (
              <div className="flex items-center gap-1 text-green-600">
                <CircleCheckBig height={18} strokeWidth={2.5} />
                <span className="text-xs font-medium">Done</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button  onClick={handleEdit} className="hover:text-blue-600 transition-colors">
                <Edit2 size={16} />
              </button>
              <button  onClick={handleDelete} className="hover:text-red-600 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      <TaskInput  editTask={{ taskId, title, priority, dueDate, status }} open={editDialogOpen} onOpenChange={setEditDialogOpen}/>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Task