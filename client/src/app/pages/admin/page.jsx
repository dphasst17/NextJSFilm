'use client'

import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import AdminFilm from "./film"
import ListBtn from "./listBtn"
import {useDisclosure} from "@nextui-org/react";
import ModalAddNew from "./modal/add"
import { StateContext } from "@/app/context/stateContext"
import ModalEditFilm from "./modal/edit"
const Admin = () => {
    const {isLog} = use(StateContext)
    const [nameModal,setNameModal] = useState("");
    const [idEdit,setIdEdit] = useState("")
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const router = useRouter()
    useEffect(() => {
        !isLog ? router.push('/auth') : ''
    },[isLog])
    useEffect(() => {document.title="Management"},[])
    return isLog && <section className="adminLayout w-full h-auto flex flex-wrap justify-center">
    <ListBtn props={{setNameModal,onOpen}}/>
    <AdminFilm props={{setNameModal,onOpen,setIdEdit}}/>
    {nameModal === "add" && <ModalAddNew props={{isOpen,onOpenChange}}/>}
    {nameModal === "edit" && <ModalEditFilm props={{isOpen,onOpenChange,idEdit}}/>}
</section>
}
export default Admin