
# Multilingual CV Website

This is a professional, multilingual CV/portfolio website built with [Next.js](https://nextjs.org), designed for UN/NGO and international audiences. It supports English (default), Spanish, and French, and includes a downloadable PDF CV.

## Features

- Modern, accessible, and professional design
- Multilingual: English, Spanish, French (with language switcher)
- Downloadable PDF CV
- Responsive and print-friendly
- Ready for free deployment on GitHub Pages

## Getting Started

## Getting Started


### Development

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


The default language is English. To view other languages, navigate to `/es` or `/fr` in your browser.

### Testing

Minimal smoke tests are included to ensure the site builds and renders:

```bash
npx jest
```

### Build & Export

To build and export the site for static hosting (required for GitHub Pages):

```bash
GITHUB_PAGES=true npm run build
```

The static site will be output to the `out/` directory.

### Deploy to GitHub Pages

1. Commit and push your changes to your GitHub repository.
2. In your repo settings, set GitHub Pages to deploy from the `out/` folder on the `master` or `main` branch.
3. Your site will be available at `https://<your-username>.github.io/<repo-name>/`.

#### Notes
- The `basePath` and `assetPrefix` are automatically set for GitHub Pages when `GITHUB_PAGES=true` is used during build.
- The downloadable PDF is located at `/public/Resume.pdf`.

---


---
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
