'use client'
import { StateContext } from "@/app/context/stateContext"
import { Code, } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { use } from "react";
import { FcConferenceCall,FcPlus,FcFilm,FcBullish } from "react-icons/fc";
const CardDetail = ({props}) => {
  return <Code radius="sm" className="w-[24%] min-w-[280px] 2xl:min-w-[200px] h-[150px] flex items-center my-1">
    <div className="icon w-1/5 h-full flex items-center justify-center"><props.icon className="w-full h-full" /></div>
    <div className="content w/3/5 h-full flex flex-wrap content-center pl-4">
      <h1 className="w-full h-[30px] my-2 flex items-center font-sc-thin text-[40px] text-zinc-300">{props.value}</h1>
      <h1 className="w-full h-[30px] my-2 flex items-center font-sc-thin text-[35px] text-zinc-400">{props.title}</h1>
    </div>
  </Code>
}
const Card = () => {
  const { manager } = use(StateContext);
  const router = useRouter()
  return <section className="w-[95%] h-auto flex flex-wrap justify-around items-center">
    <Code radius="sm" className="min-w-[280px] w-3/4 2xl:w-[30%] h-[150px] flex items-center" style={{ backgroundImage: `url(${manager?.popular?.background})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <img src={manager?.popular?.thumbnails} className="w-1/4 h-full object-contain rounded-xl" />
      <div className="w-[75%] h-full flex flex-wrap justify-around content-start bg-zinc-900 bg-opacity-65 rounded-lg p-1 cursor-pointer" onClick={() => { router.push(`/film/detail/${manager?.popular?.idFilm}/${manager?.popular?.title}`) }}>
        <h1 className="w-full text-center font-sc-thin text-[20px]">MOST POPULAR FILM</h1>
        <div className="w-full h-2/4 flex items-center justify-center font-sc-thin text-[20px]">
          {manager?.popular?.title}
        </div>
        <div className="w-2/4 h-1/4 flex items-center justify-center font-sc-thin text-[20px] truncate">
          <span className="truncate">Director: {manager?.popular?.director}</span>
        </div>
        <div className="w-2/4 h-1/4 flex items-center justify-center font-sc-thin text-[20px] truncate">Count ticket: {manager?.popular?.countTicket}</div>
      </div>
    </Code>
    <div className="w-full 2xl:w-[70%] h-auto flex flex-wrap items-center justify-around">
      <CardDetail props={{icon:FcConferenceCall,value:manager?.user.total,title:'TOTAL USER'}}/>
      <CardDetail props={{icon:FcPlus,value:manager?.user.new,title:'NEW USER'}}/>
      <CardDetail props={{icon:FcFilm ,value:manager?.ticket?.ticketSold,title:'TICKET SOLD'}}/>
      <CardDetail props={{icon:FcBullish ,value:`${manager?.ticket?.totalRevenue} $`,title:'REVENUE'}}/>
    </div>
  </section>

}

export default Card