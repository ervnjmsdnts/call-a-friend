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

export const jobCategories = [
  'CATERING',
  'CONSTRUCTION',
  'DEMOLITION',
  'MASON',
  'LABOR',
  'HELPER',
  'WELDER',
  'ELECTRICIAN',
  'PLUMBING',
  'MOTOR_MECHANIC',
  'CAR_MECHANIC',
  'HOUSE_CLEANING',
  'SLIDING_GLASS_MAKER',
  'ROOF_SERVICE',
  'PAINT_SERVICE',
  'COMPUTER_TECHNICIAN',
] as const;

export function calculateWage(category: (typeof jobCategories)[number]) {
  switch (category) {
    case 'CATERING':
      return 650;
    case 'CONSTRUCTION':
      return 750;
    case 'DEMOLITION':
      return 650;
    case 'MASON':
      return 900;
    case 'LABOR':
      return 500;
    case 'HELPER':
      return 500;
    case 'WELDER':
      return 700;
    case 'ELECTRICIAN':
      return 1000;
    case 'PLUMBING':
      return 700;
    case 'MOTOR_MECHANIC':
      return 500;
    case 'CAR_MECHANIC':
      return 700;
    case 'HOUSE_CLEANING':
      return 500;
    case 'SLIDING_GLASS_MAKER':
      return 1200;
    case 'ROOF_SERVICE':
      return 800;
    case 'PAINT_SERVICE':
      return 700;
    case 'COMPUTER_TECHNICIAN':
      return 800;
    default:
      return 100;
  }
}
