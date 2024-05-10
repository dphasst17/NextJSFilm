'use client'
import { useEffect } from "react";
import FilmContent from ".";

const Film = () => {
    useEffect(() => {
        document.title = 'Film'
    },[])
    return <FilmContent />
}
export default Film