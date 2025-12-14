"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCompany } from "@/store/slice/company";
import { changeLoading } from "@/store/slice/loading";
import { UpdatedCompany } from "@/type/company";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";



const SettingPage = () => {
    const company = useAppSelector(store => store.company.item);
    const [ updatedCompany , setUpdatedCompany ] = useState<UpdatedCompany | null>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(company) {
            setUpdatedCompany({...company})
        }
    } , [ company ])


    if(!company || !updatedCompany) return null;

    const handleUpdateCompany = () => {
            dispatch(changeLoading(true))
            dispatch(updateCompany({ ...updatedCompany , isSuccess : () => {
                dispatch(changeLoading(false));
            }}))
    }

    return (
        <div className=" w-screen bg-secondary flex flex-col items-center gap-13 p-5">
            <p className="text-3xl">Settings</p>
            <div className="flex flex-col gap-8">
                <div>
                    <p className="text-xs text-blue-500 " >Company Name</p>
                    <input type="text" placeholder="Company name.." value={updatedCompany.name} className="w-2xs h-10 px-1 border-b border-black/45 focus:outline-none" onChange={(e) => setUpdatedCompany({...updatedCompany , name : e.target.value})}  />
                </div>
                <div>
                    <p className="text-xs text-green-600" >Tax Percentage ( % )</p>
                    <input type="number" placeholder="Tax Percentage.." value={updatedCompany.taxPercentage} className="w-2xs h-10 px-1 border-b border-black/45 focus:outline-none" onChange={(e) => setUpdatedCompany({...updatedCompany , taxPercentage : Number(e.target.value)})}  />
                </div>
                <div>
                    <p className="text-xs text-green-600 " >Service Charge Percentage ( % )</p>
                    <input type="number" placeholder="Service Charge Percentage.." value={updatedCompany.serviceChargePercentage} className="w-2xs h-10 px-1 border-b border-black/45 focus:outline-none" onChange={(e) => setUpdatedCompany({...updatedCompany , serviceChargePercentage : Number(e.target.value)})}  />
                </div>
                <div>
                    <p className="text-xs text-red-400 " >Spicy Levels from 0 to</p>
                    <input type="number" placeholder="Company name.." value={updatedCompany.spicyTotalLevel} className="w-2xs h-10 px-1 border-b border-black/45 focus:outline-none" onChange={(e) => setUpdatedCompany({...updatedCompany , spicyTotalLevel : Number(e.target.value)})} />
                </div>

                {(updatedCompany.name !== company.name || updatedCompany.taxPercentage !== company.taxPercentage || updatedCompany.serviceChargePercentage !== company.serviceChargePercentage || updatedCompany.spicyTotalLevel !== company.spicyTotalLevel ) && <div className="flex gap-3 mt-4">
                    <button className="border border-black cursor-pointer px-2 py-1 rounded-lg hover:bg-black/10 select-none" onClick={() => setUpdatedCompany(company)} >Cancel</button>
                    <button disabled={updatedCompany.serviceChargePercentage < 0 || updatedCompany.taxPercentage < 0 || updatedCompany.spicyTotalLevel < 0 } className="bg-blue-500 cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-600 select-none disabled:bg-gray-600 disabled:cursor-not-allowed " onClick={handleUpdateCompany}  >Update</button>
                </div>} 
            </div>
            <button className="w-2xs bg-blue-500 cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-600 select-none" onClick={() => signOut({ callbackUrl : "/dashboard"})}>Sign Out</button>
        </div>
    )
}

export default SettingPage;