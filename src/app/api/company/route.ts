import { NewCompany, UpdatedCompany } from "@/type/company";
import { prisma } from "@/util/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async( req : NextRequest ) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "Unauthorzed" } , { status : 401 })
    const { email } = await req.json() as NewCompany;
    if(!email) return res.json({ error : "Bad Request"} , { status : 400 });
    const isExit = await prisma.company.findUnique({ where : { email }});
    if(isExit) {
        const categories = await prisma.category.findMany({ where : { companyId : isExit.id } , orderBy : { id : "asc" }});
        const categoriesIds = categories.map(item => item.id);
        const foods = await prisma.food.findMany({ where : { categoryId : { in : categoriesIds }} , orderBy : { id : "asc" }});
        return res.json({ company : isExit , categories , foods });
    } else {
        const newCompany = await prisma.company.create({ data : { name : "Company Name" , email }});
        const newCategory = await prisma.category.create({ data : { name : "Category Name" , url : "/maocai-category.jpg" , companyId : newCompany.id }});
        const newFood = await prisma.food.create({ data : { name : "Food name" , price : 100 , url : "/pork.jpg" , categoryId : newCategory.id }})
        return res.json({ company : newCompany , categories : [ newCategory ] , foods : [ newFood ] });
    }
}

export const PUT = async( req : NextRequest ) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "Unauthorzed" } , { status : 401 });
    const { id , email , name } = await req.json() as UpdatedCompany;
    const isValid = id && email && name;
    if(!isValid) return res.json({ error : "Bad request" } , { status : 400 });
    const isExit = await prisma.company.findUnique({ where : { id }});
    if(!isExit) return res.json({ error : "Bad request" } , { status : 400 });
    const updatedCompany = await prisma.company.update({ where : { id } , data : { name , email }});
    return res.json({ updatedCompany });
}