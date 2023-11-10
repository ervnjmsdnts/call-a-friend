import { JobBudgetRange } from '@prisma/client';
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

export function getBudgetRange(range: JobBudgetRange) {
  return range === 'LOWBUDGET'
    ? `${toPhp(1000)} - ${toPhp(10000)}`
    : range === 'MIDBUDGET'
    ? `${toPhp(10001)} - ${toPhp(50000)}`
    : `${toPhp(50001)} - ${toPhp(100000)}`;
}
