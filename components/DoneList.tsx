import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import SortableTask from "./SortableTask"
import { TaskType } from "./Task"

interface DoneListProps {
  tasks: TaskType[]
}

export default function DoneList({ tasks }: DoneListProps) {
  const { setNodeRef } = useDroppable({ id: "done" })

  return (
    <div ref={setNodeRef} className="flex-1">
      <div className="p-4 rounded-lg h-full border shadow-md flex flex-col">
        <p className="font-bold mb-4 text-lg">
          Done <span className="text-sm font-normal text-gray-500">({tasks.length})</span>
        </p>
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto hide-scrollbar">
          <SortableContext
            items={tasks.map(t => t.taskId)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.length > 0 ? (
              tasks.map(task => (
                <SortableTask
                  key={task.taskId}
                  task={task}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No tasks found
              </div>
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  )
}