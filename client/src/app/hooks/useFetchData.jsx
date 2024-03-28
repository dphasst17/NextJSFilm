import { use, useEffect, useState } from "react";
import * as ApiFilm from "../api/apiFilm"
import * as ApiStatistical from "../api/apiStatistical"
import { StateContext } from "../context/stateContext";
const handleGetApi = (type,fName,key) => {
    let url;
    switch(type){
        case 'film':
            url = key ? ApiFilm[fName](key) : ApiFilm[fName]
            break;
        case 'statistical':
            url = key ? ApiStatistical[fName](key) : ApiStatistical[fName]
            break;
        default:
            break;
    }    
    return url
}
export const useFetchData = (type,fName) => {
    const [data ,setData] = useState(null);
    const [err,setErr] = useState(null);
    const {setIsLoading} = use(StateContext)
    let url = handleGetApi(type,fName)
    useEffect(() => {
        setIsLoading(true)
        url().then(res => {
            setIsLoading(false)
            if(res.status === 200 || res.status === 201){
                setData(res)
                return
            }
            throw Error({status:res.status,message:res.messages})
        })
        .catch(err => {
            setErr(err)
        })
    },[url])
    return {data,err};
}
export const useFetchDataByKey = (type,fName,key) => {
    const [data ,setData] = useState(null);
    const [err,setErr] = useState(null);
    useEffect(() => {
        let url = handleGetApi(type,fName,key)
        url.then(res => {
            if(res.status === 200 || res.status === 201){
                setData(res)
                return
            }
            throw Error({status:res.status,message:res.messages})
        })
        .catch(err => {
            setErr(err)
        })
      }, []);
    return {data,err};
}