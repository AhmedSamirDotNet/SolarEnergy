import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (path?: string | null) => {
  if (!path) return '/placeholder.png'
  if (path.startsWith('data:')) {
    return path
  }

  const base = (process.env.NEXT_PUBLIC_API_URL || '/api-backend').replace(/\/$/, '')
  let cleanedPath = path.trim().replace(/\\/g, '/')

  // If backend sends absolute URL, strip domain and keep only storage/path part
  if (/^https?:\/\//i.test(cleanedPath)) {
    try {
      const parsed = new URL(cleanedPath)
      const pathname = parsed.pathname || ''
      const storageIndex = pathname.indexOf('/storage/')
      cleanedPath = storageIndex >= 0 ? pathname.slice(storageIndex) : pathname
    } catch {
      // keep original cleanedPath fallback
    }
  }

  cleanedPath = cleanedPath.replace(/^\/+/, '')

  // Ensure path is under storage for Laravel public disk images
  if (!cleanedPath.startsWith('storage/')) {
    cleanedPath = `storage/${cleanedPath}`
  }

  return `${base}/${cleanedPath}`
};
