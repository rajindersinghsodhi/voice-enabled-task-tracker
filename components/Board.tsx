"use client"

import { useEffect, useState, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import {
  fetchTasks,
  reorderTodos,
  reorderDone,
  moveTaskBetweenColumns,
  updateTaskStatus,
} from "@/store/tasksSlice"
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
import { format } from "date-fns"

export default function Board() {
  const dispatch = useAppDispatch()
  const { todos, done } = useAppSelector((state) => state.tasks)
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [dueDateFilter, setDueDateFilter] = useState<Date | undefined>()
  
  const sensors = useSensors(useSensor(PointerSensor))
  
  const filteredTasks = useMemo(() => {
    let allTasks = [...todos, ...done]

    if (searchQuery.trim()) {
      allTasks = allTasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (statusFilter !== "all") { 
      allTasks = allTasks.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      allTasks = allTasks.filter((task) => task.priority === priorityFilter);
    }

    if (dueDateFilter) {
      const filterDate = format(dueDateFilter, "yyyy-MM-dd");

      allTasks = allTasks.filter((task) => {
        const taskDate = format(new Date(task.dueDate), "yyyy-MM-dd");
        return taskDate === filterDate
      })
    }

    return {
      filteredTodos: allTasks.filter((task) => task.status === "todo"),
      filteredDone: allTasks.filter((task) => task.status === "done"),
    }
  }, [todos, done, searchQuery, statusFilter, priorityFilter, dueDateFilter])

  const handleClearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setPriorityFilter("all")
    setDueDateFilter(undefined)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id
    const task = todos.find((todo: TaskType) => todo.taskId === id) || done.find((todo: TaskType) => todo.taskId === id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) {
      setActiveTask(null)
      return
    }

    const activeId = active.id
    const overId = over.id

    const isFromTodo = todos.some((todo: TaskType) => todo.taskId === activeId)
    const isGoingToTodo = todos.some((todo: TaskType) => todo.taskId === overId) || overId === "todo"

    if (isFromTodo === isGoingToTodo) {
      const list = isFromTodo ? todos : done
      const oldIndex = list.findIndex((todo: TaskType) => todo.taskId === activeId)
      const newIndex = list.findIndex((todo: TaskType) => todo.taskId === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedList: TaskType[] = arrayMove(list, oldIndex, newIndex)
        if (isFromTodo) {
          dispatch(reorderTodos(reorderedList))
        } else {
          dispatch(reorderDone(reorderedList))
        }
      }
    } else {
      const sourceList = isFromTodo ? todos : done
      const movedTask = sourceList.find((todo: TaskType) => todo.taskId === activeId)
      
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

  useEffect(() => {
      dispatch(fetchTasks())
  }, [dispatch])

  return (
    <div className="board flex flex-col h-screen">
      <div className="filter-bar-container px-2 sm:px-4 pt-4 pb-2">
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="lists-container flex flex-col md:flex-row justify-start gap-3 px-2 sm:px-4 py-4 flex-1 overflow-x-auto overflow-y-auto">
          <TodoList tasks={filteredTasks.filteredTodos} />
          <DoneList tasks={filteredTasks.filteredDone} />
        </div>
        <DragOverlay>
          {activeTask && <Task {...activeTask} />}
        </DragOverlay>
      </DndContext>
      <div className="py-4 px-2 sm:px-4 flex justify-center">
        <TaskInput />
      </div>
    </div>
  )
}