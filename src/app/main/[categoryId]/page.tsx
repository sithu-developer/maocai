"use client"
import { useAppSelector } from "@/store/hooks";
import { abyssinica, nanum } from "@/util/font";
import { PlusIcon , MinusIcon } from "@heroicons/react/16/solid";
import { category, food } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CustomerOrderingPage = () => {
    const categories = useAppSelector(store => store.category.items);
    const foods = useAppSelector(store => store.food.items);
    const customerTable = useAppSelector(store => store.table.customerTable)
    const categoryId = useParams().categoryId;
    const [ currentCategory , setCurrentCategory ] = useState<category>();
    const [ relatedFoods , setRelatedFoods ] = useState<food[]>([])
    const tableId = useSearchParams().get("tableId");
    

    useEffect(() => {
        if(categories.length && categoryId) {
            const currCategory = categories.find(item => item.id === categoryId);
            setCurrentCategory(currCategory);
        }
    } , [ categories , categoryId ]);

    useEffect(() => {
        if(currentCategory && foods.length) {
            const relaFoods = foods.filter(item => item.categoryId === currentCategory.id)
            setRelatedFoods(relaFoods);
        }
    } , [ currentCategory , foods ])

    if(!currentCategory || !tableId || !customerTable) return null;

    const getCurrentDate = () => {
        const date = new Date();
        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    }

    return (
        <div className="w-screen h-screen bg-secondary flex">
            <div className="w-[66vw] h-screen flex flex-col">
                <p className={ nanum.className + " text-[clamp(16px,2vw,30px)] text-fontColor text-center pt-5"}>{currentCategory.name}</p>
                <div className="w-full p-[2vw] flex gap-[3vw] flex-wrap overflow-y-auto">
                    {relatedFoods.map(item => (
                        <div key={item.id} className="bg-foodBg w-[13vw] h-[14vw] min-h-[120px] flex flex-col rounded-[5px] border border-foodBorder" >
                            <p className={abyssinica.className + " text-[clamp(10px,1.2vw,16px)] text-center text-fontColor py-1 border-b border-b-foodBorder"}>{item.name + " - " + item.price}ks</p>
                            <div className="w-full grow flex justify-center items-center overflow-hidden bg-amber-400">
                                <Image alt="Food image" src={item.url} width={500} height={500} className="w-full h-auto object-cover"  />
                            </div>
                            <div className="flex justify-between items-center text-fontColor py-1 px-2 border-t border-t-foodBorder" >
                                <PlusIcon className="w-5 rounded cursor-pointer hover:bg-black/20"  />
                                <p className={abyssinica.className + " text-[clamp(10px,1.2vw,16px)] text-center grow"}>100</p>
                                <MinusIcon className="w-5 rounded cursor-pointer hover:bg-black/20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grow p-[2vw] flex flex-col gap-5">
                <div className="flex items-center justify-between" >
                    {categories.filter(cat => cat.id !== currentCategory.id).map(item => (
                        <Link key={item.id} href={`/main/${item.id}?tableId=${tableId}`} style={{ textDecoration : "none" }} >  
                            <div className="relative w-[13vw] h-[14vw] min-h-[100px] rounded-[5px] border border-voucherColor flex flex-col justify-between" >
                                <div className="overflow-hidden grow w-full flex items-center justify-center rounded-t-[5px]" >
                                    <Image alt="category photo" src={item.url} width={800} height={800} className="h-full w-auto object-cover"  />
                                </div>
                                <div className="bg-primary border-t border-t-borderColor rounded-b-[5px] py-1">
                                    <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-white"} >{item.name}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="bg-[#F8E6E6] grow rounded-[7px] border border-voucherColor flex flex-col gap-1 px-4 py-1 overflow-y-auto">
                    <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-voucherColor"}>QiQi Mala</p>
                    <div className="flex items-center justify-between">
                        <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-voucherColor underline underline-offset-2"}>Table no.{customerTable.tableName}</p>
                        <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-voucherColor underline underline-offset-2"}>{getCurrentDate()}</p>
                    </div>
                    <div className="grow flex flex-col px-2 py-5 gap-2">
                        <div className="flex items-center justify-between">
                            <p className={abyssinica.className + "  text-[clamp(10px,1.2vw,16px)] text-voucherColor"}>Items</p>
                            <p className={abyssinica.className + "  text-[clamp(10px,1.2vw,16px)] text-voucherColor"}>Qty</p>
                            <p className={abyssinica.className + "  text-[clamp(10px,1.2vw,16px)] text-voucherColor"}>Price</p>
                        </div>
                        <div className=" flex flex-col gap-1 px-1">
                            {[ 1, 2, 3 , 4 ,5 ,6 , 7, 8,9,11,12,13,14,15,16,17,18,19].map(item => (
                                <div key={item} className="flex items-center justify-between">
                                    <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>Pork</p>
                                    <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>3</p>
                                    <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>1400</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1 py-1.5 border-t border-t-voucherColor ">
                            <div className="flex items-center justify-between mb-1 px-1 ">
                                <span className="w-5" />
                                <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>Total</p>
                                <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>Calc</p>
                            </div>
                            <div className="flex items-center justify-between px-1 ">
                                <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>Tax</p>
                                <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>3%</p>
                                <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>Calc</p>
                            </div>
                            <div className="flex items-center justify-between px-1 ">
                                <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-5 text-nowrap"}>Service Charge</p>
                                <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>3%</p>
                                <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>Calc</p>
                            </div>
                            <div className="flex items-center justify-end mt-2">
                                <div className="flex justify-between items-center w-[55%] pt-2 border-t border-voucherColor px-1 ">
                                    <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>Total price</p>
                                    <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor"}>Calc</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerOrderingPage;