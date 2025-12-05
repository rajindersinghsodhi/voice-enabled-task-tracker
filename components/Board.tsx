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
import { useAppDispatch, useAppSelector } from "../store/hooks"
import {
  fetchTasks,
  reorderTodos,
  reorderDone,
  moveTaskBetweenColumns,
  updateTaskStatus,
} from "@/store/tasksSlice"

export default function Board() {
  const dispatch = useAppDispatch()
  const { todos, done } = useAppSelector((state) => state.tasks)
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)
  const sensors = useSensors(useSensor(PointerSensor))

  // LOAD TASKS
  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

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
      const oldIndex = list.findIndex((t: any) => t.taskId === activeId)
      const newIndex = list.findIndex((t: any) => t.taskId === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedList = arrayMove(list, oldIndex, newIndex)
        if (isFromTodo) {
          dispatch(reorderTodos(reorderedList))
        } else {
          dispatch(reorderDone(reorderedList))
        }
      }
    }
    // 🔀 MOVE BETWEEN COLUMNS
    else {
      const sourceList = isFromTodo ? todos : done
      const movedTask = sourceList.find(t => t.taskId === activeId)
      
      if (!movedTask) return

      const targetStatus = isGoingToTodo ? "todo" : "done"
      
      dispatch(moveTaskBetweenColumns({
        task: movedTask,
        toStatus: targetStatus,
      }))

      try {
        await dispatch(updateTaskStatus({
          taskId: movedTask.taskId,
          status: targetStatus,
        }))
      } catch (err) {
        console.error("Failed to update task", err)
      }
    }

    setActiveTask(null)
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
          <TodoList />
          <DoneList />
        </div>

        <DragOverlay>
          {activeTask && <Task {...activeTask} />}
        </DragOverlay>
      </DndContext>

      <div className="py-4 flex justify-center">
        <TaskInput />
      </div>
    </div>
  )
}