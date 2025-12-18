"use client"
import WarningDialog from "@/components/WariningDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewCategory, updateCategory } from "@/store/slice/category";
import { changeLoading } from "@/store/slice/loading";
import { NewCategory } from "@/type/category";
import { uploadImage } from "@/util/Upload";
import { ArrowPathIcon, PaintBrushIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { category } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const defaultNewCategory : NewCategory = {
    name : "" , url : "" , companyId : "" , isMainDish : false
}

const ModificationPage = () => {
    const [ newCategory , setNewCategory ] = useState<NewCategory>(defaultNewCategory);
    const [ newImageFile , setNewImageFile ] = useState<FileList | null>(null);
    const [ updatedImageFile , setUpdatedImageFile ] = useState<FileList | null>(null);
    const [ editedCategory , setEditedCategory ] = useState<category>();
    const [ openWarning , setOpenWarning ] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement  | null>(null);
    const inputUpdateRef = useRef<HTMLInputElement  | null>(null);
    const dispatch = useAppDispatch();
    const company = useAppSelector(store => store.company.item);
    const categories = useAppSelector(store => store.category.items);
    const router = useRouter();
   

    const handleCreateNewCategory = async() => {
        if(company && newImageFile) {
            dispatch(changeLoading(true))
            const url = await uploadImage(newImageFile);
            dispatch(createNewCategory( { ...newCategory , url ,  companyId : company.id , isSuccess : () => {
                setNewCategory(defaultNewCategory);
                setNewImageFile(null)
                if(inputRef.current) {
                    inputRef.current.value = "";
                }
                dispatch(changeLoading(false))
            }}))
        }
    }

    const handleUpdateCategory = async() => {
        if(editedCategory) {
            dispatch(changeLoading(true))
            if(updatedImageFile) {
                const url = await uploadImage(updatedImageFile);
                dispatch(updateCategory({...editedCategory , url , isSuccess : () => {
                    setEditedCategory(undefined);
                    setUpdatedImageFile(null)
                    if(inputUpdateRef.current) {
                        inputUpdateRef.current.value = "";
                    }
                    dispatch(changeLoading(false))
                }}));
            } else {
                dispatch(updateCategory({...editedCategory , isSuccess : () => {
                    setEditedCategory(undefined);
                    setUpdatedImageFile(null);
                    if(inputUpdateRef.current) {
                        inputUpdateRef.current.value = "";
                    }
                    dispatch(changeLoading(false))
                }}));
            }
        }
    }

    return (
        <div className="bg-secondary h-screen w-screen flex justify-between">
            <div className="w-[72%] flex flex-col">
                <p className="text-3xl px-5 py-3.5">Category</p>
                <div className="flex flex-wrap gap-5 p-5 overflow-auto">
                    {categories.length ? categories.map(item => (
                        <div key={item.id} className="relative h-43 w-40 bg-cyan-500 rounded-[9px] border-2 border-borderColor flex flex-col justify-between cursor-pointer" onClick={() => router.push(`./modification/${item.id}`)}>
                            <div className="overflow-hidden h-full w-full flex items-center justify-center rounded-t-[9px]" >
                                <Image alt="category photo" src={item.url} width={400} height={400} className=" h-full w-auto object-cover"  />
                            </div>
                            <div className="bg-primary border-t-2 border-t-borderColor rounded-b-[9px] py-1">
                                <p className="text-center text-lg text-secondary text-[clamp(10px,1.2vw,16px)]" >{item.name}</p>
                            </div>
                            {(editedCategory && editedCategory.id === item.id) ? <ArrowPathIcon className="animate-spin absolute -top-3 -right-3 w-7 p-1 bg-primary text-secondary border rounded-2xl cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                setEditedCategory(undefined)
                                setUpdatedImageFile(null);
                                if(inputUpdateRef.current) {
                                    inputUpdateRef.current.value = "";
                                }
                            }} />
                            :<PencilIcon className=" absolute -top-3 -right-3 w-7 p-1 bg-primary text-secondary border rounded-2xl cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                setEditedCategory(item)
                            }} />}
                        </div>
                    ))
                    :<p>No created category !</p>}
                </div>
            </div>
            <div className="bg-[#14b7cc] grow p-5 flex flex-col gap-5">
                <div className={`flex ${editedCategory ? "justify-between" : "justify-center"} items-center`} >
                    <p className="text-2xl">{editedCategory ? "Edit Category" : "New Category"}</p>
                    {editedCategory && <div className="p-1.5 border border-red-800 rounded-md cursor-pointer hover:bg-gray-400" onClick={() => setOpenWarning(true)}>
                        <TrashIcon className="w-4.5 text-red-800" />
                    </div>}
                </div>
                <div className="flex flex-col gap-2 mt-3">
                    <p>Name</p>
                    {editedCategory ? 
                    <input type="text" placeholder="name.." value={editedCategory.name} className=" w-full h-10 px-3 rounded-lg border border-black focus:outline-none" onChange={(e) => setEditedCategory({...editedCategory , name : e.target.value})}  />
                    :<input type="text" placeholder="name.." value={newCategory.name} className=" w-full h-10 px-3 rounded-lg border border-black focus:outline-none" onChange={(e) => setNewCategory({...newCategory , name : e.target.value})}  />}
                </div>
                {editedCategory ? 
                <div className="flex flex-col gap-2">
                    <p>Image</p>
                    <div className="flex items-center justify-between gap-3 bg-blue-300 px-3 py-2 w-full rounded-3xl">
                        <p className="w-[15vw] truncate">{updatedImageFile ? updatedImageFile[0].name : editedCategory.url}</p>
                        <div className="relative hover:bg-blue-400 cursor-pointer rounded-3xl p-1">
                            <PaintBrushIcon className="w-4" />
                            <input type="file" ref={inputUpdateRef} className="absolute top-0 left-0 w-full h-full cursor-pointer rounded-3xl opacity-0 " onChange={(e) => {
                                const files = e.target.files;
                                if(files && files.length > 0) {
                                    setUpdatedImageFile(files);
                                } else {
                                    setUpdatedImageFile(updatedImageFile)
                                }
                            }} />
                        </div>
                    </div>
                </div>
                :<div className="flex flex-col gap-2">
                    <p>Image</p>
                    <div className="bg-blue-600 relative cursor-pointer py-2 rounded-3xl shadow-2xs w-full hover:bg-blue-500 select-none flex justify-center" >
                        <input type="file" ref={inputRef} className="absolute top-0 left-0 w-full h-full cursor-pointer rounded-3xl opacity-0 " onChange={(e) => {
                            const files = e.target.files;
                            if(files && files.length > 0) {
                                setNewImageFile(files);
                            } else {
                                setNewImageFile(newImageFile)
                            }
                        }} />
                        <p>Add Image</p>
                    </div>
                    {newImageFile && newImageFile[0].name && <div className="flex items-center gap-3 bg-blue-300 px-2 py-1 w-fit rounded-3xl">
                        <p className="max-w-[15vw] truncate">{(newImageFile as FileList)[0].name}</p>
                        <div className="hover:bg-blue-400 cursor-pointer rounded-3xl" onClick={() => {
                            if(inputRef.current) {
                                inputRef.current.value = "";
                            }
                            setNewImageFile(null);
                        }}>
                            <XMarkIcon className="w-5" />
                        </div>
                    </div>}
                </div>}
                <div  className="flex gap-3">
                    {editedCategory ? <input type="checkbox" className="w-4" checked={editedCategory.isMainDish} onChange={(e ) => setEditedCategory({...editedCategory , isMainDish : e.target.checked})} />
                    :<input type="checkbox" className="w-4" checked={newCategory.isMainDish} onChange={(e ) => setNewCategory({...newCategory , isMainDish : e.target.checked})} />}
                    <label>Is Main Dish ?</label>
                </div>
                <div className="mt-2 flex gap-3">
                    <button className="border border-black cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-400 select-none" onClick={() => {
                        if(editedCategory) {
                            setEditedCategory(undefined)
                            setUpdatedImageFile(null);
                            if(inputUpdateRef.current) {
                                inputUpdateRef.current.value = "";
                            }
                        } else {
                            setNewCategory(defaultNewCategory)
                            setNewImageFile(null)
                            if(inputRef.current) {
                                inputRef.current.value = "";
                            }
                        }
                    }} >{editedCategory ? "Cancel" : "Clear"}</button>
                    {editedCategory ? <button disabled={!editedCategory.name || !editedCategory.url} className="bg-blue-600 cursor-pointer p-2 rounded-lg hover:bg-blue-500 select-none disabled:bg-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed" onClick={handleUpdateCategory} >Update</button>
                    :<button disabled={!newCategory.name || !newImageFile} className="bg-blue-600 cursor-pointer p-2 rounded-lg hover:bg-blue-500 select-none disabled:bg-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed" onClick={handleCreateNewCategory} >Create</button>}
                </div>
            </div>
            <WarningDialog openWarning={openWarning} setOpenWarning={setOpenWarning} categoryToDelete={editedCategory} setEditedCategory={setEditedCategory} />
        </div>
    )
}

export default ModificationPage;

//grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4