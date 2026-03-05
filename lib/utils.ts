import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PUBLIC_IMAGE_BASE_URL } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function extractImageFileName(path: string): string {
  let cleanedPath = path.trim().replace(/\\/g, '/')

  if (/^https?:\/\//i.test(cleanedPath)) {
    try {
      const parsed = new URL(cleanedPath)
      cleanedPath = parsed.pathname || cleanedPath
    } catch {
      // keep original value
    }
  }

  cleanedPath = cleanedPath.split('?')[0].split('#')[0]

  const marker = '/storage/images/'
  const markerIndex = cleanedPath.indexOf(marker)
  if (markerIndex >= 0) {
    const afterMarker = cleanedPath.slice(markerIndex + marker.length)
    return afterMarker.replace(/^\/+/, '')
  }

  return cleanedPath.split('/').filter(Boolean).pop() || ''
}

export const getImageUrl = (path?: string | null) => {
  if (!path) return '/placeholder.png'
  if (path.startsWith('data:')) {
    return path
  }

  const fileName = extractImageFileName(path)
  if (!fileName) return '/placeholder.png'

  const base = PUBLIC_IMAGE_BASE_URL.replace(/\/$/, '')
  return `${base}/${fileName}`
};
