import { NewOrder } from "@/type/order";
import { prisma } from "@/util/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async( req : NextRequest ) => {
    const res = NextResponse;
    const { tableId , selectedFoods } = await req.json() as NewOrder;
    const isValid = tableId && selectedFoods.length;
    if(!isValid) return res.json({ error : "Bad request" } , { status : 400 });
    const isExit = await prisma.tables.findUnique({ where : { id : tableId }});
    if(!isExit) return res.json({ error : "Bad request" } , { status : 400 });
    const orderSeq = Math.random().toString(36).slice(2,11)
    const newOrders = await prisma.$transaction(
        selectedFoods.map(item => prisma.order.create({ data : { tableId , foodId : item.foodId , quantity : item.quantity , orderSeq }}))
    );
    return res.json({ newOrders });
}