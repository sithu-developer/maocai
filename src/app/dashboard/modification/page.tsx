"use client"
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

const defaultNewCategory : NewCategory= {
    name : "" , url : ""
}

const ModificationPage = () => {
    const [ newCategory , setNewCategory ] = useState<NewCategory>(defaultNewCategory);


    return (
        <div className="bg-[#EAF4F4] h-screen w-screen flex">
            <div className="w-[72%] flex flex-col">
                <p className="text-3xl px-5 py-3.5">Category &gt; </p>
                <div className="flex flex-wrap gap-5 p-5 overflow-auto">
                    {[1,2,3,4,5,6,7,8,9].map(item => (
                        <div key={item} className="h-43 w-40 bg-cyan-500 rounded-[9px] border-2">a</div>
                    ))}
                </div>
            </div>
            <div className="bg-[#14b7cc] w-[28%] p-5 flex flex-col gap-5">
                <p className="text-2xl text-center">New Category</p>
                <div className="flex flex-col gap-2 mt-3">
                    <p>Name</p>
                    <input type="text" placeholder="name.." value={newCategory.name} className=" w-full h-10 px-3 rounded-lg border border-black focus:outline-none" onChange={(e) => setNewCategory({...newCategory , name : e.target.value})}  />
                </div>
                <div className="flex flex-col gap-2">
                    <p>Image</p>
                    <button className="bg-blue-600 cursor-pointer py-2 rounded-3xl shadow-2xs w-full hover:bg-blue-500 select-none" onClick={() => setNewCategory({...newCategory , url : "example.png"})}>Browse Image</button>
                    {newCategory.url && <div className="flex items-center gap-3 bg-blue-300 px-2 py-1 w-fit rounded-3xl">
                        <p>{newCategory.url}</p>
                        <div className="hover:bg-blue-400 cursor-pointer rounded-3xl" onClick={() => setNewCategory({...newCategory , url : ""})}>
                            <XMarkIcon className="w-5" />
                        </div>
                    </div>}
                </div>
                <div className="mt-2 flex gap-3">
                    <button className="border border-black cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-300 select-none" onClick={() => setNewCategory(defaultNewCategory)} >Clear</button>
                    <button disabled={!newCategory.name || !newCategory.url} className="bg-blue-600 cursor-pointer p-2 rounded-lg hover:bg-blue-500 select-none disabled:bg-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed" onClick={() => console.log(newCategory)} >Create</button>
                </div>
            </div>
        </div>
    )
}

export default ModificationPage;

//grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4