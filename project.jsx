/* global React */
const { useState, useEffect, useRef } = React;

// ============================================================
// Design tokens — shared with homepage
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
// Project data — single source of truth
// ============================================================
const PROJECTS = {
  'lir-725': {
    name: 'Lir 725',
    location: 'Porto, Portugal',
    tagline: 'Where the city meets the light.',
    hero: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/04/Tardoz_Sunset-scaled.png',
    description: 'Lir 725 is a residential building in the heart of Porto, designed in direct response to its surrounding urban context. The project balances a clear relationship with the street with the inclusion of generous private outdoor spaces — terraces, balconies and patios that extend living areas toward natural light and open sky.',
    descriptionExtra: 'Every apartment is oriented to maximise daylight and cross ventilation. Common areas are designed with the same attention as private ones — lobbies, corridors and stairwells are treated as shared living space, not afterthought.',
    stats: [
      { label: 'Units', value: '12' },
      { label: 'Typologies', value: 'T1 – T4' },
      { label: 'Location', value: 'Porto' },
      { label: 'Status', value: '2026 – 2027' },
      { label: 'Architecture', value: 'Studio [TBD]' },
      { label: 'Area', value: '1,200 m²' },
    ],
    gallery: [
      'https://tiagoc108.sg-host.com/wp-content/uploads/2026/04/Tardoz_Sunset-scaled.png',
      'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/Comp-1-scaled-1.jpg',
      'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/1-scaled.jpg',
    ],
    typologies: [
      { type: 'T1', area: '55 – 65 m²', bedrooms: 1, description: 'Open-plan living with private balcony. Ideal for individuals or couples seeking a compact, light-filled space in the city.' },
      { type: 'T2', area: '85 – 100 m²', bedrooms: 2, description: 'Versatile layout with two bedrooms, an integrated kitchen-living area, and a generous terrace connecting indoor and outdoor living.' },
      { type: 'T3', area: '120 – 140 m²', bedrooms: 3, description: 'A family-oriented floor plan with three bedrooms, two bathrooms, and a south-facing terrace designed for daily life and gatherings.' },
      { type: 'T4', area: '160 – 180 m²', bedrooms: 4, description: 'The largest typology, spanning a full floor. Four bedrooms, a master suite with private terrace, and panoramic city views.' },
    ],
    locationInfo: {
      description: 'Situated in one of Porto\'s most connected and liveable neighbourhoods, Lir 725 is steps away from public transport, local markets, schools, and the city\'s cultural landmarks. A five-minute walk reaches the Jardim da Cordoaria; the riverfront is a short ride away.',
      highlights: [
        { icon: 'transport', label: 'Metro & Bus', detail: '3 min walk' },
        { icon: 'park', label: 'Jardim da Cordoaria', detail: '5 min walk' },
        { icon: 'school', label: 'Schools & University', detail: '8 min walk' },
        { icon: 'shopping', label: 'Rua de Cedofeita', detail: '2 min walk' },
        { icon: 'hospital', label: 'Hospital Sto. António', detail: '10 min' },
        { icon: 'river', label: 'Douro Riverfront', detail: '12 min' },
      ],
    },
  },
  'villas-sto-tirso': {
    name: 'Villas Sto. Tirso',
    location: 'Santo Tirso, Portugal',
    tagline: 'Living shaped by landscape.',
    hero: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/Comp-1-scaled-1.jpg',
    description: 'A residential project in Santo Tirso set within a low-density, naturally defined environment. The design responds to the surrounding landscape, prioritising orientation, privacy, and the relationship between interior spaces and the outdoors.',
    descriptionExtra: 'Each villa is positioned to capture the best views and natural light, with private gardens that blur the boundary between architecture and nature. Sustainable construction practices and locally sourced materials ground the project in its context.',
    stats: [
      { label: 'Units', value: '6' },
      { label: 'Typologies', value: 'T3 – T4' },
      { label: 'Location', value: 'Santo Tirso' },
      { label: 'Status', value: '2026 – 2028' },
      { label: 'Architecture', value: 'Studio [TBD]' },
      { label: 'Plot', value: '3,800 m²' },
    ],
    gallery: [
      'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/Comp-1-scaled-1.jpg',
      'https://tiagoc108.sg-host.com/wp-content/uploads/2026/04/Tardoz_Sunset-scaled.png',
      'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/1-scaled.jpg',
    ],
    typologies: [
      { type: 'T3', area: '180 – 220 m²', bedrooms: 3, description: 'Three-bedroom villa with open-plan living, a private garden, and direct connection to outdoor space. Designed for families who value both privacy and community.' },
      { type: 'T4', area: '240 – 280 m²', bedrooms: 4, description: 'The flagship villa. Four bedrooms, a master suite with walk-in closet, double-height living area, and a wraparound garden with mature landscaping.' },
    ],
    locationInfo: {
      description: 'Santo Tirso offers the rare combination of natural surroundings and urban convenience. Set along the Ave River, the town provides excellent schools, a growing cultural scene, and fast road connections to Porto — all within a landscape defined by green hills and riverside paths.',
      highlights: [
        { icon: 'transport', label: 'Train Station', detail: '5 min drive' },
        { icon: 'park', label: 'Parque Urbano Sara Moreira', detail: '3 min walk' },
        { icon: 'school', label: 'Schools', detail: '5 min drive' },
        { icon: 'shopping', label: 'Town Centre', detail: '4 min drive' },
        { icon: 'hospital', label: 'Hospital', detail: '8 min' },
        { icon: 'river', label: 'Rio Ave', detail: '2 min walk' },
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
// Nav — adapted for project page (always solid bg, back link)
// ============================================================
function ProjectNav({ projectName }) {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(true);
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
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
    }}>
      {/* Logo — links to homepage */}
      <a href="index.html" style={{ display: 'block', lineHeight: 0 }}>
        <img
          src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png"
          alt="Orma"
          style={{ height: 28, width: 'auto', display: 'block' }}
        />
      </a>

      {/* Back to projects */}
      <a href="index.html#projects" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        color: C.bege, textDecoration: 'none',
        fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
        fontWeight: 500, opacity: 0.8, transition: 'opacity 0.3s',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        All Projects
      </a>
    </nav>
  );
}

// ============================================================
// 1. Project Hero — full-bleed image with overlay text
// ============================================================
function ProjectHero({ project }) {
  const isMobile = useIsMobile();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '85vh',
      minHeight: 500,
      overflow: 'hidden',
    }}>
      {/* Background image */}
      <img
        src={project.hero}
        alt={project.name}
        onLoad={() => setImgLoaded(true)}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: imgLoaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      />

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
  );
}

// ============================================================
// 2. Overview — description + stats grid
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
        {/* Left — text */}
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

        {/* Right — stats grid */}
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
// 3. Gallery — asymmetric image grid
// ============================================================
function Gallery({ project }) {
  const isMobile = useIsMobile();
  const revealRef = useScrollReveal();

  return (
    <section style={{
      background: C.white,
      padding: isMobile ? '60px 24px' : '120px 80px',
    }}>
      <div ref={revealRef} style={{
        maxWidth: 1400, margin: '0 auto',
        willChange: 'opacity, transform',
      }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.3em', color: C.terracota,
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 48,
          textAlign: 'center',
        }}>
          Gallery
        </div>

        {/* Asymmetric grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
          gap: isMobile ? 16 : 20,
        }}>
          {/* Large image */}
          <div style={{
            overflow: 'hidden', borderRadius: 4,
            gridRow: isMobile ? 'auto' : '1 / 3',
          }}>
            <img
              src={project.gallery[0]}
              alt={project.name + ' — 1'}
              loading="lazy"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>

          {/* Two smaller images stacked */}
          {project.gallery.slice(1, 3).map((img, i) => (
            <div key={i} style={{
              overflow: 'hidden', borderRadius: 4,
              height: isMobile ? 240 : 'auto',
            }}>
              <img
                src={img}
                alt={project.name + ' — ' + (i + 2)}
                loading="lazy"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 4. Typologies — tabs/cards per unit type
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
// 5. Location — map area + highlights
// ============================================================
function Location({ project }) {
  const isMobile = useIsMobile();
  const revealRef = useScrollReveal();
  const loc = project.locationInfo;

  return (
    <section style={{
      background: C.bege,
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
          Location
        </div>
        <h2 style={{
          fontWeight: 300, fontSize: isMobile ? 28 : 40, lineHeight: 1.2,
          letterSpacing: '-0.01em', color: C.ink, margin: '0 0 24px',
        }}>
          {project.location}
        </h2>
        <p style={{
          fontSize: 16, lineHeight: 1.8, color: C.green,
          margin: '0 0 56px', maxWidth: 640,
        }}>
          {loc.description}
        </p>

        {/* Highlights grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 16 : 24,
        }}>
          {loc.highlights.map((h) => (
            <div key={h.label} style={{
              padding: isMobile ? '20px 16px' : '28px 24px',
              background: C.white,
              borderRadius: 6,
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <div style={{ color: C.green }}>
                <LocationIcon type={h.icon} />
              </div>
              <div>
                <div style={{
                  fontWeight: 500, fontSize: 14, color: C.ink,
                  marginBottom: 2,
                }}>
                  {h.label}
                </div>
                <div style={{
                  fontSize: 13, color: C.clearGreen, fontWeight: 500,
                }}>
                  {h.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 6. Project CTA — contact block specific to project
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
          Whether you're looking for more details, floor plans, or pricing — our team is here.
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
// 7. Footer — simplified for project page
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
      document.title = `Orma. — ${project.name}`;
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
      <Overview project={project} />
      <Gallery project={project} />
      <Typologies project={project} />
      <Location project={project} />
      <ProjectCTA project={project} />
      <ProjectFooter />

      {/* Scroll to top */}
      <ScrollToTop />
    </div>
  );
}

function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 180,
        width: 44, height: 44, borderRadius: '50%',
        background: C.green, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: show ? 0.85 : 0,
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 0.3s',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      }}
      aria-label="Scroll to top"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.bege} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}

window.ProjectPage = ProjectPage;
