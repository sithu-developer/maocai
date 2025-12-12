"use client"
import { useAppSelector } from "@/store/hooks";
import { VoucherItem } from "@/type/order";
import { food, order, ORDERSTATUS, tables } from "@prisma/client";
import { useEffect, useState } from "react";

interface OrderListType {
    orderSeq : string;
    relatedOrders : order[];
}

const OrdersPage = () => {
    const orders = useAppSelector(store => store.order.items);
    const foods = useAppSelector(store => store.food.items);
    const tables = useAppSelector(store => store.table.items);
    const categories = useAppSelector(store => store.category.items);
    const [ currentOrderStatus , setCurrentOrderStatus ] = useState<ORDERSTATUS>("ORDERED");
    const [ orderLists , setOrderLists ] = useState<OrderListType[]>([]);

    useEffect(() => {
        if(orders.length) {
            // const ordersForCurrentStatus = orders.filter(item => item.status === currentOrderStatus);
            const orderSeqList = [...new Set(orders.map(item => item.orderSeq))]
            const orderLists = orderSeqList.map(item => {
                const relatedOrders = orders.filter(order => order.orderSeq === item);
                return { orderSeq : item , relatedOrders }
            });
            setOrderLists(orderLists)
        }
    } , [ orders ])

    return (
        <div className=" w-screen bg-secondary p-5"> 
            <p className="text-3xl">Orders</p>
            <div className="flex flex-wrap gap-5 mt-5">
                {orderLists.filter(item => item.relatedOrders[0].status === currentOrderStatus).map(item => {
                    const relatedFoodsAndQuantity = item.relatedOrders.map(relatedOrder => {
                        const food = foods.find(f => f.id === relatedOrder.foodId) as food;
                        return { ...food , quantity : relatedOrder.quantity }
                    });
                    const relatedTable = tables.find(table => table.id === item.relatedOrders[0].tableId) as tables;
                    const date = new Date(item.relatedOrders[0].createdAt);
                    return(
                        <div key={item.orderSeq} className=" flex flex-col items-center justify-between gap-3 bg-[#F8E6E6] p-3 w-60 rounded-2xl border border-voucherColor" >
                            <p className="bg-primary text-secondary py-0.5 px-3 rounded-2xl border-2 border-borderColor w-fit">{relatedTable.tableName}</p>
                            <p className="text-voucherColor text-sm w-full">Time: {date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()}</p>
                            <div className="flex justify-between w-full font-semibold">
                                <p className="text-voucherColor">Items</p>
                                <p className="text-voucherColor">Qty</p>
                            </div>
                            {categories.map(category => {
                                const categoryRelatedOrderedFoods = relatedFoodsAndQuantity.filter(f => f.categoryId === category.id);
                                if(categoryRelatedOrderedFoods.length)
                                return (
                                    <div key={category.id} className="w-full">
                                        <p className="text-voucherColor text-center underline underline-offset-3">{category.name}</p>
                                        <div className="flex flex-col">
                                            {categoryRelatedOrderedFoods.map(foodAndQty => {
                                                return (
                                                    <div key={foodAndQty.id} className="flex justify-between" >
                                                        <p className="text-voucherColor">{foodAndQty.name}</p>
                                                        <p className="text-voucherColor pr-1">{foodAndQty.quantity}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="w-full flex justify-center"> {/* here */}
                                <select className="px-3 py-2 rounded-md bg-primary/50 border border-voucherColor" defaultValue={item.relatedOrders[0].status}>
                                    <option value={ORDERSTATUS.ORDERED} >{ORDERSTATUS.ORDERED}</option>
                                    <option value={ORDERSTATUS.COOKING} >{ORDERSTATUS.COOKING}</option>
                                    <option value={ORDERSTATUS.DONE} >{ORDERSTATUS.DONE}</option>
                                </select>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OrdersPage;