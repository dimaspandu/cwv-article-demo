# Core Web Vitals Article Demo

A progressive web performance optimization demonstration project showing the evolution from a poorly performing "heavy" version to a fully optimized server-side enhanced version achieving 100% Core Web Vitals scores.

## Project Structure

```
cwv-article-demo/
├── heavy/                    # Baseline unoptimized version
│   ├── main.go              # Basic Go server
│   ├── static/              # Static assets
│   └── OPTIMIZATION_SUMMARY.md # Baseline report (renamed)
├── optimized/                # Desktop-optimized version
│   ├── main.go
│   ├── static/
│   └── OPTIMIZATION_SUMMARY.md
├── mobile-optimized/         # Mobile-optimized version
│   ├── main.go
│   ├── static/
│   └── OPTIMIZATION_SUMMARY.md
├── server-optimized/         # Server-optimized version
│   ├── main.go              # Enhanced Go server with compression/minification
│   ├── static/
│   └── OPTIMIZATION_SUMMARY.md
├── FINAL_OPTIMIZATION_REPORT.md # Complete journey summary
└── README.md                 # This file
```

## Versions Overview

### Heavy (Baseline)
- **Mobile Score**: 71%
- **Desktop Score**: 74%
- **Key Issues**: Large images (1600px), synchronous loading, poor LCP/CLS
- **Purpose**: Starting point for optimization journey

### Optimized
- **Mobile Score**: 76%
- **Desktop Score**: 97%
- **Improvements**: Lazy loading, image optimization, resource hints
- **Focus**: Desktop performance optimization

### Mobile-Optimized
- **Mobile Score**: 100%
- **Desktop Score**: 100%
- **Improvements**: Mobile-specific image sizes, adaptive lazy loading
- **Focus**: Cross-device optimization

### Server-Optimized
- **Mobile Score**: 100%
- **Desktop Score**: 100%
- **Improvements**: Gzip compression, minification, HTML streaming
- **Focus**: Server-side performance enhancements

## Running Each Version

### Prerequisites
- Go 1.19+ installed
- Web browser for testing

### Testing Commands

#### Heavy Version
```bash
cd heavy
go run main.go
# Server runs on http://localhost:5175
```

#### Optimized Version
```bash
cd optimized
go run main.go
# Server runs on http://localhost:5175
```

#### Mobile-Optimized Version
```bash
cd mobile-optimized
go run main.go
# Server runs on http://localhost:5175
```

#### Server-Optimized Version
```bash
cd server-optimized
go run main.go
# Server runs on http://localhost:5175
# Includes gzip compression and minification
```

## Performance Testing

### Using Lighthouse
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run performance audit
4. Test both mobile and desktop configurations

### Core Web Vitals Metrics to Monitor
- **First Contentful Paint (FCP)**: <1.8s (good), < 3.0s (needs improvement)
- **Largest Contentful Paint (LCP)**: <2.5s (good), <4.0s (needs improvement)
- **Cumulative Layout Shift (CLS)**: <0.1 (good), <0.25 (needs improvement)
- **Total Blocking Time (TBT)**: <200ms (good), <600ms (needs improvement)
- **Speed Index (SI)**: < 3.4s (good), <5.8s (needs improvement)

### Testing Checklist
- [ ] Test on desktop (1920x1080)
- [ ] Test on mobile (375x667, simulated)
- [ ] Verify lazy loading behavior
- [ ] Check network tab for compression
- [ ] Monitor Core Web Vitals in Lighthouse

## Key Optimizations Applied

### Client-Side Optimizations
- **Image Optimization**: Responsive sizing, lazy loading
- **Content Lazy Loading**: Intersection Observer for below-fold content
- **Resource Hints**: Preload, preconnect, dns-prefetch
- **Font Optimization**: Display swap, preconnect

### Server-Side Optimizations
- **Compression**: Gzip middleware for all responses
- **Minification**: CSS/JS whitespace removal
- **HTML Streaming**: Early head delivery for faster FCP

### Mobile-Specific Optimizations
- **Adaptive Thresholds**: Smaller lazy loading margins on mobile
- **Image Sizing**: Smaller dimensions for mobile devices
- **Touch-Friendly**: Maintained responsive design

## Development Notes

### File Naming Convention
- Each version folder contains `OPTIMIZATION_SUMMARY.md` (except heavy uses `BASELINE_REPORT.md`)
- Root contains `FINAL_OPTIMIZATION_REPORT.md` for complete overview
- Static assets are version-specific

### Go Server Features
- Basic file serving (heavy, optimized, mobile-optimized)
- Enhanced with compression and minification (server-optimized)
- HTML streaming for improved perceived performance

### Browser Compatibility
- Modern browsers with Intersection Observer support
- Fallbacks for older browsers
- Progressive enhancement approach

## Contributing

This project demonstrates progressive web performance optimization techniques. Each version builds upon the previous, showing incremental improvements and the impact of different optimization strategies.

## License

This project is for educational purposes demonstrating web performance optimization techniques.