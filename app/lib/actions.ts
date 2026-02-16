'use server'

import { z } from 'zod'
import { fetchContactById, fetchContacts, fetchFilteredPays, fetchPayById } from './data';
import { pays } from './placeholder-data';
import { Pay } from './definitions';
import { writePays } from './db';
import { revalidatePath } from 'next/cache';

const FormSchema = z.object({
  id: z.string(),
  contactId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending']),
  direction: z.enum(['send', 'request']),
  created_at: z.string(),
  memo: z.string(),
});

const CreatePay = FormSchema.omit({ id: true, created_at: true });
type ActionResponse = { success: boolean };
export async function createPay(_: any, formData: FormData): Promise<ActionResponse> {
  const { contactId, amount, memo, direction } = CreatePay.parse({
    contactId: formData.get('contactId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
    direction: formData.get('direction'),
    memo: formData.get('memo'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0]
  const contact = (await fetchContacts())
    .find((contact) => contact.id === contactId);
  // status starts off as pending, but get processed into either paid or error. fail rate of 1%
  const status = (Math.random() * 100) > 1 ? 'paid' : 'refunded';

  pays.push({
    ...contact,
    id: `pay-${String(pays.length + 1).padStart(4, '0')}`,
    memo,
    contact_id: contactId,
    direction,
    amount: amountInCents,
    status,
    created_at: date
  } as Pay)
  writePays(pays)
  // revalidatePath('/dashboard/pays');
  revalidatePath('/dashboard');
  return { success: status === 'paid' };
}

const EditPay = FormSchema.omit({ created_at: true, direction: true })
export async function editPay(_, formData: FormData): Promise<ActionResponse> {
  const { contactId, amount, memo, id } = EditPay.parse({
    contactId: formData.get('contactId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
    memo: formData.get('memo'),
    id: formData.get('id'),
  })

  try {
    const oldPayIndex = pays.findIndex((pay) => pay.id === id)
    const contact = (await fetchContactById(contactId)) ?? undefined;
    pays[oldPayIndex] = {
      ...pays[oldPayIndex],
      ...contact,
      id,
      contact_id: contactId,
      amount,
      memo,
    }
    writePays(pays)
  } catch {
    return { success: false };
  }
  return { success: true };
}

