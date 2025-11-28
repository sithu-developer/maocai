"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCompany } from "@/store/slice/company";
import { changeLoading } from "@/store/slice/loading";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const SettingPage = () => {
    const company = useAppSelector(store => store.company.item);
    const [ updatedCompanyName , setUpdatedCompanyName ] = useState<string>("");
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(company) {
            setUpdatedCompanyName(company.name)
        }
    } , [ company ])


    if(!company) return null;

    const handleUpdateCompany = () => {
        const timeOut = setTimeout(() => {
            dispatch(changeLoading(true))
        } , 3000 )
        dispatch(updateCompany({ ...company , name : updatedCompanyName , isSuccess : () => {
            clearTimeout(timeOut);
            dispatch(changeLoading(false));
        }}))
    }

    return (
        <div className=" w-screen bg-secondary flex flex-col items-center gap-13 p-5">
            <p className="text-3xl">Settings</p>
            <div>
                <p className="text-xs text-blue-500 " >Company Name</p>
                <input type="text" placeholder="Company name.." value={updatedCompanyName} className="w-2xs h-10 px-1 border-b border-black/45 focus:outline-none" onChange={(e) => setUpdatedCompanyName(e.target.value)}  />
                {updatedCompanyName !== company.name && <div className="flex gap-3 mt-4">
                    <button className="border border-black cursor-pointer px-2 py-1 rounded-lg hover:bg-black/10 select-none" onClick={() => setUpdatedCompanyName(company.name)} >Cancel</button>
                    <button className="bg-blue-500 cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-600 select-none" onClick={handleUpdateCompany} >Update</button>
                </div>}
            </div>
            <button className="w-2xs bg-blue-500 cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-600 select-none" onClick={() => signOut({ callbackUrl : "/dashboard"})}>Sign Out</button>
        </div>
    )
}

export default SettingPage;