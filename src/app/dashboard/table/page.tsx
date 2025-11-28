"use client"
import NewTable from "@/components/NewTable";
import { SquaresPlusIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

const TablePage = () => {
    const [ newTableOpen , setNewTableOpen ] = useState<boolean>(false);
    
    return (
        <div className=" w-screen bg-secondary p-5">
            <div className="flex justify-between items-center" >
                <p className="text-3xl ">Tables</p>
                <SquaresPlusIcon className="w-10 p-1 border rounded-xl cursor-pointer text-primary hover:bg-primary/20" onClick={() => setNewTableOpen(true)} />
            </div>
            <NewTable newTableOpen={newTableOpen} setNewTableOpen={setNewTableOpen} />
        </div>
    )
}

export default TablePage;