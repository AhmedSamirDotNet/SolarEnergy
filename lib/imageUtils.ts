const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i

type ImagePathInput = string | { src?: string } | null | undefined

function normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.trim().replace(/\/+$/, "")
}

function normalizePrefix(prefix: string): string {
    const trimmed = prefix.trim()
    if (!trimmed) return ""

    const cleanPrefix = trimmed.replace(/^\/+|\/+$/g, "")
    return cleanPrefix ? `/${cleanPrefix}` : ""
}

function normalizeRelativePath(path: string): string {
    return path.trim().replace(/\\/g, "/").replace(/^\.?\/+/, "")
}

function ensureImagesPath(path: string): string {
    return path.startsWith("images/") ? path : `images/${path}`
}

/**
 * Builds the correct image/media URL for both development and production.
 *
 * - Keeps absolute/data/blob URLs unchanged
 * - DEV  -> /images/...
 * - PROD -> {NEXT_PUBLIC_IMAGE_BASE_URL}{NEXT_PUBLIC_IMAGE_PATH_PREFIX}/images/...
 */
export function getImageUrl(imagePath: ImagePathInput): string {
    try {
        const resolvedInput = typeof imagePath === "string" ? imagePath : imagePath?.src

        if (!resolvedInput || typeof resolvedInput !== "string") {
            console.warn("[imageUtils] Empty or invalid image path input.")
            return ""
        }

        const trimmedPath = resolvedInput.trim()
        if (!trimmedPath) {
            console.warn("[imageUtils] Empty image path received.")
            return ""
        }

        if (
            ABSOLUTE_URL_PATTERN.test(trimmedPath) ||
            trimmedPath.startsWith("data:") ||
            trimmedPath.startsWith("blob:")
        ) {
            return trimmedPath
        }

        const normalizedRelativePath = normalizeRelativePath(trimmedPath)
        const imagesRelativePath = ensureImagesPath(normalizedRelativePath)
        const devUrl = `/${imagesRelativePath}`

        if (process.env.NODE_ENV === "development") {
            console.log("[imageUtils] Environment:", process.env.NODE_ENV)
            console.log("[imageUtils] Image URL:", devUrl)
            return devUrl
        }

        const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "")
        const prefix = normalizePrefix(process.env.NEXT_PUBLIC_IMAGE_PATH_PREFIX || "/.builds")
        const productionPath = `${prefix}/${imagesRelativePath}`.replace(/\/+/g, "/")
        const finalUrl = baseUrl ? `${baseUrl}${productionPath}` : productionPath

        console.log("[imageUtils] Environment:", process.env.NODE_ENV)
        console.log("[imageUtils] Image URL:", finalUrl)

        return finalUrl
    } catch (error) {
        console.error("[imageUtils] Failed to build image URL:", error)
        return typeof imagePath === "string" ? imagePath : imagePath?.src || ""
    }
}
