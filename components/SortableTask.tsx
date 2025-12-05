import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Task, { TaskType } from "./Task"

const SortableTask = ({ task }: { task: TaskType }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.taskId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <Task {...task} dragHandleProps={listeners} />
    </div>
  )
}

export default SortableTask