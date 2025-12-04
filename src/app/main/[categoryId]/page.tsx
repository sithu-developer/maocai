"use client"
import { useAppSelector } from "@/store/hooks";
import { abyssinica, nanum } from "@/util/font";
import { PlusIcon , MinusIcon } from "@heroicons/react/16/solid";
import { category, food } from "@prisma/client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CustomerOrderingPage = () => {
    const categories = useAppSelector(store => store.category.items);
    const foods = useAppSelector(store => store.food.items);
    const categoryId = useParams().categoryId;
    const [ currentCategory , setCurrentCategory ] = useState<category>();
    const [ relatedFoods , setRelatedFoods ] = useState<food[]>([])

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

    if(!currentCategory) return null;

    return (
        <div className="w-screen h-screen bg-secondary flex">
            <div className="grow h-screen flex flex-col">
                <p className={ nanum.className + " text-[clamp(16px,2vw,30px)] text-fontColor text-center py-3"}>{currentCategory.name}</p>
                <div className="w-full p-[2vw] bg-black/10 flex gap-[3vw] flex-wrap overflow-y-auto">
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
            <div className="w-[42vw]">  {/*  // here  */}
                sdfsd
            </div>
        </div>
    )
}

export default CustomerOrderingPage;