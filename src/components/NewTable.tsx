"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createTable } from "@/store/slice/table";
import { useState } from "react";

interface Props {
    newTableOpen : boolean;
    setNewTableOpen : ( value : boolean ) => void;
}

const NewTable = ( { newTableOpen , setNewTableOpen } : Props ) => {
    const [ newTableName , setNewTableName ] = useState<string>("");
    const [ isLoading , setIsLoading ] = useState<boolean>(false);
    const company = useAppSelector(store => store.company.item);
    const dispatch = useAppDispatch();


    if(!newTableOpen) return null;

    const handleCreateNewTable = () => {
        if(company) {
            // add image to blob
            setIsLoading(true)
            dispatch(createTable({ companyId : company.id , imageUrl : "/testQRUrl.png" , tableName : newTableName , isSuccess : () => {
                setNewTableName("")
                setIsLoading(false);
                setNewTableOpen(false);
            }}))
        }
    }
        
    return (
        <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-black/50" onClick={() => {
            setNewTableOpen(false);
            setNewTableName("")
        }}>
            <div className="bg-secondary w-80 p-3 rounded flex flex-col gap-7 " onClick={(e) => e.stopPropagation() } >
                <p className="text-2xl px-1" >New Table</p>
                <input type="text" placeholder="Table name..." className="py-2 px-3 border border-black/50 rounded-md focus:outline-none" onChange={(e) => setNewTableName(e.target.value)} />
                <div className="flex justify-end items-center gap-4" >
                    <button className="border rounded py-1 px-2 cursor-pointer hover:bg-primary/20 select-none" onClick={() => {
                        setNewTableOpen(false);
                        setNewTableName("")
                    }} >Cancel</button>
                    {isLoading ? <div className="w-8 h-8 rounded-full border-4 border-primary border-r-transparent animate-spin"></div>
                    :<button disabled={!newTableName} className="rounded py-1 px-2 cursor-pointer bg-blue-500 hover:bg-blue-400 select-none disabled:bg-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed " onClick={handleCreateNewTable} >Create</button>}
                </div>
            </div>
        </div>
    )
}

export default NewTable;