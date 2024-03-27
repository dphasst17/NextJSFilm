'use client'
import { RegisterStaff } from "@/app/api/apiAuth";
import { getToken } from "@/app/utils";
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalBody, Button,Input} from "@nextui-org/react"
import { useState } from "react";
import { useForm } from "react-hook-form";
const ModalAddStaff = ({ props }) => {
    const {register,handleSubmit,formState:{error}} = useForm()
    const [isText,setIsText] = useState(false)
    const GetToken = getToken()
    const arrSubmit = ['username','password','name','email']
    const onSubmit = async data => {
        if(data.confirm !== data.password){
            alert("Confirm password doesn't match with password")
            return
        }
        const token = await GetToken()
        const result = {
            username:data.username,
            password:data.password,
            name:data.name,
            email:data.email,
            role:1
        }
        RegisterStaff(token,result)
        .then(res => {
            if(res.status === 201){
                props.onOpenChange,
                props.setNameModal("")
            }
            alert(res.message)
        })

    }   
    const changeType = () => {
        setIsText(!isText)
    }
    return <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        size="2xl">
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">ADD STAFF</ModalHeader>
                    <ModalBody className="flex flex-wrap !flex-row justify-start">
                        <Input {...register('username',{required:true})} variant="bordered" label="Username" radius="sm" className="w-full"/>
                        <Input {...register('password',{required:true})} type={isText ? 'text':'password'} variant="bordered" label="Password" radius="sm" className="w-[49%]"/>
                        <Input {...register('confirm',{required:true})} type={isText ? 'text':'password'} variant="bordered" label="Confirm password" radius="sm" className="w-[49%]"/>
                        <Input {...register('name',{required:true})} variant="bordered" label="Name" radius="sm" className="w-full"/>
                        <Input {...register('email',{required:true})} variant="bordered" label="Email" radius="sm" className="w-full"/>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={changeType}>{isText ? 'Hide' : 'Show'}</Button>
                        <Button onClick={() => {handleSubmit(onSubmit)()}}>Add</Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
}
export default ModalAddStaff