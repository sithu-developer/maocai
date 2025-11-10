"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { companyCheck } from "@/store/slice/company";
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
    const dispatch = useAppDispatch();
    const company = useAppSelector(store => store.company.item)
    
    
        useEffect(() => {
            if(!company) {
                if(session && session.user && session.user.email && pathname === "/dashboard") {
                    dispatch(companyCheck({ email : session.user.email , isSuccess : () => {
                        router.push("/dashboard/modification");
                    }}));
                } else if(session && session.user && session.user.email) {
                    dispatch(companyCheck({ email : session.user.email }));
                }
            }
        } , [ session , pathname , company ])
    
    return (
        <div>
            
            {children}
        </div>
    )
}

export default BackofficeLayout;