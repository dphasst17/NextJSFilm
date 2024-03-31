'use client'
import React, { useEffect, useState } from 'react'
import { Button } from "@nextui-org/react"
import { useFetchDataByKey } from '@/app/hooks/useFetchData'
import { io } from 'socket.io-client';
const Seat = ({ props }) => {
  const key = { date: props.day.split('/').reverse().join('-'), time: props.time.toString() }
  const { data, err: errSeat } = useFetchDataByKey('film', 'getSeatByDate', key);
  const [seatData, setSeatData] = useState([])
  const col = ['a', 'b', 'c', 'd', 'e', 'f']
  const row = [1, 2, 3, 4, 5, 6, 7]
  useEffect(() => {
    data !== null && setSeatData(data.data)
  }, [data])
  useEffect(() => {
    // Kết nối đến server
    const socket = io(`${process.env.NEXT_PUBLIC_URL}`);
    // Lắng nghe sự kiện 'seat-changed'
    socket.on('seat-changed', (newTicket) => {
      if (props.day === newTicket.date && props.time === newTicket.time) {
        setSeatData([...seatData,newTicket.seat])
      }
    });

    // Dọn dẹp khi component unmount
    return () => {
      socket.off('seat-changed');
      socket.close();
    };
  }, []);
  useEffect(() => {
    seatData !== null && console.log(seatData)
  },[seatData])
  return <section className='seat w-full max-w-[1000px] min-w-[300px] h-[600px] flex flex-wrap justify-center bg-zinc-900 bg-opacity-70 p-2 rounded-lg'>
    <div className='w-full h-[8%] flex bg-zinc-900 rounded-lg'>
      <div className='w-[10%] h-full flex items-center justify-center'>COLUMN</div>
      <div className='w-[90%] h-full flex items-center justify-center'>SEAT POSITION</div>
    </div>
    <div className='w-[10%] h-[92%] flex flex-col justify-around items-center'>
      {col.map(c => <div className=''>{c.toLocaleUpperCase()}</div>)}
    </div>
    <div className='w-[90%] h-[92%] flex flex-col justify-around'>
      {col.map(c =>
        <div className='w-full flex flex-wrap justify-around'>
          {row.map(r =>
            <Button color={props.seat === `${c}${r}` ? 'primary' : (seatData?.includes(`${c.toLocaleUpperCase()}${r}`) ? 'success' : 'default')}
              radius="sm"
              className='text-white'
              onClick={() => { !seatData?.includes(`${c.toLocaleUpperCase()}${r}`) && props.setSeat(`${c}${r}`) }}>
              {c.toLocaleUpperCase()}{r}
            </Button>
          )}
        </div>)}
    </div>
  </section>
}

export default Seat