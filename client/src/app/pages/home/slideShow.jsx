'use client'
import { StateContext } from "@/app/context/stateContext"
import { formatDate } from "@/app/utils";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { GrFormNext,GrFormPrevious  } from "react-icons/gr";
const SlideShow = () => {
    const router = useRouter()
    const {coming} = use(StateContext)
    const [indexActive,setIndexActive] = useState(0)
    const next = () => {
        indexActive === 2 ? setIndexActive(0) : setIndexActive(indexActive + 1)
    }
    const prev = () => {
        indexActive === 0 ? setIndexActive(2) : setIndexActive(indexActive - 1)
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setIndexActive(indexActive => indexActive === 2 ? 0 : indexActive + 1);
        }, 7000);
        return () => clearInterval(interval); // Hủy interval khi component unmount
    }, []);
    return <section className="relative slide-show w-full h-[700px] flex items-center justify-around animateOpacity transition-all mb-10">
        <GrFormPrevious onClick={prev} className="absolute w-[40px] h-[40px] bg-slate-500 rounded-lg cursor-pointer z-30 left-10 md:left-20"/>
        <div className="relative w-[90%] h-full flex flex-wrap items-end rounded-lg border border-solid border-zinc-300 overflow-hidden z-20">
            {coming !== null && coming.map((c,i) => <img className={`${i === indexActive ? 'block' : 'hidden'} absolute w-full h-full object-cover animateShowItems z-0 transition-all`} src={c.background} key={`background-${c.id}`}/>)}
            <div className="w-full 2xl:w-2/5 h-2/4 2xl:h-full z-10 hidden sm:flex items-start 2xl:items-end p-1">
                {coming !== null && coming.map((c,i) => <img onClick={() => {setIndexActive(i)}} className={`${i === indexActive ? 'w-[180px] h-[260px] border-[3px] border-solid border-red-600 rounded-lg' : 'w-[150px] h-[230px]'} mx-2 mb-4 transition-all z-10`} src={c.thumbnails} key={`thumb-${c.id}`}/>)}
            </div>
            {coming !== null && coming.map((c,i) =>     
                <div className={`${i === indexActive ? 'flex' : 'hidden'} w-full 2xl:w-[55%] h-2/4 2xl:h-full overflow-hidden flex-wrap flex-col 2xl:flex-row justify-end 2xl:justify-center items-center content-center 2xl:content-end mb-4  rounded-lg z-10 transition-all`} key={`info-${c.id}`}>
                    <span
                        onClick={() => {router.push(`/film/detail/${c.id}/${c.title}`)}} 
                        className="w-3/4 lg:w-2/4 2xl:w-full h-auto xl:max-h-[150px] flex items-center justify-center font-sc-thin text-[25px] xl:text-[30px] 2xl:text-[40px] text-red-600 bg-zinc-700 rounded-lg text-center cursor-pointer">{c.title}</span>
                    <span className="bg-zinc-700 w-[180px] h-[40px] flex items-center justify-center my-2 font-sc-thin text-[20px] cursor-pointer rounded-lg text-red-600">
                        {formatDate(c.release)}
                    </span>
                </div>
            )}
        </div>
        <GrFormNext onClick={next} className="absolute w-[40px] h-[40px] bg-slate-500 rounded-lg cursor-pointer z-30 right-10 md:right-20"/>
       
    </section>
}
export default SlideShow