'use client'
import { StateContext } from "@/app/context/stateContext";
import { usePathname, useRouter } from "next/navigation";
import { use, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Input, useDisclosure, Button } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import ModalScan from "./modalQr";
import Loading from "./loading";
const Header = () => {
    const [isNav, setIsNav] = useState(true)
    const { isLog, isUser, setIsLog, user, isLoading } = use(StateContext);
    const [searchValue, setSearchValue] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
    return <header className="relative w-full h-[10vh] lg:h-[7vh] 2xl:h-[5vh] flex flex-wrap items-center justify-start m-1 px-2 z-50">
        <div onClick={() => { setIsNav(!isNav) }} className="w-[35px] h-[35px] bg-zinc-700 rounded-lg top-2 cursor-pointer hidden lg:flex items-center justify-center">
            <FiChevronRight className={`w-full h-full transition-all ${isNav ? 'rotate-[270deg]' : 'rotate-[90deg]'}`} />
        </div>
        <nav className={`w-full lg:w-[95%] h-auto xl:h-full flex flex-wrap top-20 transition-all overflow-x-hidden justify-between`}>
            <div className="w-[70%] lg:w-3/5 xl:w-2/5 h-full flex flex-wrap items-center">
                {arrNav.map(a => <div className={`navDetail h-3/5 flex items-center justify-center mx-2 w-2/5 min-w-[100px] lg:w-[100px] ${isNav ? 'animateNavBar' : 'animateNavBarReverse'} my-2 ${param === a.url ? 'bg-zinc-700 font-sc-thin' : ' border-zinc-300'} border border-solid animate-delay-0-${a.id}  hover:bg-zinc-700 cursor-pointer rounded-md transition-all`}
                    onClick={() => { router.push(a.url) }} key={a.id}>
                    {a.title.toLocaleUpperCase()}
                </div>)}
                {isLog && !isUser &&
                    <div onClick={() => { router.push('/admin') }} className={`navDetail flex items-center justify-center mx-2 w-2/5 min-w-[100px] lg:w-[100px] h-3/5 ${isNav ? 'animateNavBar' : 'animateNavBarReverse'} ${param === '/admin' ? 'bg-zinc-700 font-sc-thin' : ' border-zinc-300'} my-2  border border-solid animate-delay-0-3  hover:bg-zinc-700 cursor-pointer rounded-md transition-all`} >
                        MANAGE
                    </div>
                }
            </div>
            <div className="search w-1/5 hidden xl:flex items-center">
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
                        <CiSearch className="w-[10%] h-[90%] bg-zinc-900 rounded-lg p-2 cursor-pointer" onClick={() => { searchValue !== "" ? router.push(`/search/${searchValue}`) : '' }} />
                    }
                />
            </div>
            <div className="navInfo w-[30%] lg:w-[35%] h-full flex flex-wrap justify-start lg:justify-end  content-between lg:content-start">
                {isLog && !isUser &&
                    <Button onPress={onOpen} className={`navDetail flex items-center justify-center md:mx-1 my-2 min-w-[100px] w-[100px] h-3/5 ${isNav ? 'animateNavBar' : 'animateNavBarReverse'}  border-zinc-300  border border-solid animate-delay-0-3  hover:bg-zinc-700 cursor-pointer rounded-md transition-all`} >
                        SCAN QR
                    </Button>
                }
                {isLog && isUser && <div onClick={() => { router.push('/user') }} 
                    className={`navDetail h-3/5 flex items-center justify-center md:mx-1 my-2 min-w-[100px] w-[100px] border-zinc-300  border border-solid animate-delay-0-3  hover:bg-zinc-700 cursor-pointer rounded-md transition-all truncate`}>
                    {user ? user.map(u => u.name !== "" ? `HELLO ${u.name}` : 'USER') : 'USER'}
                </div>}

                <div 
                    className={`navDetail h-3/5 flex items-center justify-center border border-solid border-zinc-300 hover:bg-zinc-700 md:mx-1 my-2 min-w-[100px] w-[100px] 
                        ${isNav ? 'animateNavBar' : 'animateNavBarReverse'} animate-delay-0-4 cursor-pointer rounded-md transition-all`}
                    onClick={() => {
                        if (isLog) {
                            setIsLog(false); localStorage.clear(); router.push('/auth')
                        } else {
                            router.push('/auth')
                        }
                    }}>
                    {isLog ? 'LOGOUT' : 'LOGIN'}
                </div>

            </div>
        </nav>
        <ModalScan props={{ isOpen, onOpenChange }} />
        {isLoading && <Loading />}
    </header>
}
export default Header;