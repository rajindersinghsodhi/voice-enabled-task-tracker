import DoneList from "@/components/DoneList";
import Task from "@/components/Task";
import TaskInput from "@/components/TaskInput";
import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <div className="flex flex-col justify-between p-3 w-full min-h-screen">
      <div className="task-lists flex justify-center w-full gap-5">
        <TodoList tasks={[{ title: "buy cycle", priority:"high", dueDate:"2025-04-06", status: "todo"}, { title: "buy cycle", priority:"high", dueDate:"2025-04-06", status: "todo"}]}/>
        <DoneList doneTasks={[{ title: "buy cycle", priority:"high", dueDate:"2025-04-06", status: "done"}, { title: "buy cycle", priority:"high", dueDate:"2025-04-06", status: "done"}]}/>
      </div>
      {/* <Task title="Buy cycle" priority="high" dueDate="2025-04-06"/> */}
      <div className="task-input-container flex justify-center w-full">
        <TaskInput/>
      </div>
    </div>
  );
}
