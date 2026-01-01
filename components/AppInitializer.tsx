"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setInitialized, setUser } from "@/store/userSlice";
import { toast } from "sonner";
import { authCheck } from "@/services/authentication";

const AppInitializer = () => {
    const dispatch = useAppDispatch();

    const authenticateUser = async () => {
        try {
            const { user } = await authCheck();
            
            dispatch(setUser({
                userId: user.userId,
                userName: user.userName,
                email: user.email
            }));
            
            dispatch(setInitialized())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error)
            dispatch({ type: "RESET_STORE" });
            dispatch(setInitialized());
            // toast.error(error.message);
        }
    };

    useEffect(() => {
        authenticateUser();
    }, []);

    return null;
};

export default AppInitializer;
