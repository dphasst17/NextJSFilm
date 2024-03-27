'use client'
import { createContext, use, useEffect } from "react";
import { StateContext } from "./stateContext";
import { useFetchData } from "../hooks/useFetchData";
import { getUser } from "../api/apiUser";
import { getToken } from "../utils";
export const ApiContext = createContext({});
export const ApiProvider = ({children}) => {
    const {setFilm,setErrFilm,setComing,setErrComing,setUser,setIsUser,setIsLog} = use(StateContext)
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
        setIsUser(JSON.parse(localStorage.getItem('role') || 2) === 2 ? true : false)
        setIsLog(JSON.parse(localStorage.getItem('isLog') || false))
    },[])
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