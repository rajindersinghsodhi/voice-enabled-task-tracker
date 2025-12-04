"use client"

import Task from "./Task"

export type TaskType = {
  title: string
  priority: "low" | "medium" | "high"
  dueDate: string // YYYY-MM-DD
  status: "todo" | "done"
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
    <div className="todo-list flex flex-col items-center w-full gap-3">
        <p className="text-lg font-medium">Todo</p>
        <div className="task-list flex flex-col gap-4 w-full items-center border shadow-md p-5 rounded-md">
            {tasks.map((task, index) => (
                <Task
                    key={`${task.title}-${index}`}
                    title={task.title}
                    priority={task.priority}
                    dueDate={task.dueDate}
                    status={task.status}
                />
            ))}
        </div>
    </div>
  )
}

export default TodoList
