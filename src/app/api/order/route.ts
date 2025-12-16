import { NewOrder, UpdatedOrder } from "@/type/order";
import { prisma } from "@/util/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async( req : NextRequest ) => {
    const res = NextResponse;
    const { tableId , selectedFoods , spicyLevel } = await req.json() as NewOrder;
    const isValid = tableId && selectedFoods.length && spicyLevel !== undefined;
    if(!isValid) return res.json({ error : "Bad request" } , { status : 400 });
    const isExit = await prisma.tables.findUnique({ where : { id : tableId }});
    if(!isExit) return res.json({ error : "Bad request" } , { status : 400 });
    const orderSeq = Math.random().toString(36).slice(2,11)
    const newOrders = await prisma.$transaction(
        selectedFoods.map(item => prisma.order.create({ data : { tableId , foodId : item.foodId , quantity : item.quantity , orderSeq , spicyLevel }}))
    );
    return res.json({ newOrders });
}

// status change from admin
export const PUT = async( req : NextRequest ) => {
    const res = NextResponse;
    const { orderSeq , status } = await req.json() as UpdatedOrder;
    const isValid = orderSeq && status;
    if(!isValid) return res.json({ error : "Bad request" } , { status : 400 });
    await prisma.order.updateMany({ where : { orderSeq } , data : { status }});
    const updatedOrders = await prisma.order.findMany({ where : { orderSeq } , orderBy : { id : "asc" }});
    return res.json({ updatedOrders })
}


export const GET = async( req : NextRequest ) => {
    const res = NextResponse;
    const url = new URL(req.url);
    const tableId = url.searchParams.get("tableId");
    const companyId = url.searchParams.get("companyId");
    if(tableId) { // customer orders status check
        const activeOrders = await prisma.order.findMany({ where : { tableId , status : { not : "DONE" } }})
        return res.json({ activeOrders })
    }
    if(companyId) { // admin orders check
        const tables = await prisma.tables.findMany({ where : { companyId } , orderBy : { id : "asc" }});
        const tableIds = tables.map(item => item.id);
        const orders = await prisma.order.findMany({ where : { tableId : { in : tableIds } } , orderBy : { id : "asc" } });
        return res.json({ activeOrders : orders })
    }    
}