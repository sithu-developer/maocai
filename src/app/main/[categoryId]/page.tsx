"use client"
import Voucher from "@/components/Voucher";
import { useAppSelector } from "@/store/hooks";
import { VoucherItem } from "@/type/order";
import { abyssinica, nanum } from "@/util/font";
import { PlusIcon , MinusIcon } from "@heroicons/react/16/solid";
import { category, food } from "@prisma/client";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CustomerOrderingPage = () => {
    const categories = useAppSelector(store => store.category.items);
    const foods = useAppSelector(store => store.food.items);
    const categoryId = useParams().categoryId;
    const [ currentCategory , setCurrentCategory ] = useState<category>();
    const [ voucherItems , setVoucherItems ] = useState<VoucherItem[]>([]);
    const tableId = useSearchParams().get("tableId");
    

    useEffect(() => {
        if(categories.length && categoryId) {
            const currCategory = categories.find(item => item.id === categoryId);
            setCurrentCategory(currCategory);
        }
    } , [ categories , categoryId ]);


    if(!currentCategory || !tableId ) return null;

    const addToVoucher = (selectedItem : food) => {
        const isExit = voucherItems.find(item => item.id === selectedItem.id);
        if(isExit) {
            setVoucherItems(voucherItems.map(item => (item.id === selectedItem.id) ? {...item , quantity : (item.quantity + 1) } : item))
        } else {
            setVoucherItems([...voucherItems , {...selectedItem , quantity : 1 } ])
        }
    }

    const removeFromVoucher = (selectedItem : food) => {
        const isExit = voucherItems.find(item => item.id === selectedItem.id);
        if(isExit && isExit.quantity > 1) {
            setVoucherItems(voucherItems.map(item => (item.id === selectedItem.id) ? {...item , quantity : (item.quantity - 1) } : item ))
        } else if (isExit && isExit.quantity === 1) {
            setVoucherItems(voucherItems.filter(item => item.id !== selectedItem.id ));
        }
    }

    return (
        <div className="w-screen h-screen bg-secondary flex">
            <div className="w-[66vw] h-screen flex flex-col">
                <p className={ nanum.className + " text-[clamp(16px,2vw,30px)] text-fontColor text-center pt-5"}>{currentCategory.name}</p>
                <div className="w-full p-[2vw] flex gap-[3vw] flex-wrap overflow-y-auto">
                    {foods.filter(food => food.categoryId === currentCategory.id).map(item => (
                        <div key={item.id} className="bg-foodBg w-[13vw] h-[14vw] min-h-[120px] flex flex-col rounded-[5px] border border-foodBorder shadow-lg shadow-foodBg" >
                            <p className={abyssinica.className + " text-[clamp(10px,1.2vw,16px)] text-center text-fontColor py-1 border-b border-b-foodBorder"}>{item.name + " - " + item.price}ks</p>
                            <div className="w-full grow flex justify-center items-center overflow-hidden bg-amber-400">
                                <Image alt="Food image" src={item.url} width={500} height={500} className="w-full h-auto object-cover"  />
                            </div>
                            <div className="flex justify-between items-center text-fontColor py-1 px-2 border-t border-t-foodBorder" >
                                <PlusIcon onClick={() => addToVoucher(item)} className="w-5 rounded cursor-pointer hover:bg-black/20"/>
                                <p className={abyssinica.className + " text-[clamp(10px,1.2vw,16px)] text-center grow"}>{item.price}</p>
                                <MinusIcon onClick={() => removeFromVoucher(item)} className="w-5 rounded cursor-pointer hover:bg-black/20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-[34vw] p-[2vw] flex flex-col gap-5">
                <div className="flex items-center justify-between" >
                    {categories.filter(cat => cat.id !== currentCategory.id).map(item => (
                        <div key={item.id}  onClick={() => setCurrentCategory(item)} className="relative w-[13vw] h-[14vw] min-h-[100px] rounded-[5px] border border-voucherColor flex flex-col justify-between shadow-lg shadow-primary" >
                            <div className="overflow-hidden grow w-full flex items-center justify-center rounded-t-[5px]" >
                                <Image alt="category photo" src={item.url} width={800} height={800} className="h-full w-auto object-cover"  />
                            </div>
                            <div className="bg-primary border-t border-t-borderColor rounded-b-[5px] py-1">
                                <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-white"} >{item.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Voucher voucherItems={voucherItems} />
                <div>
                    <button className={abyssinica.className + " text-[clamp(10px,2vw,18px)] bg-[#db3030] text-white cursor-pointer py-2 rounded-3xl shadow-xl shadow-primary w-full hover:bg-primary select-none"} onClick={() => {}}>Order Comfirm</button>
                </div>
            </div>
        </div>
    )
}

export default CustomerOrderingPage;