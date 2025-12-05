"use client"

import { useEffect, useState } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

import Task, { TaskType } from "./Task"
import TaskInput from "./TaskInput"
import TodoList from "./TodoList"
import DoneList from "./DoneList"
import taskService from "@/services/taskService"

export default function Board() {
  const [todos, setTodos] = useState<TaskType[]>([])
  const [done, setDone] = useState<TaskType[]>([])
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  // LOAD TASKS
  useEffect(() => {
    const loadTasks = async () => {
      const data = await taskService.getTasks()
      setTodos(data.tasksTodo)
      setDone(data.tasksDone)
    }

    loadTasks()
  }, [])

  // DRAG START
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id

    const task =
      todos.find(t => t.taskId === id) ||
      done.find(t => t.taskId === id)

    if (task) setActiveTask(task)
  }

  // DRAG END
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      return
    }

    const activeId = active.id
    const overId = over.id

    const isFromTodo = todos.some(t => t.taskId === activeId)
    const isGoingToTodo =
      todos.some(t => t.taskId === overId) ||
      overId === "todo"

    // 🔁 REORDER IN SAME COLUMN
    if (isFromTodo === isGoingToTodo) {
      const list = isFromTodo ? todos : done
      const setList = isFromTodo ? setTodos : setDone

      const oldIndex = list.findIndex(t => t.taskId === activeId)
      const newIndex = list.findIndex(t => t.taskId === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        setList(arrayMove(list, oldIndex, newIndex))
      }
    }

    // 🔀 MOVE BETWEEN COLUMNS
    else {
      const sourceList = isFromTodo ? todos : done
      const targetList = isGoingToTodo ? todos : done

      const remove = isFromTodo ? setTodos : setDone
      const add = isGoingToTodo ? setTodos : setDone

      const movedTask = sourceList.find(t => t.taskId === activeId)
      if (!movedTask) return

      remove(sourceList.filter(t => t.taskId !== activeId))

      add([
        ...targetList,
        {
          ...movedTask,
          status: isGoingToTodo ? "todo" : "done",
        },
      ])

      try {
        await taskService.updateTask({
          taskId: movedTask.taskId,
          updates: {
            status: isGoingToTodo ? "todo" : "done"
          },
        })
      } catch (err) {
        console.error("Failed to update task", err)
      }
    }

    setActiveTask(null)
  }

  // ADD TASK
  const addTask = async (taskToAdd: TaskType) => {
    try {
      const { task } = await taskService.createTask(taskToAdd)
      setTodos(prev => [...prev, task])
    } catch (err) {
      console.error("Failed to create task", err)
    }
  }

  return (
    <div className="board flex flex-col h-screen">

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-start gap-3 px-4 py-4 flex-1 w-fit overflow-x-auto">
          <TodoList tasks={todos} />
          <DoneList tasks={done} />
        </div>
        <DragOverlay>
          {activeTask && <Task {...activeTask} />}
        </DragOverlay>
      </DndContext>

      <div className="py-4 flex justify-center">
        <TaskInput addTask={addTask} />
      </div>

    </div>
  )
}
