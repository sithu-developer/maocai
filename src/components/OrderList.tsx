"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { VoucherItem } from "@/type/order";
import { food, order } from "@prisma/client";
import { useEffect, useState } from "react";
import Voucher from "./Voucher";
import { nanum } from "@/util/font";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { checkOrders } from "@/store/slice/order";


interface OrderListTypeForCustomer {
    orderSeq : string;
    relatedOrders : order[];
    voucherItems : VoucherItem[];
}

interface Props {
    openOrderList : boolean;
    setOpenOrderList : (value : boolean ) => void;
    tableId : string;
}

const OrderList = ( { openOrderList , setOpenOrderList , tableId } : Props ) => {
    const orders = useAppSelector(store => store.order.items);
    const foods = useAppSelector(store => store.food.items);
    const [ orderLists , setOrderLists ] = useState<OrderListTypeForCustomer[]>([]);
    const dispatch = useAppDispatch();
    

    useEffect(() => {
        if(openOrderList) {
            const interval = setInterval(() => {
                dispatch(checkOrders({tableId}))
            } , 3000)
            return () => {
                clearInterval(interval)
            }
        }
    } , [ openOrderList ])

    useEffect(() => {
        if(orders.length && foods.length) {
            const orderSeqList = [...new Set(orders.map(item => item.orderSeq))]
            const orderLists = orderSeqList.map(item => {
                const relatedOrders = orders.filter(order => order.orderSeq === item);
                const relatedFoodIdsAndQtys = relatedOrders.map(ro => { return { foodId : ro.foodId , quantity : ro.quantity}});
                const voucherItems = relatedFoodIdsAndQtys.map(relatedFoodAndQty => {
                    const food = foods.find(f => f.id === relatedFoodAndQty.foodId) as food;
                    return {...food , quantity : relatedFoodAndQty.quantity }
                })
                return { orderSeq : item , relatedOrders , voucherItems }
            }).sort((a,b) => a.relatedOrders[0].id.localeCompare(b.relatedOrders[0].id) );
            setOrderLists(orderLists)
        }
    } , [ orders , foods ])

    if(!openOrderList) return null;
    
    
    return (
        <div className="bg-secondary absolute w-screen h-screen flex flex-col" >
            <div className="flex justify-between items-center px-5 py-3 bg-blue-300 " >
                <p  className={ nanum.className + " text-[clamp(18px,2.3vw,30px)] text-fontColor text-center [-webkit-text-stroke:0.6px] "}>Your order list</p>
                <XMarkIcon className="w-10 rounded-xl text-fontColor hover:bg-foodBorder/20 cursor-pointer" onClick={() => {
            setOpenOrderList(false);
        }} />
            </div>
            <div className="p-5 overflow-y-auto flex flex-wrap gap-5">
                {orderLists.map(item => (
                    <Voucher key={item.orderSeq} relatedOrders={item.relatedOrders}  voucherItems={item.voucherItems} />
                ))}
            </div>
        </div>
    )
}

export default OrderList;