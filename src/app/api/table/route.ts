import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { NewTable, UpdateTable } from "@/type/table";
import { prisma } from "@/util/prisma";

export const POST = async(req : NextRequest) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "Unauthorized" } , { status : 401 });
    const { companyId , imageUrl , tableName } = await req.json() as NewTable;
    const isValid = companyId && imageUrl && tableName;
    if(!isValid) return res.json({ error : "Bad request" } , { status : 400 });
    const newTable = await prisma.tables.create({ data : { tableName , imageUrl , companyId }});
    return res.json({ newTable })
}

export const PUT = async( req : NextRequest ) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "Unauthorized" } , { status : 401 });
    const { id , tableName } = await req.json() as UpdateTable;
    const isValid = id && tableName;
    if(!isValid) return res.json({ error : "Bad request" } , { status : 400 });
    const isExit = await prisma.tables.findUnique({ where : { id }});
    if(!isExit) return res.json({ error : "Bad request" } , { status : 400 });
    const updatedTable = await prisma.tables.update({ where : { id } , data : { tableName }});
    return res.json({ updatedTable });
}

export const DELETE = async( req : NextRequest ) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "Unauthorized" } , { status : 401 });
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if(!id) return res.json({ error : "Bad request" } , { status : 400 });
    const isExit = await prisma.tables.findUnique({ where : { id }});
    if(!isExit) return res.json({ error : "Bad request" } , { status : 400 });
    const deletedTable = await prisma.tables.delete({ where : { id } });
    return res.json({ deletedTable });
}

export const GET = async( req : NextRequest ) => {
    const res = NextResponse;
    // no session here **
    const url = new URL(req.url);
    const tableId = url.searchParams.get("tableId");
    if(!tableId) return res.json({ error : "Bad request" } , { status : 400 });
    const isTableExit = await prisma.tables.findUnique({ where : { id : tableId }});
    if(!isTableExit) return res.json({ error : "Bad request" } , { status : 400 });
    const company = await prisma.company.findUnique({ where : { id : isTableExit.companyId }});
    if(!company) return res.json({ error : "Bad request" } , { status : 400 });
    const categories = await prisma.category.findMany({ where : { companyId : company.id } , orderBy : { id : "asc" }});
    const categoryIds = categories.map(item => item.id);
    const foods = await prisma.food.findMany({ where : { categoryId : { in : categoryIds } } , orderBy : { id : "asc" } });
    return res.json({ company , categories , foods , customerTable : isTableExit })
}