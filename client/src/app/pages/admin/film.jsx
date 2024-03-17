'use client'
import FilmLayout from "@/app/components/film"
import { StateContext } from "@/app/context/stateContext"
import { use } from "react"

const AdminFilm = ({props}) => {
    const {film} = use(StateContext)
    
    return <section className="allFilm w-full mx-auto h-auto flex flex-wrap items-center justify-around">
    {film !== null && film.map(f => <FilmLayout props={{f,flexNumber:19,isAdmin:true,onOpen:props.onOpen,setNameModal:props.setNameModal,setIdEdit:props.setIdEdit}}/>)}
</section>
}
export default AdminFilm