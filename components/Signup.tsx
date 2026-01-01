"use client";

import React, { useState } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signup } from '@/services/authentication';
import InputField from '@/components/InputField'
import Button from '@/components/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/userSlice';
import { useRouter } from 'next/navigation';

type SignupFormData = {
    userName: string;
    email: string;
    password: string;
};

const signupSchema = z.object({
    userName: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { theme } = useAppSelector((state) => state.theme);


    const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const handleSignup = async (payload: SignupFormData) => {
        try {
            setLoading(true);

            const { user } = await signup(payload);
            dispatch(
                setUser(user)
            );
            router.push('/tasks');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(handleSignup)} className="signup-form flex flex-col items-center w-full gap-3 min-w-80 max-w-80">
            <div className="fields-container flex flex-col w-full gap-1 items-center">
                <Controller
                    name="userName"
                    control={control}
                    render={({ field }) => (
                        <InputField
                            label="User Name"
                            placeholder="Enter your name"
                            type="text"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.userName?.message}
                            className='min-w-52 md:min-w-72 max-w-fit'
                            classNameInput={`${ theme === 'light' ? '' : 'border-1 border-[#626262]'}`}
                        />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <InputField
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.email?.message}
                            className='min-w-52 md:min-w-72 max-w-fit'
                            classNameInput={`${ theme === 'light' ? '' : 'border-1 border-[#626262]'}`}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <InputField
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.password?.message}
                            className='min-w-52 md:min-w-72 max-w-fit'
                            classNameInput={`${ theme === 'light' ? '' : 'border-1 border-[#626262]'}`}
                        />
                    )}
                />
            </div>
            <Button buttonTitle='Sign Up' loading={loading} buttonType={'submit'} classname="bg-black text-white w-30 font-medium"/>
        </form>
    )
}

export default Signup