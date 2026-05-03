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
    description: '[Project description - to be provided]',
    descriptionExtra: '[Additional description - to be provided]',
    stats: [
      { label: 'Units', value: '[TBD]' },
      { label: 'Typologies', value: '[TBD]' },
      { label: 'Location', value: 'Porto' },
      { label: 'Status', value: '[TBD]' },
      { label: 'Architecture', value: '[TBD]' },
      { label: 'Area', value: '[TBD]' },
    ],
    rooms: [
      {
        name: 'Sala',
        area: '[TBD] m²',
        detail: '[Living room description — to be provided]',
        images: [
          'https://tiagoc108.sg-host.com/wp-content/uploads/2026/04/Tardoz_Sunset-scaled.png',
          '',
        ],
      },
      {
        name: 'Jardim',
        area: '[TBD] m²',
        detail: '[Garden description — to be provided]',
        images: ['', ''],
      },
      {
        name: 'Suite Master',
        area: '[TBD] m²',
        detail: '[Master suite description — to be provided]',
        images: ['', ''],
      },
    ],
    typologies: [
      { type: 'T1', area: '[TBD]', bedrooms: '[TBD]', description: '[Description - to be provided]' },
      { type: 'T2', area: '[TBD]', bedrooms: '[TBD]', description: '[Description - to be provided]' },
      { type: 'T3', area: '[TBD]', bedrooms: '[TBD]', description: '[Description - to be provided]' },
      { type: 'T4', area: '[TBD]', bedrooms: '[TBD]', description: '[Description - to be provided]' },
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
    description: '[Project description - to be provided]',
    descriptionExtra: '[Additional description - to be provided]',
    stats: [
      { label: 'Units', value: '[TBD]' },
      { label: 'Typologies', value: '[TBD]' },
      { label: 'Location', value: 'Santo Tirso' },
      { label: 'Status', value: '[TBD]' },
      { label: 'Architecture', value: '[TBD]' },
      { label: 'Plot', value: '[TBD]' },
    ],
    rooms: [
      {
        name: 'Sala',
        area: '[TBD] m²',
        detail: '[Living room description — to be provided]',
        images: [
          'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/Comp-1-scaled-1.jpg',
          '',
        ],
      },
      {
        name: 'Jardim',
        area: '[TBD] m²',
        detail: '[Garden description — to be provided]',
        images: ['', ''],
      },
      {
        name: 'Suite Master',
        area: '[TBD] m²',
        detail: '[Master suite description — to be provided]',
        images: ['', ''],
      },
    ],
    typologies: [
      { type: 'T3', area: '[TBD]', bedrooms: '[TBD]', description: '[Description - to be provided]' },
      { type: 'T4', area: '[TBD]', bedrooms: '[TBD]', description: '[Description - to be provided]' },
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
    padding: '16px 40px',
    fontWeight: 600, fontSize: 12, letterSpacing: '0.2em',
    textTransform: 'uppercase', textDecoration: 'none',
    borderRadius: isSolid ? 6 : 40,
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
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 200) {
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
        background: 'rgba(92,100,87,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 150,
        transform: visible || menuOpen ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
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
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(' + project.hero + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

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
      }}>
        <div style={{ maxWidth: 900 }}>
          <div style={{
            fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.7)',
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
      `}</style>
    </section>
    {/* Spacer so content starts after hero */}
    <div style={{ height: '100vh' }} />
    </>
  );
}

// ============================================================
// 2. Overview -description + stats grid
// ============================================================
function Overview({ project }) {
  const isMobile = useIsMobile();
  const revealRef = useScrollReveal();

  return (
    <section style={{
      background: C.bege,
      padding: isMobile ? '80px 24px' : '140px 80px',
    }}>
      <div ref={revealRef} style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
        gap: isMobile ? 48 : 100,
        willChange: 'opacity, transform',
      }}>
        {/* Left -text */}
        <div>
          <div style={{
            fontSize: 11, letterSpacing: '0.3em', color: C.terracota,
            textTransform: 'uppercase', fontWeight: 600, marginBottom: 24,
          }}>
            The Project
          </div>
          <p style={{
            fontWeight: 300, fontSize: isMobile ? 20 : 26, lineHeight: 1.6,
            letterSpacing: '-0.01em', color: C.ink, margin: 0,
          }}>
            {project.description}
          </p>
          <p style={{
            fontSize: 15, lineHeight: 1.8, color: C.green,
            margin: '28px 0 0',
          }}>
            {project.descriptionExtra}
          </p>
        </div>

        {/* Right -stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
        }}>
          {project.stats.map((stat, i) => (
            <div key={stat.label} style={{
              padding: isMobile ? '20px 16px' : '28px 24px',
              borderTop: '1px solid rgba(92,100,87,0.12)',
              borderRight: i % 2 === 0 ? '1px solid rgba(92,100,87,0.12)' : 'none',
            }}>
              <div style={{
                fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
                color: C.clearGreen, fontWeight: 600, marginBottom: 8,
              }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: isMobile ? 18 : 22, fontWeight: 500,
                color: C.ink, letterSpacing: '-0.01em',
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 3. Gallery — Cinematic scroll + split-screen reveal (GSAP)
// ============================================================

/* ---------- helper: render image or grey placeholder ---------- */
function GalleryImage({ src, alt, style, imgStyle }) {
  if (src) {
    return (
      <div style={{ overflow: 'hidden', ...style }}>
        <img src={src} alt={alt} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...imgStyle }} />
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: C.grey, color: C.clearGreen,
      fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase',
      ...style,
    }}>[Image]</div>
  );
}

/* ---------- single room block (desktop) ---------- */
function RoomBlock({ room, index, total }) {
  const blockRef = useRef(null);
  const titleRef = useRef(null);
  const heroRef = useRef(null);
  const heroImgRef = useRef(null);
  const splitRef = useRef(null);
  const infoRef = useRef(null);
  const img2Ref = useRef(null);

  useEffect(() => {
    if (typeof gsap === 'undefined' || !gsap.registerPlugin) return;
    const ctx = gsap.context(() => {

      /* — title card fade-in — */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.5,
        },
      });
      tl.fromTo(titleRef.current.querySelector('.room-name'),
        { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(titleRef.current.querySelector('.room-detail'),
          { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, 0.15);

      /* — hero image parallax + scale — */
      gsap.fromTo(heroImgRef.current,
        { scale: 1.15, yPercent: -8 },
        {
          scale: 1, yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
        }
      );

      /* — split-screen: clip-path reveal on second image — */
      if (img2Ref.current) {
        gsap.fromTo(img2Ref.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)', ease: 'power2.inOut',
            scrollTrigger: { trigger: splitRef.current, start: 'top 60%', end: 'top 10%', scrub: 0.6 },
          }
        );
      }

      /* — info text fade — */
      gsap.fromTo(infoRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, ease: 'power2.out',
          scrollTrigger: { trigger: splitRef.current, start: 'top 50%', end: 'top 15%', scrub: 0.5 },
        }
      );
    }, blockRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={blockRef}>
      {/* ---- Breather divider (except first room) ---- */}
      {index > 0 && (
        <div style={{
          height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: C.green,
        }}>
          <span style={{
            fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase',
            color: C.bege, fontWeight: 500, opacity: 0.7,
          }}>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* ---- Title card ---- */}
      <div ref={titleRef} style={{
        height: '70vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: C.bege, textAlign: 'center', padding: '0 40px',
      }}>
        <div className="room-name" style={{
          fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 300,
          color: C.ink, lineHeight: 1.1, letterSpacing: '-0.02em',
        }}>
          {room.name}
        </div>
        <div className="room-detail" style={{
          fontSize: 14, color: C.green, letterSpacing: '0.15em',
          textTransform: 'uppercase', marginTop: 20, fontWeight: 500,
        }}>
          {room.area}
        </div>
      </div>

      {/* ---- Hero image (full-width, parallax + scale) ---- */}
      <div ref={heroRef} style={{
        width: '100%', height: '85vh', overflow: 'hidden',
        position: 'relative',
      }}>
        <div ref={heroImgRef} style={{
          position: 'absolute', inset: '-15% 0',
          width: '100%', height: '130%',
        }}>
          <GalleryImage
            src={room.images[0]} alt={room.name}
            style={{ width: '100%', height: '100%' }}
            imgStyle={{}} />
        </div>
      </div>

      {/* ---- Split-screen: info left + image right with clip-path reveal ---- */}
      {room.images.length > 1 && (
        <div ref={splitRef} style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          minHeight: '70vh', background: C.white,
        }}>
          {/* Left: room info */}
          <div ref={infoRef} style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '80px 60px 80px 80px',
          }}>
            <div style={{
              fontSize: 11, letterSpacing: '0.3em', color: C.terracota,
              textTransform: 'uppercase', fontWeight: 600, marginBottom: 24,
            }}>
              {room.name}
            </div>
            <p style={{
              fontSize: 18, lineHeight: 1.7, color: C.ink, fontWeight: 300,
              maxWidth: 420,
            }}>
              {room.detail}
            </p>
            <div style={{
              marginTop: 32, fontSize: 13, letterSpacing: '0.12em',
              color: C.green, textTransform: 'uppercase', fontWeight: 500,
            }}>
              {room.area}
            </div>
          </div>

          {/* Right: second image with clip-path reveal */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: 500 }}>
            <div ref={img2Ref} style={{
              position: 'absolute', inset: 0,
              clipPath: 'inset(0 100% 0 0)',
            }}>
              <GalleryImage
                src={room.images[1]} alt={room.name + ' detail'}
                style={{ width: '100%', height: '100%' }}
                imgStyle={{}} />
            </div>
            {/* Background placeholder visible while clip reveals */}
            <div style={{
              width: '100%', height: '100%', background: C.grey,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.clearGreen, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              {room.images[1] ? '' : '[Image]'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- single room block (mobile) ---------- */
function RoomBlockMobile({ room, index, total }) {
  const blockRef = useRef(null);

  useEffect(() => {
    if (typeof gsap === 'undefined' || !gsap.registerPlugin) return;
    const ctx = gsap.context(() => {
      const els = blockRef.current.querySelectorAll('.mob-reveal');
      els.forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 55%', scrub: 0.4 },
          }
        );
      });
    }, blockRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={blockRef}>
      {/* Divider */}
      {index > 0 && (
        <div style={{
          height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: C.green,
        }}>
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: C.bege, fontWeight: 500, opacity: 0.7,
          }}>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Title */}
      <div className="mob-reveal" style={{
        padding: '60px 24px 32px', background: C.bege, textAlign: 'center',
      }}>
        <div style={{
          fontSize: 36, fontWeight: 300, color: C.ink, lineHeight: 1.15,
        }}>
          {room.name}
        </div>
        <div style={{
          fontSize: 12, color: C.green, letterSpacing: '0.15em',
          textTransform: 'uppercase', marginTop: 12, fontWeight: 500,
        }}>
          {room.area}
        </div>
      </div>

      {/* Images stacked */}
      {room.images.map((img, i) => (
        <div key={i} className="mob-reveal" style={{ background: C.white }}>
          <GalleryImage
            src={img} alt={room.name + ' ' + (i + 1)}
            style={{ width: '100%', height: 320, marginBottom: i < room.images.length - 1 ? 2 : 0 }}
            imgStyle={{}} />
        </div>
      ))}

      {/* Detail text */}
      <div className="mob-reveal" style={{
        padding: '32px 24px 60px', background: C.white,
      }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.3em', color: C.terracota,
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 16,
        }}>
          {room.name}
        </div>
        <p style={{
          fontSize: 16, lineHeight: 1.7, color: C.ink, fontWeight: 300,
        }}>
          {room.detail}
        </p>
      </div>
    </div>
  );
}

/* ---------- main Gallery component ---------- */
function Gallery({ project }) {
  const isMobile = useIsMobile();
  const headerRef = useRef(null);
  const rooms = project.rooms || [];

  useEffect(() => {
    if (typeof gsap === 'undefined' || !gsap.registerPlugin || !headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, ease: 'power2.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%', end: 'top 50%', scrub: 0.5 },
        }
      );
    }, headerRef.current);
    return () => ctx.revert();
  }, []);

  if (!rooms.length) return null;

  return (
    <section style={{ background: C.bege }}>
      {/* Section header */}
      <div ref={headerRef} style={{
        textAlign: 'center',
        padding: isMobile ? '80px 24px 0' : '140px 80px 0',
      }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.3em', color: C.terracota,
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 16,
        }}>
          Gallery
        </div>
        <div style={{
          fontSize: isMobile ? 28 : 48, fontWeight: 300, color: C.ink,
          lineHeight: 1.2, letterSpacing: '-0.02em',
        }}>
          Espaços que inspiram
        </div>
      </div>

      {/* Room blocks */}
      {rooms.map((room, i) =>
        isMobile
          ? <RoomBlockMobile key={i} room={room} index={i} total={rooms.length} />
          : <RoomBlock key={i} room={room} index={i} total={rooms.length} />
      )}

      {/* Bottom breathing space */}
      <div style={{ height: isMobile ? 40 : 80, background: C.white }} />
    </section>
  );
}

// ============================================================
// 4. Typologies -tabs/cards per unit type
// ============================================================
function Typologies({ project }) {
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);
  const revealRef = useScrollReveal();
  const typs = project.typologies;

  return (
    <section style={{
      background: C.green,
      padding: isMobile ? '80px 24px' : '140px 80px',
    }}>
      <div ref={revealRef} style={{
        maxWidth: 1200, margin: '0 auto',
        willChange: 'opacity, transform',
      }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.3em', color: C.terracota,
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 16,
        }}>
          Typologies
        </div>
        <h2 style={{
          fontWeight: 300, fontSize: isMobile ? 28 : 40, lineHeight: 1.2,
          letterSpacing: '-0.01em', color: C.bege, margin: '0 0 48px',
        }}>
          Spaces designed for <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.terracota }}>how you live.</em>
        </h2>

        {/* Tab buttons */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 40,
          flexWrap: 'wrap',
        }}>
          {typs.map((t, i) => (
            <button
              key={t.type}
              onClick={() => setActive(i)}
              style={{
                padding: '12px 28px',
                background: active === i ? C.bege : 'transparent',
                color: active === i ? C.ink : C.bege,
                border: active === i ? 'none' : '1px solid rgba(238,232,218,0.25)',
                borderRadius: 40,
                fontWeight: 500, fontSize: 13, letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {t.type}
            </button>
          ))}
        </div>

        {/* Active typology detail */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 32 : 64,
          alignItems: 'start',
        }}>
          {/* Info */}
          <div>
            <h3 style={{
              fontWeight: 500, fontSize: isMobile ? 32 : 48,
              color: C.bege, margin: 0, letterSpacing: '-0.02em',
            }}>
              {typs[active].type}
            </h3>

            <div style={{
              display: 'flex', gap: isMobile ? 24 : 40, marginTop: 24,
            }}>
              <div>
                <div style={{
                  fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: C.clearGreen, fontWeight: 600, marginBottom: 6,
                }}>Area</div>
                <div style={{ fontSize: 18, fontWeight: 500, color: C.bege }}>{typs[active].area}</div>
              </div>
              <div>
                <div style={{
                  fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: C.clearGreen, fontWeight: 600, marginBottom: 6,
                }}>Bedrooms</div>
                <div style={{ fontSize: 18, fontWeight: 500, color: C.bege }}>{typs[active].bedrooms}</div>
              </div>
            </div>

            <p style={{
              fontSize: 15, lineHeight: 1.8, color: 'rgba(238,232,218,0.75)',
              margin: '28px 0 0', maxWidth: 480,
            }}>
              {typs[active].description}
            </p>

            <div style={{ marginTop: 40 }}>
              <FillButton
                href={'#contact'}
                onClick={e => {
                  e.preventDefault();
                  const el = document.getElementById('project-contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="outline"
                style={{ color: C.bege, border: '1px solid rgba(238,232,218,0.3)', borderRadius: 6, padding: '14px 36px' }}
              >
                Request floor plan
              </FillButton>
            </div>
          </div>

          {/* Placeholder for floor plan image */}
          <div style={{
            background: 'rgba(238,232,218,0.06)',
            borderRadius: 6,
            height: isMobile ? 240 : 360,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(238,232,218,0.1)',
          }}>
            <div style={{ textAlign: 'center', color: 'rgba(238,232,218,0.3)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              <div style={{ marginTop: 12, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Floor plan
              </div>
            </div>
          </div>
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
      /* Pin the section - map stays fixed while content scrolls over */
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=60%',
        pin: true,
        pinSpacing: true,
        onEnter: () => { section.style.zIndex = '10'; },
        onLeaveBack: () => { section.style.zIndex = '2'; },
      });

      /* Map parallax + fade in */
      gsap.fromTo(mapRef.current,
        { yPercent: -4, opacity: 0 },
        {
          yPercent: 4,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 20%',
            scrub: 0.6,
          },
        }
      );

      /* Cards - fade in + slide up, scroll-driven */
      const cards = cardsRef.current.children;
      gsap.fromTo(cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 45%',
            end: 'top 5%',
            scrub: 0.6,
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
          <div style={{ background: C.white, overflow: 'hidden' }}>
            <div style={{ height: 200, overflow: 'hidden' }}>
              <img src={project.hero} alt={project.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '24px 28px' }}>
              <h4 style={{ fontWeight: 500, fontSize: 18, color: C.ink, margin: '0 0 16px', letterSpacing: '-0.01em' }}>{project.name}</h4>
              <FillButton href={'#'} onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{ width: '100%', textAlign: 'center', display: 'block', padding: '14px 24px' }}>
                Ver projecto
              </FillButton>
            </div>
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
      background: C.ink,
      padding: isMobile ? '80px 24px' : '120px 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle watermark */}
      <div style={{
        position: 'absolute', bottom: -20, right: -40,
        fontWeight: 700, fontSize: isMobile ? 120 : 200,
        letterSpacing: '-0.04em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.03)',
        whiteSpace: 'nowrap', pointerEvents: 'none',
        lineHeight: 0.85,
      }}>{project.name}</div>

      <div ref={revealRef} style={{
        maxWidth: 800, margin: '0 auto', textAlign: 'center',
        position: 'relative', zIndex: 2,
        willChange: 'opacity, transform',
      }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.3em', color: C.terracota,
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 24,
        }}>
          Interested?
        </div>
        <h2 style={{
          fontWeight: 300, fontSize: isMobile ? 32 : 48, lineHeight: 1.15,
          letterSpacing: '-0.01em', color: C.bege, margin: '0 0 20px',
        }}>
          Let's talk about <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.terracota }}>{project.name}.</em>
        </h2>
        <p style={{
          fontSize: 16, lineHeight: 1.8, color: 'rgba(238,232,218,0.65)',
          margin: '0 auto 44px', maxWidth: 500,
        }}>
          Whether you're looking for more details, floor plans, or pricing - our team is here.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <FillButton href="index.html#contact">
            Get in touch
          </FillButton>
          <FillButton href="tel:+351220000000" variant="outline">
            Call us
          </FillButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 7. Footer -simplified for project page
// ============================================================
function ProjectFooter() {
  const isMobile = useIsMobile();

  return (
    <footer style={{
      background: '#3D4239', color: C.bege,
      padding: isMobile ? '32px 24px' : '40px 64px',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 16 : 0,
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
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Overview project={project} />
        <Gallery project={project} />
        <Typologies project={project} />
      </div>

      {/* Location - GSAP pinned, z-index 2 covers hero, below z-index 3 content after */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Location project={project} />
      </div>

      {/* Content after map - z-index 3 scrolls over the pinned map */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        <ProjectCTA project={project} />
        <ProjectFooter />
      </div>

      {/* Floating buttons - WhatsApp + Scroll to top */}
      <FloatingButtons />
    </div>
  );
}

function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 180,
      display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center',
    }}>
      <a
        href="https://wa.me/351XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          width: 52, height: 52, borderRadius: '50%',
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
          width: 40, height: 40, borderRadius: '50%',
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
