'use client'
import { updateUser } from '@/app/api/apiUser'
import { StateContext } from '@/app/context/stateContext'
import { getToken } from '@/app/utils'
import { Modal, ModalHeader, ModalContent, ModalFooter, ModalBody, Input, Button } from "@nextui-org/react"
import React, { use, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const ModalEditUser = ({ props }) => {
    const { user,setUser } = use(StateContext);
    const {register,handleSubmit,formState:{error}} = useForm()
    const inputKey=['name','phone','email']
    const currentData = user?.map(u => {return {name:u.name,phone:u.phone,email:u.email}})
    const GetToken = getToken()
    const onSubmit = async data => {
        const isConstant = currentData.every(d => inputKey.every(k => d[k] === data[k]))
        if(isConstant){
            return props.setModalName('')
        }
        const token = await GetToken()
        if(token){
            updateUser(token,data)
            .then(res => {
                if(res.status === 200){
                    setUser(user.map(u => {
                        return {
                            ...u,
                            name:data.name,
                            phone:data.phone,
                            email:data.email
                        }
                    }))
                }
                alert(res.message)
                props.setModalName('')
            })
        }
        
    }
    return <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        backdrop="opaque"
        size="2xl"
        classNames={{
            backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
        placement="top-center"
    >
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Edit User</ModalHeader>
                    <ModalBody className="flex flex-wrap !flex-row justify-around">
                        {
                            inputKey.map(k => 
                                user?.map(u => <Input {...register(`${k}`,{required:true})} label={k.toUpperCase()} defaultValue={u[k]}/>)
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => { handleSubmit(onSubmit)() }}>Edit</Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>

}

export default ModalEditUser