"use client"

import { signIn } from "next-auth/react";


const DashboardPage = () => {
    
    return (
        <div className="flex justify-center items-center bg-amber-700 h-screen w-screen">
            <button onClick={() => signIn("google")} className="bg-blue-400 px-5 py-2 rounded text-xl m-5 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 active:bg-blue-700 ">Sign In</button>
        </div>
    )
}

export default DashboardPage;