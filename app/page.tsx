import KanbanBoard from "@/components/Board"
import { TaskType } from "@/components/Task"

const initialTodos: TaskType[] = [
  { title: "found it", priority: "medium", dueDate: "2025-12-06", status: "todo" },
  { title: "never lie", priority: "high", dueDate: "2025-12-07", status: "todo" },
]

const initialDone: TaskType[] = [
  { title: "anything", priority: "low", dueDate: "2025-12-04", status: "done" },
  { title: "do this", priority: "low", dueDate: "2025-12-04", status: "done" },
  { title: "once more", priority: "low", dueDate: "2025-12-04", status: "done" },
  { title: "take this", priority: "low", dueDate: "2025-12-04", status: "done" },
  { title: "find that guy", priority: "low", dueDate: "2025-12-04", status: "done" },
  { title: "its easy", priority: "low", dueDate: "2025-12-04", status: "done" },
]

export default function Home() {
  return <KanbanBoard initialTodos={initialTodos} initialDone={initialDone} />
}
