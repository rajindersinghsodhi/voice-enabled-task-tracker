"use client"

import { useEffect, useState } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"

import Task, { TaskType } from "./Task"
import SortableTask from "./SortableTask"
import TaskInput from "./TaskInput"
import taskService from "@/services/taskService"

function DroppableColumn({
  id,
  children,
}: {
  id: "todo" | "done"
  children: React.ReactNode
}) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="flex-1 flex h-full">
      {children}
    </div>
  )
}

export default function KanbanBoard() {
  const [todos, setTodos] = useState<TaskType[]>([])
  const [done, setDone] = useState<TaskType[]>([])
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    const loadTasks = async () => {
      const data = await taskService.getTasks()
      setTodos(data.tasksTodo)
      setDone(data.tasksDone)
    }

    loadTasks()
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id

    const task =
      todos.find(t => t.taskId === id) ||
      done.find(t => t.taskId === id)

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

  const isFromTodo = todos.some(t => t.taskId === activeId)
  const isGoingToTodo =
    todos.some(t => t.taskId === overId) ||
    overId === "todo"

  // Reorder inside same column
  if (isFromTodo === isGoingToTodo) {
    const list = isFromTodo ? todos : done
    const setList = isFromTodo ? setTodos : setDone

    const oldIndex = list.findIndex(t => t.taskId === activeId)
    const newIndex = list.findIndex(t => t.taskId === overId)

    if (oldIndex !== -1 && newIndex !== -1) {
      setList(arrayMove(list, oldIndex, newIndex))
    }
  }
  // Move between columns
  else {
    const sourceList = isFromTodo ? todos : done
    const targetList = isGoingToTodo ? todos : done

    const remove = isFromTodo ? setTodos : setDone
    const add = isGoingToTodo ? setTodos : setDone

    const movedTask = sourceList.find(t => t.taskId === activeId)
    if (!movedTask) return

    // Optimistically update UI
    remove(sourceList.filter(t => t.taskId !== activeId))
    add([
      ...targetList,
      {
        ...movedTask,
        status: isGoingToTodo ? "todo" : "done",
      },
    ])

    // Persist to backend
    try {
      await taskService.updateTask({
        taskId: movedTask.taskId,
        updates: { status: isGoingToTodo ? "todo" : "done" },
      })
    } catch (err) {
      console.error("Failed to update task status", err)
      // Optionally: revert UI if update fails
    }
  }

  setActiveTask(null)
}


  const addTask = async (taskToAdd: TaskType) => {
    try {
      // SAVE TO DB FIRST
      const { task } = await taskService.createTask(taskToAdd)

      // THEN UPDATE UI
      console.log(task)
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

        {/* ✅ BOARD AREA */}
        <div className="flex justify-start gap-3 px-4 py-4 flex-1 w-fit overflow-x-auto">

          {/* TODO COLUMN */}
          <DroppableColumn id="todo">
            <div className="flex-1 p-4 rounded-lg flex flex-col h-full max-w-fit border shadow-md">
              <p className="font-bold mb-4 text-lg">Todo</p>

              {/* ✅ SCROLL ZONE */}
              <div className="flex-1 overflow-y-auto hide-scrollbar w-full">
                <SortableContext
                  items={todos.map(t => t.taskId)}
                  strategy={verticalListSortingStrategy}
                >
                  {todos.map(task => (
                    <SortableTask
                      key={task.taskId}
                      task={task}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </DroppableColumn>

          {/* DONE COLUMN */}
          <DroppableColumn id="done">
            <div className="flex-1 p-4 rounded-lg flex flex-col max-w-fit h-full border shadow-md">
              <p className="font-bold mb-4 text-lg">Done</p>

              {/* ✅ SCROLL ZONE */}
              <div className="flex-1 overflow-y-auto hide-scrollbar w-full">
                <SortableContext
                  items={done.map(t => t.taskId)}
                  strategy={verticalListSortingStrategy}
                >
                  {done.map(task => (
                    <SortableTask
                      key={task.taskId}
                      task={task}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </DroppableColumn>

        </div>

        {/* ✅ DRAG OVERLAY */}
        <DragOverlay>
          {activeTask && <Task {...activeTask} />}
        </DragOverlay>

      </DndContext>

      {/* ✅ FOOTER STAYS FIXED */}
      <div className="task-input-container flex justify-center w-full py-4">
        <TaskInput
          addTask={addTask}
        />
      </div>

    </div>
  )
}
