'use client'
import { createContext, use, useEffect } from "react";
import { StateContext } from "./stateContext";
import { useFetchData } from "../hooks/useFetchData";
import { getUser } from "../api/apiUser";
import { getToken } from "../utils";
export const ApiContext = createContext({});
export const ApiProvider = ({children}) => {
    const {isLog,setFilm,setErrFilm,setComing,setErrComing,setUser,setIsUser,setIsLog,setManager} = use(StateContext)
    const {data:dataFilm,err:errFilm} = useFetchData('film','fetchAllFilmTicket');
    const {data:dataComing,err:errComing} = useFetchData('film','fetchFilmComing');
    const { data:dataPopular, err:errPopular } = useFetchData('statistical','popular');
    const { data:dataUser, err:errUser } = useFetchData('statistical','user');
    const { data:dataTicket, err:errTicket } = useFetchData('statistical','ticket');
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
        const role = JSON.parse(localStorage.getItem('role') || 2)
        if(isLog && role !== 2){
            dataPopular !== null && setManager((prevData) => ({...prevData,popular:dataPopular.data[0]}))
            dataUser !== null && setManager((prevData) => ({...prevData,user:dataUser.data}))
            dataTicket !== null && setManager((prevData) => ({...prevData,ticket:dataTicket.data}))
        }
    },[isLog,dataPopular,dataUser,dataTicket])
    useEffect(() => {
        const FetchUser = async () => {
            const token = await GetToken()
            if(token){
                getUser(token).then(
                    res => setUser(res.data)
                )
            }
        }
        isLog && FetchUser()
    },[isLog])
    return (
        <ApiContext.Provider value={{}}>
            {children}
        </ApiContext.Provider>
    )
}