# Mahoba Insight — WordPress Theme

A clean, fast, Reuters-inspired one-page news theme.

## Install

1. Zip the `mahoba-insight` folder (the folder itself, not its contents).
2. In WordPress admin: **Appearance → Themes → Add New → Upload Theme**, upload the zip, and Activate.

## Configure

- **Appearance → Customize → Site Identity** — set site title, tagline, and logo.
- **Appearance → Customize → Mahoba Insight Options**:
  - Breaking Ticker Text
  - Footer Copyright
  - Social URLs — Facebook, Twitter/X, Instagram, YouTube, WhatsApp
- **Appearance → Menus** — create a **Primary Menu** (header) and **Footer Menu**.
- **Settings → Reading** — set homepage to *Your latest posts*.

## Files

- `style.css` — theme header + all styles
- `functions.php` — setup, enqueues, menus, widgets, Customizer
- `header.php` / `footer.php` — shared shell with sticky header + ticker + footer
- `front-page.php` — one-page layout: chips → hero → latest grid
- `index.php` — fallback for archives / search
- `assets/js/main.js` — mobile menu + ticker hover

## Requirements

WordPress 6.0+, PHP 7.4+.