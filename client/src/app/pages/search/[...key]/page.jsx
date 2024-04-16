'use client'
import FilmLayout from "@/app/components/film";
import { useFetchDataByKey } from "@/app/hooks/useFetchData";
import { useParams } from "next/navigation"
import { useEffect } from "react";

const Search = () => {
    const param = useParams();
    const {data:dataFilm,err:errFilm} = useFetchDataByKey('film','fetchSearchFilm',decodeURIComponent(param.key[0]).toUpperCase())
    return <section className="w-full h-auto flex flex-wrap justify-center">
        {dataFilm?.data.map(f => <div className="w-[240px]"><FilmLayout props={{f,flexNumber:15}} key={`search-${f.title}`}/></div>)}
    </section>
}
export default Search