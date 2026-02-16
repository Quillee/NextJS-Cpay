"use client"
import { ContactField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  DocumentCurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createPay } from "@/app/lib/actions";
import { useActionState } from 'react';


const FORM_SUBMIT_MESSAGES = {
  'true': 'Pay has been successfully submitted!',
  'false': 'We were unable to send this Pay at this time. Please try again later'
}

export default function Form({ contacts }: { contacts: ContactField[] }) {
  const [state, formAction, isPending] = useActionState(createPay, null)
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {!state ? null : state.success && <div className="flex justify-center text-xl font-bold w-full animate-rainbow bg-[length:200%_auto] bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">{FORM_SUBMIT_MESSAGES[String(state.success)]}</div>}
        {/* Contact Name */}
        <div className="mb-4">
          <label htmlFor="contact" className="mb-2 block text-sm font-medium">
            Choose contact
          </label>
          <div className="relative">
            <select
              id="contact"
              name="contactId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="n/a" disabled>
                Select a contact
              </option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Pay Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <input type="hidden" name="status" value="pending" />

        {/* Pay Direction */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">
            Are you requeting or sending?
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="direction"
                  type="radio"
                  value="request"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Request <ArrowDownTrayIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="pay"
                  name="direction"
                  type="radio"
                  value="send"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pay"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Pay <ArrowUpTrayIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      {/* Memo */}
      <div className="mb-4">
        <label htmlFor="memo" className="mb-2 block text-sm font-medium">
          Add an optional memo
        </label>
        <div className="relative">
          <textarea
            id="memo"
            name="memo"
            placeholder="Memo"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
          <DocumentCurrencyDollarIcon className="pointer-events-none absolute left-3 bottom-1/4 h-[18px] w-[18px] -translate-y-3/4 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/pays"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" aria-disabled={isPending}>Create Pay</Button>
      </div>
    </form>
  );
}
