"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { TaskType } from "./Task"
import SortableTask from "./SortableTask"

type DoneListProps = {
  tasks: TaskType[]
}

const DoneList = ({ tasks }: DoneListProps) => {
  return (
    <div className="flex-1 p-4 rounded-lg  overflow-y-auto border-2 border-blue-500">
      {/* <h2 className="font-bold mb-4 text-lg">Done</h2>
      <SortableContext items={tasks.map(t => t.title)} strategy={verticalListSortingStrategy}>
        {tasks.map(task => (
          <SortableTask key={task.title} task={task} />
        ))}
      </SortableContext> */}
    </div>
  )
}

export default DoneList
