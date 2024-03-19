'use client'

import Header from "./header"
const Layout = ({ props }) => {
    return <div className="film-container w-full h-full flex flex-wrap content-start">
        <Header />
        <main className="w-full h-auto overflow-x-hidden">
            {props.children}
        </main>
    </div>

}
export default Layout