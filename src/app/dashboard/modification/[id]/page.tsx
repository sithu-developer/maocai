"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewFood, updateFood } from "@/store/slice/food";
import { NewFood, UpdatedFood } from "@/type/food";
import { ArrowPathIcon, PaintBrushIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { category } from "@prisma/client";
import { useParams } from "next/navigation";
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
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(categories.length && id ) {
            const selectedCategory = categories.find(item => item.id === id);
            setSelectedCategory(selectedCategory);
        }
    } , [ categories , id ])
    
    if(!selectedCategory) return null;

    const handleCreateNewFood = () => {
        dispatch(createNewFood({...newFood , categoryId : selectedCategory.id , isSuccess : () => {
            setNewFood(defaultNewFood);
        }}))
    }

    const handleUpdateFood = () => {
        if(editedFood) {
            dispatch(updateFood({...editedFood , isSuccess : () => {
                setEditedFood(undefined);
            } }))
        }
    }

    return (
        <div className="bg-[#EAF4F4] h-screen w-screen flex">
            <div className="w-[72%] flex flex-col">
                <p className="text-3xl px-5 py-3.5">Category &gt; {selectedCategory.name}</p>
                <div className="flex flex-wrap gap-5 p-5 overflow-auto">
                    {foods.filter(food => food.categoryId === selectedCategory.id).map(item => (
                        <div key={item.id} className="relative h-43 w-40 bg-cyan-500 rounded-[9px] border-2 border-[#B5B837AB] flex flex-col justify-between">
                            <div>
                                
                            </div>
                            <div className="bg-[#E76B6A] border-t-2 border-t-[#B5B837AB] rounded-b-[9px] py-1">
                                <p className="text-center text-lg text-[#EAF4F4]" >{item.name}</p>
                            </div>
                            {(editedFood && editedFood.id === item.id) ? <ArrowPathIcon className="animate-spin absolute -top-3 -right-3 w-7 p-1 bg-[#E76B6A] text-[#EAF4F4] border rounded-2xl cursor-pointer" onClick={() => setEditedFood(undefined)} />
                            :<PencilIcon className=" absolute -top-3 -right-3 w-7 p-1 bg-[#E76B6A] text-[#EAF4F4] border rounded-2xl cursor-pointer" onClick={() => setEditedFood(item)} />}
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-[#14b7cc] w-[28%] p-5 flex flex-col gap-5">
                <div className={`flex ${editedFood ? "justify-between" : "justify-center"} items-center`} >
                    <p className="text-2xl">{editedFood ? "Edit Food" : "New Food"}</p>
                    {editedFood && <div className="p-1.5 border border-red-800 rounded-md cursor-pointer hover:bg-gray-400">
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
                    <button className="bg-blue-600 cursor-pointer py-2 rounded-3xl shadow-2xs w-full hover:bg-blue-500 select-none" onClick={() => setNewFood({...newFood , url : "example.png"})}>Add Image</button>
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
        </div>
    )
}

export default MenuPage;