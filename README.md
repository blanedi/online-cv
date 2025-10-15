
# Multilingual CV & Portfolio Website

This repository contains the source code for a professional, multilingual CV and portfolio website for Cintya Huaire. Built with [Next.js](https://nextjs.org), it is designed for international, UN, NGO, and academic audiences, and is fully deployable to GitHub Pages.

## 🌍 Features

- **Professional, Accessible Design**: Clean, modern UI with a focus on clarity and professionalism.
- **Multilingual**: English (default), Spanish, and French. Language switcher included.
- **Downloadable PDF CV**: Always-available PDF download for offline/print use.
- **Responsive & Print-Friendly**: Looks great on all devices and when printed.
- **Static Export for GitHub Pages**: All assets and routes work out-of-the-box on GitHub Pages.
- **SEO & Social Meta Tags**: Optimized for sharing and discoverability.
- **Custom Favicon & Branding**: Personalized favicon and Open Graph image.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Run Locally

```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 3. View in Other Languages

- English: `/en` (default)
- Spanish: `/es`
- French: `/fr`

### 4. Download the PDF CV

Click the "Download CV" button in the site header, or access `/Resume.pdf` directly.

## 🧪 Testing

Basic smoke tests are included to ensure the site builds and renders:

```bash
npx jest
```

## 🏗️ Build & Deploy to GitHub Pages

1. **Build for Static Export**
   ```bash
   GITHUB_PAGES=true npm run build
   npm run export
   ```
   The static site will be output to the `docs/` directory (ready for GitHub Pages).

2. **Push to GitHub**
   Commit and push your changes to your repository.

3. **Configure GitHub Pages**
   - In your repo settings, set GitHub Pages to deploy from the `/docs` folder on the `master` or `main` branch.
   - Your site will be available at `https://<your-username>.github.io/<repo-name>/`.

#### Deployment Notes
- The `basePath` and `assetPrefix` are set automatically for GitHub Pages when `GITHUB_PAGES=true` is used.
- The downloadable PDF is located at `/docs/Resume.pdf` after export.
- A `.nojekyll` file is included to ensure proper asset serving.

## 🛠️ Customization

- **Content**: Edit your CV data in the appropriate files in `src/data/` or `src/components/`.
- **Languages**: Update translations in the `locales/` directory.
- **Images & Assets**: Place images in `public/images/` and update references as needed.
- **Branding**: Update the favicon in `public/favicon.svg`.

## 📁 Project Structure

- `src/app/` – Main Next.js app directory (pages, layout, not-found, etc.)
- `public/` – Static assets (images, PDF, favicon)
- `docs/` – Static export output for GitHub Pages
- `src/components/` – React components for CV sections, layout, etc.
- `src/data/` – (If present) Structured CV data

## 👩‍💻 Technology Stack

- [Next.js 15+](https://nextjs.org/) (App Router, Static Export)
- [React 19+](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)
- [TypeScript](https://www.typescriptlang.org/)

## 📄 License & Credits

This project is for personal/professional use by Cintya Huaire. Built with open-source tools. Feel free to fork and adapt for your own CV/portfolio!

---

For questions or feedback, please contact me by edithuaire@gmail.com or open an issue.