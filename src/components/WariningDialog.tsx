"use client"
import { useAppDispatch } from "@/store/hooks";
import { deleteCategory } from "@/store/slice/category";
import { deleteFood } from "@/store/slice/food";
import { changeLoading } from "@/store/slice/loading";
import { category, food } from "@prisma/client";

interface Props {
    openWarning : boolean;
    setOpenWarning : ( value : boolean ) => void;
    categoryToDelete ?: category;
    setEditedCategory ?: (value : category | undefined) => void;
    foodToDelete ?: food;
    setEditedFood ?: (value : food | undefined) => void;
}

const WarningDialog = ( { openWarning , setOpenWarning , categoryToDelete , setEditedCategory , foodToDelete , setEditedFood } : Props ) => {
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

    }

    return (
        <>
            {openWarning && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={() => setOpenWarning(false)}>
                <div className="bg-white w-80 p-6 rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-xl text-red-600 mb-4 font-bold">Delete </h2>

                    {categoryToDelete && <p className="mb-1 text-blue-500">"Delete this Category will also delete all the foods under that category!"</p>}
                    <p className="mb-4">Are you sure that you want to Delete this {categoryToDelete && "category \"" + categoryToDelete.name + "\"?"}{foodToDelete && "food \"" + foodToDelete.name + "\"?"}</p>

                    <div className="flex justify-end gap-2">
                    <button className="border border-black cursor-pointer px-2 py-1 rounded-lg hover:bg-black/20 select-none"
                        onClick={() => setOpenWarning(false)}
                    >
                        Cancel
                    </button>
                    <button className="border border-red-600 text-red-700 cursor-pointer px-2 py-1 rounded-lg hover:bg-black/20 select-none"
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