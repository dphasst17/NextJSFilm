'use client'
import { Button, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaPlus, FaRegUser } from "react-icons/fa";
import { RiUserAddLine } from "react-icons/ri";
const ListBtn = ({ props }) => {
  const [isStaff, setIsStaff] = useState("")
  useEffect(() => {
    setIsStaff(JSON.parse(localStorage.getItem('role')) === 1 ? true : false)
  }, [])
  return <section className='admin-list-btn w-full min-h-[60px] flex flex-wrap p-2'>
    <Tooltip content="Add film ticket" showArrow radius='sm' placement="bottom-start">
      <Button isIconOnly onPress={props.onOpen} onClick={() => { props.setNameModal("add") }} radius='sm' color='primary' className='mx-1'>
        <FaPlus />
      </Button>
    </Tooltip>
    {!isStaff && <>
      <Tooltip content="Create staff" showArrow radius='sm' placement="bottom">
        <Button isIconOnly onPress={props.onOpen} onClick={() => { props.setNameModal("addUser") }} radius='sm' color='primary' className='mx-1 text-white font-bold text-[15px]'>
          <RiUserAddLine />
        </Button>
      </Tooltip>
      <Tooltip content="View all user and staff" showArrow radius='sm' placement='bottom'>
        <Button isIconOnly onPress={props.onOpen} onClick={() => { props.setNameModal("user") }} radius='sm' color='success' className='mx-1 text-white font-bold text-[15px]'>
          <FaRegUser />
        </Button>
      </Tooltip>
    </>}
  </section>
}

export default ListBtn