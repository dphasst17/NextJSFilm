'use client'
import { createContext, useEffect, useState } from "react";

export const StateContext = createContext({});
export const StateProvider = ({children}) => {
    const [film,setFilm] = useState(null);
    const [errFilm,setErrFilm] = useState(null);
    const [coming,setComing] = useState(null);
    const [errComing,setErrComing] = useState(null);
    const [isLog,setIsLog] = useState(JSON.parse(localStorage.getItem('adminLog') || false))
    const [timeFrame,setTimeFrame] = useState([7,9,11,13,15,17,19,21,23])
    const arrKeyFilmDetail = ['director','cast','release','time']
    const [isUser,setIsUser] = useState(JSON.parse(localStorage.getItem('role') || 2) === 2 ? true : false)
    return (
        <StateContext.Provider value={{ 
            arrKeyFilmDetail,
            isLog,setIsLog,
            film,setFilm,
            errFilm,setErrFilm,
            coming,setComing,
            errComing,setErrComing,
            timeFrame,setTimeFrame,
            isUser,setIsUser
        }}>
            {children}
        </StateContext.Provider>
    )
}