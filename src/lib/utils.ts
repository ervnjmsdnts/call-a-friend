import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPhp(value: string | number) {
  const price = parseFloat(value.toString());

  const formatted = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(price);

  return formatted;
}

export function toTitleCase(string: string | null) {
  if (!string) return;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
