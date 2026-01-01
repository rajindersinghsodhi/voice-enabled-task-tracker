import { api } from "@/lib/api"

const authCheck = async () => {
    try {
        const { data } = await api.get(`/auth`, {
            withCredentials: true,
        });

        return data;
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
        throw new Error(errorMessage);
    }
}

const signup = async (payload: any) => {
    try {
        const { data } = await api.post(`/auth/signup`, payload, {
            withCredentials: true,
        });

        return data;
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
        throw new Error(errorMessage);
    }
}

const login = async (payload: any) => {
    try {
        const { data } = await api.post(`/auth/login`, payload, {
            withCredentials: true,
        });

        return data;
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
        throw new Error(errorMessage);
    }
}

const logout = async () => {
    try {
        const { data } = await api.post(`/auth/logout`, {}, {
            withCredentials: true,
        });

        return data;
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
        throw new Error(errorMessage);
    }
}

export { authCheck, signup, login, logout };