'use client'
import React, { useState } from "react";
import {Input,Button} from "@nextui-org/react";
import {EyeFilledIcon} from "@/app/components/Icon/EyeFilledIcon";
import {EyeSlashFilledIcon} from "@/app/components/Icon/EyeSlashFilledIcon";
import { useForm } from "react-hook-form";
import { Login } from "@/app/api/apiAuth";
const AuthContent = () => {
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
                console.log(res.data)
            }
        })
    }
    return <section className="Login w-full h-[80vh] flex flex-wrap content-center justify-center">
        <div className="w-full flex justify-center items-center font-sc-thin text-[25px] md:text-[30px] lg:text-[35px] xl:text-[40px] animateOpacity transition-all">
            Login
        </div>
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
            />
        </form>
        <Button onClick={(e) => { e.preventDefault(); handleSubmit(onSubmit)() }} size="lg" color="success" radius="sm"
            className="max-w-xl font-sc-thin text-white text-xl animateOpacity transition-all">
            LOGIN
        </Button>
    </section>
}

export default AuthContent