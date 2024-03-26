'use client'

import { getCookie, setCookie } from "cookies-next"
import { useCallback, useState } from "react"
import { getNewToken } from "../api/apiAuth"

export const formatDate = (date) => {
    return date.split("-").reverse().join("/")
}
export const pagination = (itemsInPage,dataLength) => {
    return dataLength % itemsInPage === 0 ? dataLength / itemsInPage : (dataLength / itemsInPage) + 1
}
export const setLocalStorage = (name,value) => {
    return localStorage.setItem(`${name}`,JSON.stringify(value))
}
export const getToken = () => {
    const get = useCallback(async() => {
        const access = getCookie('access')
        const refresh = getCookie('refresh')
        if(!access && refresh){
            const response = await getNewToken(refresh)
            const res = await response.json()
            setLocalStorage('expA',res.data.expAccess)
            setCookie('access',res.data.accessToken,{expires: new Date(res.data.expAccess * 1000)})
            return res.data.accessToken
        }
        if(!access && !refresh){
            localStorage.clear()
            return false
        }
        if(access){
            return access
        }
    },[])
    return get;
}