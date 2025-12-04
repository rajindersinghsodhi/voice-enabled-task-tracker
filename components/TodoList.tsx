"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableTask from "./SortableTask"
import { TaskType } from "./Task"

type TodoListProps = {
  tasks: TaskType[]
}

const TodoList = ({ tasks }: TodoListProps) => {
  return (
    <div className="flex-1 bg-gray-50 p-4 rounded-lg min-h-[400px] max-h-[600px] overflow-y-auto">
      <h2 className="font-bold mb-4 text-lg">Todo</h2>
      <SortableContext items={tasks.map(t => t.title)} strategy={verticalListSortingStrategy}>
        {tasks.map(task => (
          <SortableTask key={task.title} task={task} />
        ))}
      </SortableContext>
    </div>
  )
}

export default TodoList
