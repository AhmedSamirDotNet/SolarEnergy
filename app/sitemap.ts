import { MetadataRoute } from 'next'

/**
 * Dynamic sitemap generation for AFKAR Solar website
 * This file is automatically processed by Next.js to create sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://afkarsolar.com'
    const currentDate = new Date()

    return [
        // Home Page
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1.0,
            alternates: {
                languages: {
                    ar: `${baseUrl}/ar`,
                    en: `${baseUrl}/en`,
                },
            },
        },

        // Products Page
        {
            url: `${baseUrl}/products`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.9,
            alternates: {
                languages: {
                    ar: `${baseUrl}/ar/products`,
                    en: `${baseUrl}/en/products`,
                },
            },
        },

        // Contact Page
        {
            url: `${baseUrl}/contact`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
            alternates: {
                languages: {
                    ar: `${baseUrl}/ar/contact`,
                    en: `${baseUrl}/en/contact`,
                },
            },
        },

        // About Page (if exists)
        {
            url: `${baseUrl}/about`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
            alternates: {
                languages: {
                    ar: `${baseUrl}/ar/about`,
                    en: `${baseUrl}/en/about`,
                },
            },
        },

        // Services Page (if exists)
        {
            url: `${baseUrl}/services`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
            alternates: {
                languages: {
                    ar: `${baseUrl}/ar/services`,
                    en: `${baseUrl}/en/services`,
                },
            },
        },
    ]
}
