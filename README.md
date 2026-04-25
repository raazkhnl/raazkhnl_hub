# raazkhnl — neural hub

personal portfolio for **Rajesh Khanal** ([@raazkhnl](https://github.com/raazkhnl)) — Computer Engineer @ IRD, Gov of Nepal · M.E. Networks & Cyber Security @ Pulchowk Campus.

dark × gen-z aesthetic with a working in-browser terminal you can actually drive.

> live: https://khanalrajesh.com.np (also reachable at https://raazkhnl.github.io/raazkhnl_hub/, which redirects to the custom domain)

---

## stack

- **vite 6** + **react 19** + **react-router-dom 6** (BrowserRouter w/ basename)
- **tailwindcss v4** (`@theme` tokens, no config file)
- **typescript 5.8**
- **web3forms** for the contact endpoint

no client-state lib, no animation lib — motion is hand-tuned css with `IntersectionObserver` and `requestAnimationFrame`.

## scripts

```bash
npm run dev        # vite dev @ http://localhost:3000/  (clean URLs)
npm run build      # production build (base = /, served from custom domain root)
npm run preview    # preview the production build
npm run deploy     # build + push dist/ → gh-pages branch
```

`postbuild` copies `dist/index.html` → `dist/404.html` so deep links don't 404 on GitHub Pages (e.g. `khanalrajesh.com.np/project/zomec` falls through to the SPA).

`vite.config.ts` sets `base: '/'`. The site is served from the **root** of the custom domain (`khanalrajesh.com.np`), so assets resolve from `/` in both dev and prod. `BrowserRouter` reads its `basename` from `import.meta.env.BASE_URL` (`/`), so routes are clean (`/`, `/project/<id>`).

`public/CNAME` contains the custom domain — Vite copies it into `dist/` and `gh-pages -d dist` publishes it, telling GitHub Pages to serve at `khanalrajesh.com.np`. The `raazkhnl.github.io/raazkhnl_hub/` URL keeps working: GitHub auto-301s it to the custom domain.

## structure

```
.
├── index.html             entry, fonts, OG/Twitter/JSON-LD, no-FOUC bg
├── index.tsx              root + BrowserRouter (basename from BASE_URL)
├── App.tsx                Routes (lazy ProjectDetails / NotFound, Suspense)
├── constants.tsx          profile, projects, skills, timeline
├── types.ts               shared types (Project.link is the live URL)
├── vite.config.ts         conditional base, port 3000
├── vite-env.d.ts          import.meta.env types
├── src/index.css          design tokens + utilities (glass, chip, btn, motion)
├── public/
│   ├── raazkhnl.png       avatar / favicon (© Rajesh Khanal, see LICENSE)
│   ├── robots.txt         allow all + sitemap pointer
│   └── sitemap.xml        all 11 routes for crawlers
├── pages/
│   └── Home.tsx           hero · stack · work · timeline · contact
└── components/
    ├── Terminal.tsx       interactive shell (history, tab, ascii, easter eggs)
    ├── BentoGrid.tsx      stack matrix bento
    ├── ProjectGallery.tsx project cards (cursor-tracking glow)
    ├── ProjectDetails.tsx project page (lazy)
    ├── ContactForm.tsx    web3forms contact (firstName/lastName/email/phone/message)
    ├── NotFound.tsx       404 page (lazy)
    ├── Avatar.tsx         floating profile avatar (parallax + bob)
    ├── MatrixRain.tsx     subtle canvas matrix bg
    ├── Reveal.tsx         IntersectionObserver fade-up
    ├── GlowCard.tsx       cursor-tracking radial glow
    ├── MagneticButton.tsx pointer-magnetic translate
    └── Typewriter.tsx     cycling phrase typewriter
```

## featured projects

`constants.tsx#PROJECTS` holds the entries. Each has a `link` (live demo) and/or `github` (repo). The card's corner-button picks the best target:

1. `link` if present → opens the live product
2. else `github` → opens the repo
3. else → falls back to https://github.com/raazkhnl

| id                  | shipped/contributed at | link / repo                                                              |
| ------------------- | ---------------------- | ------------------------------------------------------------------------ |
| `zomec`             | Belvy LLC              | https://app.zomec.ai/                                                    |
| `dasro`             | Belvy LLC              | https://www.dasro.ca/jobseeker                                           |
| `code4pro`          | Belvy LLC              | https://www.code4pro.com/                                                |
| `ndhrms`            | personal               | [NDHRMS](https://github.com/raazkhnl/NDHRMS)                             |
| `queueless`         | personal               | [QueueLess](https://github.com/raazkhnl/QueueLess)                       |
| `rk-word-editor`    | personal               | [rk-word-editor](https://github.com/raazkhnl/rk-word-editor)             |
| `whatsup`           | personal               | [whatsup](https://github.com/raazkhnl/whatsup)                           |
| `neon-invasion`     | personal               | [neon-invasion](https://github.com/raazkhnl/neon-invasion)               |
| `facial-attendance` | personal               | [facial_attendance](https://github.com/raazkhnl/facial_attendance)       |
| `abc-app`           | personal               | [abc-app](https://github.com/raazkhnl/abc-app)                           |
| `inote`             | personal               | [iNote](https://github.com/raazkhnl/iNote)                               |

## terminal commands

press `/` from anywhere on the page to focus the terminal input.

| command               | what it does                                        |
| --------------------- | --------------------------------------------------- |
| `help [cmd]`          | list commands · or details for one                  |
| `man <cmd>`           | manual entry for a command                          |
| `about` / `whoami`    | who is raazkhnl                                     |
| `skills [cat]`        | list skills (cat: `lang`, `ui`, `ops`)              |
| `projects`            | list shipped projects                               |
| `open <id>`           | navigate to a project page                          |
| `socials`             | github · linkedin · web · email                     |
| `email`               | copy email to clipboard                             |
| `contact`             | jump to contact form                                |
| `home / stack / work` | jump to a section                                   |
| `resume`              | open resume / website                               |
| `github` / `linkedin` | open in new tab                                     |
| `date` / `time`       | current date or time                                |
| `echo <text>`         | echo text                                           |
| `banner`              | print ascii banner                                  |
| `neofetch`            | system-info card                                    |
| `ls` / `cat <file>`   | fake filesystem (about, contact, now, readme)       |
| `pwd`                 | print working dir                                   |
| `history`             | show recent commands (last 25)                      |
| `matrix`              | toggle matrix rain background (persisted)           |
| `theme <c>`           | accent: `mint`, `pink`, `amber`, `iris` (persisted) |
| `joke`                | dev joke                                            |
| `sudo <cmd>`          | permission denied (with style)                      |
| `clear` / `cls`       | clear screen (or `Ctrl+L`)                          |

### keyboard shortcuts

- `/` — focus terminal
- `Ctrl+L` — clear terminal
- `Ctrl+C` — abort current input
- `↑` / `↓` — history (persisted)
- `Tab` — autocomplete (commands, project ids, file names, theme names)
- `g h` / `g s` / `g w` / `g c` — jump to home / stack / work / contact

## design system

CSS tokens live in `src/index.css` under Tailwind v4's `@theme` block.

```
ink         #050507   page bg
mint        #36f9b3   primary accent
pink        #ff3d8b   pop accent
electric    #38bdf8   tertiary
amber       #fbbf24   warm accent
iris        #8b5cf6   subtle gradient
```

reusable utilities: `.stage`, `.scanlines`, `.grain`, `.glass`, `.glass-tight`, `.glow-card`, `.chip`, `.chip-pink`, `.btn-primary`, `.btn-pink`, `.btn-ghost`, `.eyebrow`, `.text-grad`, `.text-grad-mint`, `.text-grad-pink`, `.text-grad-flow`, `.text-grad-flow-mint`, `.tape-underline`, `.dot`, `.dot-pink`, `.float-avatar`, `.card-media`, `.glitch`, `[data-reveal]`.

`prefers-reduced-motion` is honored globally — animations and matrix rain disable.

## persistence

| key                        | what                                      |
| -------------------------- | ----------------------------------------- |
| `raazkhnl.term.history.v1` | terminal command history (last 50)        |
| `raazkhnl.accent.v1`       | accent theme (mint · pink · amber · iris) |
| `raazkhnl.matrix.v1`       | matrix rain on/off                        |
| `raazkhnl.booted` *(session)* | once-per-session boot screen flag      |

## SEO

- canonical URL, descriptive title, meta description, keywords, author, robots
- Open Graph (`profile` type) + Twitter `summary_large_image`
- two JSON-LD blocks: `Person` (with `sameAs` to all socials) and `WebSite`
- `<noscript>` content with name, role, and a github fallback link
- `public/robots.txt` + `public/sitemap.xml` listing all 11 project routes

## security

- every external link uses `target="_blank"` paired with `rel="noopener noreferrer"` (or `rel="noreferrer"` which implies `noopener`); `window.open` calls pass `"noopener,noreferrer"` features. No reverse-tabnabbing surface.
- no `dangerouslySetInnerHTML`, no `eval`, no inline `<script>` injecting user data.
- form input goes straight to web3forms; no plaintext storage.
- `localStorage` / `sessionStorage` only hold UI state (theme, terminal history, boot flag) — no PII or secrets.
- the web3forms `access_key` is intentionally client-side (per their docs); rotate it via `components/ContactForm.tsx#ACCESS_KEY` if needed.

## contact form

uses [web3forms](https://web3forms.com/) — free, no backend. swap `ACCESS_KEY` in `components/ContactForm.tsx` with your own.

## deploy to GitHub Pages

```bash
npm run deploy
```

what happens, in order:
1. `predeploy` runs `npm run build`
2. `vite build` produces `dist/` with `base=/` and copies `public/*` (incl. `CNAME`) into it
3. `postbuild` copies `dist/index.html` → `dist/404.html` (SPA fallback for deep links)
4. `gh-pages -d dist` pushes `dist/` to the `gh-pages` branch
5. GitHub Pages reads `dist/CNAME` and serves the site at `https://khanalrajesh.com.np`
6. Visits to `https://raazkhnl.github.io/raazkhnl_hub/` 301-redirect to the custom domain

ensure your repo's **Settings → Pages → Source** is set to the `gh-pages` branch (root) and **Custom domain** is set to your domain (or just rely on the `CNAME` file). DNS for the apex domain should `ALIAS`/`ANAME`/`A`-record to GitHub's pages IPs (185.199.108.153, .109.153, .110.153, .111.153); for `www`, `CNAME` to `raazkhnl.github.io`. Enforce HTTPS in Pages settings once the domain validates.

if you fork this for your own portfolio:
1. update `package.json#homepage` to your domain
2. replace `public/CNAME` with your domain (or delete it if you're using the default `*.github.io/<repo>/` URL — in that case set `vite.config.ts` base back to `/<repo>/`)
3. update the canonical URL, OG/Twitter URLs in `index.html`, and `loc` entries in `public/sitemap.xml`
4. drop your photo into `public/raazkhnl.png` (any 500×500 PNG works), or rename the file and update `Avatar.tsx#src`
5. update `RAAZKHNL` in `constants.tsx` with your details
6. swap the web3forms `ACCESS_KEY` in `components/ContactForm.tsx`

## license

MIT — see [LICENSE](LICENSE). The avatar photograph (`public/raazkhnl.png`) is © Rajesh Khanal and is **not** covered by the MIT grant; replace it before reuse.

---

made with ꨄ︎ by [@raazkhnl](https://github.com/raazkhnl).
