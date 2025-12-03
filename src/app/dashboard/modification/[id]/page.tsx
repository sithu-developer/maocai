"use client"

import WarningDialog from "@/components/WariningDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewFood, updateFood } from "@/store/slice/food";
import { changeLoading } from "@/store/slice/loading";
import { NewFood, UpdatedFood } from "@/type/food";
import { ArrowPathIcon, ChevronRightIcon, PaintBrushIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { category } from "@prisma/client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


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
    const [ openWarning , setOpenWarning ] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if(categories.length && id ) {
            const selectedCategory = categories.find(item => item.id === id);
            setSelectedCategory(selectedCategory);
        }
    } , [ categories , id ])
    
    if(!selectedCategory) return null;

    const handleCreateNewFood = () => {
        const timeOut = setTimeout(() => {
            dispatch(changeLoading(true))
        } , 3000 )
        dispatch(createNewFood({...newFood , categoryId : selectedCategory.id , isSuccess : () => {
            clearTimeout(timeOut);
            setNewFood(defaultNewFood);
            dispatch(changeLoading(false))
        }}))
    }

    const handleUpdateFood = () => {
        if(editedFood) {
            const timeOut = setTimeout(() => {
                dispatch(changeLoading(true))
            } , 3000 )
            dispatch(updateFood({...editedFood , isSuccess : () => {
                clearTimeout(timeOut);
                setEditedFood(undefined);
                dispatch(changeLoading(false))
            } }))
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
                        <div key={item.id} className="relative h-43 w-40 bg-cyan-500 rounded-[9px] border-2 border-borderColor flex flex-col justify-between">
                            <div className="overflow-hidden h-full w-full flex items-center justify-center rounded-t-[9px]" >
                                <Image alt="category photo" src={item.url} width={400} height={400} className=" h-auto w-full object-cover"  />
                            </div>
                            <div className="bg-primary border-t-2 border-t-borderColor rounded-b-[9px] py-1">
                                <p className="text-center text-lg text-secondary" >{item.name} - {item.price}ks</p>
                            </div>
                            {(editedFood && editedFood.id === item.id) ? <ArrowPathIcon className="animate-spin absolute -top-3 -right-3 w-7 p-1 bg-primary text-secondary border rounded-2xl cursor-pointer" onClick={() => setEditedFood(undefined)} />
                            :<PencilIcon className=" absolute -top-3 -right-3 w-7 p-1 bg-primary text-secondary border rounded-2xl cursor-pointer" onClick={() => setEditedFood(item)} />}
                        </div>
                    ))
                    :<p>No created food !</p>}
                </div>
            </div>
            <div className="bg-[#14b7cc] grow p-5 flex flex-col gap-5">
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
                    <div className="flex items-center justify-between gap-3 bg-blue-300 px-3 py-2 w-full rounded-3xl">
                        <p>{editedFood.url}</p>
                        <div className="hover:bg-blue-400 cursor-pointer rounded-3xl p-1" onClick={() => setEditedFood({...editedFood , url : "updatedUrl.png"})}>
                            <PaintBrushIcon className="w-4" />
                        </div>
                    </div>
                </div>
                :<div className="flex flex-col gap-2">
                    <p>Image</p>
                    <button className="bg-blue-600 cursor-pointer py-2 rounded-3xl shadow-2xs w-full hover:bg-blue-500 select-none" onClick={() => setNewFood({...newFood , url : "/pork.jpg"})}>Add Image</button>
                    {newFood.url && <div className="flex items-center gap-3 bg-blue-300 px-2 py-1 w-fit rounded-3xl">
                        <p>{newFood.url}</p>
                        <div className="hover:bg-blue-400 cursor-pointer rounded-3xl" onClick={() => setNewFood({...newFood , url : ""})}>
                            <XMarkIcon className="w-5" />
                        </div>
                    </div>}
                </div>}
                <div className="mt-2 flex gap-3">
                    <button className="border border-black cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-400 select-none" onClick={() => {
                        if(editedFood) {
                            setEditedFood(undefined)
                        } else {
                            setNewFood(defaultNewFood)
                        }
                    }} >{editedFood ? "Cancel" : "Clear"}</button>
                    {editedFood ? <button disabled={!editedFood.name || !editedFood.price || !editedFood.url} className="bg-blue-600 cursor-pointer p-2 rounded-lg hover:bg-blue-500 select-none disabled:bg-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed" onClick={handleUpdateFood} >Update</button>
                    :<button disabled={!newFood.name || !newFood.price || !newFood.url} className="bg-blue-600 cursor-pointer p-2 rounded-lg hover:bg-blue-500 select-none disabled:bg-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed" onClick={handleCreateNewFood} >Create</button>}
                </div>
            </div>
            <WarningDialog openWarning={openWarning} setOpenWarning={setOpenWarning} foodToDelete={editedFood} setEditedFood={setEditedFood} />
        </div>
    )
}

export default MenuPage;