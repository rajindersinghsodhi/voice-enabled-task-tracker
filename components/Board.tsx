"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import Task, { TaskType } from "./Task"
import TaskInput from "./TaskInput"
import SortableTask from "./SortableTask"

type KanbanBoardProps = {
  initialTodos?: TaskType[]
  initialDone?: TaskType[]
}

const KanbanBoard = ({ initialTodos = [], initialDone = [] }: KanbanBoardProps) => {
  const [todos, setTodos] = useState<TaskType[]>(initialTodos)
  const [done, setDone] = useState<TaskType[]>(initialDone)
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = todos.find(t => t.title === active.id) || done.find(t => t.title === active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return setActiveTask(null)

    const sourceList = todos.find(t => t.title === active.id) ? todos : done
    const targetList = todos.find(t => t.title === over.id) ? todos : done

    if (sourceList === targetList) {
      const oldIndex = sourceList.findIndex(t => t.title === active.id)
      const newIndex = sourceList.findIndex(t => t.title === over.id)
      const newList = arrayMove(sourceList, oldIndex, newIndex)
      sourceList === todos ? setTodos(newList) : setDone(newList)
    } else {
      const taskIndex = sourceList.findIndex(t => t.title === active.id)
      const [movedTask] = sourceList.splice(taskIndex, 1)
      movedTask.status = targetList === todos ? "todo" : "done"
      targetList.push(movedTask)
      setTodos([...todos])
      setDone([...done])
    }

    setActiveTask(null)
  }

  const addTask = (task: TaskType) => setTodos([...todos, task])

  return (
    <div className="board flex flex-col h-screen">

  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={handleDragEnd}
    onDragStart={handleDragStart}
  >
    
    {/* Board Area */}
    <div className="flex gap-6 px-4 py-4 flex-1 overflow-x-auto">

      {/* TODO COLUMN */}
      <div className="flex-1 p-4 rounded-lg flex flex-col h-full border shadow-md">

        <h2 className="font-bold mb-4 text-lg">
          Todo
        </h2>

        {/* Scroll zone */}
        <div className="flex-1 overflow-y-auto">
          <SortableContext
            items={todos.map(t => t.title)}
            strategy={verticalListSortingStrategy}
          >
            {todos.map(task => (
              <SortableTask key={task.title} task={task} />
            ))}
          </SortableContext>
        </div>

      </div>


      {/* DONE COLUMN */}
      <div className="flex-1 p-4 rounded-lg flex flex-col h-full border shadow-md">

        <h2 className="font-bold mb-4 text-lg">
          Done
        </h2>

        {/* Scroll zone */}
        <div className="flex-1 overflow-y-auto">
          <SortableContext
            items={done.map(t => t.title)}
            strategy={verticalListSortingStrategy}
          >
            {done.map(task => (
              <SortableTask key={task.title} task={task} />
            ))}
          </SortableContext>
        </div>

      </div>

    </div>


    {/* Drag overlay */}
    <DragOverlay>
      {activeTask ? <Task {...activeTask} /> : null}
    </DragOverlay>

  </DndContext>


  {/* Input stays OUTSIDE scroll area */}
  <div className="task-input-container flex justify-center w-full py-4">
    <TaskInput addTask={addTask} />
  </div>

</div>

  )
}

export default KanbanBoard
