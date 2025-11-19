import { NewCategory, UpdatedCategory } from "@/type/category";
import { prisma } from "@/util/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route";



export const POST = async(req : NextRequest) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "Unauthorized"} , { status : 401 })
    const { name , url , companyId } = await req.json() as NewCategory;
    const isValid = name && url && companyId;
    if(!isValid) return res.json({ error : "Bad request"} , { status : 400 });
    const newCategory = await prisma.category.create({ data : { name , url , companyId }});
    return res.json({ newCategory } , { status : 200 });
}

export const PUT = async( req : NextRequest ) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "unauthorized"} , { status : 401});
    const { id , name , url , companyId } = await req.json() as UpdatedCategory;
    const isValid = id && name && url && companyId;
    if(!isValid) return res.json({ error : "Bad request" } , { status : 400 });
    const isExit = await prisma.category.findUnique({ where : { id }});
    if(!isExit) return res.json({ error : "Not found"} , { status : 400 });
    const updatedCategory = await prisma.category.update({ where : { id } , data : { name , url , companyId }});
    return res.json({ updatedCategory } , { status : 200 })
}

export const DELETE = async (req : NextRequest ) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "Unauthorized" } , { status : 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if(!id) return res.json({ error : "Bad request" } , { status : 400 });
    const isExit = await prisma.category.findUnique({ where : { id }});
    if(!isExit) return res.json({ error : "Bad request" } , { status : 400 });
    await prisma.food.deleteMany({ where : { categoryId : id }});
    const deletedCategory = await prisma.category.delete({ where : { id }});
    return res.json({ deletedCategory });
}