import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if(!filename || !request.body) return NextResponse.json({ error : "Bad request from Upload" } , { status : 400 });

  const uniString = Math.random().toString(36).slice(2,11)
  
  const blob = await put(`maocai/modification/${uniString}-${filename}`, request.body , {
    access: 'public',
  });


  return NextResponse.json(blob);
}

