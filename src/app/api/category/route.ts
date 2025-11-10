import { NewCategory } from "@/type/category";
import { prisma } from "@/util/prisma";
import { NextRequest, NextResponse } from "next/server"

export const POST = async(req : NextRequest) => {
    const res = NextResponse;
    const { name , url } = await req.json() as NewCategory;
    const isValid = name && url;
    if(!isValid) return res.json({ error : "Bad request"} , { status : 400 });
    const newCategory = await prisma.category.create({ data : { name , url , companyId : ""}})
    
    return res.json({ isDone :  "done" } , { status : 200 });
}