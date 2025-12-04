"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities" // ✅ Correct import
import Task, { TaskType } from "./Task"

type SortableTaskProps = {
  task: TaskType
}

const SortableTask = ({ task }: SortableTaskProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.title })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "12px",
    zIndex: 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Task {...task} />
    </div>
  )
}

export default SortableTask
