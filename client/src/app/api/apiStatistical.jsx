export const popular = async() => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/statistical/popular`).then(res => res.json())
}
export const user = async() => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/statistical/user`).then(res => res.json())
}
export const ticket = async() => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/statistical/ticket`).then(res => res.json())
}