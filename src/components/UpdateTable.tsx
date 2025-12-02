"use client"
import { useAppDispatch } from "@/store/hooks";
import { updateTable } from "@/store/slice/table";
import { tables } from "@prisma/client";
import { useEffect, useState } from "react";

interface Props {
    editedTable : tables;
    setEditedTable : (value : tables | undefined) => void;
    updateTableOpen : boolean;
    setUpdateTableOpen : ( value : boolean ) => void;
}

const UpdateTable = ( { setUpdateTableOpen , updateTableOpen , editedTable , setEditedTable } : Props ) => {
    const [ editedTableName , setEditedTableName ] = useState<string>("");
    const [ isLoading , setIsLoading ] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setEditedTableName(editedTable.tableName)
    } , [editedTable])

    if(!updateTableOpen) return null;

    const handleUpdateTable = () => {
        setIsLoading(true);
        dispatch(updateTable({ id : editedTable.id , tableName : editedTableName , isSuccess : () => {
            setIsLoading(false);
            setEditedTableName("");
            setUpdateTableOpen(false);
            setEditedTable(undefined);
        } }))
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center" onClick={() => {
            if(!isLoading) {
                setUpdateTableOpen(false);
                setEditedTableName(editedTable.tableName);
            }
        }}>
            <div className="bg-secondary w-80 p-3 rounded-2xl flex flex-col gap-7 " onClick={(e) => e.stopPropagation() } >
                <p className="text-2xl px-1" >Update Table</p>
                <input type="text" placeholder="Table name..." value={editedTableName} className="py-2 px-3 border border-black/50 rounded-md focus:outline-none" onChange={(e) => setEditedTableName(e.target.value)} />
                <div className="flex justify-end items-center gap-4" >
                    <button className="border rounded py-1 px-2 cursor-pointer hover:bg-primary/20 select-none" onClick={() => {
                        if(!isLoading) {
                            setUpdateTableOpen(false);
                            setEditedTableName(editedTable.tableName);
                        }
                    }} >Cancel</button>
                    {isLoading ? <div className="w-8 h-8 rounded-full border-4 border-primary border-r-transparent animate-spin"></div>
                    :<button disabled={!editedTableName || editedTableName === editedTable.tableName} className="rounded py-1 px-2 cursor-pointer bg-blue-500 hover:bg-blue-400 select-none disabled:bg-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed " onClick={handleUpdateTable} >Update</button>}
                </div>
            </div>
        </div>
    )
}

export default UpdateTable;