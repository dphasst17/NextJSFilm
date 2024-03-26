export const getUser = async(token) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/user`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
    }).then(res => res.json())
}
export const updateUser = async(token,data) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/user/update`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify(data)
    }).then(res => res.json())
}