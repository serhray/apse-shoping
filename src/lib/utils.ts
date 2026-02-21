import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = '₹') {
  return `${currency}${amount.toLocaleString('en-IN')}`
}

export function calcDiscount(original: number, current: number) {
  return Math.round(((original - current) / original) * 100)
}

export function truncate(str: string, max: number) {
  return str.length <= max ? str : str.slice(0, max) + '…'
}
