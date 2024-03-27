'use client'
import React, { use, useState } from "react";
import {Input,Button} from "@nextui-org/react";
import {EyeFilledIcon} from "@/app/components/Icon/EyeFilledIcon";
import {EyeSlashFilledIcon} from "@/app/components/Icon/EyeSlashFilledIcon";
import { useForm } from "react-hook-form";
import { Register } from "@/app/api/apiAuth";
import { useRouter } from "next/navigation";
import { StateContext } from "@/app/context/stateContext";
const RegisterForm = ({ props }) => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const onSubmit = data => {
        if(data.confirm !== data.password){
            alert('Confirm password does not match with password')
            return
        }
        const result = {
            username:data.username,
            password:data.password,
            email:data.email
        }
        Register(result).then(res => {
            res.status === 401 && alert(res.message)
            if(res.status === 201){
                alert(res.message)
                props.setIsLogin(true)
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
                type="email"
                label="Email"
                variant="bordered"
                placeholder="Enter your email"
                className="max-w-sm my-1 animateOpacity transition-all"
                {...register('email', { required: true })}
                isInvalid={errors.email ? true : false}
                errorMessage={errors.email ? "Please enter your email" : ''}
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
            <Input
                label="Confirm Password"
                variant="bordered"
                {...register('confirm', { required: true })}
                placeholder="Enter your confirm password"
                endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                    </button>
                }
                isInvalid={errors.confirm ? true : false}
                type={isVisible ? "text" : "password"}
                className="max-w-sm my-1 animateOpacity transition-all"
                errorMessage={errors.confirm ? "Please enter your password" : ''}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        handleSubmit(onSubmit)()
                    }
                }}
            />
        </form>
        <Button onClick={(e) => { e.preventDefault(); handleSubmit(onSubmit)() }} size="lg" color="success" radius="sm"
            className="max-w-xl font-sc-thin text-white text-xl animateOpacity transition-all">
            CREATE ACCOUNT
        </Button>
    </>
}
export default RegisterForm