"use client"
import WarningDialog from "@/components/WariningDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeLoading } from "@/store/slice/loading";
import { checkOrders, updateOrder } from "@/store/slice/order";
import { TrashIcon } from "@heroicons/react/16/solid";
import { food, order, ORDERSTATUS, tables } from "@prisma/client";
import { useEffect, useState } from "react";

interface OrderListType {
    orderSeq : string;
    relatedOrders : order[];
}

export interface SelectedOrderToDeleteType {
    orderSeq : string;
    createdDate : Date
}

const OrdersPage = () => {
    const company = useAppSelector(store => store.company.item);
    const orders = useAppSelector(store => store.order.items);
    const foods = useAppSelector(store => store.food.items);
    const tables = useAppSelector(store => store.table.items);
    const categories = useAppSelector(store => store.category.items);
    const [ currentOrderStatus , setCurrentOrderStatus ] = useState<ORDERSTATUS>("ORDERED");
    const [ orderLists , setOrderLists ] = useState<OrderListType[]>([]);
    const [ openWarning , setOpenWarning ] = useState<boolean>(false);
    const [ selectedOrderSeqAndCreatedDate , setSelectedOrderSeqAndCreatedDate ] = useState<SelectedOrderToDeleteType | null>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(orders.length) {
            const orderSeqList = [...new Set(orders.map(item => item.orderSeq))]
            const orderLists = orderSeqList.map(item => {
                const relatedOrders = orders.filter(order => order.orderSeq === item);
                return { orderSeq : item , relatedOrders }
            }).sort((a,b) => a.relatedOrders[0].id.localeCompare(b.relatedOrders[0].id) );
            setOrderLists(orderLists)
        }
    } , [ orders ])

    useEffect(() => {
        if(company) {
            const interval = setInterval(() => {
                dispatch(checkOrders({ companyId : company.id }))
            } , 3000);
            return () => {
                clearInterval(interval)
            }
        }
    } , [ company ])

    const handleUpdateOrder = ( { orderSeq , status } : { orderSeq : string , status : ORDERSTATUS }) => {
        dispatch(changeLoading(true))
        dispatch(updateOrder({ orderSeq , status , isSuccess : () => {
            dispatch(changeLoading(false))
        }}))
    }

    return (
        <div className="w-screen h-screen bg-secondary p-5 flex flex-col"> 
            <p className="text-3xl mb-1 text-center">Orders</p>
            <div className="flex justify-center p-3 gap-3">
                {Object.values(ORDERSTATUS).map(item => (
                    <div onClick={() => setCurrentOrderStatus(item)} key={item} className={`${item === currentOrderStatus ? "bg-primary text-secondary" : "bg-primary/30"} border border-voucherColor text-[18px] px-3 py-1 rounded-3xl cursor-pointer`} >{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}</div>
                ))}
            </div>
            <div className="flex flex-wrap gap-5 mt-5 overflow-auto p-3">
                {orderLists.filter(item => item.relatedOrders[0].status === currentOrderStatus).map(item => {
                    const relatedFoodsAndQuantity = item.relatedOrders.map(relatedOrder => {
                        const food = foods.find(f => f.id === relatedOrder.foodId) as food;
                        return { ...food , quantity : relatedOrder.quantity }
                    });
                    const relatedTable = tables.find(table => table.id === item.relatedOrders[0].tableId) as tables;
                    const date = new Date(item.relatedOrders[0].createdAt);
                    return(
                        <div key={item.orderSeq} className="relative flex flex-col justify-between  bg-[#F8E6E6] w-60 h-fit rounded-2xl border border-voucherColor" >
                            {item.relatedOrders[0].status === ORDERSTATUS.DONE ? 
                            <TrashIcon className="absolute -top-2.5 -right-2.5 w-9 p-1 bg-[#F8E6E6] border border-voucherColor rounded-3xl cursor-pointer text-red-500 hover:bg-red-200 " onClick={() => {
                                setOpenWarning(true);
                                setSelectedOrderSeqAndCreatedDate({ orderSeq : item.orderSeq , createdDate : date });
                            }} />
                            : undefined}
                            <div className=" flex flex-col items-center gap-3 p-3 w-full h-90 overflow-y-auto">
                                <div className="flex">
                                    <p className="bg-primary text-center text-secondary py-0.5 px-2 rounded-l-2xl border-2 border-borderColor w-fit  text-[14px]">T : {relatedTable.tableName}</p>
                                    <p className="bg-primary text-secondary py-0.5 px-2 rounded-r-2xl border-2 border-l-0 border-borderColor w-fit text-[14px]">Seq : {item.orderSeq}</p>
                                </div>
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
                                            {category.isMainDish && <p className="text-secondary px-1 py-0.5 rounded text-[10px] justify-self-center bg-foodBorder mt-1">Spicy Level {item.relatedOrders[0].spicyLevel}</p>}
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
                            <select onChange={(e) => handleUpdateOrder({ orderSeq : item.orderSeq , status : (e.target.value as ORDERSTATUS) })} className="py-3 rounded-b-2xl bg-primary text-center border-t border-t-voucherColor text-secondary w-full" defaultValue={item.relatedOrders[0].status}>
                                <option value={ORDERSTATUS.ORDERED} >Ordered</option>
                                <option value={ORDERSTATUS.COOKING} >Cooking</option>
                                <option value={ORDERSTATUS.DONE} >Done</option>
                            </select>
                        </div>
                    )
                })}
            </div>
            {selectedOrderSeqAndCreatedDate && <WarningDialog selectedOrderSeqAndCreatedDate={selectedOrderSeqAndCreatedDate} setSelectedOrderSeqAndCreatedDate={setSelectedOrderSeqAndCreatedDate} openWarning={openWarning} setOpenWarning={setOpenWarning} />}
        </div>
    )
}

export default OrdersPage;