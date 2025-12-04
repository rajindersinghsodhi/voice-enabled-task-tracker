"use client"

import Task from "./Task"

export type TaskType = {
  title: string
  priority: "low" | "medium" | "high"
  dueDate: string // YYYY-MM-DD
}

type TodoListProps = {
  tasks: TaskType[]
}

const TodoList = ({ tasks }: TodoListProps) => {
  if (!tasks.length) {
    return (
      <div className="text-center text-muted-foreground py-6">
        No tasks yet. Add your first task ✅
      </div>
    )
  }

  return (
    <div className="todo-list flex flex-col items-center w-full">
        <p>Todo</p>
        <div className="task-list flex flex-col gap-4 w-full">
            {tasks.map((task, index) => (
                <Task
                key={`${task.title}-${index}`}
                title={task.title}
                priority={task.priority}
                dueDate={task.dueDate}
                />
            ))}
        </div>
    </div>
  )
}

export default TodoList
