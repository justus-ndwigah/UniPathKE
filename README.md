# UniPathKE

Kenya's complete KUCCPS pathway guide — find your university, diploma or TVET path for every KCSE grade level.

A standard React + Vite + TypeScript project (no Replit lock-in). Works with GitHub Pages, Vercel, Netlify, or any static host.

## Local development

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Preview the production build locally

```bash
npm run preview
```

## Deploy

- **Vercel / Netlify**: import the GitHub repo, framework preset "Vite", build command `npm run build`, output directory `dist`.
- **GitHub Pages**: see the GitHub Actions workflow in `.github/workflows/deploy.yml`, or run `npm run build` and push the `dist/` folder to a `gh-pages` branch.
