# Image Guide for SOYL Website

## Where to Add Images

All images should be placed in the `public/` directory. This directory is served at the root of your website, making images directly accessible.

### Recommended Folder Structure

```
public/
  ├── images/
  │   ├── hero-1.svg              # Hero section images
  │   ├── hero-2.svg
  │   ├── products/               # Product images
  │   │   └── product-1.jpg
  │   ├── team/                   # Team photos
  │   │   └── member-1.jpg
  │   ├── placeholders/           # Placeholder images
  │   │   └── feature-1.svg
  │   └── testimonials/           # Testimonial images
  │       └── avatar-1.jpg
  ├── og/                         # Open Graph images
  │   └── soyl-og.svg
  └── patterns/                   # Background patterns
      └── dot-grid.svg
```

## How to Use Images in Your Code

### Method 1: Next.js Image Component (Recommended)

The Next.js `Image` component automatically optimizes images for performance:

```tsx
import Image from 'next/image'

// Fixed size image
<Image
  src="/images/my-image.jpg"
  alt="Description of the image"
  width={800}
  height={600}
/>

// Responsive image with fill
<div className="relative w-full h-64">
  <Image
    src="/images/my-image.jpg"
    alt="Description"
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>

// Priority loading (for above-the-fold images)
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={800}
  priority
/>
```

### Method 2: Regular img Tag (For SVGs or Simple Images)

For simple cases or SVGs that don't need optimization:

```tsx
<img src="/images/logo.svg" alt="Logo" />
```

### Method 3: CSS Background Images

You can reference images in CSS:

```css
.hero-background {
  background-image: url('/images/hero-bg.jpg');
}
```

## Example: Adding a New Image

### Step 1: Add the image file
1. Place your image in `public/images/` (or a subfolder)
   - Example: `public/images/products/product-demo.jpg`

### Step 2: Use it in a component

```tsx
'use client'

import Image from 'next/image'

export function ProductDemo() {
  return (
    <div className="relative w-full h-96">
      <Image
        src="/images/products/product-demo.jpg"
        alt="Product demonstration"
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 800px"
      />
    </div>
  )
}
```

## Image Path Rules

- ✅ **Correct**: `/images/my-image.jpg` (starts with `/`)
- ❌ **Wrong**: `/public/images/my-image.jpg` (don't include `/public`)
- ❌ **Wrong**: `./images/my-image.jpg` (relative paths don't work)

## Image Formats Supported

- **SVG**: Best for logos, icons, illustrations
- **JPG/JPEG**: Best for photos
- **PNG**: Best for images with transparency
- **WebP**: Modern format, automatically optimized by Next.js

## Best Practices

1. **Use Next.js Image component** for automatic optimization
2. **Always provide alt text** for accessibility
3. **Use appropriate sizes** - specify width/height or use `fill` with `sizes`
4. **Optimize images** before uploading (compress large files)
5. **Use priority** for above-the-fold images
6. **Organize by purpose** - use subfolders for different image types

## Current Image Usage Examples

### Hero Section Image
See: `src/app/_components/Hero.tsx`
```tsx
<Image
  src="/images/placeholders/hero-1.svg"
  alt="SOYL product visualization"
  fill
  priority
/>
```

### Open Graph Image
See: `src/app/layout.tsx`
```tsx
images: [{
  url: '/og/soyl-og.svg',
  width: 1200,
  height: 630,
}]
```

## Need Help?

If you're unsure where to place an image:
- **Hero/Banner images**: `public/images/`
- **Product images**: `public/images/products/`
- **Team photos**: `public/images/team/`
- **Social media images**: `public/og/`
- **Icons/Patterns**: `public/patterns/`

