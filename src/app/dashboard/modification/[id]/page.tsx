"use client"

import WarningDialog from "@/components/WariningDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewFood, updateFood } from "@/store/slice/food";
import { changeLoading } from "@/store/slice/loading";
import { NewFood, UpdatedFood } from "@/type/food";
import { uploadImage } from "@/util/Upload";
import { ArrowPathIcon, ChevronRightIcon, PaintBrushIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { category } from "@prisma/client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


const defaultNewFood : NewFood = {
    name : "" , price : 0 , categoryId : "" , url : ""
}

const MenuPage = () => {
    const categories = useAppSelector(store => store.category.items);
    const foods = useAppSelector(store => store.food.items);
    const id = useParams().id;
    const [ selectedCategory , setSelectedCategory ] = useState<category>();
    const [ editedFood , setEditedFood ] = useState<UpdatedFood>();
    const [ newFood , setNewFood ] = useState<NewFood>(defaultNewFood);
    const [ newImageFile , setNewImageFile ] = useState<FileList | null>(null);
    const [ updatedImageFile , setUpdatedImageFile ] = useState<FileList | null>(null);
    const [ openWarning , setOpenWarning ] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement  | null>(null);
    const inputUpdateRef = useRef<HTMLInputElement  | null>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();


    useEffect(() => {
        if(categories.length && id ) {
            const selectedCategory = categories.find(item => item.id === id);
            setSelectedCategory(selectedCategory);
        }
    } , [ categories , id ])
    
    if(!selectedCategory) return null;

    const handleCreateNewFood = async() => {
        if(newImageFile) {
            dispatch(changeLoading(true))
            const url = await uploadImage(newImageFile);
            dispatch(createNewFood({...newFood , url , categoryId : selectedCategory.id , isSuccess : () => {
                setNewFood(defaultNewFood);
                setNewImageFile(null);
                if(inputRef.current) {
                    inputRef.current.value = "";
                }
                dispatch(changeLoading(false))
            }}))
        }
    }

    const handleUpdateFood = async() => {
        if(editedFood) {
            dispatch(changeLoading(true))
            if(updatedImageFile) {
                const url = await uploadImage(updatedImageFile)
                dispatch(updateFood({...editedFood , url , isSuccess : () => {
                    setEditedFood(undefined);
                    setUpdatedImageFile(null)
                    if(inputUpdateRef.current) {
                        inputUpdateRef.current.value = "";
                    }
                    dispatch(changeLoading(false))
                } }))
            } else {
                dispatch(updateFood({...editedFood , isSuccess : () => {
                    setEditedFood(undefined);
                    setUpdatedImageFile(null)
                    if(inputUpdateRef.current) {
                        inputUpdateRef.current.value = "";
                    }
                    dispatch(changeLoading(false))
                } }))
            }
        }
    }


    return (
        <div className="bg-secondary h-screen w-screen flex">
            <div className="w-[72%] flex flex-col">
                <div className="flex gap-5 items-center px-5">
                    <p className="text-3xl py-3.5 cursor-pointer" onClick={() => router.push("./")}>Category</p>
                    <ChevronRightIcon className="w-8" />
                    <p className="text-3xl py-3.5">{selectedCategory.name}</p>
                </div>
                <div className="flex flex-wrap gap-5 p-5 overflow-auto">
                    {foods.filter(food => food.categoryId === selectedCategory.id).length ? foods.filter(food => food.categoryId === selectedCategory.id).map(item => (
                        <div key={item.id} className="relative bg-white h-43 w-40 rounded-[9px] border-2 border-borderColor flex flex-col justify-between">
                            <div className="overflow-hidden h-full w-full flex items-center justify-center rounded-t-[9px]" >
                                <Image alt="category photo" src={item.url} width={400} height={400} className=" h-auto w-full object-cover"  />
                            </div>
                            <div className="bg-primary border-t-2 border-t-borderColor rounded-b-[9px] py-1">
                                <p className="text-center text-lg text-secondary text-[clamp(10px,1.2vw,16px)]" >{item.name} - {item.price}ks</p>
                            </div>
                            {(editedFood && editedFood.id === item.id) ? <ArrowPathIcon className="animate-spin absolute -top-3 -right-3 w-7 p-1 bg-primary text-secondary border rounded-2xl cursor-pointer" onClick={() => {
                                setEditedFood(undefined)
                                setUpdatedImageFile(null)
                                if(inputUpdateRef.current) {
                                    inputUpdateRef.current.value = "";
                                }
                            }} />
                            :<PencilIcon className=" absolute -top-3 -right-3 w-7 p-1 bg-primary text-secondary border rounded-2xl cursor-pointer" onClick={() => setEditedFood(item)} />}
                        </div>
                    ))
                    :<p>No created food !</p>}
                </div>
            </div>
            <div className="bg-linear-to-br from-[#53d3fa] via-[#b794f4] to-[#f687b3] grow p-5 flex flex-col gap-5">
                <div className={`flex ${editedFood ? "justify-between" : "justify-center"} items-center`} >
                    <p className="text-2xl">{editedFood ? "Edit Food" : "New Food"}</p>
                    {editedFood && <div className="p-1.5 border border-red-800 rounded-md cursor-pointer hover:bg-gray-400" onClick={() => setOpenWarning(true)}>
                        <TrashIcon className="w-4.5 text-red-800" />
                    </div>}
                </div>
                <div className="flex flex-col gap-2 mt-3">
                    <p>Name</p>
                    {editedFood ? 
                    <input type="text" placeholder="eg : Cola.." value={editedFood.name} className=" w-full h-10 px-3 rounded-lg border border-black focus:outline-none" onChange={(e) => setEditedFood({...editedFood , name : e.target.value})}  />
                    :<input type="text" placeholder="eg : Cola.." value={newFood.name} className=" w-full h-10 px-3 rounded-lg border border-black focus:outline-none" onChange={(e) => setNewFood({...newFood , name : e.target.value})}  />}
                </div>
                <div className="flex flex-col gap-2 mt-3">
                    <p>Price</p>
                    {editedFood ? 
                    <input type="number" placeholder="eg : 120.." value={(editedFood.price === 0 ? "" : editedFood.price)} className=" w-full h-10 px-3 rounded-lg border border-black focus:outline-none" onChange={(e) => setEditedFood({...editedFood , price : Number(e.target.value)})}  />
                    :<input type="number" placeholder="eg : 120.." value={(newFood.price === 0 ? "" : newFood.price)} className=" w-full h-10 px-3 rounded-lg border border-black focus:outline-none" onChange={(e) => setNewFood({...newFood , price : Number(e.target.value)})}  />}
                </div>
                {editedFood ? 
                <div className="flex flex-col gap-2">
                    <p>Image</p>
                    <div className="flex items-center justify-between gap-3 bg-blue-300 border px-3 py-2 w-full rounded-3xl">
                        <p className="w-[15vw] truncate">{updatedImageFile ? updatedImageFile[0].name : editedFood.url}</p>
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
                        <p className="text-secondary" >Add Image</p>
                    </div>
                    {newImageFile && newImageFile[0].name && <div className="flex items-center gap-3 bg-blue-300 border px-2 py-1 w-fit rounded-3xl">
                        <p className="max-w-[15vw] truncate">{newImageFile[0].name}</p>
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
                <div className="mt-2 flex gap-3">
                    <button className="border border-black cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-400 select-none" onClick={() => {
                        if(editedFood) {
                            setEditedFood(undefined)
                            setUpdatedImageFile(null)
                            if(inputUpdateRef.current) {
                                inputUpdateRef.current.value = "";
                            }
                        } else {
                            setNewFood(defaultNewFood)
                            setNewImageFile(null);
                            if(inputRef.current) {
                                inputRef.current.value = "";
                            }
                        }
                    }} >{editedFood ? "Cancel" : "Clear"}</button>
                    {editedFood ? <button disabled={!editedFood.name || !editedFood.price || !editedFood.url} className="bg-blue-600 text-secondary cursor-pointer p-2 rounded-lg hover:bg-blue-500 select-none disabled:bg-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed" onClick={handleUpdateFood} >Update</button>
                    :<button disabled={!newFood.name || !newFood.price || !newImageFile} className="bg-blue-600 text-secondary cursor-pointer p-2 rounded-lg hover:bg-blue-500 select-none disabled:bg-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed" onClick={handleCreateNewFood} >Create</button>}
                </div>
            </div>
            <WarningDialog openWarning={openWarning} setOpenWarning={setOpenWarning} foodToDelete={editedFood} setEditedFood={setEditedFood} />
        </div>
    )
}

export default MenuPage;