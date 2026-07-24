# Toomas Taro — personal portfolio

A lightweight, multilingual portfolio for Toomas Taro, Project & Delivery Manager. The site is built with semantic HTML, modern CSS and vanilla JavaScript and is designed to run directly on GitHub Pages.

## Features

- English, Estonian and Russian content without page reloads
- Browser-language detection and saved language preference
- Responsive layouts for mobile, tablet and desktop
- Accessible navigation, focus states, expandable experience and reduced-motion support
- SEO metadata, Open Graph tags, JSON-LD, sitemap, robots file and custom 404 page
- No framework, build step, package manager or external runtime dependency

## Project structure

```text
.
├── index.html                  Main page and metadata
├── styles.css                 Layout, visual system and responsive styles
├── script.js                  Language, navigation and interaction logic
├── content/
│   ├── en.js                  English content
│   ├── et.js                  Estonian content
│   └── ru.js                  Russian content
├── assets/
│   ├── images/                Social preview and decorative SVG assets
│   └── cv/                    Downloadable CV files and print source
├── favicon.svg
├── 404.html
├── robots.txt
├── sitemap.xml
└── .nojekyll
```

## Run locally

Use a local web server so browser behavior matches GitHub Pages:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

VS Code Live Server works as an alternative. Opening `index.html` directly may not represent all browser behavior, so a local server is preferred.

## Edit translations

Each language is a single object inside `content/en.js`, `content/et.js` or `content/ru.js`. Keep the same keys in all three files. Static page text uses `data-i18n` keys; repeating content such as expertise cards and experience entries is rendered from arrays in those files.

When adding a new text field:

1. Add the field to all three language objects.
2. Add a matching `data-i18n` attribute in `index.html`, or extend the relevant renderer in `script.js`.
3. Test all language buttons and reload the page to confirm the saved preference.

## Update experience

Edit the `experience.items` array in every translation file. Each item accepts:

- `company`
- `period`
- `role`
- `description`
- optional `details` array

Entries appear in the order listed.

## Replace CV files

Place PDF files in `assets/cv/` using these names:

```text
toomas-taro-cv-en.pdf
toomas-taro-cv-et.pdf
toomas-taro-cv-ru.pdf
```

The repository includes one-page English, Estonian and Russian PDFs. Each language points to its matching file.

The editable print source is in `assets/cv/source/`:

- `cv.html` — shared document structure
- `cv.css` — A4 print layout
- `cv-content.js` — CV content in all three languages
- `cv.js` — shared rendering logic

Preview a version through the local server:

```text
http://localhost:8000/assets/cv/source/cv.html?lang=en
http://localhost:8000/assets/cv/source/cv.html?lang=et
http://localhost:8000/assets/cv/source/cv.html?lang=ru
```

After editing, print each page to PDF without browser headers and footers and keep the filenames listed above.

## Metadata and social preview

Default metadata is in the `<head>` of `index.html`. Language-specific titles and descriptions are stored under `meta` in the translation files and updated at runtime.

If the repository URL changes, update:

- the canonical and Open Graph URLs in `index.html`
- the `url` value in JSON-LD
- `robots.txt`
- `sitemap.xml`

The social preview source is `assets/images/social-preview.svg`.

## Deploy to GitHub Pages

The site uses root-relative repository files and requires no build step.

1. Push the `main` branch to GitHub.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select `main` and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site.

Primary URL:

`https://cv.toomastaro.com/`

GitHub Pages fallback URL:

`https://toomastaro.github.io/cv/`

## Custom domain

The current custom domain is stored in `CNAME` and configured as `cv.toomastaro.com`.

To replace it later:

1. Configure the new domain with the DNS provider according to GitHub Pages documentation.
2. Add the new custom domain in **Settings → Pages**.
3. Enable HTTPS after the certificate is issued.
4. Replace the value in `CNAME`.
5. Update canonical, Open Graph, JSON-LD, robots and sitemap URLs.
