# Personal Portfolio

This is an Astro portfolio site. Publications are kept as structured data and
rendered through shared, responsive components across the homepage, the papers
page, and the CV page.

## Run Locally

The project uses the Node.js version specified in `.nvmrc`.

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Astro, normally
[http://localhost:4321](http://localhost:4321).

To view the site from a phone or tablet on the same network:

```powershell
npm.cmd run dev -- --host
```

Open the network URL printed by Astro on that device. For a production-style
check, run:

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd run preview
```

## Add A Publication

Publication content lives in
[`src/data/publications.json`](src/data/publications.json). To publish a new
card:

1. Add an object to `src/data/publications.json`. Use a unique `id`.
2. Place any teaser image or downloadable PDF in `src/assets/publications/`.
3. Set `teaser` and `pdfAsset` to their `publications/...` asset paths, or omit either field.
4. Run `npm.cmd run build`. Astro validates the data and reports missing assets.

Use WebP or AVIF for teaser images when possible so the homepage remains fast
on mobile connections.

```json
{
  "id": "paper-slug",
  "title": "Paper Title",
  "authors": [
    { "name": "Gonzalo Gomez-Nogales", "highlighted": true },
    { "name": "Coauthor Name" }
  ],
  "venue": "Conference or Journal",
  "year": 2026,
  "primaryUrl": "https://doi.org/...",
  "teaser": "publications/paper-teaser.webp",
  "teaserFit": "cover",
  "pdfAsset": "publications/paper.pdf",
  "videoUrl": "https://...",
  "projectUrl": "https://...",
  "abstract": "A short summary for the publications page."
}
```

Optional author field `equalContribution: true` displays an asterisk after
that author. Papers appear in exactly the order they are listed in
`src/data/publications.json`; move an object up or down in that array to
reorder its card. Use
`"teaserFit": "contain"` for diagrams or collages that must remain fully
visible, and `"cover"` for images that can be cropped to fill the card.

## Deploy

The public site at `https://gonzalogn.com/` is served by Netlify. Netlify is
the deployment target for this repository, and its connected branch should be
`master`.

In Netlify, configure the site with:

- Build command: `npm run build`
- Publish directory: `dist`
- Production branch: `master`
- Custom domain: `gonzalogn.com`

After those settings are in place, publishing changes is simply:

```powershell
git push origin master
```

Do not configure `gonzalogn.com` in GitHub Pages while Netlify is serving the
domain. The GitHub Pages action is a separate deployment system and is not
needed for the current hosting setup.

Keep `template.website_url` in `src/settings.ts` set to
`https://gonzalogn.com/` and `template.base` set to `''`.
