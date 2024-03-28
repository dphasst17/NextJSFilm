'use client'
import FilmLayout from "@/app/components/film"
import { StateContext } from "@/app/context/stateContext"
import { use, useState } from "react"
import { Pagination } from "@nextui-org/react";
import { pagination } from "@/app/utils";
const AdminFilm = ({ props }) => {
    const { film } = use(StateContext)
    const [activePage, setActivePage] = useState(1);
    return <section className="allFilm w-full mx-auto h-auto flex flex-wrap items-center justify-around">
        {film !== null && film.slice((10*activePage) - 10,10*activePage).map(f => <FilmLayout props={{ f, flexNumber: 19, isAdmin: true, onOpen: props.onOpen, setNameModal: props.setNameModal, setIdEdit: props.setIdEdit }} />)}
        {film !== null && <Pagination 
            className="w-full flex items-center justify-center my-2 animateOpacity transition-all animate-delay-0-3" 
            isCompact size="lg" showControls total={pagination(10,film.length)} initialPage={1} 
            onChange={(e) => {setActivePage(e)}}
        />}
    </section>
}
export default AdminFilm