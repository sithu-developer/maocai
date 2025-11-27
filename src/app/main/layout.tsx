"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface Props {
    children : React.ReactNode
}

const MainLayout = ( { children } : Props) => {
    const searchParams = useSearchParams();
    const tableId = searchParams.get("tableId");
    const companyId = searchParams.get("companyId");

    console.log(tableId , companyId)

    useEffect(() => {
        if(tableId && companyId) {
            // here tableId and companyId fetch
        }
    } , [ tableId , companyId ])
    

    // if(!tableId || !companyId) return null;
    return (
        <div>
            {children}
        </div>
    )
}

export default MainLayout;