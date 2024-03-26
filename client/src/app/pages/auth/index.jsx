'use client'
import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { Login } from "@/app/api/apiAuth";
import { setCookie } from "cookies-next";
import { setLocalStorage } from "@/app/utils";
import { useRouter } from "next/navigation";
import { StateContext } from "@/app/context/stateContext";
import LoginForm from "./login";
import RegisterForm from "./register";
const AuthContent = () => {
    const router = useRouter();
    const [isLogin,setIsLogin] = useState(true)
    const {setIsLog,setIsUser} = use(StateContext)
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const onSubmit = data => {
        Login(data).then(res => {
            res.status === 401 && alert(res.message)
            if(res.status===200){
                setLocalStorage('adminLog',true)
                setLocalStorage('expA',res.data.expAccess)
                setLocalStorage('expR',res.data.expRefresh)
                setLocalStorage('role',res.data.role)
                setCookie('access',res.data.accessToken,{expires: new Date(res.data.expAccess * 1000) })
                setCookie('refresh',res.data.refreshToken,{expires: new Date(res.data.expRefresh * 1000)})
                setIsLog(true)
                setIsUser(res.data.role === 2 ? true : false)
                router.push('/')
            }
        })
    }
    return <section className="Login w-full h-[80vh] flex flex-wrap content-center justify-center">
        <div className="w-full flex justify-center items-center font-sc-thin text-[25px] md:text-[30px] lg:text-[35px] xl:text-[40px] animateOpacity transition-all">
            {isLogin ? 'LOGIN' : 'REGISTER'}
        </div>
        {isLogin && <LoginForm props={{setIsLogin}}/>}
        {!isLogin && <RegisterForm props={{setIsLogin}}/>}
    </section>
}

export default AuthContent