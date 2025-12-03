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
    const tableId = String(searchParams.get("tableId"));
    const companyId = String(searchParams.get("companyId"));
    const dispatch = useAppDispatch();

    useEffect(() => {
        if( tableId && companyId && !company ) {
            const timeOut = setTimeout(() => {
                dispatch(changeLoading(true))
            } , 3000 )
            dispatch(customerCheck({ companyId , tableId , isSuccess : () => {
                clearTimeout(timeOut);
                dispatch(changeLoading(false));
            } }))
        }
    } , [ tableId , companyId , company ])
    

    if(!tableId || !companyId) return null;
    return (
        <div>
            {children}
            <Loading />
        </div>
    )
}

export default MainLayout;