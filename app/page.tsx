import Task from "@/components/Task";
import TaskInput from "@/components/TaskInput";
import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <div className="flex border-2 border-red-500 p-3">
      <TodoList tasks={[{ title: "buy cycle", priority:"high", dueDate:"2025-04-06"}, { title: "buy cycle", priority:"high", dueDate:"2025-04-06"}]}/>
      {/* <Task title="Buy cycle" priority="high" dueDate="2025-04-06"/> */}
      <TaskInput/>
    </div>
  );
}
