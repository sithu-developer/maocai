"use client"
import { useEffect } from "react";

interface Props {
    openOrderList : boolean;
    setOpenOrderList : (value : boolean ) => void;
}

const OrderList = ( { openOrderList , setOpenOrderList } : Props ) => {
    

    useEffect(() => {
        if(openOrderList) {
            const interval = setInterval(() => { console.log("good") } , 1000)
            return () => {
                console.log("cleared")
                clearInterval(interval)
            }
        }
    } , [ openOrderList ])

    if(!openOrderList) return null;
    
    // here
    return (
        <div className="bg-secondary fixed inset-0 w-screen flex justify-center items-center" onClick={() => {
            setOpenOrderList(false);
        }} >
            <div> 
                hello
            </div>
        </div>
    )
}

export default OrderList;