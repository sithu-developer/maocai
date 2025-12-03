"use client"
import { useAppSelector } from "@/store/hooks";
import { abyssinica, nanum } from "@/util/font";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


const MainPage = () => {
    const categories = useAppSelector(store => store.category.items);
    const router = useRouter();
    
    return (
        <div className="w-screen h-screen pl-[6vw] pr-[2vw] bg-secondary">
            <div className="h-[40vh] flex justify-between items-end ">
                <div className="w-[50vw] flex flex-col gap-[5vh] ">
                    <p className={abyssinica.className + " text-[clamp(25px,5vw,68px)] text-primary"}>Welcome, bǎobèi !</p>
                    <p className={nanum.className + " text-[clamp(16px,2vw,30px)] text-primary text-justify leading-10"} >We are so happy to have you join our cozy little corner of deliciousness.</p>
                </div>
                <Image alt="Chef cartoon" src={"/chinese-Chef.png"} width={800} height={800} className="w-auto h-full py-2" />
            </div>
            <div className="h-[60vh]">
                <div className="h-[75%] flex items-center justify-between">
                    {categories.length ? categories.map(item => ( // here 
                        <Link key={item.id} href={`/main/${item.id}`} style={{ textDecoration : "none" }} >  
                            <div className="relative h-[21vw] w-[19vw] max-w-68 max-h-75 bg-cyan-500 rounded-[9px] border-2 border-borderColor flex flex-col justify-between" >
                                <div className="overflow-hidden grow w-full flex items-center justify-center rounded-t-[9px]" >
                                    <Image alt="category photo" src={item.url} width={800} height={800} className="h-full w-auto object-cover"  />
                                </div>
                                <div className="bg-primary border-t-2 border-t-borderColor rounded-b-[9px] py-1">
                                    <p className={nanum.className + " text-center text-[clamp(16px,2vw,30px)] text-secondary"} >{item.name}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                    :<p className="text-2xl" >No created category !</p>}
                </div>
                <div className="flex justify-between items-center py-3" >
                    <p className={nanum.className + " text-[clamp(16px,2vw,30px)] text-primary text-justify "} >Open daily : 11 AM to 9 PM</p>
                    <p className={nanum.className + " text-[clamp(16px,2vw,30px)] text-primary text-justify "} >12 * 85 st, Mandalay</p>
                </div>
            </div>
        </div>
    )
}

export default MainPage;