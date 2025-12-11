"use client";

import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeLoading } from "@/store/slice/loading";
import { customerCheck } from "@/store/slice/table";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface Props {
    children : React.ReactNode
}

const MainLayout = ( { children } : Props) => {
    const company = useAppSelector(store => store.company.item)
    const searchParams = useSearchParams();
    const tableId = searchParams.get("tableId");
    const dispatch = useAppDispatch();

    useEffect(() => {
        if( tableId && !company ) {
            const timeOut = setTimeout(() => {
                dispatch(changeLoading(true))
            } , 3000 )
            dispatch(customerCheck({  tableId , isSuccess : () => {
                clearTimeout(timeOut);
                dispatch(changeLoading(false));
            } }))
        }
    } , [ tableId , company ])
    

    if(!tableId) return null;
    return (
        <div>
            {children}
            <Loading />
        </div>
    )
}

export default MainLayout;