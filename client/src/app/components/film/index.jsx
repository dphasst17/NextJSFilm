'use client'
import { useRouter } from "next/navigation"
import {Button} from "@nextui-org/react";
const FilmLayout = ({props}) => {
    const router = useRouter()
    return <div style={{flex:`2 2 ${props.flexNumber}%`}}
    className={`item relative w-[220px] min-w-[220px] max-w-[500px] h-[320px] p-2 mx-2 border-solid border-slate-300 border-[1px] mt-2 animateShowItems transition-all rounded-lg overflow-hidden cursor-pointer`} key={props.f.id}>
        <img src={props.f.thumbnails} className="w-full h-full object-cover rounded-lg transition-all"/>
        <div className="info absolute w-full h-2/4 -bottom-52 transition-all left-0 py-2">
            <div className="absolute overlay w-full h-full bg-zinc-950 opacity-60 z-10"></div>
            <div className="relative detail w-full h-full z-20 flex flex-wrap content-around justify-center">
                <div className="w-full h-[60%] flex items-center justify-center text-center font-sc-thin font-extrabold text-[18px]">{props.f.title}</div>
                <span className="font-sc-thin font-black text-[18px] text-red-500">Time:{props.f.time}</span>
                <div className="w-full h-[30%] flex justify-around items-center">
                    {props.isAdmin && <Button style={{margin:'2% 0'}} className="w-2/5" onPress={props.onOpen} 
                        onClick={() =>{props.setNameModal("edit");props.setIdEdit(props.f.id)}} color="primary" radius="sm">EDIT</Button>}
                    <Button style={{margin:'2% 0'}} className="w-2/5" color="default" radius="sm" onClick={() => {router.push(`/film/detail/${props.f.id}/${props.f.title}`)}}>DETAIL</Button>
                </div>
            </div>
        </div>
    </div>
}
export default FilmLayout