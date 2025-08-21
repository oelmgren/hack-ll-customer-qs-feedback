# Assets Directory

This directory contains static assets for the application.

## Structure

```
public/
├── favicon.ico              # Main favicon file
├── assets/
│   ├── images/              # Image assets (logos, banners, etc.)
│   │   └── logo.png         # Brand logo
│   ├── icons/               # Icon assets
│   │   └── favicon.png      # PNG favicon alternative
│   └── README.md           # This file
```

## Usage

### Favicon
- **favicon.ico**: Traditional favicon file (32x32 pixels)
- **assets/icons/favicon.png**: PNG favicon alternative

### Brand Logo
- **assets/images/logo.png**: Main brand logo in PNG format

## How to Use in Next.js

### In HTML/JSX
```jsx
// Favicon
<link rel="icon" href="/favicon.ico" />
<link rel="icon" href="/assets/icons/favicon.png" type="image/png" />

// Logo
<img src="/assets/images/logo.png" alt="Brand Logo" />
```

### In CSS
```css
.logo {
  background-image: url('/assets/images/logo.png');
}
```

## File Formats

- **PNG**: Recommended for logos and icons (good quality, widely supported)
- **ICO**: Traditional favicon format (better browser support)
- **SVG**: Scalable vector format (small file size, but requires vector graphics)
- **JPG**: Use for complex images or photos

## Replacement Instructions

1. Replace `favicon.ico` with your actual favicon file
2. Replace `assets/images/logo.png` with your brand logo
3. Update `assets/icons/favicon.png` if you want a custom PNG favicon
4. Update this README with your specific asset information 