import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { NewTable, UpdateTable } from "@/type/table";
import { prisma } from "@/util/prisma";
import { generateQR } from "@/util/qrcode";
import { envValues } from "@/util/envValues";
import { put } from "@vercel/blob";
import { base64ToBuffer } from "@/util/Upload";

export const POST = async(req : NextRequest) => {
    const res = NextResponse;
    const session = await getServerSession(authOptions);
    if(!session) return res.json({ error : "Unauthorized" } , { status : 401 });
    const { companyId , tableName } = await req.json() as NewTable;
    const isValid = companyId && tableName;
    if(!isValid) return res.json({ error : "Bad request" } , { status : 400 });
    const newTable = await prisma.tables.create({ data : { tableName , imageUrl : "" , companyId }});
    const qrCodeImage = await generateQR(`${envValues.orderAppUrl}?tableId=${newTable.id}`); // generate QR for url
    const imageBuffer = base64ToBuffer(qrCodeImage);
    const blob = await put(`maocai/QR/${tableName}-${newTable.id}.png`, imageBuffer, {  // upload to vercel
        access: 'public',
        contentType : "image/png"
    });
    const reNewTable = await prisma.tables.update({ where : { id : newTable.id} , data : { imageUrl : blob.url }})
    return res.json({ newTable : reNewTable })
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
    await prisma.order.deleteMany({ where : { tableId : id }})
    const deletedTable = await prisma.tables.delete({ where : { id } });
    return res.json({ deletedTable });
}

export const GET = async( req : NextRequest ) => {
    const res = NextResponse;
    // no session here ** customer check
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
    const activeOrders = await prisma.order.findMany({ where : { tableId , status : { not : "DONE" } }})
    return res.json({ company , categories , foods , customerTable : isTableExit , activeOrders })
}