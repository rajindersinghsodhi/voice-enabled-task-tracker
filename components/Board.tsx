"use client"

import { useEffect, useState, useMemo } from "react"
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
import FilterBar from "./FilterBar"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import {
  fetchTasks,
  reorderTodos,
  reorderDone,
  moveTaskBetweenColumns,
  updateTaskStatus,
} from "@/store/tasksSlice"
import { format } from "date-fns"

export default function Board() {
  const dispatch = useAppDispatch()
  const { todos, done } = useAppSelector((state) => state.tasks)
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)
  const sensors = useSensors(useSensor(PointerSensor))

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [dueDateFilter, setDueDateFilter] = useState<Date | undefined>()

  // LOAD TASKS
  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    let allTasks = [...todos, ...done]

    // Search by title
    if (searchQuery.trim()) {
      allTasks = allTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      allTasks = allTasks.filter((task) => task.status === statusFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      allTasks = allTasks.filter((task) => task.priority === priorityFilter)
    }

    // Filter by due date
    if (dueDateFilter) {
      const filterDate = format(dueDateFilter, "yyyy-MM-dd")
      allTasks = allTasks.filter((task) => task.dueDate === filterDate)
    }

    // Separate back into todos and done
    return {
      filteredTodos: allTasks.filter((task) => task.status === "todo"),
      filteredDone: allTasks.filter((task) => task.status === "done"),
    }
  }, [todos, done, searchQuery, statusFilter, priorityFilter, dueDateFilter])

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setPriorityFilter("all")
    setDueDateFilter(undefined)
  }

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
      {/* Filter Bar */}
      <div className="px-4 pt-4">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          dueDateFilter={dueDateFilter}
          setDueDateFilter={setDueDateFilter}
          onClearFilters={handleClearFilters}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-start gap-3 px-4 py-4 flex-1 w-fit overflow-x-auto">
          <TodoList tasks={filteredTasks.filteredTodos} />
          <DoneList tasks={filteredTasks.filteredDone} />
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