import { api } from "@/lib/api";

const BASE_URL=process.env.NEXT_PUBLIC_API_URL;

const createTask = async ({ title, description, priority, dueDate }:{ title: string, description: string, priority: string, dueDate: string }) => {
    try {
        const { data } = await api.post(`/tasks`, 
            {
                title,
                description,
                priority,
                dueDate
            },
            {
                withCredentials: true,
            }
        )

        return data;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
        throw new Error(errorMessage);
    }
}

const getTasks = async () => {
    try {
        const { data } = await api.get(`/tasks`, {
            withCredentials: true,
        })

        return data;
    } catch (error) {
         const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
        throw new Error(errorMessage);
    }
}

const updateTask = async ({ taskId, updates }: { taskId: string, updates: any }) => {
    try {
        console.log({taskId, updates})
        const { data } = await api.patch(`/tasks`, { taskId, updates }, {
            withCredentials: true,
        });

        return data;
    } catch (error) {
         const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
        throw new Error(errorMessage);
    }
}

const deleteTask = async ({ taskId }: { taskId: string }) => {
    try {
        console.log(taskId)
        const { data } = await api.delete(`/tasks/${taskId}`, {
            withCredentials: true,
        });

        return data;
    } catch (error) {
         const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
        throw new Error(errorMessage);
    }
}

const parseSpeechToTask = async ({ speechText }: { speechText: string }) => {
    try {
        console.log(speechText)
        const { data } = await api.post(`/tasks/voice`, { speechText }, {
            withCredentials: true,
        });

        return data;
    } catch (error) {
         const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
        throw new Error(errorMessage);
    }
}

export default { createTask, getTasks, updateTask, deleteTask, parseSpeechToTask };