/* global React */
const { useState, useEffect, useRef } = React;

// ============================================================
// Design tokens -shared with homepage
// ============================================================
const C = {
  ink: '#1F2022',
  green: '#5C6457',
  clearGreen: '#B1B4A9',
  bege: '#EEE8DA',
  grey: '#EAECEB',
  terracota: '#974315',
  white: '#FFFFFF',
};

// ============================================================
// Project data -single source of truth
// ============================================================
const PROJECTS = {
  'lir-725': {
    name: 'Lir 725',
    location: 'Porto, Portugal',
    tagline: '[Tagline]',
    hero: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/04/Tardoz_Sunset-scaled.png',
    heroVideo: 'assets/hero-project.mp4',
    render: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mattis vel risus a euismod. Nulla id egestas elit. Aliquam pretium posuere risus, in vestibulum arcu semper ac. Vestibulum nec enim at odio accumsan euismod sed et nisl. Maecenas posuere malesuada dolor nec tincidunt. Donec placerat dignissim diam volutpat pretium. Nunc eget vestibulum ex, ut porttitor lectus. Cras tristique elit ultricies, suscipit lorem eu, fermentum odio. Pellentesque sodales scelerisque neque vitae rutrum.',
    descriptionExtra: 'Cras ullamcorper finibus turpis. Aliquam erat volutpat. Integer imperdiet arcu et tincidunt venenatis. Cras ultricies nec odio quis ullamcorper. Aenean posuere magna eu enim volutpat, ut efficitur magna dapibus. Vivamus et maximus nisl. Donec lacinia risus at placerat tempor. Morbi in maximus dui, a feugiat arcu.',
    stats: [
      { label: 'Units', value: '[TBD]' },
      { label: 'Typologies', value: '[TBD]' },
      { label: 'Location', value: 'Porto' },
      { label: 'Status', value: '[TBD]' },
      { label: 'Architecture', value: '[TBD]' },
      { label: 'Area', value: '[TBD]' },
    ],
    galleries: {
      interior: [
        {
          name: 'Casas de Banho',
          images: [
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920&q=80',
            'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1920&q=80',
          ],
        },
        {
          name: 'Cozinhas',
          images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80',
          ],
        },
        {
          name: 'Quartos',
          images: [
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1920&q=80',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80',
          ],
        },
      ],
      exterior: [
        {
          name: 'Jardim',
          images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
            'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1920&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
          ],
        },
        {
          name: 'Estacionamento',
          images: [
            'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1920&q=80',
            'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1920&q=80',
          ],
        },
      ],
    },
    rooms: [
      {
        name: 'Sala',
        area: '42 m²',
        detail: 'Luz natural que atravessa toda a divisão. Pé direito generoso e acabamentos de excelência.',
        images: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
        ],
      },
      {
        name: 'Jardim',
        area: '85 m²',
        detail: 'Espaço exterior privativo com paisagismo integrado. O prolongamento natural da sala.',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
        ],
      },
      {
        name: 'Suite Master',
        area: '28 m²',
        detail: 'Refúgio privado com closet integrado e casa de banho com luz zenital.',
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1920&q=80',
        ],
      },
    ],
    typologies: [
      { type: 'T1', area: '[TBD] m²', bedrooms: 1, wc: 1, disposicao: 'Sala + Cozinha open space, 1 Quarto, 1 WC, Varanda', planta: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', description: '[Description - to be provided]' },
      { type: 'T2', area: '[TBD] m²', bedrooms: 2, wc: 2, disposicao: 'Sala + Cozinha open space, 2 Quartos (1 suite), 2 WC, Varanda', planta: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', description: '[Description - to be provided]' },
      { type: 'T3', area: '[TBD] m²', bedrooms: 3, wc: 3, disposicao: 'Sala, Cozinha, 3 Quartos (1 suite), 3 WC, Varanda, Lugar de garagem', planta: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', description: '[Description - to be provided]' },
      { type: 'T4', area: '[TBD] m²', bedrooms: 4, wc: 4, disposicao: 'Sala, Cozinha, 4 Quartos (1 suite), 4 WC, Terraço, 2 Lugares de garagem', planta: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&q=80', description: '[Description - to be provided]' },
    ],
    locationInfo: {
      address: '[Address - to be provided]',
      phone: '[TBD]',
      mapCoords: '41.1496,-8.6110',
      mapZoom: 15,
      highlights: [
        { icon: 'transport', label: '[TBD]', detail: '[TBD]' },
        { icon: 'park', label: '[TBD]', detail: '[TBD]' },
        { icon: 'school', label: '[TBD]', detail: '[TBD]' },
        { icon: 'shopping', label: '[TBD]', detail: '[TBD]' },
        { icon: 'hospital', label: '[TBD]', detail: '[TBD]' },
        { icon: 'river', label: '[TBD]', detail: '[TBD]' },
      ],
    },
  },
  'villas-sto-tirso': {
    name: 'Villas Sto. Tirso',
    location: 'Santo Tirso, Portugal',
    tagline: '[Tagline]',
    hero: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/Comp-1-scaled-1.jpg',
    heroVideo: 'assets/hero-project.mp4',
    render: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mattis vel risus a euismod. Nulla id egestas elit. Aliquam pretium posuere risus, in vestibulum arcu semper ac. Vestibulum nec enim at odio accumsan euismod sed et nisl. Maecenas posuere malesuada dolor nec tincidunt. Donec placerat dignissim diam volutpat pretium. Nunc eget vestibulum ex, ut porttitor lectus. Cras tristique elit ultricies, suscipit lorem eu, fermentum odio. Pellentesque sodales scelerisque neque vitae rutrum.',
    descriptionExtra: 'Cras ullamcorper finibus turpis. Aliquam erat volutpat. Integer imperdiet arcu et tincidunt venenatis. Cras ultricies nec odio quis ullamcorper. Aenean posuere magna eu enim volutpat, ut efficitur magna dapibus. Vivamus et maximus nisl. Donec lacinia risus at placerat tempor. Morbi in maximus dui, a feugiat arcu.',
    stats: [
      { label: 'Units', value: '[TBD]' },
      { label: 'Typologies', value: '[TBD]' },
      { label: 'Location', value: 'Santo Tirso' },
      { label: 'Status', value: '[TBD]' },
      { label: 'Architecture', value: '[TBD]' },
      { label: 'Plot', value: '[TBD]' },
    ],
    galleries: {
      interior: [
        {
          name: 'Casas de Banho',
          images: [
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80',
            'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1920&q=80',
          ],
        },
        {
          name: 'Cozinhas',
          images: [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
          ],
        },
        {
          name: 'Quartos',
          images: [
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1920&q=80',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1920&q=80',
          ],
        },
      ],
      exterior: [
        {
          name: 'Jardim',
          images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
            'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1920&q=80',
          ],
        },
        {
          name: 'Estacionamento',
          images: [
            'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1920&q=80',
            'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1920&q=80',
          ],
        },
      ],
    },
    rooms: [
      {
        name: 'Sala',
        area: '38 m²',
        detail: 'Amplitude e luminosidade definem o espaço central desta moradia.',
        images: [
          'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1920&q=80',
          'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1920&q=80',
        ],
      },
      {
        name: 'Jardim',
        area: '120 m²',
        detail: 'Jardim privativo generoso, pensado para momentos em família.',
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
          'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1920&q=80',
        ],
      },
      {
        name: 'Suite Master',
        area: '24 m²',
        detail: 'Suite com acesso direto ao jardim e acabamentos premium.',
        images: [
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1920&q=80',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1920&q=80',
        ],
      },
    ],
    typologies: [
      { type: 'T3', area: '[TBD] m²', bedrooms: 3, wc: 3, disposicao: 'Sala, Cozinha, 3 Quartos (1 suite), 3 WC, Jardim privativo, Lugar de garagem', planta: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', description: '[Description - to be provided]' },
      { type: 'T4', area: '[TBD] m²', bedrooms: 4, wc: 4, disposicao: 'Sala, Cozinha, 4 Quartos (1 suite), 4 WC, Jardim privativo, Terraço, 2 Lugares de garagem', planta: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&q=80', description: '[Description - to be provided]' },
    ],
    locationInfo: {
      address: '[Address - to be provided]',
      phone: '[TBD]',
      mapCoords: '41.3411,-8.4770',
      mapZoom: 14,
      highlights: [
        { icon: 'transport', label: '[TBD]', detail: '[TBD]' },
        { icon: 'park', label: '[TBD]', detail: '[TBD]' },
        { icon: 'school', label: '[TBD]', detail: '[TBD]' },
        { icon: 'shopping', label: '[TBD]', detail: '[TBD]' },
        { icon: 'hospital', label: '[TBD]', detail: '[TBD]' },
        { icon: 'river', label: '[TBD]', detail: '[TBD]' },
      ],
    },
  },
};

// ============================================================
// Hooks
// ============================================================
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(48px)';
    el.style.transition = 'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ============================================================
// Shared button with left-to-right fill hover
// ============================================================
function FillButton({ children, href, onClick, variant = 'solid', style = {} }) {
  const isSolid = variant === 'solid';
  const baseStyle = {
    position: 'relative', overflow: 'hidden',
    display: 'inline-block',
    padding: '16px 36px',
    fontWeight: isSolid ? 600 : 500, fontSize: 12, letterSpacing: '0.2em',
    textTransform: 'uppercase', textDecoration: 'none',
    borderRadius: 40,
    cursor: 'pointer', border: 'none',
    transition: 'border-color 0.4s ease',
    ...(isSolid
      ? { background: C.terracota, color: C.white }
      : { background: 'transparent', color: C.bege, border: '1px solid rgba(238,232,218,0.25)' }
    ),
    ...style,
  };

  const fillBg = isSolid ? 'rgba(255,255,255,0.15)' : 'rgba(238,232,218,0.08)';

  const handlers = {
    onMouseEnter: e => {
      const fill = e.currentTarget.querySelector('.fill-span');
      if (fill) fill.style.transform = 'translateX(0)';
      if (!isSolid) e.currentTarget.style.borderColor = 'rgba(238,232,218,0.5)';
    },
    onMouseLeave: e => {
      const fill = e.currentTarget.querySelector('.fill-span');
      if (fill) fill.style.transform = 'translateX(-101%)';
      if (!isSolid) e.currentTarget.style.borderColor = 'rgba(238,232,218,0.25)';
    },
  };

  const inner = (
    <>
      <span className="fill-span" style={{
        position: 'absolute', inset: 0,
        background: fillBg,
        transform: 'translateX(-101%)',
        transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        borderRadius: 'inherit', pointerEvents: 'none',
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </>
  );

  if (href) {
    return <a href={href} style={baseStyle} {...handlers}>{inner}</a>;
  }
  return <button onClick={onClick} style={baseStyle} {...handlers}>{inner}</button>;
}

// ============================================================
// Location icons
// ============================================================
function LocationIcon({ type }) {
  const s = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    transport: <svg {...s}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    park: <svg {...s}><path d="M12 22V8" /><path d="M5 12s2-4 7-4 7 4 7 4" /><path d="M7 18s1.5-3 5-3 5 3 5 3" /></svg>,
    school: <svg {...s}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" /></svg>,
    shopping: <svg {...s}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>,
    hospital: <svg {...s}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
    river: <svg {...s}><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /></svg>,
  };
  return icons[type] || icons.park;
}

// ============================================================
// Menu components -shared with homepage
// ============================================================
function MenuSubLink({ label, subtitle, href, onClose }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href || '#'}
      onClick={(e) => {
        if (href && !href.startsWith('http')) {
          // Let the browser navigate to index.html#section
        } else {
          e.preventDefault();
        }
        onClose();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none',
        padding: '12px 0',
        transition: 'opacity 0.3s',
        opacity: hovered ? 0.7 : 1,
      }}
    >
      <span style={{
        fontWeight: 400, fontSize: 15, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: C.bege,
        position: 'relative', display: 'inline-block',
      }}>
        {label}
        <span style={{
          position: 'absolute', left: 0, bottom: -1, height: 1,
          background: C.bege, width: hovered ? '100%' : '0%',
          transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }} />
      </span>
      {subtitle && (
        <span style={{
          display: 'block', fontWeight: 300, fontSize: 12, letterSpacing: '0.06em',
          color: 'rgba(238,232,218,0.5)', marginTop: 2,
        }}>{subtitle}</span>
      )}
    </a>
  );
}

function MenuLink({ label, href, onClose, hasChildren, children }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleClick = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setExpanded(!expanded);
    } else {
      // Navigate to homepage section
      if (href) {
        // Let browser follow the link naturally
      } else {
        e.preventDefault();
      }
      onClose();
    }
  };

  return (
    <div>
      <a
        href={href || '#'}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontWeight: 400, fontSize: 28, letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: C.bege, textDecoration: 'none',
          padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'opacity 0.3s',
          opacity: hovered ? 0.7 : 1,
          borderBottom: '1px solid rgba(238,232,218,0.15)',
          position: 'relative',
        }}
      >
        <span style={{ position: 'relative', display: 'inline-block' }}>
          {label}
          <span style={{
            position: 'absolute', left: 0, bottom: -2, height: 1,
            background: C.bege, width: hovered ? '100%' : '0%',
            transition: 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          }} />
        </span>
        {hasChildren && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.bege} strokeWidth="1"
            style={{ transition: 'transform 0.3s ease', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', marginLeft: 12, flexShrink: 0 }}>
            <polyline points="2,5 7,10 12,5" />
          </svg>
        )}
      </a>
      {hasChildren && (
        <div style={{
          maxHeight: expanded ? 200 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          paddingLeft: 16,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

function MenuDrawer({ open, onClose }) {
  return (
    <>
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 199,
          background: 'rgba(0,0,0,0.45)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
        }}
      />
      {/* Side drawer from right */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: Math.min(420, window.innerWidth),
        maxWidth: '100vw',
        zIndex: 201,
        background: C.green,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 56px 48px',
        overflowY: 'auto',
      }}>
        {/* Top: close button + logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 72 }}>
            <img
              src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png"
              alt="Orma" style={{ height: 22, width: 'auto', display: 'block', opacity: 0.8 }}
            />
            <button onClick={onClose} style={{
              background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 8,
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={C.bege} strokeWidth="1" strokeLinecap="round">
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <MenuLink label="Projects" href="index.html#projects" onClose={onClose} hasChildren>
              <MenuSubLink label="Lir 725" subtitle="Porto" href="project.html?id=lir-725" onClose={onClose} />
              <MenuSubLink label="Villas Sto. Tirso" subtitle="Santo Tirso" href="project.html?id=villas-sto-tirso" onClose={onClose} />
            </MenuLink>
            <MenuLink label="About" href="index.html#about" onClose={onClose} />
            <MenuLink label="Consultancy" href="consultancy.html" onClose={onClose} />
            <MenuLink label="Contact" href="index.html#contact" onClose={onClose} />
          </nav>
        </div>

        {/* Bottom: contact info */}
        <div style={{ borderTop: '1px solid rgba(238,232,218,0.15)', paddingTop: 32 }}>
          <p style={{
            fontWeight: 300,
            fontSize: 13, lineHeight: 1.7, letterSpacing: '0.03em',
            color: 'rgba(238,232,218,0.6)', margin: 0,
          }}>
            Porto - Santo Tirso<br />
            geral@orma.pt
          </p>
        </div>
      </div>
    </>
  );
}

// ============================================================
// Nav -global menu (same as homepage)
// ============================================================
function ProjectNav({ projectName }) {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(true);
  const [inHero, setInHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const heroH = window.innerHeight;
      setInHero(y < heroH * 0.85);
      if (y < heroH * 0.5) {
        setVisible(true);
      } else if (y < lastScroll.current) {
        setVisible(true);
      } else if (y > lastScroll.current + 10) {
        setVisible(false);
      }
      lastScroll.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 80,
        padding: isMobile ? '0 20px' : '0 48px',
        background: inHero ? 'transparent' : 'rgba(92,100,87,0.95)',
        backdropFilter: inHero ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: inHero ? 'none' : 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 150,
        transform: visible || menuOpen ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease',
      }}>
        {/* Logo -links to homepage */}
        <a href="index.html" style={{ display: 'block', lineHeight: 0 }}>
          <img
            src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png"
            alt="Orma"
            style={{ height: 28, width: 'auto', display: 'block' }}
          />
        </a>

        {/* Hamburger icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: 8,
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-end', justifyContent: 'center',
            gap: 7, width: 48, height: 48,
          }}
          aria-label="Menu"
        >
          <span style={{ display: 'block', width: 32, height: 1.5, background: C.bege, transition: 'all 0.3s' }} />
          <span style={{ display: 'block', width: 24, height: 1.5, background: C.bege, transition: 'all 0.3s' }} />
          <span style={{ display: 'block', width: 32, height: 1.5, background: C.bege, transition: 'all 0.3s' }} />
        </button>
      </nav>
    </>
  );
}

// ============================================================
// Brochure download box — always visible on hero
// ============================================================
function BrochureBox({ projectName }) {
  const isMobile = useIsMobile();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePhone = (e) => {
    const val = e.target.value.replace(/[^0-9+\-\s()]/g, '');
    setForm({ ...form, telefone: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    const digits = form.telefone.replace(/\D/g, '');
    if (digits.length < 9) return;
    setSubmitted(true);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 6,
    color: C.white,
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 400,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  if (submitted) {
    return (
      <div style={{
        flex: '0 0 auto',
        width: isMobile ? '100%' : 280,
        background: 'rgba(31,32,34,0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 14,
        padding: '24px 20px',
        marginTop: isMobile ? 28 : 0,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
        <p style={{ color: C.white, fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>
          Obrigado!
        </p>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
          O download vai começar automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      flex: '0 0 auto',
      width: isMobile ? '100%' : 280,
      background: 'rgba(31,32,34,0.65)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 14,
      padding: '20px 18px',
      marginTop: isMobile ? 28 : 0,
    }}>
      <p style={{
        fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.5)', fontWeight: 600, margin: '0 0 4px',
      }}>Brochura</p>
      <p style={{
        fontSize: 15, fontWeight: 300, color: C.white, margin: '0 0 14px', lineHeight: 1.3,
      }}>
        Receba os detalhes do {projectName || 'projecto'}
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="text" placeholder="Nome" required
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.45)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
        />
        <input
          type="email" placeholder="Email" required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.45)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
        />
        <input
          type="tel" placeholder="Telefone" required
          inputMode="numeric"
          pattern="[\d\s+\-()]{9,}"
          value={form.telefone}
          onChange={handlePhone}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.45)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
        />

        <label style={{
          display: 'flex', alignItems: 'center', gap: 6,
          cursor: 'pointer', marginTop: 2,
        }}>
          <input
            type="checkbox" checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            style={{ accentColor: C.green, flexShrink: 0 }}
          />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
            Aceito os termos e a política de privacidade.
          </span>
        </label>

        <button type="submit" disabled={!agreed} style={{
          marginTop: 4,
          width: '100%',
          padding: '12px 0',
          background: agreed ? C.green : 'rgba(92,100,87,0.4)',
          color: C.white,
          border: 'none',
          borderRadius: 40,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontFamily: 'inherit',
          cursor: agreed ? 'pointer' : 'not-allowed',
          transition: 'background 0.25s, opacity 0.25s',
          opacity: agreed ? 1 : 0.6,
        }}>
          Download Brochura
        </button>
      </form>
    </div>
  );
}

// ============================================================
// 1. Project Hero -full-bleed image with overlay text
// ============================================================
function ProjectHero({ project }) {
  const isMobile = useIsMobile();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <>
    {/* Fixed hero -content scrolls over it */}
    <section style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      zIndex: 1,
    }}>
      {/* Background video (or image fallback) */}
      {project.heroVideo ? (
        <video
          autoPlay muted loop playsInline
          poster={project.hero}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'brightness(1.1)',
          }}
        >
          <source src={project.heroVideo} type="video/mp4" />
        </video>
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(' + project.hero + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(31,32,34,0.15) 0%, rgba(31,32,34,0.55) 100%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        zIndex: 2,
        padding: isMobile ? '0 24px 48px' : '0 80px 80px',
        display: isMobile ? 'block' : 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 40,
      }}>
        <div style={{ maxWidth: 900, flex: '1 1 auto' }}>
          <div style={{
            fontSize: 12, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase', fontWeight: 600, marginBottom: 16,
          }}>
            {project.location}
          </div>
          <h1 style={{
            fontWeight: 300, fontSize: isMobile ? 48 : 80, lineHeight: 1.0,
            letterSpacing: '-0.02em', color: C.white, margin: 0,
          }}>
            {project.name}
          </h1>
          <p style={{
            fontWeight: 300, fontSize: isMobile ? 18 : 22, lineHeight: 1.5,
            color: 'rgba(255,255,255,0.8)', margin: '20px 0 0',
            maxWidth: 560, fontStyle: 'italic',
          }}>
            {project.tagline}
          </p>
        </div>

        {/* Brochure download box */}
        <BrochureBox projectName={project.name} />
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: isMobile ? 16 : 28,
        left: '50%', transform: 'translateX(-50%)',
        zIndex: 2, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 8, opacity: 0.5,
      }}>
        <div style={{
          width: 1, height: 32, background: C.white,
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
    {/* Spacer so content starts after hero */}
    <div style={{ height: '100vh' }} />
    </>
  );
}

// ============================================================
// 3. ConceptRender — concept text left + render image right
// ============================================================

function ConceptRender({ project }) {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  // GSAP animations
  useEffect(() => {
    if (typeof gsap === 'undefined' || !gsap.registerPlugin) return;
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const triggers = [];

    // Text column — staggered fade up
    if (textRef.current) {
      const children = textRef.current.querySelectorAll('.cr-animate');
      if (children.length) {
        const t = gsap.fromTo(children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12,
            scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );
        triggers.push(t.scrollTrigger);
      }
    }

    // Render image — parallax + fade
    if (imageRef.current && !isMobile) {
      const t = gsap.fromTo(imageRef.current,
        { yPercent: 8, opacity: 0, scale: 1.03 },
        { yPercent: -4, opacity: 1, scale: 1, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 85%', end: 'bottom 20%', scrub: 0.5 }
        }
      );
      triggers.push(t.scrollTrigger);
    } else if (imageRef.current) {
      const t = gsap.fromTo(imageRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: imageRef.current, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
      triggers.push(t.scrollTrigger);
    }

    return () => triggers.forEach(t => t && t.kill());
  }, [isMobile]);

  return (
    <section ref={sectionRef} style={{
      background: C.bege,
      padding: isMobile ? '64px 24px 72px' : '120px 80px 140px',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: isMobile ? 'flex' : 'grid',
        flexDirection: 'column',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr',
        gap: isMobile ? 48 : 80,
        alignItems: 'center',
      }}>
        {/* LEFT — Concept text only */}
        <div ref={textRef}>
          <div className="cr-animate" style={{
            fontSize: 12, letterSpacing: '0.3em', color: C.terracota,
            textTransform: 'uppercase', fontWeight: 600, marginBottom: 20, opacity: 0,
          }}>
            O Conceito
          </div>

          <h2 className="cr-animate" style={{
            fontWeight: 300, fontSize: isMobile ? 32 : 48, lineHeight: 1.2,
            letterSpacing: '-0.02em', color: C.ink, margin: '0 0 28px', opacity: 0,
          }}>
            {project.name}
          </h2>

          {project.description && (
            <p className="cr-animate" style={{
              fontSize: isMobile ? 15 : 16, lineHeight: 1.85, color: C.green,
              margin: 0, opacity: 0, maxWidth: 520,
            }}>
              {project.description}
            </p>
          )}
        </div>

        {/* RIGHT — Render image */}
        <div ref={imageRef} style={{
          width: '100%',
          aspectRatio: isMobile ? '4/3' : '3/4',
          overflow: 'hidden',
          borderRadius: 4,
          opacity: 0,
        }}>
          <img
            src={project.hero}
            alt={project.name + ' render'}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>
    </section>
  );
}

function GalleryColumn({ title, categories, side, triggerStart, typologies }) {
  const isMobile = useIsMobile();
  const [activeCat, setActiveCat] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const columnRef = useRef(null);
  const imgRef = useRef(null);
  const imgWrapRef = useRef(null);

  const cat = categories[activeCat];
  const images = cat ? cat.images : [];
  const total = images.length;

  // Slide direction: interior enters from left, exterior from right
  const fromLeft = side === 'interior';
  const slideX = fromLeft ? -80 : 80;

  // GSAP entrance — own ScrollTrigger per column
  useEffect(() => {
    if (typeof gsap === 'undefined' || !columnRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: columnRef.current,
          start: triggerStart || 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Whole column slides in from its side + fades
      tl.fromTo(columnRef.current,
        { opacity: 0, x: slideX },
        { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' },
        0
      );

      // Title label — slides in slightly ahead
      const label = columnRef.current.querySelector('.gc-label');
      if (label) {
        tl.fromTo(label,
          { opacity: 0, x: fromLeft ? -20 : 20 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
          0.1
        );
      }

      // Tabs stagger in
      const tabs = columnRef.current.querySelectorAll('.gc-tab');
      if (tabs.length) {
        tl.fromTo(tabs,
          { opacity: 0, y: 14, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)', stagger: 0.06 },
          0.2
        );
      }

      // Image — clip-path curtain from the column's side + Ken Burns
      if (imgWrapRef.current) {
        const clipFrom = fromLeft ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)';
        tl.fromTo(imgWrapRef.current,
          { clipPath: clipFrom },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut' },
          0.25
        );
        if (imgRef.current) {
          tl.fromTo(imgRef.current,
            { scale: 1.2 },
            { scale: 1, duration: 1.6, ease: 'power2.out' },
            0.25
          );
        }
      }

      // Category label below
      const catLabel = columnRef.current.querySelector('.gc-cat-label');
      if (catLabel) {
        tl.fromTo(catLabel,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          1.0
        );
      }
    }, columnRef.current);
    return () => ctx.revert();
  }, []);

  // Category switch — cinematic crossfade with curtain
  const switchCat = (i) => {
    if (i === activeCat) return;
    if (imgWrapRef.current && typeof gsap !== 'undefined') {
      const tl = gsap.timeline();
      tl.to(imgWrapRef.current, {
        clipPath: fromLeft ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
        duration: 0.35, ease: 'power2.in',
        onComplete: () => { setActiveCat(i); setImgIdx(0); }
      });
      tl.call(() => {
        requestAnimationFrame(() => {
          if (imgRef.current) gsap.set(imgRef.current, { scale: 1.1 });
          gsap.fromTo(imgWrapRef.current,
            { clipPath: fromLeft ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.out' }
          );
          if (imgRef.current) gsap.to(imgRef.current, { scale: 1, duration: 0.8, ease: 'power2.out' });
        });
      }, null, '+=0.05');
    } else {
      setActiveCat(i); setImgIdx(0);
    }
  };

  // Image navigation
  const navImg = (dir) => {
    if (total <= 1 || !imgRef.current || typeof gsap === 'undefined') return;
    const next = ((imgIdx + dir) % total + total) % total;
    gsap.to(imgRef.current, {
      x: -dir * 60, opacity: 0, scale: 0.95, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        setImgIdx(next);
        requestAnimationFrame(() => {
          if (imgRef.current) gsap.fromTo(imgRef.current,
            { x: dir * 60, opacity: 0, scale: 1.05 },
            { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
          );
        });
      },
    });
  };

  // Lightbox
  const openLb = () => {
    setLightbox(imgIdx);
    requestAnimationFrame(() => {
      const ov = document.querySelector('.gal-lb-' + side);
      const img = document.querySelector('.gal-lb-img-' + side);
      if (ov && typeof gsap !== 'undefined') {
        gsap.fromTo(ov, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
        if (img) gsap.fromTo(img, { scale: 0.88, y: 30 }, { scale: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.08 });
      }
    });
  };
  const closeLb = () => {
    const ov = document.querySelector('.gal-lb-' + side);
    if (ov && typeof gsap !== 'undefined') {
      gsap.to(ov, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => setLightbox(null) });
    } else setLightbox(null);
  };
  const navLb = (dir) => {
    const img = document.querySelector('.gal-lb-img-' + side);
    if (img && typeof gsap !== 'undefined') {
      gsap.to(img, { x: -dir * 50, opacity: 0, scale: 0.95, duration: 0.22, ease: 'power2.in', onComplete: () => {
        setLightbox(p => ((p + dir) % total + total) % total);
        requestAnimationFrame(() => {
          const ni = document.querySelector('.gal-lb-img-' + side);
          if (ni) gsap.fromTo(ni, { x: dir * 50, opacity: 0, scale: 1.05 }, { x: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
        });
      }});
    }
  };

  const lbBtnStyle = { background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' };

  const arrowBtn = (s) => ({
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [s]: isMobile ? 10 : 16, zIndex: 5,
    width: isMobile ? 34 : 40, height: isMobile ? 34 : 40, borderRadius: '50%',
    background: 'rgba(255,255,255,0.85)', border: 'none',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    opacity: total > 1 ? 1 : 0,
    pointerEvents: total > 1 ? 'auto' : 'none',
  });

  return (
    <div ref={columnRef} style={{ flex: 1, minWidth: 0, opacity: 0 }}>
      {/* Lightbox */}
      {lightbox !== null && (
        <div className={'gal-lb-' + side} onClick={closeLb}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <button onClick={e => { e.stopPropagation(); closeLb(); }}
            style={{ ...lbBtnStyle, position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          {total > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); navLb(-1); }}
                style={{ ...lbBtnStyle, position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button onClick={e => { e.stopPropagation(); navLb(1); }}
                style={{ ...lbBtnStyle, position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 6 15 12 9 18"/></svg>
              </button>
            </>
          )}
          <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: '"General Sans", system-ui, sans-serif', letterSpacing: '0.1em' }}>
            {lightbox + 1} / {total}
          </div>
          <img className={'gal-lb-img-' + side} src={images[lightbox]} alt=""
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 4 }} />
        </div>
      )}

      {/* Title label */}
      <div className="gc-label" style={{ fontSize: 12, letterSpacing: '0.3em', color: C.terracota, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16, opacity: 0 }}>
        {title}
      </div>

      {/* Sub-category tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {categories.map((c, i) => (
          <button key={c.name} className="gc-tab" onClick={() => switchCat(i)}
            style={{
              padding: '10px 22px',
              background: activeCat === i ? C.ink : 'transparent',
              color: activeCat === i ? C.bege : C.ink,
              border: activeCat === i ? 'none' : '1px solid rgba(31,32,34,0.18)',
              borderRadius: 30, fontWeight: 500, fontSize: 12, letterSpacing: '0.08em',
              cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              fontFamily: '"General Sans", system-ui, sans-serif',
              opacity: 0,
            }}
            onMouseEnter={e => { if (activeCat !== i) { e.currentTarget.style.borderColor = 'rgba(31,32,34,0.5)'; e.currentTarget.style.background = 'rgba(31,32,34,0.04)'; } }}
            onMouseLeave={e => { if (activeCat !== i) { e.currentTarget.style.borderColor = 'rgba(31,32,34,0.18)'; e.currentTarget.style.background = 'transparent'; } }}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Image area with clip-path reveal */}
      <div ref={imgWrapRef} style={{
        position: 'relative', borderRadius: 12, overflow: 'hidden',
        height: isMobile ? 260 : 420, background: C.grey,
        clipPath: fromLeft ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)',
      }}>
        <button style={arrowBtn('left')} onClick={() => navImg(-1)}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; e.currentTarget.style.background = '#fff'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; }}>
          <svg width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button style={arrowBtn('right')} onClick={() => navImg(1)}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; e.currentTarget.style.background = '#fff'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; }}>
          <svg width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 6 15 12 9 18"/></svg>
        </button>
        {total > 1 && (
          <div style={{
            position: 'absolute', bottom: 14, right: 16, zIndex: 5,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 20, padding: '5px 14px', color: '#fff', fontSize: 11,
            letterSpacing: '0.1em', fontFamily: '"General Sans", system-ui, sans-serif', fontWeight: 500,
          }}>
            {imgIdx + 1} / {total}
          </div>
        )}
        <img
          ref={imgRef}
          src={images[imgIdx] || ''}
          alt={cat ? cat.name : ''}
          onClick={openLb}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            cursor: 'zoom-in', transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
            willChange: 'transform',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* Category name below image */}
      {/* Typology summary below image */}
      <div className="gc-cat-label" style={{ marginTop: 20, opacity: 0 }}>
        {cat && <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', color: C.ink, marginBottom: 10 }}>{cat.name}</div>}
        {typologies && typologies.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
            {typologies.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.terracota, letterSpacing: '0.04em' }}>{t.type}</span>
                <span style={{ fontSize: 12, color: 'rgba(31,32,34,0.5)', fontWeight: 400 }}>{t.area}</span>
                {i < typologies.length - 1 && <span style={{ color: 'rgba(31,32,34,0.15)', marginLeft: 4 }}>|</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Galleries({ project }) {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const dividerRef = useRef(null);
  const galleries = project.galleries;

  if (!galleries) return null;
  const interior = galleries.interior || [];
  const exterior = galleries.exterior || [];
  if (interior.length === 0 && exterior.length === 0) return null;

  // GSAP — title enters first, divider grows between the two columns
  useEffect(() => {
    if (typeof gsap === 'undefined' || !sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Title — enters early, before columns
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 88%', toggleActions: 'play none none none' }
          }
        );
      }
      // Divider line grows after Interior is visible
      if (dividerRef.current) {
        gsap.fromTo(dividerRef.current,
          { scaleY: 0 },
          { scaleY: 1, duration: 1.4, ease: 'power3.inOut',
            scrollTrigger: { trigger: dividerRef.current, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );
      }
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: C.bege, padding: isMobile ? '60px 24px 80px' : '100px 80px 120px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <h2 ref={titleRef} style={{
          fontWeight: 300, fontSize: isMobile ? 28 : 44, lineHeight: 1.2,
          letterSpacing: '-0.02em', color: C.ink, margin: '0 0 56px', opacity: 0,
        }}>
          Galeria <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.terracota }}>do projeto</em>
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 56 : 0,
          position: 'relative',
        }}>
          {interior.length > 0 && (
            <div style={{ flex: 1, paddingRight: isMobile ? 0 : 36 }}>
              <GalleryColumn title="Interior" categories={interior} side="interior" triggerStart="top 78%" typologies={project.typologies} />
            </div>
          )}
          {/* Vertical divider line */}
          {!isMobile && interior.length > 0 && exterior.length > 0 && (
            <div ref={dividerRef} style={{
              width: 1, background: 'rgba(31,32,34,0.1)', alignSelf: 'stretch',
              transformOrigin: 'top center', flexShrink: 0,
            }} />
          )}
          {exterior.length > 0 && (
            <div style={{ flex: 1, paddingLeft: isMobile ? 0 : 36 }}>
              <GalleryColumn title="Exterior" categories={exterior} side="exterior" triggerStart={isMobile ? 'top 78%' : 'top 55%'} typologies={project.typologies} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 3c. PhotoCarousel — infinite loop, no white gaps
// ============================================================
function PhotoCarousel({ project }) {
  const isMobile = useIsMobile();
  const rooms = project.rooms || [];
  const allImages = rooms.flatMap(r => r.images || []);
  const images = allImages.length > 0 ? allImages : [];
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const animatingRef = useRef(false);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  if (images.length === 0) return null;
  const total = images.length;

  // Fixed pixel sizes — large enough that only 3 slides are visible
  const gap = isMobile ? 10 : 16;
  const trackH = isMobile ? 320 : 520;
  const slideW = isMobile ? 280 : 680; // each slide in px
  const step = slideW + gap; // distance per slide

  // Triple the images: [...images, ...images, ...images]
  // Start at the middle set so we can go left or right freely
  const tripled = [...images, ...images, ...images];
  const startOffset = total; // index into tripled where "real" set starts

  // Position track so that tripled[startOffset + current] is centered
  const getX = (idx) => {
    return -((startOffset + idx) * step);
  };

  // Set initial position centered
  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return;
    const containerW = containerRef.current.offsetWidth;
    const centerOffset = (containerW / 2) - (slideW / 2);
    trackRef.current.style.paddingLeft = centerOffset + 'px';
    trackRef.current.style.transform = 'translateX(' + getX(0) + 'px)';
  }, [isMobile]);

  const goTo = (idx) => {
    if (animatingRef.current || typeof gsap === 'undefined' || !trackRef.current) return;
    animatingRef.current = true;
    const targetX = getX(idx);

    gsap.to(trackRef.current, {
      x: targetX,
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete: () => {
        // Normalize: if we went past bounds, snap back to middle set
        const normalized = ((idx % total) + total) % total;
        if (idx !== normalized) {
          gsap.set(trackRef.current, { x: getX(normalized) });
        }
        setCurrent(normalized);
        animatingRef.current = false;
      }
    });
  };

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  // Scroll entrance
  useEffect(() => {
    if (typeof gsap === 'undefined' || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: '0% 85%', toggleActions: 'play none none none' }
        }
      );
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  // Arrow style
  const arrowBtn = (side) => ({
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: isMobile ? 8 : 20, zIndex: 10,
    width: isMobile ? 32 : 48, height: isMobile ? 32 : 48,
    borderRadius: '50%', background: isMobile ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.8)', border: 'none',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', transition: 'all 0.3s ease',
  });
  const arrowSvg = (dir) => (
    <svg width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {dir === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 6 15 12 9 18" />}
    </svg>
  );

  // Lightbox
  const openLightbox = (idx) => {
    setLightbox(((idx % total) + total) % total);
    requestAnimationFrame(() => {
      const ov = document.querySelector('.pc-lightbox');
      const img = document.querySelector('.pc-lb-img');
      if (ov && typeof gsap !== 'undefined') {
        gsap.fromTo(ov, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
        if (img) gsap.fromTo(img, { scale: 0.9, y: 20 }, { scale: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.08 });
      }
    });
  };
  const closeLightbox = () => {
    const ov = document.querySelector('.pc-lightbox');
    if (ov && typeof gsap !== 'undefined') {
      gsap.to(ov, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => setLightbox(null) });
    } else setLightbox(null);
  };
  const navLightbox = (dir) => {
    const img = document.querySelector('.pc-lb-img');
    if (img && typeof gsap !== 'undefined') {
      gsap.to(img, { x: -dir * 40, opacity: 0, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          setLightbox(p => ((p + dir) % total + total) % total);
          requestAnimationFrame(() => {
            const ni = document.querySelector('.pc-lb-img');
            if (ni) gsap.fromTo(ni, { x: dir * 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
          });
        }
      });
    }
  };
  const renderLightbox = () => {
    if (lightbox === null) return null;
    return (
      <div className="pc-lightbox" onClick={closeLightbox}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
        <button onClick={e => { e.stopPropagation(); closeLightbox(); }}
          style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <button onClick={e => { e.stopPropagation(); navLightbox(-1); }}
          style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button onClick={e => { e.stopPropagation(); navLightbox(1); }}
          style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 6 15 12 9 18"/></svg>
        </button>
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: '"General Sans", system-ui, sans-serif', letterSpacing: '0.1em' }}>
          {lightbox + 1} / {total}
        </div>
        <img className="pc-lb-img" src={images[lightbox]} alt=""
          style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 4 }} />
      </div>
    );
  };

  return (
    <section ref={sectionRef} style={{ padding: isMobile ? '20px 0' : '80px 0', background: C.bege, overflow: 'hidden', position: 'relative' }}>
      {renderLightbox()}
      <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
        <button style={arrowBtn('left')} onClick={prev}
          onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}>
          {arrowSvg('left')}
        </button>
        <button style={arrowBtn('right')} onClick={next}
          onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}>
          {arrowSvg('right')}
        </button>

        {/* Viewport — clips overflow */}
        <div style={{ overflow: 'hidden', height: trackH }}>
          {/* Continuous track — tripled images, never runs out */}
          <div ref={trackRef} style={{
            display: 'flex', alignItems: 'center',
            gap: gap,
            height: '100%',
            willChange: 'transform',
          }}>
            {tripled.map((src, i) => {
              // Which real image index is this?
              const realIdx = i % total;
              const isActive = (i === startOffset + current);
              return (
                <div
                  key={i}
                  onClick={() => { if (isActive) openLightbox(realIdx); }}
                  style={{
                    flex: '0 0 ' + slideW + 'px',
                    width: slideW,
                    height: isActive ? '100%' : '85%',
                    borderRadius: isMobile ? 10 : 14,
                    overflow: 'hidden',
                    cursor: isActive ? 'zoom-in' : 'default',
                    boxShadow: isActive ? '0 6px 32px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'height 0.65s cubic-bezier(0.4,0,0.2,1), box-shadow 0.5s ease',
                  }}
                >
                  <img src={src} alt="" loading="lazy"
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                    }}
                    onMouseOver={e => { if (isActive) e.currentTarget.style.transform = 'scale(1.03)'; }}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 4. Typologies — enriched tabs with m², disposição, planta
// ============================================================
function Typologies({ project }) {
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [lightbox, setLightbox] = useState(false);
  const typologies = project.typologies || [];

  if (typologies.length === 0) return null;
  const typo = typologies[active];

  const switchTypo = (i) => {
    if (i === active) return;
    if (contentRef.current && typeof gsap !== 'undefined') {
      gsap.to(contentRef.current, { opacity: 0, y: 10, duration: 0.22, ease: 'power2.in', onComplete: () => {
        setActive(i);
        requestAnimationFrame(() => {
          if (contentRef.current) gsap.fromTo(contentRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
        });
      }});
    } else {
      setActive(i);
    }
  };

  // GSAP scroll reveal
  useEffect(() => {
    if (typeof gsap === 'undefined' || !sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll('.typ-animate');
      gsap.fromTo(items,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: '0% 80%', toggleActions: 'play none none none' }
        }
      );
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  // Lightbox for planta
  const openLb = () => {
    setLightbox(true);
    requestAnimationFrame(() => {
      const ov = document.querySelector('.typ-planta-lb');
      const img = document.querySelector('.typ-planta-img');
      if (ov && typeof gsap !== 'undefined') {
        gsap.fromTo(ov, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
        if (img) gsap.fromTo(img, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'power3.out', delay: 0.08 });
      }
    });
  };
  const closeLb = () => {
    const ov = document.querySelector('.typ-planta-lb');
    if (ov && typeof gsap !== 'undefined') {
      gsap.to(ov, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => setLightbox(false) });
    } else setLightbox(false);
  };

  // Stat mini-block
  const StatBlock = ({ label, value, icon }) => (
    <div style={{ textAlign: 'center', minWidth: 80 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.clearGreen, fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 500, color: C.bege, letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );

  return (
    <section ref={sectionRef} style={{ background: C.green, padding: isMobile ? '80px 24px' : '140px 80px' }}>
      {/* Planta lightbox */}
      {lightbox && typo.planta && (
        <div className="typ-planta-lb" onClick={closeLb}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <button onClick={e => { e.stopPropagation(); closeLb(); }}
            style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img className="typ-planta-img" src={typo.planta} alt={'Planta ' + typo.type}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 4 }} />
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="typ-animate" style={{ fontSize: 12, letterSpacing: '0.3em', color: C.terracota, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
          Tipologias
        </div>
        <h2 className="typ-animate" style={{ fontWeight: 300, fontSize: isMobile ? 28 : 40, lineHeight: 1.2, letterSpacing: '-0.01em', color: C.bege, margin: '0 0 48px' }}>
          Encontre a tipologia <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.terracota }}>ideal.</em>
        </h2>

        {/* Typology tabs */}
        <div className="typ-animate" style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          {typologies.map((t, i) => (
            <button key={t.type} onClick={() => switchTypo(i)}
              style={{
                padding: '12px 28px',
                background: active === i ? C.bege : 'transparent',
                color: active === i ? C.ink : C.bege,
                border: active === i ? 'none' : '1px solid rgba(238,232,218,0.25)',
                borderRadius: 40, fontWeight: 500, fontSize: 13, letterSpacing: '0.1em',
                cursor: 'pointer', transition: 'all 0.3s ease',
              }}>
              {t.type}
            </button>
          ))}
        </div>

        {/* Typology content */}
        <div ref={contentRef} style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 32 : 64,
          alignItems: 'start',
        }}>
          {/* Left: info */}
          <div style={{ order: isMobile ? 2 : 0 }}>
            <h3 style={{ fontWeight: 500, fontSize: isMobile ? 36 : 52, color: C.bege, margin: 0, letterSpacing: '-0.02em' }}>
              {typo.type}
            </h3>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: isMobile ? 24 : 40, marginTop: 28, flexWrap: 'wrap' }}>
              <StatBlock label="Área" value={typo.area} />
              <StatBlock label="Quartos" value={typo.bedrooms} />
              <StatBlock label="WC" value={typo.wc} />
            </div>

            {/* Disposição */}
            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.clearGreen, fontWeight: 600, marginBottom: 10 }}>Disposição</div>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: 'rgba(238,232,218,0.75)', margin: 0, maxWidth: 480 }}>
                {typo.disposicao}
              </p>
            </div>

            {/* CTA */}
            <div style={{ marginTop: 40 }}>
              <FillButton
                href={'#contact'}
                onClick={e => { e.preventDefault(); const el = document.getElementById('project-contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                variant="outline"
                style={{ color: C.bege, border: '1px solid rgba(238,232,218,0.3)', borderRadius: 6, padding: '14px 36px' }}>
                Pedir informações
              </FillButton>
            </div>
          </div>

          {/* Right: planta image */}
          <div style={{ order: isMobile ? 1 : 0 }}>
            {typo.planta ? (
              <div
                onClick={openLb}
                style={{
                  position: 'relative', borderRadius: 10, overflow: 'hidden',
                  height: isMobile ? 260 : 400, cursor: 'zoom-in',
                  background: C.grey,
                }}>
                <div style={{
                  position: 'absolute', top: 14, left: 14, zIndex: 5,
                  background: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '5px 14px',
                  color: '#fff', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                  fontFamily: '"General Sans", system-ui, sans-serif', fontWeight: 600,
                }}>
                  Planta
                </div>
                <img
                  src={typo.planta}
                  alt={'Planta ' + typo.type}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            ) : (
              <div style={{
                height: isMobile ? 260 : 400, borderRadius: 10, background: 'rgba(238,232,218,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px dashed rgba(238,232,218,0.15)',
              }}>
                <span style={{ fontSize: 13, letterSpacing: '0.1em', color: 'rgba(238,232,218,0.3)', textTransform: 'uppercase' }}>Planta em breve</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 4b. Acabamentos — placeholder section
// ============================================================
function Acabamentos() {
  const isMobile = useIsMobile();
  const revealRef = useScrollReveal();

  const placeholders = [
    { label: 'Pavimentos', icon: 'M3 21h18M3 3h18M3 12h18M9 3v18M15 3v18' },
    { label: 'Cozinha', icon: 'M3 6h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6zM3 6V4a1 1 0 011-1h16a1 1 0 011 1v2M10 10h4' },
    { label: 'Casas de Banho', icon: 'M4 12h16M4 12a2 2 0 00-2 2v2a2 2 0 002 2h16a2 2 0 002-2v-2a2 2 0 00-2-2M6 12V6a2 2 0 012-2h1a2 2 0 012 2v6' },
    { label: 'Carpintarias', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  ];

  return (
    <section style={{ background: C.bege, padding: isMobile ? '60px 24px 80px' : '100px 80px 120px' }}>
      <div ref={revealRef} style={{ maxWidth: 1200, margin: '0 auto', willChange: 'opacity, transform' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.3em', color: C.terracota, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
          Acabamentos
        </div>
        <h2 style={{ fontWeight: 300, fontSize: isMobile ? 28 : 40, lineHeight: 1.2, letterSpacing: '-0.01em', color: C.ink, margin: '0 0 48px' }}>
          Detalhes que fazem <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.terracota }}>a diferença.</em>
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? 16 : 24,
        }}>
          {placeholders.map((p) => (
            <div key={p.label} style={{
              background: C.grey,
              borderRadius: 12,
              padding: isMobile ? '32px 20px' : '48px 28px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 16,
              border: '1px dashed rgba(31,32,34,0.1)',
              minHeight: isMobile ? 140 : 180,
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.clearGreen} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={p.icon} />
              </svg>
              <span style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, color: 'rgba(31,32,34,0.4)' }}>
                {p.label}
              </span>
              <span style={{ fontSize: 11, letterSpacing: '0.06em', color: 'rgba(31,32,34,0.25)', fontStyle: 'italic' }}>
                Em breve
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 5. Location - full-bleed map with overlay cards (LAGOM-style)
// ============================================================
function Location({ project }) {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const mapRef = useRef(null);
  const cardsRef = useRef(null);
  const loc = project.locationInfo;
  const [lat, lng] = (loc.mapCoords || '41.15,-8.61').split(',');

  /* GSAP ScrollTrigger - parallax map + card reveal */
  useEffect(() => {
    if (isMobile || !sectionRef.current || !mapRef.current || !cardsRef.current) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const ctx = gsap.context(() => {
      /* Map parallax — subtle vertical drift as section scrolls through */
      gsap.fromTo(mapRef.current,
        { yPercent: -6, opacity: 0 },
        {
          yPercent: 6,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );

      /* Cards — fade in + slide up as section enters viewport */
      const cards = cardsRef.current.children;
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  const mapSrc = 'https://maps.google.com/maps?q=' + lat + ',' + lng + '&t=&z=' + (loc.mapZoom || 15) + '&ie=UTF8&iwloc=&output=embed';

  /* ---- Mobile: simple stacked layout, no parallax ---- */
  if (isMobile) {
    return (
      <section style={{ width: '100%' }}>
        <div style={{ height: 350, position: 'relative' }}>
          <iframe src={mapSrc} width="100%" height="100%"
            style={{ border: 0, filter: 'saturate(0.85) brightness(1.02)' }}
            allowFullScreen="" loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={'Map - ' + project.name} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: C.white, padding: '32px 24px' }}>
            <h3 style={{ fontWeight: 500, fontSize: 22, color: C.ink, margin: '0 0 28px', letterSpacing: '-0.01em' }}>
              {project.name}
            </h3>
            <div style={{ padding: '20px 0', borderTop: '1px solid rgba(92,100,87,0.1)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.terracota} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.6 }}>{loc.address}</div>
                  <div style={{ fontSize: 13, color: C.clearGreen, marginTop: 2 }}>{project.location}</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 0', borderTop: '1px solid rgba(92,100,87,0.1)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.terracota} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span style={{ fontSize: 14, color: C.ink }}>{loc.phone}</span>
              </div>
            </div>
            <a href={'https://www.google.com/maps?q=' + lat + ',' + lng} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, color: C.terracota, textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em' }}>
              Ver no mapa
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    );
  }

  /* ---- Desktop: GSAP parallax map with floating cards ---- */
  return (
    <section ref={sectionRef} style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      zIndex: 2,
      background: C.bege,
    }}>
      {/* Map background - absolute, taller than section for parallax room */}
      <div ref={mapRef} style={{
        position: 'absolute',
        top: '-10%',
        left: 0,
        width: '100%',
        height: '120%',
        zIndex: 0,
        willChange: 'transform',
      }}>
        <iframe src={mapSrc} width="100%" height="100%"
          style={{ border: 0, filter: 'saturate(0.85) brightness(1.02)' }}
          allowFullScreen="" loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={'Map - ' + project.name} />
      </div>

      {/* Card overlays - positioned over the map */}
      <div ref={cardsRef} style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '80px 64px',
        gap: 24,
        pointerEvents: 'none',
      }}>
        {/* Left card - Address info */}
        <div style={{
          background: C.white,
          padding: '40px 36px',
          borderRadius: 8,
          maxWidth: 380,
          width: 380,
          pointerEvents: 'auto',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        }}>
          <h3 style={{
            fontWeight: 500, fontSize: 26,
            color: C.ink, margin: '0 0 28px',
            letterSpacing: '-0.01em',
          }}>
            {project.name}
          </h3>

          <div style={{ padding: '20px 0', borderTop: '1px solid rgba(92,100,87,0.1)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.terracota} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.6 }}>{loc.address}</div>
                <div style={{ fontSize: 13, color: C.clearGreen, marginTop: 2 }}>{project.location}</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '16px 0', borderTop: '1px solid rgba(92,100,87,0.1)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.terracota} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span style={{ fontSize: 14, color: C.ink }}>{loc.phone}</span>
            </div>
          </div>

          <a href={'https://www.google.com/maps?q=' + lat + ',' + lng} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16,
              color: C.terracota, textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em',
              transition: 'opacity 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Ver no mapa
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

          {loc.highlights && loc.highlights[0] && loc.highlights[0].label !== '[TBD]' && (
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(92,100,87,0.1)' }}>
              {loc.highlights.slice(0, 4).map((h) => (
                <div key={h.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', fontSize: 13, color: C.green,
                }}>
                  <span>{h.label}</span>
                  <span style={{ color: C.clearGreen, fontWeight: 500 }}>{h.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right card - Project image */}
        <div style={{
          background: C.white,
          borderRadius: 8,
          maxWidth: 380,
          width: 380,
          overflow: 'hidden',
          pointerEvents: 'auto',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          alignSelf: 'flex-start',
          marginTop: 60,
        }}>
          <div style={{ height: 220, overflow: 'hidden' }}>
            <img src={project.hero} alt={project.name} loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: '24px 28px' }}>
            <h4 style={{ fontWeight: 500, fontSize: 18, color: C.ink, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              {project.name}
            </h4>
            <FillButton href={'#'}
              onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ width: '100%', textAlign: 'center', display: 'block', padding: '14px 24px' }}>
              Ver projecto
            </FillButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 6. Project CTA -contact block specific to project
// ============================================================
function ProjectCTA({ project }) {
  const isMobile = useIsMobile();
  const revealRef = useScrollReveal();

  return (
    <section id="project-contact" style={{
      background: C.bege,
      padding: isMobile ? '80px 24px' : '120px 80px',
      position: 'relative',
    }}>
      {/* Thin top divider */}
      <div style={{ position: 'absolute', top: 0, left: isMobile ? 24 : 80, right: isMobile ? 24 : 80, height: 1, background: 'rgba(92,100,87,0.12)' }} />

      <div ref={revealRef} style={{
        maxWidth: 640, margin: '0 auto', textAlign: 'center',
        willChange: 'opacity, transform',
      }}>
        <h2 style={{
          fontWeight: 300, fontSize: isMobile ? 28 : 42, lineHeight: 1.2,
          letterSpacing: '-0.01em', color: C.ink, margin: '0 0 16px',
        }}>
          Interessado no <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.terracota }}>{project.name}</em>?
        </h2>
        <p style={{
          fontSize: 15, lineHeight: 1.8, color: C.green,
          margin: '0 auto 40px', maxWidth: 420, opacity: 0.8,
        }}>
          Fale connosco para mais detalhes, plantas ou condições.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <FillButton href="index.html#contact">
            Entrar em contacto
          </FillButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 7. Footer — global (same as homepage)
// ============================================================
function ProjectFooter() {
  const isMobile = useIsMobile();
  const footerRef = useScrollReveal();

  return (
    <footer style={{
      background: '#3D4239', color: C.bege,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Giant watermark */}
      <div style={{
        position: 'absolute', bottom: isMobile ? -30 : -40, left: '50%',
        transform: 'translateX(-50%)',
        fontWeight: 700, fontSize: isMobile ? 160 : 280,
        letterSpacing: '-0.04em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.04)',
        whiteSpace: 'nowrap', pointerEvents: 'none',
        lineHeight: 0.85,
      }}>orma.</div>

      <div ref={footerRef} style={{
        maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2,
        padding: isMobile ? '80px 24px 32px' : '120px 64px 40px',
        willChange: 'opacity, transform',
      }}>
        {/* Top — CTA headline + contact info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr',
          gap: isMobile ? 48 : 80,
          paddingBottom: isMobile ? 56 : 80,
        }}>
          {/* Left — Big CTA */}
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.3em', color: C.clearGreen, textTransform: 'uppercase', fontWeight: 600, marginBottom: 28 }}>Contacto</div>
            <h2 style={{ fontWeight: 300, fontSize: isMobile ? 36 : 56, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.bege, margin: 0 }}>
              Fale connosco sobre a sua próxima <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.terracota }}>casa.</em>
            </h2>
            <div style={{ display: 'flex', gap: 16, marginTop: isMobile ? 32 : 44, flexWrap: 'wrap' }}>
              <FillButton href="index.html#contact">Entrar em contacto</FillButton>
              <FillButton href="index.html#projects" variant="outline">Os nossos projetos</FillButton>
            </div>
          </div>

          {/* Right — Contact details */}
          <div style={{ paddingTop: isMobile ? 0 : 16 }}>
            {[
              { label: 'Email', value: 'info@orma.pt', href: 'mailto:info@orma.pt' },
              { label: 'Telefone', value: '+351 220 000 000', href: 'tel:+351220000000' },
              { label: 'Morada', value: 'Rua de Cedofeita 123\nPorto, Portugal' },
            ].map((item, i) => (
              <div key={item.label} style={{
                borderTop: i === 0 ? '1px solid rgba(238,232,218,0.12)' : 'none',
                borderBottom: '1px solid rgba(238,232,218,0.12)',
                padding: '20px 0',
              }}>
                <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.clearGreen, fontWeight: 600, marginBottom: 6 }}>{item.label}</div>
                {item.href ? (
                  <a href={item.href} style={{ fontSize: 15, color: C.bege, lineHeight: 1.5, textDecoration: 'none', transition: 'opacity 0.3s' }}>{item.value}</a>
                ) : (
                  <div style={{ fontSize: 15, color: C.bege, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.value}</div>
                )}
              </div>
            ))}
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
              {[
                { name: 'Instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg> },
                { name: 'LinkedIn', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
                { name: 'Facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
              ].map(s => (
                <a key={s.name} href="#" aria-label={s.name} style={{ color: C.clearGreen, transition: 'color 0.3s', display: 'flex', alignItems: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.bege}
                  onMouseLeave={e => e.currentTarget.style.color = C.clearGreen}
                >{s.icon}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 16 : 0,
          paddingTop: 20,
          borderTop: '1px solid rgba(238,232,218,0.08)',
          fontSize: 12, color: 'rgba(177,180,169,0.6)', letterSpacing: '0.04em',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="index.html" style={{ lineHeight: 0 }}>
            <img src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png" alt="Orma" loading="lazy" style={{ height: 18, opacity: 0.5 }} />
          </a>
          <span>© {new Date().getFullYear()} Orma. All rights reserved.</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="#" style={{ color: 'rgba(177,180,169,0.6)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'rgba(177,180,169,0.6)', textDecoration: 'none' }}>Terms & Conditions</a>
        </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// Main page component
// ============================================================
function ProjectPage() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id') || 'lir-725';
  const project = PROJECTS[projectId];

  // Update page title
  useEffect(() => {
    if (project) {
      document.title = `Orma. -${project.name}`;
    }
  }, [project]);

  if (!project) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 24, fontFamily: '"General Sans", system-ui, sans-serif',
      }}>
        <h1 style={{ fontWeight: 300, fontSize: 48, color: C.ink }}>Project not found</h1>
        <a href="index.html" style={{ color: C.terracota, textDecoration: 'none', fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          ← Back to homepage
        </a>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      fontFamily: '"General Sans", system-ui, sans-serif',
    }}>
      <ProjectNav projectName={project.name} />
      <ProjectHero project={project} />
      {/* Content before map - scrolls over fixed hero */}
      <div style={{ position: 'relative', zIndex: 2, background: C.bege }}>
        <ConceptRender project={project} />
        <Galleries project={project} />
        <PhotoCarousel project={project} />
        <Typologies project={project} />
        <Acabamentos />
      </div>

      {/* Location — scrolls naturally, no pin */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Location project={project} />
      </div>

      {/* Content after map */}
      <div style={{ position: 'relative', zIndex: 2, background: C.bege }}>
        <ProjectCTA project={project} />
        <ProjectFooter />
      </div>

      {/* Floating buttons - WhatsApp + Scroll to top */}
      <FloatingButtons />
    </div>
  );
}

function FloatingButtons() {
  const isMobile = useIsMobile();
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed', bottom: isMobile ? 16 : 28, right: isMobile ? 16 : 28, zIndex: 180,
      display: 'flex', flexDirection: 'column', gap: isMobile ? 8 : 12, alignItems: 'center',
    }}>
      <a
        href="https://wa.me/351XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          width: isMobile ? 44 : 52, height: isMobile ? 44 : 52, borderRadius: '50%',
          background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          textDecoration: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.22)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.18)'; }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#FFFFFF">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        style={{
          width: isMobile ? 34 : 40, height: isMobile ? 34 : 40, borderRadius: '50%',
          background: C.green, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          transition: 'transform 0.25s ease, opacity 0.35s ease',
          opacity: showTop ? 0.85 : 0,
          pointerEvents: showTop ? 'auto' : 'none',
        }}
        onMouseEnter={e => { if (showTop) { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.opacity = '1'; } }}
        onMouseLeave={e => { if (showTop) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.85'; } }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}

window.ProjectPage = ProjectPage;
