'use client'
import React, { use, useState } from "react";
import {Input,Button} from "@nextui-org/react";
import {EyeFilledIcon} from "@/app/components/Icon/EyeFilledIcon";
import {EyeSlashFilledIcon} from "@/app/components/Icon/EyeSlashFilledIcon";
import { useForm } from "react-hook-form";
import { Login } from "@/app/api/apiAuth";
import { setCookie } from "cookies-next";
import { setLocalStorage } from "@/app/utils";
import { useRouter } from "next/navigation";
import { StateContext } from "@/app/context/stateContext";
import { getUser } from "@/app/api/apiUser";
const LoginForm = ({ props }) => {
    const router = useRouter();
    const {setIsLog,setIsUser,setUser} = use(StateContext)
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
                setLocalStorage('isLog',true)
                setLocalStorage('expA',res.data.expAccess)
                setLocalStorage('expR',res.data.expRefresh)
                setLocalStorage('role',res.data.role)
                setCookie('access',res.data.accessToken,{expires: new Date(res.data.expAccess * 1000) })
                setCookie('refresh',res.data.refreshToken,{expires: new Date(res.data.expRefresh * 1000)})
                setIsLog(true)
                setIsUser(res.data.role === 2 ? true : false)
                if(res.data.role !==0){
                    getUser(res.data.accessToken)
                    .then(resData => {
                        if(resData.status === 200){
                            console.log(resData.data)
                            setUser(resData.data)
                        }
                    })
                }
                router.push('/')
            }
        })
    }
    return <>
        <form className="w-full flex flex-col items-center">
            <Input
                type="text"
                label="Username"
                variant="bordered"
                placeholder="Enter your username"
                className="max-w-sm my-1 animateOpacity transition-all"
                {...register('username', { required: true })}
                isInvalid={errors.username ? true : false}
                errorMessage={errors.username ? "Please enter your username" : ''}
            />
            <Input
                label="Password"
                variant="bordered"
                {...register('password', { required: true })}
                placeholder="Enter your password"
                endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                    </button>
                }
                isInvalid={errors.password ? true : false}
                type={isVisible ? "text" : "password"}
                className="max-w-sm my-1 animateOpacity transition-all"
                errorMessage={errors.password ? "Please enter your password" : ''}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        handleSubmit(onSubmit)()
                    }
                }}
            />
        </form>
        <div className="w-full h-auto flex justify-center items-center mb-10 mt-4">
            <Button onClick={(e) => { e.preventDefault(); handleSubmit(onSubmit)() }} size="lg" color="success" radius="sm"
                className="max-w-xl font-sc-thin text-white text-xl animateOpacity transition-all">
                LOGIN
            </Button>
        </div>
        <hr className="w-1/4 bg-white text-white" />
        <div className="w-full h-auto flex justify-center items-center mb-10 mt-4">
            <Button onClick={() => {props.setIsLogin(false)}} size="lg" color="default" radius="sm"
                className="max-w-xl font-sc-thin text-white text-xl animateOpacity transition-all">
                CREATE ACCOUNT
            </Button>
        </div>
    </>
}
export default LoginForm