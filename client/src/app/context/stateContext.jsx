'use client'
import { createContext, useEffect, useState } from "react";

export const StateContext = createContext({});
export const StateProvider = ({children}) => {
    const [user,setUser] = useState(null)
    const [film,setFilm] = useState(null);
    const [errFilm,setErrFilm] = useState(null);
    const [coming,setComing] = useState(null);
    const [errComing,setErrComing] = useState(null);
    const [manager,setManager] = useState(null);
    const [errManager,setErrManager] = useState(null);
    const [isLog,setIsLog] = useState("")
    const [timeFrame,setTimeFrame] = useState([7,9,11,13,15,17,19,21,23])
    const arrKeyFilmDetail = ['director','cast','release','time']
    const [isLoading,setIsLoading] = useState(false)
    const [isUser,setIsUser] = useState()
    useEffect(() => {
        setIsUser(JSON.parse(localStorage.getItem('role') || 2) === 2 ? true : false)
        setIsLog(JSON.parse(localStorage.getItem('isLog') || false))
    },[])
    useEffect(() => {manager !== null && console.log(manager)},[manager])
    return (
        <StateContext.Provider value={{ 
            arrKeyFilmDetail,
            user,setUser,
            isLog,setIsLog,
            film,setFilm,
            errFilm,setErrFilm,

            manager,setManager,
            errManager,setErrManager,

            coming,setComing,
            errComing,setErrComing,
            
            timeFrame,setTimeFrame,
            isUser,setIsUser,
            isLoading,setIsLoading
        }}>
            {children}
        </StateContext.Provider>
    )
}