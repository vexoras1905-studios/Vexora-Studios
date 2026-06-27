# VEXORA Studios - Premium Web Design Agency

A high-performance, ultra-responsive, accessible, and visual-first digital web agency landing page styled with an interactive dark/light theme toggle, glassmorphic layout modules, scroll-reveal features, and positive-form triggers.

## Tech Stack
* **HTML5** (Semantic tags, high accessibility contrast, SEO Open Graph structure)
* **Tailwind CSS v4** (Utility layers and responsive scales)
* **Vanilla JavaScript** (Lite loader screens, interactive FAQ accordions, IntersectionObservers)
* **Web3Forms API** (Active contact form relay)

---

## 🚀 Key Files Inside This Bundle

### 1. `index.html`
The central entry point of the VEXORA Studios layout. Integrates SEO meta keywords, responsive viewport scaling, and lazy placeholders.

### 2. `style.css`
A customized style manifest compiling Tailwind utility modules and detailing root parameters, glass panels, scroll bars, and CSS animation routines.

### 3. `script.js`
Handles:
* Loader screen transitions.
* Dark/Light luxury theme toggle using local persistence storing.
* Section reveal triggers on active viewport intersection.
* Smooth scrolling link transitions.
* Collapsible FAQ accordions.

---

## 🤖 `robots.txt` Content

```txt
# robots.txt for VEXORA Studios
User-agent: *
Allow: /

# Sitemap URL
Sitemap: https://official.vexorastudios/sitemap.xml
```

---

## 🌐 `sitemap.xml` Content

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://official.vexorastudios/</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## ⚠️ `404.html` Page Code

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Not Found | VEXORA Studios</title>
    <link rel="stylesheet" href="/style.css" />
    <style>
      body {
        background: #020617;
        color: #f8fafc;
        font-family: system-ui, sans-serif;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
      }
      .glass-card {
        background: rgba(15, 23, 42, 0.4);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 24px;
        padding: 48px;
        text-align: center;
        max-width: 480px;
        box-shadow: 0 8px 32px 0 rgba(0,0,0,0.5);
      }
    </style>
  </head>
  <body>
    <div class="glass-card">
      <div style="font-size: 72px; font-weight: bold; color: #3b82f6; margin-bottom: 16px;">404</div>
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 12px;">Visual Disconnected</h1>
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        The layout or section you are seeking does not exist or has been shifted to a distinct directory segment.
      </p>
      <a href="/index.html" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; transition: background 0.3s;">
        Return To Safety
      </a>
    </div>
  </body>
</html>
```
