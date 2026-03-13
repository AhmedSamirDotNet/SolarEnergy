import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BACKEND_URL } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (path?: string | null) => {
  if (!path) return "/placeholder.svg";

  // Return path as-is if it's already a full URL or data URI
  if (path.startsWith("http") || path.startsWith("data:")) return path;

  // Clean path to ensure no double slashes and fix backslashes
  let cleanPath = path.replace(/\\/g, "/"); // Replace backslashes with forward slashes
  cleanPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  // Log for debugging (optional, can be removed in prod)
  // console.log("Processing image path:", { original: path, cleaned: cleanPath });

  // Use BACKEND_URL for relative paths
  return `${BACKEND_URL}${cleanPath}`;
};
