import { NextRequest, NextResponse } from 'next/server';
import { pays } from '@/app/lib/placeholder-data';
import { writePays } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing pay id' }, { status: 400 });
  }

  const index = pays.findIndex((pay) => pay.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Pay not found' }, { status: 404 });
  }

  pays.splice(index, 1);
  writePays(pays);
  revalidatePath('/dashboard');

  return NextResponse.json({ success: true });
}
