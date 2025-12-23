import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextRequest, NextResponse } from "next/server";
import { NewFood, UpdatedFood } from "@/type/food";
import { prisma } from "@/util/prisma";

export const POST = async( req : NextRequest ) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "Unauthorized"} , { status : 401 });
    const { name , price , url , categoryId } = await req.json() as NewFood;
    const isValid = name && price && url && categoryId;
    if(!isValid) return res.json({ error : "Bad Request"} , { status : 400 });
    const createdFood = await prisma.food.create({ data : { name , price , url , categoryId }});
    return res.json({ createdFood });
}

export const PUT = async( req : NextRequest ) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "Unauthorized" } , { status : 401 });
    const { id , name , price , url , categoryId } = await req.json() as UpdatedFood;
    const isValid = id && name && price && url && categoryId;
    if(!isValid) return res.json({ error : "Bad request" } , { status : 400 });
    const isExit = await prisma.food.findUnique({ where : { id }});
    if(!isExit) return res.json({ error : "Bad request" } , { status : 400 });
    const updatedFood = await prisma.food.update({ where : { id } , data : { name , price , url , categoryId }});
    return res.json({ updatedFood });
}

export const DELETE = async( req : NextRequest ) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "Unauthorized" } , { status : 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if(!id) return res.json({ error : "Bad request" } , { status : 400 });
    const isExit = await prisma.food.findUnique({ where : { id }});
    if(!isExit) return res.json({ error : "Bad request" } , { status : 400 });
    await prisma.order.deleteMany({ where : { foodId : id } })
    const deletedFood = await prisma.food.delete({ where : { id }});
    return res.json({ deletedFood });
}