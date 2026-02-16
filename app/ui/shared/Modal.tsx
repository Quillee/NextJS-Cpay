"use client"

import { XMarkIcon } from "@heroicons/react/24/outline";
import { MouseEventHandler } from "react";
import { Button } from "../button";

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (f: boolean) => void;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  message: string;
  acceptText: string;
}

export default function Modal({ isOpen, setIsOpen, handleClick, acceptText, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setIsOpen(false)}>
      <div className="fixed inset-0 bg-black/30" />
      <div
        className="relative z-10 w-80 rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          onClick={() => setIsOpen(false)}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        <p className="mt-2 mb-6 text-sm text-gray-700">{message}</p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            className="bg-gray-100 px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-red-500 px-3 py-2 text-sm text-white rounded-md hover:bg-red-400"
            onClick={handleClick}
          >
            {acceptText}
          </Button>
        </div>
      </div>
    </div>
  );
}
