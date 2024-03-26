'use client'
import { useFetchDataByKey } from "@/app/hooks/useFetchData"
import { useParams, useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import { Button, ButtonGroup, Input } from "@nextui-org/react";
import { StateContext } from "@/app/context/stateContext"
import { formatDate } from "@/app/utils";
import BreadcrumbItems from "./breadcrumbItem";
import { useForm } from "react-hook-form";
import Payment from "./paypal";
import Seat from "./seat";
const Detail = () => {
    const { arrKeyFilmDetail, user, isLog } = use(StateContext)
    const param = useParams();
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [urlBackground, setUrlBackground] = useState("")
    const [data, setData] = useState(null);
    const [time, setTime] = useState(0);
    const [day, setDay] = useState(0);
    const [seat,setSeat] = useState('')
    const [dateArray, setDateArray] = useState([]);
    const [isPaypal, setIsPaypal] = useState(false);
    const [stateForm, setStateForm] = useState({ info: { name: '', email: '', phone: '' }, timeFrame: 0, date: '', count: 1, idFilm: param?.id[0] })
    const { data: result, err } = useFetchDataByKey('film', 'fetchFilmDetail', param?.id[0])
    const role = JSON.parse(localStorage.getItem('role') || 2)
    useEffect(() => {
        result !== null && setData(result.data)
        result !== null && setUrlBackground(result.data.map(e => e.background))
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
        if (!isLog) {
            return router.push('/auth')
        }
        if (time === 0) {
            alert('Please select a time frame!')
            return
        }
        if (day === 0) {
            alert('Please select a date!')
            return
        }
        setStateForm({ info: { name: data.name, email: data.email, phone: data.phone }, timeFrame: time, date: day, count: 1, idFilm: param?.id[0], orderId: '' })
        setIsPaypal(true)
    }
    const inputValue = ['name', 'email', 'phone']
    return <div className="relative detailFilm w-full h-auto pt-10" style={{ backgroundImage: `url('${urlBackground}')`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', backgroundAttachment: "fixed" }}>
        <div className="overlay absolute w-full h-full inset-0 bg-zinc-800 opacity-50 z-0"></div>
        <BreadcrumbItems props={{ title: data?.map(d => d.title) }} />
        {data !== null && data?.map(d => <div className="relative w-full h-auto min-h-[300px] flex flex-wrap" key={d._id}>
            <div className="images relative w-full flex content-start justify-center h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]">
                <div className="background absolute w-[98%] h-4/5 z-0 rounded-lg border border-solid border-zinc-200 animateShowItems transition-all animate-delay-0 p-2">
                    <img src={d.background} className="w-full h-full rounded-lg object-cover animateShowItems" alt="" />
                </div>
                <div className="absolute thumbnails w-[200px] h-[250px] rounded-lg bottom-0 border border-solid border-zinc-200 animateShowItems transition-all animate-delay-0" >
                    <img className="w-full h-full rounded-lg object-cover animateShowItems" src={d.thumbnails} />
                </div>
            </div>
            <div className="filmInfo w-full h-auto flex flex-wrap justify-center items-center mt-5 animateOpacity transition-all animate-delay-0-1">
                <span className="font-sc-thin w-full h-auto text-center text-[30px] font-extrabold text-red-600">{d.title}</span>
                <span className="font-sc-thin w-full h-auto text-center text-[30px] font-extrabold mt-1">{d.des}</span>
                <div className="infoFilm w-full h-auto flex flex-wrap justify-center">
                    {arrKeyFilmDetail.map(k => <div className="item w-2/5 h-auto min-h-[50px] flex items-center bg-zinc-700 rounded-lg m-1 px-2">
                        <span className="font-bold text-[20px]">
                            {k.toUpperCase()}: <span className="font-bold text-[20px]">{k === 'release' ? formatDate(d[k]) : d[k]}</span>
                        </span>

                    </div>)}

                </div>
                <span className="font-sc-thin w-full h-auto text-center text-[40px] font-extrabold text-red-600 mt-4">Trailer</span>
                <iframe
                    className="w-4/5 h-auto min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[800px] border border-solid rounded-lg border-zinc-100 mb-10"
                    src={`https://www.youtube.com/embed/${d.trailer.split('v=')[1]}`}
                    title="YouTube video player"
                    crossOrigin="anonymous"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            {role !== 0 && <div className="frame w-full h-auto min-h-[400px] flex flex-wrap justify-center content-start">
                <h1 className="w-full text-center font-sc-thin font-extrabold text-[40px] text-red-600 my-4">Time frame</h1>
                <ButtonGroup size="lg">{d.frame.map(t => <Button className="transition-all" onClick={() => { setTime(t) }} color={t === time ? 'primary' : 'default'} radius="sm">{t}:00 {t < 12 ? 'AM' : 'PM'}</Button>)}</ButtonGroup>
                <h1 className="w-full text-center font-sc-thin font-extrabold text-[40px] text-red-600 my-4">Date</h1>
                <div className="w-4/5 flex flex-wrap justify-around">
                    {dateArray.map(d => <Button className="w-[13%] transition-all my-1" radius="sm" size="lg" onClick={() => { setDay(d) }} color={d === day ? 'primary' : 'default'}>{d}</Button>)}
                </div>
                {time !== 0 && day !== 0 && <Seat props={{seat,setSeat,time,day}}/>}
                <h1 className="w-full text-center font-sc-thin font-extrabold text-[40px] text-red-600 my-4">Form</h1>
                <div className="form w-3/5 h-auto mb-8 flex flex-wrap justify-evenly z-10">
                    {user?.map(u => inputValue.map(i =>
                        <Input {...register(i, { required: true })} radius="sm" isInvalid={errors[i] ? true : false} type="text"
                            label={i.toUpperCase()} defaultValue={u[i]} className={`${i === 'email' ? 'w-2/5' : 'w-1/5'} mx-1`} />
                    ))}
                    <Input {...register('count', { required: true })} radius="sm" type="text" label="Ticket count" value={1} className="w-[15%]" />
                    {!isPaypal && <div className="w-full flex items-center justify-center my-2">
                        <Button onClick={() => { handleSubmit(onSubmit)() }} color="success" size="lg" className="my-2 w-[180px] text-[20px] font-sc-thin text-white">Payment</Button>
                    </div>}
                    {isPaypal && <Payment props={{ setIsPaypal, setStateForm, stateForm,seat, count: 1, price: 1, title: d.title, background: d.background, thumbnails: d.thumbnails }} />}
                </div>
            </div>}
        </div>)}
    </div>
}
export default Detail