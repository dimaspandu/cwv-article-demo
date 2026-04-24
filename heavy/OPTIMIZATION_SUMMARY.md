# Heavy Version: Baseline Performance Report

## Overview
This document establishes the baseline performance metrics for the "heavy" version of the CWV Article Demo project. This version represents the unoptimized starting point with poor Core Web Vitals scores, serving as a reference for measuring optimization improvements across subsequent versions.

## Performance Metrics

### Mobile Performance (Score: 71)
- **First Contentful Paint**: 2.5 s
- **Largest Contentful Paint**: 11.0 s
- **Total Blocking Time**: 0 ms
- **Cumulative Layout Shift**: 0.005
- **Speed Index**: 2.5 s

### Desktop Performance (Score: 74)
- **First Contentful Paint**: 0.5 s
- **Largest Contentful Paint**: 1.9 s
- **Total Blocking Time**: 0 ms
- **Cumulative Layout Shift**: 0.386
- **Speed Index**: 0.6 s

## Identified Issues

### Core Web Vitals Problems
1. **Largest Contentful Paint (LCP)**:
   - Mobile: 11.0s (severely poor - should be <2.5s)
   - Desktop: 1.9s (poor - should be <2.5s)

2. **Cumulative Layout Shift (CLS)**:
   - Mobile: 0.005 (good - <0.1)
   - Desktop: 0.386 (poor - should be <0.1)

3. **First Contentful Paint (FCP)**:
   - Mobile: 2.5s (needs improvement - should be <1.8s)
   - Desktop: 0.5s (good - <1.8s)

### Technical Issues
- **Large Images**: Hero image at 1600px width, content images at 1600px
- **Synchronous Loading**: All content (sidebar, related posts) loaded at once
- **No Lazy Loading**: Images and content sections not optimized for viewport
- **No Compression**: Server responses not compressed
- **No Resource Hints**: Missing preconnect, dns-prefetch, preload directives

## Root Cause Analysis

### Image Optimization Problems
- High-resolution images (1600px) served to all devices
- No responsive image sizing
- No lazy loading for below-the-fold images
- Missing loading="lazy" attributes

### Content Loading Issues
- Sidebar widgets (popular posts, latest posts, ads) loaded synchronously
- Related posts section rendered immediately
- No JSON-based lazy loading for dynamic content
- Layout shifts from unloaded content

### Network Performance
- No gzip/brotli compression
- No resource preloading
- No DNS prefetching for external domains
- Large payload sizes

## Performance Score Breakdown

### Mobile (71%)
- **FCP**: Needs Work (2.5s > 1.8s)
- **LCP**: Poor (11.0s > 2.5s)
- **CLS**: Good (0.005 < 0.1)
- **TBT**: Good (0ms < 0.1s)

### Desktop (74%)
- **FCP**: Good (0.5s < 1.8s)
- **LCP**: Poor (1.9s > 2.5s, but close)
- **CLS**: Poor (0.386 > 0.1)
- **TBT**: Good (0ms < 0.1s)

## Benchmark for Future Optimizations
This heavy version establishes the starting point for the optimization journey:

1. **Phase 1 (Optimized)**: Desktop-focused improvements targeting LCP and CLS
2. **Phase 2 (Mobile-Optimized)**: Mobile-specific enhancements for cross-device performance
3. **Phase 3 (Server-Optimized)**: Server-side compression, minification, and streaming

The significant performance gaps (especially mobile LCP at 11.0s) demonstrate the need for comprehensive optimization strategies combining client-side improvements with server-side enhancements.

## File Structure
- `main.go`: Basic Go server serving static files
- `static/index.html`: Main HTML with unoptimized content
- `static/style.css`: Stylesheet
- `static/script.js`: JavaScript for comments functionality
- Various image assets and JSON files

This baseline report serves as historical documentation and a reference point for measuring the impact of subsequent optimizations.