'use client'
import React, { useState } from 'react'
import { Modal, ModalHeader, ModalContent, ModalFooter, ModalBody, Input, Button,Code } from "@nextui-org/react";
import {EyeFilledIcon} from "@/app/components/Icon/EyeFilledIcon";
import {EyeSlashFilledIcon} from "@/app/components/Icon/EyeSlashFilledIcon";
const ModalUpdatePassword = ({props}) => {
  const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
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
          <ModalBody className="flex flex-wrap !flex-row justify-start">
            <Input label="Current Password" type={isVisible ? 'text':'password'}/>
            <Input label="New Password" type={isVisible ? 'text':'password'}/>
            <Input label="Confirm Password" type={isVisible ? 'text':'password'}/>
            <Code onClick={toggleVisibility} className='cursor-pointer'>{isVisible 
              ? <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" /> 
              : <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" /> }</Code>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => { handleSubmit(onSubmit)() }}>Edit</Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
}

export default ModalUpdatePassword