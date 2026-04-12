# FlipBook Builder

A web-based tool that converts PDF files into interactive, page-flipping digital books — complete with realistic animations, sound effects, and full customization. Export as a single standalone HTML file with zero dependencies.

![Built with React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)

## What It Does

Upload a PDF, customize the look and feel, then export a fully self-contained HTML flipbook — no server, no dependencies, just one file you can share or host anywhere.

## Features

### Core
- **PDF to Flipbook** — Drag-and-drop PDF upload with real-time processing
- **Realistic Page Flip** — Smooth 3D page-turning animations
- **Two Display Modes** — Full page or spread (half-page) view
- **Bidirectional** — Full RTL and LTR reading support
- **Bilingual UI** — Arabic and English interface
- **Standalone Export** — Single HTML file output with everything embedded

### Visual Customization
- **Binding Styles** — Perfect, Hardcover, Magazine, Spiral, and Japanese Stitch — each with unique animation timing and shadow
- **Colors** — Background, covers, toolbar, and border colors
- **Backgrounds** — Solid, gradient, image upload, or built-in patterns (Wood, Marble, Fabric, Old Paper)
- **Covers** — Custom cover images, logo, editable title with font/size/color control
- **Borders** — Solid, shadow, or double borders with adjustable thickness, radius, and shadow intensity
- **Size Presets** — Auto, Small, Medium, Large, or custom dimensions

### Sound Effects
Six built-in page-flip sounds (procedurally synthesized) plus a realistic audio sample:
Classic Paper, Soft Whoosh, Crisp Snap, Heavy Book, Glossy Magazine, Realistic, or Silent

### Navigation
- Page thumbnails bar
- Table of Contents (auto-generated from PDF outline)
- Go-to-page input
- Zoom controls (50%–200%)
- Fullscreen mode

## Quick Start

```bash
# Install
npm install

# Run
npm run dev

# Build
npm run build
```

Opens at `http://localhost:5173`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| PDF Engine | pdfjs-dist |
| Flip Animation | page-flip + react-pageflip |
| Icons | lucide-react |

## License

Private — All rights reserved.
