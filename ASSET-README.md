# Image Replacement Guide

This document explains where to replace placeholder images with final design assets.

## Image Locations & Replacement Steps

### Hero Image

**Path:** `public/images/placeholders/hero-1.svg`

**Recommended Specifications:**
- **Aspect Ratio:** 16:9 (1600×900px recommended)
- **Format:** WebP or AVIF for best performance
- **Fallback:** PNG or JPG (Next.js will auto-generate these)

**Replacement:**

1. **Optimize your image:**
   ```bash
   # Using ImageMagick (example)
   magick input.jpg -resize 1600x900 -quality 90 hero-1.webp
   ```

2. **Replace the file:**
   - Option A: Replace `public/images/placeholders/hero-1.svg` with `hero-1.webp` and update the import in `src/app/_components/Hero.tsx`
   - Option B: Add to `public/images/hero-real.webp` and update the `src` prop

3. **Update the component:**
   ```tsx
   <Image
     src="/images/hero-real.webp"  // or your new path
     alt="SOYL product visualization"
     fill
     className="object-cover"
     priority
     sizes="(max-width: 768px) 100vw, 50vw"
   />
   ```

### Feature Card Images

**Path:** `public/images/placeholders/feature-1.svg`

**Recommended Specifications:**
- **Aspect Ratio:** 3:2 (600×400px recommended)
- **Format:** WebP or AVIF

**Example replacement code:**
```tsx
import Image from 'next/image';

<Image
  src="/images/features/emotion-sensing.webp"
  alt="Emotion sensing feature"
  width={600}
  height={400}
  className="rounded-lg"
/>
```

### Testimonial Avatars

**Path:** `public/images/placeholders/testimonial-avatar-1.svg`

**Recommended Specifications:**
- **Size:** 160×160px (square, will be cropped to circle)
- **Format:** WebP or PNG (with transparency)
- **Style:** Circular profile photos

**Example replacement:**
```tsx
<Image
  src="/images/testimonials/jane-doe.webp"
  alt="Jane Doe"
  width={160}
  height={160}
  className="rounded-full"
/>
```

### Blog Banner Images

**Recommended Specifications:**
- **Aspect Ratio:** 16:9 (1600×800px)
- **Format:** WebP or AVIF

## Optimization Best Practices

1. **Use Next.js Image component** (already implemented):
   - Automatic format selection (WebP/AVIF when supported)
   - Responsive sizing
   - Lazy loading (except for priority images)

2. **Format Priority:**
   - AVIF (best compression, modern browsers)
   - WebP (widely supported, good compression)
   - PNG (for transparency needs)
   - JPG (fallback)

3. **Compression:**
   ```bash
   # WebP compression
   cwebp -q 80 input.jpg -o output.webp
   
   # AVIF compression
   avifenc --min 30 --max 40 input.jpg output.avif
   ```

4. **Multiple Sizes:**
   - Hero: 1600×900 (desktop), 1200×675 (tablet), 800×450 (mobile)
   - Features: 600×400 (all sizes)
   - Avatars: 160×160 (all sizes)

## File Naming Convention

Use descriptive, kebab-case names:
- ✅ `hero-product-visualization.webp`
- ✅ `feature-emotion-sensing.webp`
- ✅ `testimonial-jane-doe.webp`
- ❌ `image1.jpg`
- ❌ `IMG_1234.PNG`

## After Replacing Images

1. Test all breakpoints (mobile, tablet, desktop)
2. Verify image loading and fallbacks work
3. Check Lighthouse performance score
4. Ensure alt text is descriptive and accessible

## Troubleshooting

**Image not loading?**
- Check file path matches exactly (case-sensitive on some systems)
- Verify file is in `public/` directory (accessible at `/images/...`)
- Check Next.js console for 404 errors

**Slow loading?**
- Reduce image dimensions if too large
- Use WebP/AVIF format
- Enable `priority` prop for above-the-fold images only

---

**Questions?** See `src/content/README.md` for content editing guidelines.

