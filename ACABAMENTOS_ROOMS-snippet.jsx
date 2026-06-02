// ============================================================
// Lir 725 — Materials data
//
// Drop-in replacement for the placeholder ACABAMENTOS_ROOMS
// array currently in project.jsx (look for: "// 4b. Acabamentos
// — placeholder section").
//
// Hotspot x/y values are PERCENTAGES of the image, from the
// top-left corner. They were positioned against the production
// renders bathroom.jpg (LIR WC02_02_Edit-2) and kitchen.png
// (LIR KITCHEN_opt 1) — fine-tune in dev tools if the final
// crop differs.
//
// Images: replace 'bathroom.jpg' / 'kitchen.png' with the final
// WordPress-hosted URLs (e.g. https://tiagoc108.sg-host.com/...)
// before deploy.
// ============================================================

const ACABAMENTOS_ROOMS = [
  {
    id: 'banho',
    label: 'Bathroom',
    image: 'bathroom.jpg',
    spots: [
      {
        id: 'ceiling', x: 47, y: 8,
        label: 'Ceiling',
        material: 'Plasterboard RAL 9010',
        detail: 'Smooth plasterboard ceiling in pure white. Clean planes that recede so light and form lead the room.',
      },
      {
        id: 'shower', x: 78, y: 22,
        label: 'Shower',
        material: 'BRUMA — Recessed system',
        detail: 'BRUMA recessed shower system with wall-mounted rain head and handset. Concealed valves keep the wall uninterrupted.',
        url: 'https://www.bruma.pt/assets/INFO/new/1673602CR_ficha.pdf',
      },
      {
        id: 'mirror', x: 28, y: 38,
        label: 'Mirror',
        material: 'ITALBOX — Backlit',
        detail: 'ITALBOX circular mirror with an integrated LED halo. Soft ambient glow framing a precise reflection.',
        url: 'https://italbox.pt/pt/produtos/espelhos/espelhos-com-iluminacao/redondo-',
      },
      {
        id: 'tile', x: 60, y: 92,
        label: 'Tile',
        material: 'MARAZZI — Grande Concrete Look White',
        detail: 'MARAZZI Grande Concrete Look White on walls and floor. Oversized slabs minimise grout lines for a continuous concrete-effect surface.',
        url: 'https://www.marazzitile.co.uk/collections/grande-concrete-look-collections/',
      },
      {
        id: 'faucet', x: 29, y: 62,
        label: 'Faucet',
        material: 'BRUMA — Brushed stainless steel',
        detail: 'Premium anti-fingerprint brushed stainless steel finish. Minimalist design with integrated temperature control.',
        url: 'https://www.bruma.pt/?page=products&prod=4596',
      },
      {
        id: 'basin', x: 25, y: 66,
        label: 'Washbasin',
        material: 'ITALBOX — Solid surface',
        detail: 'ITALBOX Quadratum basin in seamless solid surface. Sharp geometry, warm to the touch, non-porous and easy to maintain.',
        url: 'https://italbox.pt/pt/produtos/lavatorios/solid-surface-1/bancada-lavatorio-quadratum-ss',
      },
      {
        id: 'wc', x: 52, y: 78,
        label: 'WC',
        material: 'GEBERIT — Wall-hung',
        detail: 'GEBERIT wall-hung toilet with concealed cistern and flush plate. Floor stays clear for easier cleaning and a lighter visual footprint.',
        url: 'https://catalog.geberit.pt/pt-PT/product/PRO_1511968',
      },
      {
        id: 'vanity', x: 25, y: 76,
        label: 'Vanity',
        material: 'ITALBOX — Oak veneer',
        detail: 'Wall-hung ITALBOX vanity in oak veneer. Natural grain warms the cool stone and ceramic around it.',
      },
    ],
  },
  {
    id: 'cozinha',
    label: 'Kitchen',
    image: 'kitchen.png',
    spots: [
      {
        id: 'ceiling', x: 50, y: 8,
        label: 'Ceiling',
        material: 'Plasterboard RAL 9010',
        detail: 'Smooth plasterboard ceiling in pure white. A quiet backdrop for the cabinetry and stone below.',
      },
      {
        id: 'cab-upper', x: 65, y: 38,
        label: 'Upper cabinets',
        material: 'ONESKIN — Tortora',
        detail: 'ONESKIN cabinet finish in Tortora on the upper run — a warm muted taupe. Matte texture that diffuses light and resists fingerprints.',
        url: 'https://www.oneskin.pt/products_sub/tortora-1',
      },
      {
        id: 'backsplash', x: 48, y: 47,
        label: 'Backsplash',
        material: 'COSENTINO — Dekton Keena',
        detail: 'Ultracompact Dekton in Keena, with soft marble veining. Heat-, stain- and scratch-resistant for an everyday-tough work surface.',
        url: 'https://www.cosentino.com/pt-pt/cores/dekton/keena/',
      },
      {
        id: 'faucet', x: 76, y: 53,
        label: 'Faucet',
        material: 'BRUMA — Chrome',
        detail: 'BRUMA single-lever kitchen mixer with high swivel spout. Ceramic cartridge for precise flow and temperature.',
        url: 'https://www.bruma.pt/?page=products&prod=6625',
      },
      {
        id: 'countertop', x: 32, y: 60,
        label: 'Countertop',
        material: 'COSENTINO — Dekton Keena',
        detail: 'Countertop in the same Dekton Keena as the backsplash. One material, one continuous surface from horizontal to vertical.',
        url: 'https://www.cosentino.com/pt-pt/cores/dekton/keena/',
      },
      {
        id: 'cab-lower', x: 78, y: 72,
        label: 'Lower cabinets',
        material: 'ONESKIN — Sunny White',
        detail: 'ONESKIN cabinet finish in Sunny White on the lower run. A soft, warm white that reflects daylight without going clinical.',
        url: 'https://www.oneskin.pt/products_sub/sunny-white',
      },
      {
        id: 'flooring', x: 60, y: 92,
        label: 'Flooring',
        material: 'Pine — Staggered lay',
        detail: 'Solid pine flooring laid in a staggered (offset) pattern. Random plank lengths add rhythm and grounded warmth underfoot.',
      },
    ],
  },
];
