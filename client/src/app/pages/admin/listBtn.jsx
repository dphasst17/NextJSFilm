'use client'
import React from 'react'
import {Button} from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
const ListBtn = ({props}) => {
  return <section className='admin-list-btn w-full min-h-[60px] flex flex-wrap p-2'>
    <Button isIconOnly onPress={props.onOpen} onClick={() =>{props.setNameModal("add")}} radius='sm' color='primary'><FaPlus /></Button>
  </section>
}

export default ListBtn