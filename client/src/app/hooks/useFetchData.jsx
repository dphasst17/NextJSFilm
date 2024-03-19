import { useEffect, useState } from "react";
import * as ApiFilm from "../api/apiFilm"
const handleGetApi = (type,fName,key) => {
    let url;
    switch(type){
        case 'film':
            url = key ? ApiFilm[fName](key) : ApiFilm[fName]
            break;
        default:
            break;
    }    
    return url
}
export const useFetchData = (type,fName) => {
    const [data ,setData] = useState(null);
    const [err,setErr] = useState(null)
    let url = handleGetApi(type,fName)
    useEffect(() => {
        url().then(res => {
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
      }, [type,fName,key]);
    return {data,err};
}