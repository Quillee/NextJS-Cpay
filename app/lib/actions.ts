'use server'

import { z } from 'zod'
import { fetchContacts } from './data';

const FormSchema = z.object({
    id: z.string(),
    contactId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    created_at: z.string(),
});

const CreatePay = FormSchema.omit({ id: true, created_at: true });
export async function createPay(formData: FormData) {
    const { contactId, amount, status } = CreatePay.parse({
        contactId: formData.get('contactId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0]
    const contact = (await fetchContacts())
      .find((contact) => contact.id === contactId);
    return {
    
    } 
}
