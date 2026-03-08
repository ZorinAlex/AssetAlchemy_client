# AssetAlchemy — Project Guide for Claude

## Project Overview

AssetAlchemy is a web tool for creating and managing 2D game assets (spritesheets, bitmap fonts, particle systems, Spine animation viewer). It targets game developers using Pixi.js and Phaser.js.

**Status:** Alpha stage. No database — stateless file-processing app.

---

## Monorepo Structure

```
AssetAlchemy/
├── client/     # Frontend — Quasar (Vue 3) + Vite
└── server/     # Backend  — NestJS
```

---

## Client (Quasar + Vue 3)

**Working directory:** `client/`

### Tech Stack
- **Quasar** 2.16 (Vue 3.4, SFC Composition API, TypeScript)
- **Vite** via @quasar/app-vite
- **Vue Router** 4 — hash mode
- **Pinia** — state management
- **Axios** — HTTP client (boot: `src/boot/axios.ts`)
- **Pixi.js** 7.4 + Pixi Spine
- **TailwindCSS** 3.4 + SCSS
- **Icons:** Material Icons (Quasar extras)
- **Font:** Roboto (Quasar extras)

### Commands
```bash
# from client/
quasar dev          # dev server (auto-opens browser)
quasar build        # production build
```

### Source Structure
```
src/
├── boot/axios.ts              # Axios setup; exposes $api, $axios globally
├── components/                # Reusable components
│   ├── imageFile.vue
│   ├── imagesUploader.vue
│   └── particleBehaviour/     # 21 particle-behavior panel components
├── css/
│   ├── app.scss
│   └── quasar.variables.scss
├── interfaces/
│   ├── enums.ts
│   └── imageFile.ts
├── layouts/MainLayout.vue     # Shell layout (nav + router-view)
├── pages/
│   ├── IndexPage.vue          # / — home / features overview
│   ├── Packer.vue             # /spritesheet
│   ├── BFont.vue              # /bitmapfont
│   ├── Particles.vue          # /particles
│   ├── Spine.vue              # /spine
│   └── ErrorNotFound.vue      # 404
├── router/
│   ├── index.ts
│   └── routes.ts
├── stores/                    # Pinia stores
├── utils/
│   ├── ascii.ts
│   └── particlesUtils.ts
└── assets/
    └── images/                # WebP feature screenshots
```

### Quasar Config Highlights (`quasar.config.js`)
- Boot: `['axios']`
- CSS: `['app.scss']`
- Extras: `roboto-font`, `material-icons`
- Plugins: `Notify` (default type: `negative`, position: `top`)
- Router mode: `hash`
- Build targets: ES2019, Chrome 87, Firefox 78, Safari 13.1, Edge 88

### API Communication
- Base URL: `https://api.assetalchemy.app`
- Access in components: `this.$api` (Options API) or inject via Composition API
- Instance type: AxiosInstance

---

## Server (NestJS)

**Working directory:** `server/`

### Tech Stack
- **NestJS** 10 + TypeScript 5
- **Jimp** 1.6 + **Sharp** 0.33 — image processing
- **maxrects-packer** 2.7 — bin-packing algorithm
- **archiver** 7 — ZIP creation
- **class-validator** — DTO validation
- **@nestjs/config** + Joi — env validation

### Commands
```bash
# from server/
npm run start:dev   # watch mode
npm run build       # compile
npm run start:prod  # run compiled
npm run lint        # ESLint --fix
npm run test        # Jest
npm run test:cov    # coverage
```

### Environment Variables
| Variable  | Description            | Validated |
|-----------|------------------------|-----------|
| PORT      | HTTP port              | Joi (required) |
| TEMP_PATH | Temp file storage path | Joi (required) |

### Module Structure
```
src/
├── main.ts              # Bootstrap: CORS, ValidationPipe(transform:true), PORT
├── app.module.ts        # Root: ConfigModule, PackerModule, ArchiveModule, LoggerMiddleware, ExceptionsFilter
├── packer/              # Core feature module
│   ├── packer.controller.ts  # POST /packer/pack, POST /packer/bfont
│   ├── packer.service.ts     # packImages(), fontDataFromJSON(), generateJSON()
│   ├── pack.dto.ts
│   ├── bitmap.font.dto.ts
│   └── packer.interfaces.ts  # IPackerOptions, IRect, ISheetData, IProcessImages, IPackData, ICharXmlData
├── archive/
│   └── archive.service.ts   # createZip(), removeFiles()
├── filters/exceptions.filter.ts
├── middleware/logger.middleware.ts
└── utils/
    ├── ascii.ts
    └── font_utils.ts
```

### API Endpoints
| Method | Path           | Description                        | Response     |
|--------|----------------|------------------------------------|--------------|
| POST   | /packer/pack   | Upload images → spritesheet + JSON | ZIP file     |
| POST   | /packer/bfont  | Upload images → bitmap font + XML  | ZIP file     |

**Data flow:** upload → Jimp/Sharp process → MaxRects bin pack → generate atlas JSON/XML → ZIP → return → cleanup temp files

---

## Key Conventions

- **Language:** TypeScript throughout (strict where possible)
- **Vue style:** Composition API with `<script setup>` preferred
- **CSS:** SCSS + TailwindCSS utility classes; Quasar component styles
- **Quasar components:** Use `Q*` prefixed components (auto-imported by Quasar)
- **Notifications:** Use Quasar `Notify` plugin (`$q.notify(...)`)
- **No database:** Files are processed in memory / temp storage, no persistence
- **File uploads:** Multipart form data to server endpoints

---

## Important Notes

- The client repo has a `Dockerfile` + `default.conf` (nginx) for SPA deployment
- Pinia stores are under `src/stores/` — `example-store.ts` is a template
- Spine viewer supports runtime versions: 3.7, 3.8, 4.0, 4.1
- Router is hash-based (`/#/route`) — important for nginx/static hosting config
