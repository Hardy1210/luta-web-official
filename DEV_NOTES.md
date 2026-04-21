# DEV NOTES — Uso interno del equipo

---

## SEO por cliente — Checklist de cambios

### 1. Fuente central de verdad

**`config/site.ts`** — único archivo que hay que editar para adaptar el SEO completo a un nuevo cliente.

| Campo | Descripción |
|---|---|
| `name` | Nombre del cliente / marca |
| `tagline` | Eslogan corto |
| `description` | Descripción global del sitio (meta description raíz) |
| `url` | URL de producción (`https://www.dominio.fr`) |
| `locale` | Código de locale OG (`fr_FR`, `en_GB`, etc.) |
| `social.twitter` | Handle Twitter con `@` |
| `social.instagram` | Handle Instagram con `@` |
| `social.linkedin` | Slug de página LinkedIn |
| `ogImage` | Ruta relativa a la imagen OG global (`/og-image.jpg`) |
| `navItems` | Ítems de navegación — ajustar etiquetas y rutas |

---

### 2. Archivos a editar por página

#### Página raíz
- **`app/page.tsx`**
  - `title` → usar `{ absolute: siteConfig.name }` (no aplica template)
  - `description` → tomar de `siteConfig.description`

#### Páginas interiores
- **`app/a-propos/page.tsx`**, **`app/contact/page.tsx`**, y cualquier página nueva
  - Llamar `generateMetadata({ title, description, slug })` con los valores reales del cliente
  - Reemplazar los placeholders en MAYÚSCULAS: `TITRE_A_PROPOS`, `DESCRIPTION_A_PROPOS`, etc.
  - `slug` debe coincidir con la ruta real (sin `/`)

---

### 3. Metadata global (`app/layout.tsx`)

Solo tocar si cambia algo estructural. Los valores OG y Twitter ya los hereda de `config/site.ts` vía `siteConfig`.

- `viewport` — no modificar salvo requerimiento específico
- `metadata.title.template` → se genera automáticamente como `%s | ${siteConfig.name}`

---

### 4. Imágenes (`public/`)

| Archivo | Tamaño | Obligatorio |
|---|---|---|
| `og-image.jpg` | 1200 × 630 px | Sí |
| `favicon.ico` | 32 × 32 px | Sí |
| `apple-touch-icon.png` | 180 × 180 px | Recomendado |

> Alternativa Next.js 16: colocar `icon.ico` y `apple-icon.png` directamente en `app/` — se sirven automáticamente sin configuración.

---

### 5. Sitemap y robots

- **`app/sitemap.ts`** — agregar/quitar URLs al array cuando se añadan o eliminen rutas
- **`app/robots.ts`** — ajustar `disallow` si hay rutas privadas o de staging

Ambos leen `siteConfig.url` automáticamente; no hardcodear URLs.

---

### 6. Helper de metadata

- **`lib/metadata.ts`** — no tocar salvo que cambien las reglas globales de SEO
- **`types/seo.ts`** — no tocar salvo que se agreguen nuevos campos a `siteConfig` o `PageSeoProps`

---

### Flujo de onboarding para nuevo cliente

```
1. Editar config/site.ts  →  todos los campos del cliente
2. Reemplazar public/og-image.jpg  →  imagen branded 1200×630
3. Reemplazar public/favicon.ico y apple-touch-icon.png
4. Editar cada app/**/page.tsx  →  sustituir placeholders TITRE_* / DESCRIPTION_*
5. Actualizar app/sitemap.ts  →  añadir rutas reales del cliente
6. npm run build  →  verificar sin errores de tipo
```
