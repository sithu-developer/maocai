"use client"
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
    children : React.ReactNode
}

const BackofficeLayout = ( {children} : Props ) => {
    const { data : session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    
    
        useEffect(() => {
            if(session && pathname === "/dashboard") {
                // go to api and create new company
                router.push("/dashboard/modification")
            }
        } , [ session , pathname ])
    
    return (
        <div>
            
            {children}
        </div>
    )
}

export default BackofficeLayout;