'use client'
import FilmLayout from "@/app/components/film"
import { StateContext } from "@/app/context/stateContext"
import { use, useState } from "react"
import {Pagination} from "@nextui-org/react";
import { pagination } from "@/app/utils";

const FilmContent = () => {
    const {film,coming} = use(StateContext);
    const [activePage,setActivePage] = useState(1)
    return <div className="Film-container w-full h-auto">
        <h1 className="w-full text-center font-sc-thin text-[50px] text-red-500 my-2">Coming Soon</h1>
        <div className="allFilm w-full max-w-[1600px] mx-auto h-auto flex flex-wrap items-center justify-around">
            {coming !== null && coming.map(f => <FilmLayout props={{f,flexNumber:15}}/>)}
        </div>
        <h1 className="w-full text-center font-sc-thin text-[50px] text-red-500 mt-8 mb-2">All Film</h1>
        <div className="allFilm w-full max-w-[1600px] mx-auto h-auto min-h-[650px] flex flex-wrap items-start justify-around overflow-hidden">
            {film !== null && film.slice((8*activePage) - 8,8*activePage).map(f => <FilmLayout props={{f,flexNumber:24}}/>)}
        </div>
        {film !== null && <Pagination 
            className="w-full flex items-center justify-center my-2 animateOpacity transition-all animate-delay-0-3" 
            isCompact size="lg" showControls total={pagination(8,film.length)} initialPage={1} 
            onChange={(e) => {setActivePage(e)}}
        />}
    </div>
}
export default FilmContent;