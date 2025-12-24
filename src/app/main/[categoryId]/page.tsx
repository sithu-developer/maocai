"use client"
import OrderList from "@/components/OrderList";
import SpicyLevel from "@/components/SpicyLevel";
import Voucher from "@/components/Voucher";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeLoading } from "@/store/slice/loading";
import { orderFoods } from "@/store/slice/order";
import { VoucherItem } from "@/type/order";
import { abyssinica, nanum } from "@/util/font";
import { PlusIcon , MinusIcon, InboxIcon } from "@heroicons/react/16/solid";
import { category, food } from "@prisma/client";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CustomerOrderingPage = () => {
    const categories = useAppSelector(store => store.category.items);
    const foods = useAppSelector(store => store.food.items);
    const orders = useAppSelector(store => store.order.items);
    const categoryId = useParams().categoryId;
    const [ currentCategory , setCurrentCategory ] = useState<category>();
    const [ voucherItems , setVoucherItems ] = useState<VoucherItem[]>([]);
    const [ openOrderList , setOpenOrderList ] = useState<boolean>(false);
    const [ openSpicyLevel , setOpenSpicyLevel ] = useState<boolean>(false);
    const tableId = useSearchParams().get("tableId");
    const dispatch = useAppDispatch();

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

    const handleCreateNewOrder = () => {
        const selectedFoods = voucherItems.map(item => { return {foodId : item.id , quantity : item.quantity}})
        const mainCategoryIds = categories.filter(item => item.isMainDish).map(item => item.id);
        const mainCategoryFoods = voucherItems.filter(item => mainCategoryIds.includes(item.categoryId));
        if(mainCategoryFoods.length) {
            setOpenSpicyLevel(true);
        } else {
            dispatch(changeLoading(true));
            dispatch(orderFoods({ tableId , selectedFoods , spicyLevel : null , isSuccess : () => {
                dispatch(changeLoading(false));
                setVoucherItems([]);
            }}));
        }
        
    }

    return (
        <div className="w-screen h-screen bg-secondary flex">
            <div className="w-[66vw] h-screen flex flex-col">
                <p className={ nanum.className + " text-[clamp(16px,2vw,30px)] text-fontColor text-center pt-5 [-webkit-text-stroke:0.6px] "}>{currentCategory.name}</p>
                <div className="w-full p-[2vw] flex gap-[3vw] flex-wrap overflow-y-auto">
                    {foods.filter(food => food.categoryId === currentCategory.id).map(item => {
                        const quantity = voucherItems.find(vItem => vItem.id === item.id)?.quantity;
                        return (
                            <div key={item.id} className="bg-foodBg w-[13vw] h-[14vw] min-h-[120px] flex flex-col rounded-[5px] border border-foodBorder shadow-lg shadow-foodBg" >
                                <p className={abyssinica.className + " text-[clamp(10px,1.2vw,16px)] text-center text-fontColor py-1 border-b border-b-foodBorder"}>{item.name + " - " + item.price}ks</p>
                                <div className="w-full grow flex justify-center items-center overflow-hidden bg-white">
                                    <Image alt="Food image" src={item.url} width={500} height={500} className="w-full h-auto object-cover select-none"  />
                                </div>
                                <div className="flex justify-between items-center text-fontColor py-1 px-2 border-t border-t-foodBorder" >
                                    <PlusIcon onClick={() => addToVoucher(item)} className="w-5 rounded cursor-pointer hover:bg-black/20"/>
                                    <p className={abyssinica.className + " text-[clamp(10px,1.2vw,16px)] text-center select-none grow"}>{quantity ? quantity : 0}</p>
                                    <MinusIcon onClick={() => removeFromVoucher(item)} className="w-5 rounded cursor-pointer hover:bg-black/20" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="w-[34vw] p-[2vw] flex flex-col gap-5">
                <div className="flex items-center justify-between" >
                    {categories.filter(cat => cat.id !== currentCategory.id).map(item => (
                        <div key={item.id}  onClick={() => setCurrentCategory(item)} className="relative w-[13vw] h-[14vw] min-h-[100px] rounded-[5px] border border-voucherColor cursor-pointer flex flex-col justify-between shadow-lg shadow-primary" >
                            <div className="overflow-hidden grow w-full flex items-center justify-center rounded-t-[4.2px]" >
                                <Image alt="category photo" src={item.url} width={800} height={800} className="h-full w-auto object-cover select-none"  />
                            </div>
                            <div className="bg-primary border-t border-t-borderColor rounded-b-[4.2px] py-1">
                                <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-white select-none"} >{item.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Voucher voucherItems={voucherItems} />
                <div>
                    <button onClick={handleCreateNewOrder} disabled={!voucherItems.length} className={abyssinica.className + " text-[clamp(10px,2vw,18px)] bg-[#db3030] text-white cursor-pointer py-2 rounded-3xl shadow-xl shadow-primary w-full hover:bg-primary select-none disabled:bg-black/55 disabled:text-black/70 disabled:cursor-not-allowed disabled:shadow-gray-600"}>Order Comfirm</button>
                </div>
            </div>
            {orders.length ? <div className="fixed top-3 left-3" >
                <InboxIcon onClick={() => setOpenOrderList(true)} className="min-w-10 max-w-16 bg-secondary w-[4.5vw] p-1 text-primary rounded-2xl border border-primary shadow-lg shadow-primary cursor-pointer" />
            </div>
            : undefined}
            <OrderList tableId={tableId} openOrderList={openOrderList} setOpenOrderList={setOpenOrderList} />
            <SpicyLevel tableId={tableId} voucherItems={voucherItems} setVoucherItems={setVoucherItems} openSpicyLevel={openSpicyLevel} setOpenSpicyLevel={setOpenSpicyLevel} />
        </div>
    )
}

export default CustomerOrderingPage;