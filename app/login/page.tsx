"use client";


import React, { useState } from 'react';
import Login from '@/components/Login'
import Signup from '@/components/Signup';
import { useAppSelector } from '@/store/hooks';
import Image from 'next/image';

const LoginPage = () => {
  const [loginState, setLoginState] = useState(true);
  const { theme } = useAppSelector((state) => state.theme);

  const switchAuthState = () => {
    setLoginState(!loginState);
  }

  return (
    <div className={`login-page flex flex-col h-[100dvh]`}>
        <div className="branding-container w-full h-fit flex items-center gap-2 p-5">
            {/* <Image src="/dod-logo.png" alt="any" className='branding-logo brightness-95' width={40} height={40}/> */}
            <p className='branding-text text-2xl font-medium text-dod'>Ai Task manager</p>
        </div>
        <div className="auth-wrapper flex justify-center items-center w-full h-full">
            <div className={`auth-container flex flex-col p-5 w-fit md:w-md gap-5 justify-center items-center rounded-xl ${ theme === 'light' ? 'bg-white border' : 'bg-chat-input-dark'} shadow-lg`}>
              {/* <Image src="/dod-logo.png" alt="any" className='branding-logo brightness-95' width={50} height={50}/> */}
              { loginState ? (
                <div className="login-container flex flex-col items-center justify-center w-full gap-5">
                  <span className="login-text md:text-lg lg:text-xl">Welcome back, let’s unlock insights!<span className='text-dod'></span></span>
                  <Login/>
                  <div className="flex font-medium gap-1">
                      <p>Dont have an account?</p>
                      <button className='text-blue-800 cursor-pointer' onClick={switchAuthState}>Register Now</button>
                  </div>
                </div>
              ) : (
                <div className="signup-container flex flex-col items-center justify-center w-full gap-5">
                  <span className="signup-text md:text-lg lg:text-xl">Get started on smarter insights<span className='text-dod'></span></span>
                  <Signup/>
                  <div className="flex font-medium gap-1">
                      <p>Already have an account?</p>
                      <button className='text-blue-800 cursor-pointer' onClick={switchAuthState}>Login</button>
                  </div>
                </div>
              )}
          </div>
        </div>
    </div>
  )
}

export default LoginPage