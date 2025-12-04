"use client"

import Task from "./Task"
import { TaskType } from "./TodoList"

type DoneListProps = {
  doneTasks: TaskType[]
}

const DoneList = ({ doneTasks }: DoneListProps) => {
  if (!doneTasks.length) {
    return (
      <div className="text-center text-muted-foreground py-6">
        No completed tasks yet 🎉
      </div>
    )
  }

  return (
    <div className="done-list flex flex-col items-center w-full gap-3">
        <p className="text-lg font-medium">Done</p>
        <div className="task-list flex flex-col gap-4 w-full items-center border shadow-md p-5 rounded-md">
            {doneTasks.map((task, index) => (
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

export default DoneList
