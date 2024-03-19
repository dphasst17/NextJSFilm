export const Login = async(data) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/auth/login`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then(res => res.json())
}
export const Register = async(data) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/auth/register`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then(res => res.json())
}