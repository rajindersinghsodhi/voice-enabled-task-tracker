import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import SortableTask from "./SortableTask"
import { useAppSelector } from "@/store/hooks"

export default function TodoList() {
  const tasks = useAppSelector((state) => state.tasks.todos)
  const { setNodeRef } = useDroppable({ id: "todo" })

  return (
    <div ref={setNodeRef} className="flex-1">
      <div className="p-4 rounded-lg h-full border shadow-md flex flex-col">
        <p className="font-bold mb-4 text-lg">Todo</p>
        { tasks.length === 0 ? (
          <div className="flex justify-center items-center h-full min-w-60">
            <p className="text-sm text-gray-500">No tasks to do</p>
          </div>
        ): (
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto hide-scrollbar">
          <SortableContext
            items={tasks.map(t => t.taskId)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map(task => (
              <SortableTask
                key={task.taskId}
                task={task}
              />
            ))}
          </SortableContext>
        </div>
        )}
      </div>
    </div>
  )
}