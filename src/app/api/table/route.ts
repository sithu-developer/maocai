import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { NewTable } from "@/type/table";
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