"use client"

import { useRouter } from "next/navigation";


const DashboardPage = () => {
    const router = useRouter();

    return (
        <div className="flex justify-center items-center bg-amber-700 h-screen">
            <button onClick={() => { router.push("/dashboard/modification")}} className="bg-blue-400 px-5 py-2 rounded text-xl m-5 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 active:bg-blue-700 ">To Admin</button>
        </div>
    )
}

export default DashboardPage;