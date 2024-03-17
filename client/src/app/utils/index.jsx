'use client'
export const formatDate = (date) => {
    return date.split("-").reverse().join("/")
}
export const pagination = (itemsInPage,dataLength) => {
    return dataLength % itemsInPage === 0 ? dataLength / itemsInPage : (dataLength / itemsInPage) + 1
}