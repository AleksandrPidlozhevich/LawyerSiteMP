import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPhoneNumber = (value: string) => {
    let digits = value.replace(/\D/g, '');

    if (digits.startsWith('375')) {
        digits = digits.substring(3);
    }

    digits = digits.substring(0, 9);

    if (digits.length === 0) return '';
    if (digits.length <= 2) return `+375 (${digits}`;
    if (digits.length <= 5) return `+375 (${digits.substring(0, 2)}) ${digits.substring(2)}`;
    if (digits.length <= 7) return `+375 (${digits.substring(0, 2)}) ${digits.substring(2, 5)}-${digits.substring(5)}`;
    return `+375 (${digits.substring(0, 2)}) ${digits.substring(2, 5)}-${digits.substring(5, 7)}-${digits.substring(7)}`;
};

export const getCleanPhoneNumber = (formattedPhone: string) => {
    const digits = formattedPhone.replace(/\D/g, '');

    if (digits.startsWith('375') && digits.length === 12) {
        return `+${digits}`;
    }

    if (digits.length === 9) {
        return `+375${digits}`;
    }
    return formattedPhone;
};
