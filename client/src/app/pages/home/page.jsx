'use client'
import FilmLayout from "@/app/components/film"
import { StateContext } from "@/app/context/stateContext"
import {use} from "react"
import SlideShow from "./slideShow"
const Home =() => {
    const {film} = use(StateContext)
    return <div className="home w-full h-auto flex flex-wrap items-center justify-around overflow-x-hidden">
        <SlideShow />
        <div className="w-[90%] flex flex-wrap items-center justify-center">{film !== null && film.slice(0,6).map(f => <FilmLayout props={{f,flexNumber:12}}/>)}</div>
    </div>
}
export default Home