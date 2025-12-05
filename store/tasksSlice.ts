// store/tasksSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { TaskType } from '@/components/Task'
import taskService from '@/services/taskService'

interface TasksState {
  todos: TaskType[]
  done: TaskType[]
  loading: boolean
  error: string | null
}

const initialState: TasksState = {
  todos: [],
  done: [],
  loading: false,
  error: null,
}

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const data = await taskService.getTasks()
    return data
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskToAdd: TaskType) => {
    const { task } = await taskService.createTask(taskToAdd)
    return task
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }: { taskId: string; updates: Partial<TaskType> }) => {
    await taskService.updateTask({ taskId, updates })
    return { taskId, updates }
  }
)

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }: { taskId: string; status: 'todo' | 'done' }) => {
    await taskService.updateTask({
      taskId,
      updates: { status },
    })
    return { taskId, status }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string) => {
    console.log("taskId in redux", taskId)
    await taskService.deleteTask({taskId})
    return taskId
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    reorderTodos: (state, action: PayloadAction<TaskType[]>) => {
      state.todos = action.payload
    },
    reorderDone: (state, action: PayloadAction<TaskType[]>) => {
      state.done = action.payload
    },
    moveTaskBetweenColumns: (
      state,
      action: PayloadAction<{ task: TaskType; toStatus: 'todo' | 'done' }>
    ) => {
      const { task, toStatus } = action.payload
      
      if (task.status === 'todo') {
        state.todos = state.todos.filter(t => t.taskId !== task.taskId)
      } else {
        state.done = state.done.filter(t => t.taskId !== task.taskId)
      }
      
      const updatedTask = { ...task, status: toStatus }
      
      if (toStatus === 'todo') {
        state.todos.push(updatedTask)
      } else {
        state.done.push(updatedTask)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.todos = action.payload.tasksTodo
        state.done = action.payload.tasksDone
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch tasks'
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.todos.push(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { taskId, updates } = action.payload
        
        // Find and update in todos
        const todoIndex = state.todos.findIndex(t => t.taskId === taskId)
        if (todoIndex !== -1) {
          state.todos[todoIndex] = { ...state.todos[todoIndex], ...updates }
        }
        
        // Find and update in done
        const doneIndex = state.done.findIndex(t => t.taskId === taskId)
        if (doneIndex !== -1) {
          state.done[doneIndex] = { ...state.done[doneIndex], ...updates }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload
        state.todos = state.todos.filter(t => t.taskId !== taskId)
        state.done = state.done.filter(t => t.taskId !== taskId)
      })
  },
})

export const { reorderTodos, reorderDone, moveTaskBetweenColumns } = tasksSlice.actions
export default tasksSlice.reducer