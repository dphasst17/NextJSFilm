'use client'
import { useFetchDataByKey } from "@/app/hooks/useFetchData"
import { useParams } from "next/navigation"
import { use, useEffect, useState } from "react"
import { Button, ButtonGroup, Input } from "@nextui-org/react";
import { StateContext } from "@/app/context/stateContext"
import { formatDate } from "@/app/utils";
import BreadcrumbItems from "./breadcrumbItem";
import { useForm } from "react-hook-form";
import Payment from "./paypal";
const Detail = () => {
    const {arrKeyFilmDetail } = use(StateContext)
    const param = useParams()
    const { register, handleSubmit, formState: { errors }, } = useForm()
    const [data, setData] = useState(null);
    const [time, setTime] = useState(0);
    const [day, setDay] = useState(0)
    const [dateArray, setDateArray] = useState([]);
    const [isPaypal,setIsPaypal] = useState(false);
    const [stateForm,setStateForm] = useState({info:{name:'',email:'',phone:''},timeFrame:0,date:'',count:1,idFilm:param?.id[0]})
    const { data: result, err } = useFetchDataByKey('film', 'fetchFilmDetail', param?.id[0])
    const isLog = JSON.parse(localStorage.getItem('adminLog') || false)
    useEffect(() => {
        result !== null && setData(result.data)
    }, [result])
    useEffect(() => {
        document.title = data ? data.map(d => d.title) : 'Film'
        if (data !== null) {
            let today = new Date(data.map(d => d.release));
            let nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
            let tempDateArray = [];

            while (today <= nextMonth) {
                tempDateArray.push((new Date(today)).toISOString().split("T")[0].split("-").reverse().join("/"));
                today.setDate(today.getDate() + 1);
            }

            setDateArray(tempDateArray);
        }
    }, [data])
    const onSubmit = data => {
        if(time === 0) {
            alert('Please select a time frame!')
            return
        }
        if(day === 0) {
            alert('Please select a date!')
            return
        }
        
        setStateForm({info:{name:data.name,email:data.email,phone:data.phone},timeFrame:time,date:day,count:1,idFilm:param?.id[0],orderId:''})
        setIsPaypal(true)
    }

    return <div className="detailFilm w-full h-auto">
        <BreadcrumbItems props={{ title: data?.map(d => d.title) }} />
        {data !== null && data?.map(d => <div className="w-full h-auto min-h-[300px] flex flex-wrap" key={d._id}>
            <div className="images relative w-full flex content-start justify-center h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]">
                <div className="background absolute w-[98%] h-4/5 z-0 rounded-lg border border-solid border-zinc-200 animateShowItems transition-all animate-delay-0 p-2">
                    <img src={d.background} className="w-full h-full rounded-lg object-cover animateShowItems" alt="" />
                </div>
                <div className="absolute thumbnails w-[200px] h-[250px] rounded-lg bottom-0 border border-solid border-zinc-200 animateShowItems transition-all animate-delay-0" >
                    <img className="w-full h-full rounded-lg object-cover animateShowItems" src={d.thumbnails} />
                </div>
            </div>
            <div className="filmInfo w-full h-auto flex flex-wrap justify-center items-center mt-5 animateOpacity transition-all animate-delay-0-1">
                <span className="font-sc-thin w-full h-auto text-center text-[30px] font-extrabold text-red-400">{d.title}</span>
                <span className="font-sc-thin w-full h-auto text-center text-[30px] font-extrabold mt-1">{d.des}</span>
                <div className="infoFilm w-full h-auto flex flex-wrap justify-center">
                    {arrKeyFilmDetail.map(k => <div className="item w-[90%] h-auto min-h-[50px] flex items-center border-b border-b-solid border-zinc-200">
                        <span className="font-bold text-[20px]">
                            {k.toUpperCase()}: <span className="font-bold text-[20px]">{k === 'release' ? formatDate(d[k]) : d[k]}</span>
                        </span>

                    </div>)}

                </div>
                <span className="font-sc-thin w-full h-auto text-center text-[40px] font-extrabold text-red-400 mt-4">Trailer</span>
                <iframe
                    className="w-4/5 h-auto min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[800px] border border-solid rounded-lg border-zinc-100 mb-10"
                    src={`https://www.youtube.com/embed/${d.trailer.split('v=')[1]}`}
                    title="YouTube video player"
                    crossOrigin="anonymous"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            {!isLog && <div className="frame w-full h-auto min-h-[400px] flex flex-wrap justify-center content-start">
                <h1 className="w-full text-center font-sc-thin font-extrabold text-[40px] text-red-400 my-4">Time frame</h1>
                <ButtonGroup size="lg">{d.frame.map(t => <Button className="transition-all" onClick={() => { setTime(t) }} color={t === time ? 'primary' : 'default'} radius="sm">{t}:00 {t < 12 ? 'AM' : 'PM'}</Button>)}</ButtonGroup>
                <h1 className="w-full text-center font-sc-thin font-extrabold text-[40px] text-red-400 my-4">Date</h1>
                <div className="w-4/5 flex flex-wrap justify-around">
                    {dateArray.map(d => <Button className="w-[13%] transition-all my-1" radius="sm" size="lg" onClick={() => { setDay(d) }} color={d === day ? 'primary' : 'default'}>{d}</Button>)}
                </div>
                <h1 className="w-full text-center font-sc-thin font-extrabold text-[40px] text-red-400 my-4">Form</h1>
                <div className="form w-3/5 h-auto mb-8 flex flex-wrap justify-evenly">
                    <Input {...register('name', { required: true })} variant="bordered" isInvalid={errors.name ? true : false} type="text" label="Full name" className="w-1/5" />
                    <Input {...register('email', { required: true })} variant="bordered" isInvalid={errors.email ? true : false} type="email" label="Email" className="w-2/5" />
                    <Input {...register('phone', { required: true })} variant="bordered" isInvalid={errors.phone ? true : false} type="text" label="Phone" className="w-1/4" />
                    <Input {...register('count', { required: true })} type="text" label="Ticket count" value={1} className="w-[15%]" />
                    {!isPaypal && <div className="w-full flex items-center justify-center my-2">
                        <Button onClick={() => { handleSubmit(onSubmit)() }} color="success" size="lg" className="my-2 w-[180px] text-[20px] font-sc-thin text-white">Payment</Button>
                    </div>}
                    {isPaypal && <Payment props={{setIsPaypal,setStateForm,stateForm,count:1,price:3,title:d.title}}/>}
                </div>
            </div>}
        </div>)}
    </div>
}
export default Detail