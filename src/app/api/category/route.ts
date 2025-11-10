import { NewCategory } from "@/type/category";
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