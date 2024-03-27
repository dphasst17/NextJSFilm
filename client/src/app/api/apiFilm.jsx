export const fetchAllFilmTicket = async() => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/film`).then(res => res.json())
}
export const fetchFilmComing = async(id) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/film/coming`).then(res => res.json())
}
export const fetchFilmDetail = async(id) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/film/detail/${id}`).then(res => res.json())
}
export const fetchSearchFilm = async(keyword) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/film/search`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({value:keyword})
    }).then(res => res.json())
}
export const fetchBuyTicket = async(token,stateForm) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/film/buy`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify(stateForm)
    }).then(res => res.json())
}
export const fetchCreateFilm = async(token,data) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/film/`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify(data)
    }).then(res => res.json())
}
export const fetchUpdateFilm = async(data) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/film/`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then(res => res.json())
}
export const confirmTicket = async(value) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/film/ticket/confirm`,{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({id:value})
    }).then(res => res.json())
}
export const getSeatByDate = async(data) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/film/seat/${data.date}/${data.time}`).then(res => res.json())
}