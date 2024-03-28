'use client'
import React, { use, useEffect, useState } from 'react'
import { Input, Button, Code, Skeleton, Image } from "@nextui-org/react"
import { StateContext } from '@/app/context/stateContext'
import { useRouter } from 'next/navigation';
import { TbUserEdit } from "react-icons/tb";
import { RiLockPasswordLine } from "react-icons/ri";
import { useDisclosure, Pagination } from "@nextui-org/react";
import { pagination } from '@/app/utils';
import ModalEditUser from './modal/edit';
import ModalUpdatePassword from './modal/password';
const Skeletons = () => {
    return <div className="w-4/5 h-[80px] flex items-center gap-3 my-2">
        <div className='h-full'>
            <Skeleton className="flex rounded-lg w-20 h-full" />
        </div>
        <div className="w-full h-full flex flex-col gap-2">
            <Skeleton className="h-2/4 w-3/5 rounded-lg" />
            <Skeleton className="h-2/4 w-4/5 rounded-lg" />
        </div>
    </div>
}
const Title = ({ props }) => {
    return <div className='title w-full h-[50px] flex items-center justify-center'>
        <Code className='cursor-pointer font-bold text-[25px]' size='lg'>{props.value}</Code>
    </div>
}
const IndexUser = () => {
    const router = useRouter()
    const { user, isLog } = use(StateContext);
    const [modalName, setModalName] = useState("");
    const [activePage, setActivePage] = useState(1)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    useEffect(() => {
        isLog !== "" && !isLog && router.push('/auth')
    }, [])
    useEffect(() => {user !== null && console.log(user)},[user])
    return isLog && <div className='user w-full h-auto min-h-screen flex flex-wrap justify-around content-start'>
        <div className='point w-full h-[30px] my-4 px-2 flex items-center'>
            POINT:
            <Button className='h-[30px] flex items-center justify-center mx-2' radius='sm' color='default'>{user?.map(u => u.point)} </Button>
        </div>
        <section className='info w-2/4 h-auto min-h-[300px] flex flex-wrap justify-center content-start'>
            <Title props={{ value: 'USER' }} />
            {user?.map(u => <div className='w-2/5'>
                <Input label="Full name" value={u.name} className='my-2' />
                <Input label="Phone" value={u.phone} className='my-2' />
                <Input label="Email" value={u.email} className='my-2' />
                <Button isIconOnly color='primary' radius='sm' className='mx-1' onPress={onOpen} onClick={() => { setModalName('password') }}><RiLockPasswordLine /></Button>
                <Button isIconOnly color='primary' radius='sm' className='mx-1' onPress={onOpen} onClick={() => { setModalName('edit') }}><TbUserEdit /></Button>
            </div>)}
        </section>
        <section className='ticket w-2/4 h-auto min-h-[300px] flex flex-wrap justify-center'>
            <Title props={{ value: 'PURCHASED TICKET' }} />
            <div className='items w-full h-auto flex flex-wrap justify-center'>
                {!user && <><Skeletons />
                    <Skeletons />
                    <Skeletons />
                    <Skeletons />
                    <Skeletons /></>}
                <div className='ticket w-4/5 h-auto min-h-[650px] flex flex-wrap justify-center'>
                    {user?.map(u => u.ticket)[0].slice((3*activePage) - 3,3*activePage).map(t => <div style={{ backgroundImage: `url(${t.background})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '100% 120%' }} className='ticketDetail w-full h-[200px] flex flex-wrap my-1 rounded-lg' key={t.idTicket}>
                        <div className='images w-1/5 h-full flex items-center justify-center'>
                            <Image src={t.thumbnails} className='w-full h-full max-h-[190px] object-cover' />
                        </div>
                        <div className="contentTicket w-4/5 h-full flex flex-wrap justify-around py-1">
                            <Code className='w-[95%] text-center flex justify-center items-center cursor-pointer font-bold text-[20px] bg-zinc-900 bg-opacity-80 truncate'>#{t.idFilm}</Code>
                            <Code className='w-[95%] text-center flex justify-center items-center cursor-pointer font-bold text-[25px] bg-zinc-900 bg-opacity-80 truncate' size='lg' color='default'>{t.title}</Code>
                            <Code className='w-[95%] text-center flex justify-center items-center cursor-pointer font-bold text-[20px] bg-zinc-900 bg-opacity-80 truncate'>Ticket id : {t.idTicket}</Code>
                            <Code className='w-[30%] text-center cursor-pointer font-bold text-[20px] bg-zinc-900 bg-opacity-80 truncate'>Time: {t.timeFrame}:00 {t.timeFrame < 12 ? 'AM' : 'PM'}</Code>
                            <Code className='w-2/5 text-center cursor-pointer font-bold text-[20px] bg-zinc-900 bg-opacity-80 truncate'>Date: {t.date}</Code>
                            <Code className='w-1/4 text-center cursor-pointer font-bold text-[20px] bg-zinc-900 bg-opacity-80 truncate'>Count: {t.count}</Code>
                        </div>
                    </div>)}
                </div>
                <Pagination
                    className="w-full flex items-center justify-center my-2 animateOpacity transition-all animate-delay-0-3"
                    isCompact size="lg" showControls total={pagination(3, user?.map(u => u.ticket)[0].length)} initialPage={1}
                    onChange={(e) => { setActivePage(e) }}
                />
            </div>
        </section>
        {modalName === "edit" && <ModalEditUser props={{ isOpen, onOpenChange, setModalName }} />}
        {modalName === "password" && <ModalUpdatePassword props={{ isOpen, onOpenChange }} />}
    </div>
}

export default IndexUser