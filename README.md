# Lir 725 — Materials section (developer handoff)

Interactive "Materials" block for the Lir 725 project page. Two scenes
(Bathroom + Kitchen) with clickable hotspots on each render that reveal a
material tag, label, description, and product link.

---

## Folder contents

| File | Purpose |
| --- | --- |
| `Lir-725-acabamentos.html` | **Standalone demo.** Open in a browser to preview the section exactly as intended (markup, styles, interactions, and data all inlined). |
| `ACABAMENTOS_ROOMS-snippet.jsx` | **Drop-in data block** for the React project. Replaces the placeholder `ACABAMENTOS_ROOMS` array inside `project.jsx` (look for `// 4b. Acabamentos — placeholder section`, around line 1100). |
| `bathroom.jpg` | Final bathroom render (2000×1600, ~480 KB). |
| `kitchen.png` | Final kitchen render (1280×1600, ~3.4 MB). Consider re-exporting as a `.jpg` or `.webp` if file size is a concern. |

---

## How to integrate into the live site

1. **Upload the two renders** to the WordPress media library (or wherever
   project assets are hosted, e.g. `https://tiagoc108.sg-host.com/wp-content/uploads/...`).
2. **Swap the image references** in `ACABAMENTOS_ROOMS-snippet.jsx`:
   - `image: 'bathroom.jpg'` → final hosted URL
   - `image: 'kitchen.png'` → final hosted URL
3. **Replace the placeholder data** in `project.jsx`:
   - Find the existing `ACABAMENTOS_ROOMS` constant (placeholder section "4b").
   - Replace it with the array exported from `ACABAMENTOS_ROOMS-snippet.jsx`.
4. **Visual reference**: open `Lir-725-acabamentos.html` directly to confirm
   the hotspot positions, interaction, and copy match before merging.

> The React component itself (tabs, scene switching, hotspot rendering,
> info panel) is already implemented in `project.jsx`. Only the data
> array needs to change.

---

## Hotspot coordinate system

- `x` and `y` are **percentages of the image**, measured from the top-left.
- The hotspot's visual center sits at (`x%`, `y%`) of the rendered image.
- The values in this handoff were calibrated against the renders in this
  folder. If the production render is cropped or re-exported at a different
  aspect ratio, expect to nudge a few coordinates in dev tools.

---

## Materials inventory

### Bathroom (8 spots)

| id | Material | Product link |
| --- | --- | --- |
| `ceiling` | Plasterboard RAL 9010 | — |
| `shower` | BRUMA — Recessed system | [datasheet](https://www.bruma.pt/assets/INFO/new/1673602CR_ficha.pdf) |
| `mirror` | ITALBOX — Backlit | [italbox](https://italbox.pt/pt/produtos/espelhos/espelhos-com-iluminacao/redondo-) |
| `tile` | MARAZZI — Grande Concrete Look White | [marazzi](https://www.marazzitile.co.uk/collections/grande-concrete-look-collections/) |
| `faucet` | BRUMA — Brushed stainless steel | [bruma](https://www.bruma.pt/?page=products&prod=4596) |
| `basin` | ITALBOX — Solid surface | [italbox](https://italbox.pt/pt/produtos/lavatorios/solid-surface-1/bancada-lavatorio-quadratum-ss) |
| `wc` | GEBERIT — Wall-hung | [geberit](https://catalog.geberit.pt/pt-PT/product/PRO_1511968) |
| `vanity` | ITALBOX — Oak veneer | — |

### Kitchen (7 spots)

| id | Material | Product link |
| --- | --- | --- |
| `ceiling` | Plasterboard RAL 9010 | — |
| `cab-upper` | ONESKIN — Tortora (upper cabinets) | [oneskin](https://www.oneskin.pt/products_sub/tortora-1) |
| `backsplash` | COSENTINO — Dekton Keena | [cosentino](https://www.cosentino.com/pt-pt/cores/dekton/keena/) |
| `faucet` | BRUMA — Chrome | [bruma](https://www.bruma.pt/?page=products&prod=6625) |
| `countertop` | COSENTINO — Dekton Keena | [cosentino](https://www.cosentino.com/pt-pt/cores/dekton/keena/) |
| `cab-lower` | ONESKIN — Sunny White (lower cabinets) | [oneskin](https://www.oneskin.pt/products_sub/sunny-white) |
| `flooring` | Pine — Staggered lay | — |

---

## Implementation notes

- **Aspect ratio:** the demo uses each image's natural aspect ratio (no
  `object-fit: cover`). Switching tabs causes the stage height to change.
  Acceptable for two scenes; revisit if more scenes are added.
- **Hotspot visuals:** rendered purely with CSS via `::before` (pulsing
  ring) and `::after` (terracotta dot) on each `.hotspot` button. The
  buttons themselves are empty — no inner markup required.
- **Accessibility:** every hotspot has `aria-label`, the info panel uses
  semantic heading + paragraph, and `Esc` closes the active panel.
- **Mobile:** breakpoint at 900px collapses the info panel onto multiple
  lines and hides the scene-switch arrows (tabs still work).

---

## Quick local preview

From this folder:

```bash
python3 -m http.server 4173
# open http://localhost:4173/Lir-725-acabamentos.html
```

A static server is required because the HTML loads images via relative
paths — opening the file with `file://` won't work for the images.
