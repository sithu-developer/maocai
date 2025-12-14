"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeLoading } from "@/store/slice/loading";
import { orderFoods } from "@/store/slice/order";
import { VoucherItem } from "@/type/order";
import { abyssinica, nanum } from "@/util/font";
import { useState } from "react";

interface Props {
    openSpicyLevel : boolean;
    setOpenSpicyLevel : ( value : boolean ) => void;
    voucherItems: VoucherItem[]
    setVoucherItems: (value: VoucherItem[]) => void;
    tableId: string;
}

const SpicyLevel = ( { openSpicyLevel , setOpenSpicyLevel , voucherItems , setVoucherItems , tableId } : Props ) => {
    const company = useAppSelector(store => store.company.item)
    const [ selectedLevel , setSelectedLevel ] = useState<number | null>(null);
    const dispatch = useAppDispatch();

    if(!openSpicyLevel || !company) return null;

    const handleCreateNewOrder = () => {
        const selectedFoods = voucherItems.map(item => { return {foodId : item.id , quantity : item.quantity}})
        dispatch(changeLoading(true));
        dispatch(orderFoods({ tableId , selectedFoods , spicyLevel : selectedLevel , isSuccess : () => {
            dispatch(changeLoading(false));
            setSelectedLevel(null)
            setOpenSpicyLevel(false);
            setVoucherItems([]);
        }}));
    }

    return (
        <div className="fixed inset-0  flex justify-center items-center backdrop-blur-xs" >
            <div className="w-60 bg-foodBg border border-black rounded-md flex flex-col gap-4 p-3" >
                <p className={ nanum.className + " text-[clamp(14px,1.5vw,25px)] text-fontColor text-center [-webkit-text-stroke:0.6px]"}>Your Favour</p>
                <div className="flex flex-col px-2 gap-2">
                    {Array.from({ length : company.spicyTotalLevel + 1} , (_ , i) => i).map(item => (
                        <label key={item} className={abyssinica.className + " text-[clamp(10px,1.2vw,16px)] text-fontColor flex items-center gap-3 cursor-pointer border border-voucherColor px-2 py-1 rounded-2xl"} >
                            <input type="radio" name="spicyLevel" value={item} checked={selectedLevel === item} onChange={() => setSelectedLevel(item)}/>
                            Spicy Level {item}
                        </label>
                    ))}
                </div>
                <div className="flex justify-center gap-2">
                    <button className={abyssinica.className + " text-[clamp(10px,2vw,18px)] bg-primary text-secondary px-3 py-1 rounded-2xl border-voucherColor border shadow-md shadow-voucherColor cursor-pointer"} onClick={() => {
                        setOpenSpicyLevel(false);
                        setSelectedLevel(null)
                    }}>Back</button>
                    <button onClick={handleCreateNewOrder} disabled={selectedLevel === null} className={abyssinica.className + " text-[clamp(10px,2vw,18px)] bg-primary text-secondary px-3 py-1 rounded-2xl border-voucherColor border shadow-md shadow-voucherColor cursor-pointer disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"}>Comfirm</button>
                </div>
            </div>
        </div>
    )
}

export default SpicyLevel;