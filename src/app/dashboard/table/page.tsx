"use client"
import NewTable from "@/components/NewTable";
import UpdateTable from "@/components/UpdateTable";
import WarningDialog from "@/components/WariningDialog";
import { useAppSelector } from "@/store/hooks";
import { ArrowPathIcon, ChevronDoubleUpIcon, PencilIcon, SquaresPlusIcon, TrashIcon } from "@heroicons/react/16/solid";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { tables } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

const TablePage = () => {
    const [ newTableOpen , setNewTableOpen ] = useState<boolean>(false);
    const [ updateTableOpen , setUpdateTableOpen ] = useState<boolean>(false);
    const [ openWarning , setOpenWarning ] = useState<boolean>(false);
    const tables = useAppSelector(store => store.table.items);
    const [ editedTable , setEditedTable ] = useState<tables>();

    const printQrCode = ( imageUrl : string ) => {
        const printWindow = window.open("" , "_blank");
        if(!printWindow) return ;

        printWindow.document.open();
        printWindow.document.writeln(`
            <html>
            <head>
                <title>Print QR Code</title>
            </head>
            <body>
                <div style="display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh;">
                    <img alt="QR code" src="${imageUrl}" style="width : 80vw; " />
                </div>
            </body>
            </html>
        `);
        printWindow.document.close(); 

        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        }
    }
    
    return (
        <div className=" w-screen bg-secondary p-5">
            <div className="flex justify-between items-center" >
                <p className="text-3xl ">Tables</p>
                <div className="flex items-center gap-5">
                    {editedTable && (
                        <TrashIcon className="w-10 p-1 border rounded-xl cursor-pointer text-red-500 hover:bg-red-200" onClick={() => setOpenWarning(true)} />
                    )}
                    {editedTable && (
                        <ChevronDoubleUpIcon className="w-10 p-1 border rounded-xl cursor-pointer text-blue-500 hover:bg-blue-200" onClick={() => setUpdateTableOpen(true)} />
                    )}
                    <SquaresPlusIcon className="w-10 p-1 border rounded-xl cursor-pointer text-primary hover:bg-primary/20" onClick={() => setNewTableOpen(true)} />
                </div>
            </div>
            <div className="flex flex-wrap gap-5 mt-5">
                {tables.map(item => ( 
                    <div key={item.id} className="flex flex-col gap-1 items-center" >
                        <p className="bg-primary text-secondary py-0.5 px-3 rounded-2xl border-2 border-borderColor ">{item.tableName}</p>
                        <div className="relative">
                            <Image alt="QR code" src={"/testQRUrl.png"} width={400} height={400} className="w-40 h-auto rounded-2xl shadow-xl border border-black" />
                            {(editedTable && editedTable.id === item.id) ? <ArrowPathIcon className="animate-spin absolute -top-3 -right-3 w-7 p-1 bg-primary text-secondary border rounded-2xl cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                setEditedTable(undefined)
                            }} />
                            :<PencilIcon className=" absolute -top-3 -right-3 w-7 p-1 bg-primary text-secondary border rounded-2xl cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                setEditedTable(item)
                            }} />}
                        </div>
                        <button className="flex items-center justify-center gap-2 bg-primary py-1.5 w-full rounded-md text-secondary mt-2 cursor-pointer shadow-2xl shadow-rose-600 border border-black" onClick={() => printQrCode(item.imageUrl)}>
                            <PrinterIcon className="w-6" />
                            Print
                        </button>
                    </div>
                ))}
            </div>
            <NewTable newTableOpen={newTableOpen} setNewTableOpen={setNewTableOpen} />
            {editedTable && <UpdateTable setUpdateTableOpen={setUpdateTableOpen} updateTableOpen={updateTableOpen} editedTable={editedTable} setEditedTable={setEditedTable} />}
            {editedTable && <WarningDialog openWarning={openWarning} setOpenWarning={setOpenWarning} editedTable={editedTable} setEditedTable={setEditedTable} />}
        </div>
    )
}

export default TablePage;