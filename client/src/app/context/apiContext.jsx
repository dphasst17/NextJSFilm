'use client'
import { createContext, use, useEffect } from "react";
import { StateContext } from "./stateContext";
import { useFetchData } from "../hooks/useFetchData";
import { setCookie } from "cookies-next";
import { getUser } from "../api/apiUser";
import { getToken } from "../utils";
export const ApiContext = createContext({});
export const ApiProvider = ({children}) => {
    const {setFilm,setErrFilm,setComing,setErrComing,setUser} = use(StateContext)
    const {data:dataFilm,err:errFilm} = useFetchData('film','fetchAllFilmTicket')
    const {data:dataComing,err:errComing} = useFetchData('film','fetchFilmComing')
    const GetToken = getToken()
    useEffect(() => {
        dataFilm !== null && setFilm(dataFilm.data)
        dataComing !== null && setComing(dataComing.data)
    },[dataFilm,dataComing])
    useEffect(() => {
        errFilm !== null && setErrFilm(errFilm)
        errComing !== null && setErrComing(err)
    },[errFilm,errComing])
    
    useEffect(() => {
        const FetchUser = async () => {
            const token = await GetToken()
            if(token){
                getUser(token).then(
                    res => setUser(res.data)
                )
            }
        }
        FetchUser()
    },[])
    return (
        <ApiContext.Provider value={{}}>
            {children}
        </ApiContext.Provider>
    )
}