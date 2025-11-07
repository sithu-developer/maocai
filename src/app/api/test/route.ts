import { NextRequest, NextResponse } from "next/server";

export const POST = async(req : NextRequest) => {
    const body = await req.json();
    console.log("Here" , body)
    // return Response.json({ isDone : "Done" } , { status : 200 });
    return NextResponse.json({ isDone : true });
}


export const PUT = async( req : NextRequest ) => {
    const body = await req.json();
    const name = req.nextUrl.searchParams.get("item"); 
    console.log("PUT" , body , name);
    return NextResponse.json({ "From PUT" : "OK Lar"});
}