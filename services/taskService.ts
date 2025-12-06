import axios from "axios";

const BASE_URL=process.env.NEXT_PUBLIC_API_URL;

const createTask = async ({ title, priority, dueDate }:{ title: string, priority: string, dueDate: string }) => {
    try {
        const { data } = await axios.post(`${BASE_URL}/api/v1/tasks`, 
            {
                title,
                priority,
                dueDate
            }
        )

        return data;
    } catch (error) {
        throw error;
    }
}

const getTasks = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/tasks`)

        return data;
    } catch (error) {
        throw error;
    }
}

const updateTask = async ({ taskId, updates }: { taskId: string, updates: any }) => {
    try {
        const { data } = await axios.patch(`${BASE_URL}/api/v1/tasks/${taskId}`, updates);

        return data;
    } catch (error) {
        throw error;
    }
}

const deleteTask = async ({ taskId }: { taskId: string }) => {
    try {
        console.log(taskId)
        const { data } = await axios.delete(`${BASE_URL}/api/v1/tasks/${taskId}`);

        return data;
    } catch (error) {
        throw error;
    }
}

const parseSpeechToTask = async ({ speechText }: { speechText: string }) => {
    try {
        console.log(speechText)
        const { data } = await axios.post(`${BASE_URL}/api/v1/tasks/voice`, { speechText });

        return data;
    } catch (error) {
        throw error;
    }
}

export default { createTask, getTasks, updateTask, deleteTask, parseSpeechToTask };