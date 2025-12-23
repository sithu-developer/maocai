"use client"

import { nanum } from "@/util/font";
import { signIn } from "next-auth/react";


const DashboardPage = () => {
    
    return (
        <div className="flex flex-col justify-center items-center bg-secondary h-screen w-screen">
            <div className="flex flex-col gap-10 bg-foodBg px-10 py-5 rounded-2xl">
                <div>
                    <p className={nanum.className + " text-primary text-[clamp(20px,3.5vw,38px)] [-webkit-text-stroke:1px] text-center"} >Mala Maocai Admin</p>
                    <p className={nanum.className + " text-primary text-[clamp(18px,2.5vw,33px)] [-webkit-text-stroke:1px] text-center"} >Sign In</p>
                </div>
                <button onClick={() => signIn("google" , { callbackUrl : "/dashboard/modification" })} className="bg-primary text-secondary px-5 py-2 rounded text-xl m-5 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-primary active:bg-primary ">Sign In</button>
            </div>
        </div>
    )
}

export default DashboardPage;