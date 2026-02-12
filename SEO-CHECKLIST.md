# AFKAR Solar - SEO Implementation Checklist

## ✅ Completed Items

### 1. Video Optimization for Cross-Browser Compatibility
- ✅ Added multiple video source formats (WebM + MP4)
- ✅ Added `preload="auto"` attribute for faster loading
- ✅ Added `poster` attribute for thumbnail preview
- ✅ Added `aria-label` for accessibility (Arabic & English)
- ✅ Added fallback text for unsupported browsers
- ✅ Added `itemProp="video"` for schema markup

### 2. Comprehensive SEO Metadata
- ✅ Enhanced title with Arabic & English
- ✅ Extended description with bilingual content
- ✅ Added 60+ targeted keywords (Arabic & English)
- ✅ Location-based keywords (Riyadh, Jeddah, Dammam, etc.)
- ✅ Service keywords (installation, maintenance, storage)
- ✅ Industry keywords (solar panels, renewable energy)

### 3. Social Media Optimization
- ✅ Open Graph tags for Facebook/LinkedIn sharing
- ✅ Twitter Card metadata
- ✅ Social media images (og-image, twitter-card)
- ✅ Bilingual social descriptions

### 4. Technical SEO
- ✅ Structured Data (JSON-LD) schemas
  - Organization schema
  - Local Business schema
  - Service schema
  - Website schema
  - Breadcrumb schema
- ✅ Robots.txt configuration
- ✅ Language alternates (ar-SA, en-US)
- ✅ Canonical URLs
- ✅ Geographic targeting (Saudi Arabia)
- ✅ Google Search Console verification ready

### 5. Search Engine Directives
- ✅ Robot indexing rules
- ✅ Max video preview settings
- ✅ Max image preview settings
- ✅ Max snippet settings

---

## 📋 Next Steps to Complete

### 1. Image Assets (Required)
Create and add these images to `/public/images/`:

- **Hero Poster**: `hero-poster.jpg` (1920x1080)
  - Screenshot or first frame of your background video
  - Used as fallback while video loads
  
- **Open Graph Image**: `og-image.jpg` (1200x630)
  - For Facebook, LinkedIn, WhatsApp previews
  - Should include logo + company name
  
- **Twitter Card Image**: `twitter-card.jpg` (1200x675)
  - Similar to OG image but optimized for Twitter
  
- **Favicon**: Already have `logo.png` ✅

### 2. Video Format Conversion
Convert your video to WebM format for better browser support:

```bash
# Using FFmpeg (if installed)
ffmpeg -i Home-Background-first-section.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 Home-Background-first-section.webm
```

**Or use online converter:**
- cloudconvert.com
- convertio.co
- freeconvert.com

Place the `.webm` file in `/public/images/`

### 3. Search Console Verification

**Google Search Console:**
1. Go to https://search.google.com/search-console
2. Add your property (https://afkarsolar.com)
3. Get your verification code
4. Replace `'your-google-verification-code'` in `app/layout.tsx` line 131

**Bing Webmaster Tools:**
1. Go to https://www.bing.com/webmasters
2. Add your site
3. Get verification code
4. Add to `app/layout.tsx`

### 4. Create Sitemap
Generate an XML sitemap for better crawling:

**Option A: Manual Creation**
Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://afkarsolar.com/</loc>
    <lastmod>2026-02-13</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://afkarsolar.com/products</loc>
    <lastmod>2026-02-13</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://afkarsolar.com/contact</loc>
    <lastmod>2026-02-13</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Option B: Next.js Dynamic Sitemap**
Create `app/sitemap.ts` for automatic generation.

### 5. Social Media Accounts
Update social media links in `components/seo/structured-data.tsx`:
- Twitter/X handle
- Facebook page
- LinkedIn company page
- Instagram handle
- Phone number

### 6. Analytics Setup
- ✅ Vercel Analytics already installed
- Consider adding Google Analytics 4
- Consider adding Microsoft Clarity

### 7. Performance Optimization
- Compress video files (target < 5MB)
- Lazy load images
- Enable Next.js Image Optimization
- Use CDN for static assets

### 8. Testing
Test your SEO implementation:

**Tools:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Schema Markup Validator: https://validator.schema.org/

**Checklist:**
- [ ] Test video playback on Chrome, Firefox, Safari, Edge
- [ ] Test social media preview (Facebook, Twitter, WhatsApp)
- [ ] Validate all structured data
- [ ] Check mobile responsiveness
- [ ] Test page load speed
- [ ] Verify all images load properly

---

## 📊 Expected SEO Improvements

### Search Visibility
- **Arabic searches**: Improved ranking for "طاقة شمسية السعودية", "ألواح شمسية", etc.
- **English searches**: Better visibility for "solar panels Saudi Arabia", "solar energy KSA"
- **Local searches**: Enhanced for city-specific queries (Riyadh, Jeddah, Dammam)

### Rich Results
- Company information card in search results
- Business hours and contact info
- Star ratings (once you collect reviews)
- Location map integration

### Social Sharing
- Professional preview cards when shared on social media
- Consistent branding across platforms
- Bilingual support for diverse audience

---

## 🎯 Key Performance Indicators (KPIs)

Monitor these metrics after implementation:

1. **Organic Traffic**: Increase in visitors from search engines
2. **Keyword Rankings**: Track positions for target keywords
3. **Click-Through Rate (CTR)**: % of people clicking your result
4. **Bounce Rate**: Should decrease with better targeting
5. **Page Load Time**: Monitor video impact on performance
6. **Social Shares**: Track engagement from social platforms

---

## 📚 Additional Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Arabic SEO Best Practices](https://moz.com/learn/seo/international-seo)

---

**Last Updated**: February 13, 2026
**Version**: 1.0.0
