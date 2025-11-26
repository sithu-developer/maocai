import { abyssinica, nanum } from "@/util/font";


const MainPage = () => {

    return (
        <div className="w-screen h-screen p-5 bg-[#EAF4F4]">
            <div className="flex justify-between">
                <div>
                    <p className={abyssinica.className + " text-[66px] text-[#E76B6A]"}>Welcome, bǎobèi !</p>
                    <p className={nanum.className + " text-[32px] text-[#E76B6A] border-black border w-[751px]"} >We are so happy to have you join our cozy little corner of deliciousness.</p>
                </div>
                <div>
                    cartoon
                </div>
            </div>
        </div>
    )
}

export default MainPage;