"use client"
import Loading from "@/components/Loading";
import SideBar from "@/components/SideBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { companyCheck } from "@/store/slice/company";
import { changeLoading } from "@/store/slice/loading";
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
                    const timeOut = setTimeout(() => {
                        dispatch(changeLoading(true))
                    } , 3000 )
                    dispatch(companyCheck({ email : session.user.email , isSuccess : () => {
                        clearTimeout(timeOut);
                        dispatch(changeLoading(false))
                        router.push("/dashboard/modification");
                    }}));
                } else if(session && session.user && session.user.email) {
                    const timeOut = setTimeout(() => {
                        dispatch(changeLoading(true))
                    } , 3000 )
                    dispatch(companyCheck({ email : session.user.email , isSuccess : () => {
                        clearTimeout(timeOut);
                        dispatch(changeLoading(false))
                    } }));
                }
            }
        } , [ session , pathname , company ])
    
    return (
        <div className="flex">
            {pathname !== "/dashboard" && <SideBar />}
            {children}
            <Loading />
        </div>
    )
}

export default BackofficeLayout;