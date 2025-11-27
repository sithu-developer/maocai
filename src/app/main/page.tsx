"use client"
import { useAppSelector } from "@/store/hooks";
import { abyssinica, nanum } from "@/util/font";
import Image from "next/image";
import { useRouter } from "next/navigation";


const MainPage = () => {
    const categories = useAppSelector(store => store.category.items);
    const router = useRouter();
    
    return (
        <div className="w-screen h-screen pl-[6vw] pr-[2vw] bg-[#EAF4F4]">
            <div className="h-[40vh] flex justify-between items-center">
                <div className="w-[50vw] flex flex-col gap-[5vh] ">
                    <p className={abyssinica.className + " text-[clamp(25px,3.5vw,48px)] text-[#E76B6A]"}>Welcome, bǎobèi !</p>
                    <p className={nanum.className + " text-[clamp(16px,1.8vw,30px)] text-[#E76B6A] text-justify leading-10"} >We are so happy to have you join our cozy little corner of deliciousness.</p>
                </div>
                <div className="w-[30vw] text-[3vw]">
                    cartoon
                </div>
            </div>
            <div className="h-[60vh]">
                <div className="h-[75%]">
                    {categories.length ? categories.map(item => (
                        <div key={item.id} className="relative h-43 w-40 bg-cyan-500 rounded-[9px] border-2 border-[#B5B837AB] flex flex-col justify-between cursor-pointer" onClick={() => router.push(`./modification/${item.id}`)}>
                            <div className="overflow-hidden h-full w-full flex items-center justify-center rounded-t-[9px]" >
                                <Image alt="category photo" src={item.url} width={400} height={400} className=" h-full w-auto"  />
                            </div>
                            <div className="bg-[#E76B6A] border-t-2 border-t-[#B5B837AB] rounded-b-[9px] py-1">
                                <p className="text-center text-lg text-[#EAF4F4]" >{item.name}</p>
                            </div>
                        </div>
                    ))
                    :<p className="text-2xl" >No created category !</p>}

                </div>
                <div className="flex justify-between items-center py-3" >
                    <p className={nanum.className + " text-[clamp(16px,1.8vw,30px)] text-[#E76B6A] text-justify "} >Open daily : 11 AM to 9 PM</p>
                    <p className={nanum.className + " text-[clamp(16px,1.8vw,30px)] text-[#E76B6A] text-justify "} >12 * 85 st, Mandalay</p>
                </div>
            </div>
        </div>
    )
}

export default MainPage;