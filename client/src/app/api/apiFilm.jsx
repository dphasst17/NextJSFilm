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
export const fetchBuyTicket = async(stateForm) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/film/buy`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(stateForm)
    }).then(res => res.json())
}
export const fetchCreateFilm = async(data) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/film/`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then(res => res.json())
}