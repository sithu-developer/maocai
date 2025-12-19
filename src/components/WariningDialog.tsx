"use client"
import { SelectedOrderToDeleteType } from "@/app/dashboard/orders/page";
import { useAppDispatch } from "@/store/hooks";
import { deleteCategory } from "@/store/slice/category";
import { deleteFood } from "@/store/slice/food";
import { changeLoading } from "@/store/slice/loading";
import { deleteOrder } from "@/store/slice/order";
import { deleteTable } from "@/store/slice/table";
import { isExpired7Days } from "@/util/general";
import { category, food, tables } from "@prisma/client";
import { useState } from "react";

interface Props {
    openWarning : boolean;
    setOpenWarning : ( value : boolean ) => void;
    categoryToDelete ?: category;
    setEditedCategory ?: (value : category | undefined) => void;
    foodToDelete ?: food;
    setEditedFood ?: (value : food | undefined) => void;
    editedTable ?: tables;
    setEditedTable ?: (value : tables | undefined) => void;
    selectedOrderSeqAndCreatedDate ?: SelectedOrderToDeleteType;
    setSelectedOrderSeqAndCreatedDate ?: (value : SelectedOrderToDeleteType | null) => void;
}

const WarningDialog = ( { openWarning , setOpenWarning , categoryToDelete , setEditedCategory , foodToDelete , setEditedFood , editedTable , setEditedTable  , selectedOrderSeqAndCreatedDate , setSelectedOrderSeqAndCreatedDate } : Props ) => {
    const dispatch = useAppDispatch();

    const handleDelete = () => {
        if(categoryToDelete) {
            dispatch(changeLoading(true))
            dispatch(deleteCategory({ id : categoryToDelete.id , isSuccess : () => {
                setOpenWarning(false);
                if(setEditedCategory) {
                    setEditedCategory(undefined)
                }
                dispatch(changeLoading(false))
            } }))
        }
        if(foodToDelete) {
            dispatch(changeLoading(true))
            dispatch(deleteFood({ id : foodToDelete.id , isSuccess : () => {
                setOpenWarning(false);
                if(setEditedFood) {
                    setEditedFood(undefined);
                }
                dispatch(changeLoading(false))
            } }))
        }
        if(editedTable) {
            dispatch(changeLoading(true))
            dispatch(deleteTable({ id : editedTable.id , isSuccess : () => {
                setOpenWarning(false);
                if(setEditedTable) {
                    setEditedTable(undefined);
                }
                dispatch(changeLoading(false))
            } }))
        }
        if(selectedOrderSeqAndCreatedDate) {
            dispatch(changeLoading(true))
            dispatch(deleteOrder({ orderSeq : selectedOrderSeqAndCreatedDate.orderSeq , isSuccess : () => {
                dispatch(changeLoading(false));
                setOpenWarning(false);
                if(setSelectedOrderSeqAndCreatedDate) {
                    setSelectedOrderSeqAndCreatedDate(null);
                }
            } }))
        }
    }

    return (
        <>
            {openWarning && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={() => {
                setOpenWarning(false);
                if(setSelectedOrderSeqAndCreatedDate) {
                    setSelectedOrderSeqAndCreatedDate(null);
                }
            }}>
                <div className="bg-white w-80 p-6 rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-xl text-red-600 mb-4 font-bold">Delete </h2>

                    {categoryToDelete && <p className="mb-1 text-blue-500">"Delete this Category will also delete all the foods under that category!"</p>}
                    {editedTable && <p className="mb-1 text-blue-500">"Delete this table will also delete all the orders related to that table!"</p>}
                    {selectedOrderSeqAndCreatedDate && <p className="mb-1 font-semibold ">You can only delete this order if it expired at least 7 days ago!</p>}
                    <p className="mb-4">Are you sure that you want to Delete this {categoryToDelete && "category \"" + categoryToDelete.name + "\"?"}{foodToDelete && "food \"" + foodToDelete.name + "\"?"}{editedTable && "table \"" + editedTable.tableName + "\"?"}{selectedOrderSeqAndCreatedDate && "order ( Seq : " + selectedOrderSeqAndCreatedDate.orderSeq + " ) ?"}</p>


                    <div className="flex justify-end gap-2">
                    <button className="border border-black cursor-pointer px-2 py-1 rounded-lg hover:bg-black/20 select-none"
                        onClick={() => {
                            setOpenWarning(false);
                            if(setSelectedOrderSeqAndCreatedDate) {
                                setSelectedOrderSeqAndCreatedDate(null);
                            }
                        }}
                    >
                        Cancel
                    </button>
                    <button disabled={ !categoryToDelete && !foodToDelete && !editedTable && selectedOrderSeqAndCreatedDate && !isExpired7Days(selectedOrderSeqAndCreatedDate.createdDate) } className="border border-red-600 text-red-700 cursor-pointer px-2 py-1 rounded-lg hover:bg-black/20 select-none disabled:bg-gray-500 disabled:text-black/80 disabled:border-black disabled:cursor-not-allowed"
                        onClick={handleDelete}
                    >
                        Confirm
                    </button>
                    </div>
                </div>
            </div>
            )}
        </>
    )
}

export default WarningDialog;