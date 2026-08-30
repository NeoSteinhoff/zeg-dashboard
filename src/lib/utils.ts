import { clsx, type ClassValue, type ClassValueFn } from "clsx"
import { twMerge } from "tailwind-merge"

function isFunction(value: unknown): value is ClassValueFn {
  return typeof value === "function"
}

export function cn(...inputs: ClassValue[]) {
  const resolved = inputs.map((input) => {
    if (isFunction(input)) {
      return undefined // resolve at render time by Base UI
    }
    return input
  })
  return twMerge(clsx(resolved))
}
