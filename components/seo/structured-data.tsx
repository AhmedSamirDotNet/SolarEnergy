"use client"

/**
 * Structured Data (JSON-LD) component for SEO
 * Provides rich snippets for search engines in both Arabic and English
 */
export function StructuredData() {
    // Organization Schema
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://afkarsolar.com/#organization",
        "name": "AFKAR Solar",
        "alternateName": "أفكار سولار",
        "url": "https://afkarsolar.com",
        "logo": "https://afkarsolar.com/images/logo.png",
        "description": "Leading solar energy solutions provider in Saudi Arabia. Premium solar panels, energy storage, and professional installation.",
        "sameAs": [
            "https://twitter.com/AFKARSolar",
            "https://facebook.com/AFKARSolar",
            "https://linkedin.com/company/afkar-solar",
            "https://instagram.com/AFKARSolar"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+966-XXX-XXXX-XXX",
            "contactType": "customer service",
            "areaServed": "SA",
            "availableLanguage": ["Arabic", "English"]
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "SA",
            "addressRegion": "Riyadh",
            "addressLocality": "Riyadh"
        }
    }

    // Local Business Schema
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://afkarsolar.com/#localbusiness",
        "name": "AFKAR Solar",
        "image": "https://afkarsolar.com/images/logo.png",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "SA",
            "addressRegion": "Riyadh",
            "addressLocality": "Riyadh"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "24.7136",
            "longitude": "46.6753"
        },
        "url": "https://afkarsolar.com",
        "telephone": "+966-XXX-XXXX-XXX",
        "priceRange": "$$",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
                "opens": "08:00",
                "closes": "17:00"
            }
        ]
    }

    // Product/Service Schema
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": "https://afkarsolar.com/#service",
        "serviceType": "Solar Energy Installation",
        "provider": {
            "@id": "https://afkarsolar.com/#organization"
        },
        "areaServed": {
            "@type": "Country",
            "name": "Saudi Arabia"
        },
        "description": "Professional solar panel installation, energy storage solutions, and renewable energy systems for residential and commercial properties.",
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "SAR"
        }
    }

    // Website Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://afkarsolar.com/#website",
        "url": "https://afkarsolar.com",
        "name": "AFKAR Solar",
        "description": "Premium solar energy solutions in Saudi Arabia",
        "publisher": {
            "@id": "https://afkarsolar.com/#organization"
        },
        "inLanguage": ["ar-SA", "en-US"],
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://afkarsolar.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    }

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://afkarsolar.com"
            }
        ]
    }

    return (
        <>
            {/* Organization Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />

            {/* Local Business Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />

            {/* Service Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />

            {/* Website Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />

            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    )
}
