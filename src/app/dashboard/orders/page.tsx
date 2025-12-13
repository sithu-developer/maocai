"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOrder } from "@/store/slice/order";
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
    const dispatch = useAppDispatch();

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

    const handleUpdateOrder = ( { orderSeq , status } : { orderSeq : string , status : ORDERSTATUS }) => { // here1
        dispatch(updateOrder({ orderSeq , status }))
    }

    return (
        <div className=" w-screen bg-secondary p-5"> 
            <p className="text-3xl mb-1 text-center">Orders</p>
            <div className="flex justify-center p-3 gap-3">
                {Object.values(ORDERSTATUS).map(item => (
                    <div onClick={() => setCurrentOrderStatus(item)} key={item} className={`${item === currentOrderStatus ? "bg-primary text-secondary" : "bg-primary/30"} border border-voucherColor text-[18px] px-3 py-1 rounded-3xl cursor-pointer`} >{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}</div>
                ))}
            </div>
            <div className="flex flex-wrap gap-5 mt-5">
                {orderLists.filter(item => item.relatedOrders[0].status === currentOrderStatus).map(item => {
                    const relatedFoodsAndQuantity = item.relatedOrders.map(relatedOrder => {
                        const food = foods.find(f => f.id === relatedOrder.foodId) as food;
                        return { ...food , quantity : relatedOrder.quantity }
                    });
                    const relatedTable = tables.find(table => table.id === item.relatedOrders[0].tableId) as tables;
                    const date = new Date(item.relatedOrders[0].createdAt);
                    return(
                        <div key={item.orderSeq} className="flex flex-col justify-between bg-[#F8E6E6] w-60 rounded-2xl border border-voucherColor" >
                            <div className=" flex flex-col items-center gap-3 p-3 w-full h-90 overflow-y-auto">
                                <p className="bg-primary text-secondary py-0.5 px-3 rounded-2xl border-2 border-borderColor w-fit">{relatedTable.tableName}</p>
                                <p className="text-voucherColor text-sm w-full">Time: {date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + "_" + date.getHours() + ":" + date.getMinutes()}</p>
                                <div className="flex justify-between w-full font-semibold">
                                    <p className="text-voucherColor">Items</p>
                                    <p className="text-voucherColor">Qty</p>
                                </div>
                                {categories.map(category => {
                                    const categoryRelatedOrderedFoods = relatedFoodsAndQuantity.filter(f => f.categoryId === category.id);
                                    if(categoryRelatedOrderedFoods.length)
                                    return (
                                        <div key={category.id} className="w-full">
                                            <p className="text-voucherColor text-center underline underline-offset-3 text-[14px]">{category.name}</p>
                                            <div className="flex flex-col">
                                                {categoryRelatedOrderedFoods.map(foodAndQty => {
                                                    return (
                                                        <div key={foodAndQty.id} className="flex justify-between" >
                                                            <p className="text-voucherColor text-[14px] ">{foodAndQty.name}</p>
                                                            <p className="text-voucherColor text-[14px] pr-1">{foodAndQty.quantity}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <select onChange={(e) => handleUpdateOrder({ orderSeq : e.target.value , status : item.relatedOrders[0].status })} className="py-3 rounded-b-2xl bg-primary text-center border-t border-t-voucherColor text-secondary w-full" defaultValue={item.relatedOrders[0].status}>
                                <option value={ORDERSTATUS.ORDERED} >Ordered</option>
                                <option value={ORDERSTATUS.COOKING} >Cooking</option>
                                <option value={ORDERSTATUS.DONE} >Done</option>
                            </select>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OrdersPage;