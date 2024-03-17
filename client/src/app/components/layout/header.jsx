'use client'
import { StateContext } from "@/app/context/stateContext";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Input, Button } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
const Header = () => {
    const [isNav, setIsNav] = useState(true)
    const { isLog, setIsLog } = use(StateContext);
    const [searchValue, setSearchValue] = useState("")
    const param = usePathname()
    const router = useRouter()
    const arrNav = [
        {
            id: 1,
            title: "home",
            url: "/",
        },
        {
            id: 2,
            title: "film",
            url: "/film",
        },
        {
            id: 3,
            title: "contact",
            url: "/contact",
        },
    ]
    useEffect(() => { console.log(isLog) }, [isLog])
    return <header className="relative w-full h-[5vh] flex flex-wrap items-center justify-start mt-1 px-2 z-50">
        <div onClick={() => { setIsNav(!isNav) }} className="w-[35px] h-[35px] bg-zinc-700 rounded-lg top-2 cursor-pointer flex items-center justify-center">
            <FiChevronRight className={`w-full h-full transition-all ${isNav ? 'rotate-[270deg]' : 'rotate-[90deg]'}`} />
        </div>
        <nav className={`w-2/5 h-full flex top-20 transition-all overflow-x-hidden`}>
            {arrNav.map(a => <div className={`navDetail flex items-center justify-center mx-2 w-[100px] ${isNav ? 'animateNavBar' : 'animateNavBarReverse'} my-2 ${param === a.url ? 'bg-zinc-700 font-sc-thin' : ' border-zinc-300'} border border-solid animate-delay-0-${a.id}  hover:bg-zinc-700 cursor-pointer rounded-md transition-all`}
                onClick={() => { router.push(a.url) }} key={a.id}>
                {a.title.toLocaleUpperCase()}
            </div>)}
            {isLog &&
                <>
                    <div onClick={() => { router.push('/admin') }} className={`navDetail flex items-center justify-center mx-2 w-[100px] ${isNav ? 'animateNavBar' : 'animateNavBarReverse'} ${param === '/admin' ? 'bg-zinc-700 font-sc-thin' : ' border-zinc-300'} my-2  border border-solid animate-delay-0-3  hover:bg-zinc-700 cursor-pointer rounded-md transition-all`} >
                        MANAGE
                    </div>
                </>
            }
            <div className={`navDetail flex items-center justify-center border border-solid border-zinc-300 hover:bg-zinc-700 mx-2 w-[100px] ${isNav ? 'animateNavBar' : 'animateNavBarReverse'} my-2 animate-delay-0-4 cursor-pointer rounded-md transition-all`}
                onClick={() => { 
                    if(isLog){
                        setIsLog(false); localStorage.clear(); router.push('/auth')
                    }else{
                        router.push('/auth')
                    }
                 }}>
                {isLog ? 'LOGOUT':'LOGIN'}
            </div>
            <div onClick={() => { setIsLog(true); localStorage.setItem('adminLog', JSON.stringify(true)) }} className={`navDetail flex items-center justify-center mx-2 w-[100px] ${isNav ? 'animateNavBar' : 'animateNavBarReverse'} ${param === '/admin' ? 'bg-zinc-700 font-sc-thin' : ' border-zinc-300'} my-2  border border-solid animate-delay-0-3  hover:bg-zinc-700 cursor-pointer rounded-md transition-all`} >
                set login
            </div>
        </nav>
        <div className="search w-1/5 flex items-center">
            <Input
                type="email"
                placeholder="Search..."
                radius="sm"
                onChange={(e) => { setSearchValue(e.target.value) }}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        e.target.value !== "" ? router.push(`/search/${e.target.value}`) : ''
                    }
                }}
                endContent={
                    <CiSearch className="w-[10%] h-4/5 bg-zinc-900 rounded-lg p-2 cursor-pointer" onClick={() => { searchValue !== "" ? router.push(`/search/${searchValue}`) : '' }} />
                }
            />
        </div>
    </header>
}
export default Header;