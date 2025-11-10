import { NewCompany } from "@/type/company";
import { prisma } from "@/util/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async( req : NextRequest ) => {
    const res = NextResponse
    const { email } = await req.json() as NewCompany;
    if(!email) return res.json({ error : "Bad Request"} , { status : 400 });
    const isExit = await prisma.company.findUnique({ where : { email }});
    if(isExit) {
        const categories = await prisma.category.findMany({ where : { companyId : isExit.id }});
        return res.json({ company : isExit , categories });
    } else {
        const newCompany = await prisma.company.create({ data : { name : "Company Name" , email }});
        const newCategory = await prisma.category.create({ data : { name : "Category Name" , url : "example.png" , companyId : newCompany.id }});
        return res.json({ company : newCompany , categories : [ newCategory ]});
    }
    
}