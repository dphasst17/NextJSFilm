'use client'
import { createContext, use, useEffect } from "react";
import { StateContext } from "./stateContext";
import { useFetchData } from "../hooks/useFetchData";
import { setCookie } from "cookies-next";
export const ApiContext = createContext({});
export const ApiProvider = ({children}) => {
    const {setFilm,setErrFilm,setComing,setErrComing} = use(StateContext)
    const {data:dataFilm,err:errFilm} = useFetchData('film','fetchAllFilmTicket')
    const {data:dataComing,err:errComing} = useFetchData('film','fetchFilmComing')
    useEffect(() => {
        dataFilm !== null && setFilm(dataFilm.data)
        dataComing !== null && setComing(dataComing.data)
    },[dataFilm,dataComing])
    useEffect(() => {
        errFilm !== null && setErrFilm(errFilm)
        errComing !== null && setErrComing(err)
    },[errFilm,errComing])
    useEffect(() => {setCookie('cookieTest','test',{maxAge: 60 * 6 * 24 })},[])
    return (
        <ApiContext.Provider value={{ 
        }}>
            {children}
        </ApiContext.Provider>
    )
}