"use client"
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

const Loading = () => {
    const isLoading = useAppSelector(store => store.loading.isLoading)

    if(isLoading)
    return (
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50">
            <Image alt="loading image" unoptimized src={"/loading-icon.gif"} width={400} height={400} className="w-25 h-auto rounded-4xl " />
        </div>
    )
}

export default Loading;