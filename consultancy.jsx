/* global React, gsap, ScrollTrigger */
const { useState, useEffect, useRef } = React;

// ============================================================
// Design tokens
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
// useIsMobile
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

// ============================================================
// useScrollReveal
// ============================================================
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
// WordReveal - scroll-driven word-by-word text reveal
// ============================================================
function WordReveal({ text, italic, style }) {
  const containerRef = useRef(null);

  const segments = [];
  if (italic) {
    const idx = text.indexOf(italic);
    if (idx >= 0) {
      const before = text.substring(0, idx).trim();
      const after = text.substring(idx + italic.length).trim();
      if (before) before.split(/\s+/).forEach(w => segments.push({ word: w, em: false }));
      italic.split(/\s+/).forEach(w => segments.push({ word: w, em: true }));
      if (after) after.split(/\s+/).forEach(w => segments.push({ word: w, em: false }));
    } else {
      text.split(/\s+/).forEach(w => segments.push({ word: w, em: false }));
    }
  } else {
    text.split(/\s+/).forEach(w => segments.push({ word: w, em: false }));
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const wordEls = container.querySelectorAll('[data-word]');
    if (!wordEls.length) return;

    let raf = null;
    const update = () => {
      const rect = container.getBoundingClientRect();
      const wh = window.innerHeight;
      const enter = wh * 0.85;
      const full = wh * 0.25;
      const totalWords = wordEls.length;

      wordEls.forEach((wordEl, i) => {
        const wordStart = enter - (i / totalWords) * (enter - full);
        const wordEnd = wordStart - (enter - full) * 0.12;
        let p;
        if (rect.top >= wordStart) p = 0;
        else if (rect.top <= wordEnd) p = 1;
        else p = (wordStart - rect.top) / (wordStart - wordEnd);
        p = Math.max(0, Math.min(1, p));
        wordEl.style.opacity = String(0.15 + p * 0.85);
      });
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <h2 ref={containerRef} style={style}>
      {segments.map((seg, i) => {
        const wordStyle = {
          display: 'inline',
          opacity: 0.15,
          transition: 'opacity 0.05s linear',
        };
        if (seg.em) {
          return (
            <span key={i}>
              <em data-word style={{ ...wordStyle, fontStyle: 'italic', color: C.green, fontWeight: 300 }}>
                {seg.word}
              </em>
              {i < segments.length - 1 ? ' ' : ''}
            </span>
          );
        }
        return (
          <span key={i}>
            <span data-word style={wordStyle}>{seg.word}</span>
            {i < segments.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </h2>
  );
}

// ============================================================
// Wordmark - O. logo with leaf SVG
// ============================================================
function Wordmark({ color = C.bege, size = 26, withSubline = false }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4, lineHeight: 1 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
        <span style={{ position: 'relative', display: 'inline-block', width: size * 0.78, height: size * 0.78 }}>
          <span style={{ position: 'absolute', inset: 0, border: `${Math.max(2, size * 0.09)}px solid ${color}`, borderRadius: '50%' }} />
          <svg viewBox="0 0 32 32" style={{ position: 'absolute', inset: '22%', width: '56%', height: '56%' }}>
            <path d="M6 22 C 6 12, 16 6, 26 6 C 26 16, 20 26, 10 26 C 8 26, 6 24, 6 22 Z" fill={color} />
          </svg>
        </span>
        <span style={{ fontWeight: 500, fontSize: size, color, letterSpacing: '-0.02em', marginLeft: 2 }}>rma.</span>
      </div>
      {withSubline && (
        <div style={{ fontFamily: '"General Sans", sans-serif', fontSize: size * 0.28, letterSpacing: '0.32em', color, fontWeight: 500, textTransform: 'uppercase', marginLeft: size * 0.06 }}>Designed for Living</div>
      )}
    </div>
  );
}

// ============================================================
// TreeMark - background tree watermark
// ============================================================
function TreeMark({ opacity = 0.08, style = {} }) {
  return (
    <div style={{
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundImage: 'url(./orma-arvore.svg)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      opacity,
      ...style,
    }} aria-hidden="true" />
  );
}

// ============================================================
// RollingNumber - animated counter
// ============================================================
function RollingNumber({ value, suffix = '', duration = 1800 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const num = parseInt(value, 10) || 0;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          setDisplay(Math.round(eased * num));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return React.createElement('span', { ref }, display + suffix);
}

// ============================================================
// STAT_ICONS - SVG icons for WhyUs stats
// ============================================================
const STAT_ICONS = {
  years: function() {
    return React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
      React.createElement('circle', { cx: 12, cy: 12, r: 9, stroke: C.clearGreen, strokeWidth: 1.5 }),
      React.createElement('path', { d: 'M12 7L12 12L16 14', stroke: C.clearGreen, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    );
  },
  projects: function() {
    return React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
      React.createElement('rect', { x: 3, y: 3, width: 7, height: 7, rx: 1, stroke: C.clearGreen, strokeWidth: 1.5 }),
      React.createElement('rect', { x: 14, y: 3, width: 7, height: 7, rx: 1, stroke: C.clearGreen, strokeWidth: 1.5 }),
      React.createElement('rect', { x: 3, y: 14, width: 7, height: 7, rx: 1, stroke: C.clearGreen, strokeWidth: 1.5 }),
      React.createElement('rect', { x: 14, y: 14, width: 7, height: 7, rx: 1, stroke: C.clearGreen, strokeWidth: 1.5 })
    );
  },
  reinvest: function() {
    return React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
      React.createElement('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10', stroke: C.clearGreen, strokeWidth: 1.5, strokeLinecap: 'round' }),
      React.createElement('path', { d: 'M22 2L22 8L16 8', stroke: C.clearGreen, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      React.createElement('path', { d: 'M22 8L18 4', stroke: C.clearGreen, strokeWidth: 1.5, strokeLinecap: 'round' })
    );
  },
};

// ============================================================
// Service Icons - custom SVGs for each service
// ============================================================
function ServiceIconStrategy() {
  return (
    <svg width="38" height="38" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="10" stroke={C.green} strokeWidth="1.5"/>
      <path d="M15 5L15 25" stroke={C.green} strokeWidth="1" opacity="0.4"/>
      <path d="M5 15L25 15" stroke={C.green} strokeWidth="1" opacity="0.4"/>
      <path d="M15 5L15 8" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 22L15 25" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 15L8 15" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 15L25 15" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="15" cy="15" r="3" stroke={C.green} strokeWidth="1.5"/>
      <path d="M15 12L15 9" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ServiceIconEvents() {
  return (
    <svg width="38" height="38" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="22" height="18" rx="1.5" stroke={C.green} strokeWidth="1.5"/>
      <path d="M4 12H26" stroke={C.green} strokeWidth="1.2"/>
      <path d="M10 8V5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 8V5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="18" r="1.5" stroke={C.green} strokeWidth="1" opacity="0.6"/>
      <circle cx="15" cy="18" r="1.5" stroke={C.green} strokeWidth="1" opacity="0.6"/>
      <circle cx="20" cy="18" r="1.5" fill={C.green} opacity="0.4"/>
      <circle cx="10" cy="22" r="1.5" stroke={C.green} strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}

function ServiceIconSports() {
  return (
    <svg width="38" height="38" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 27L4 10L15 4L26 10L26 27" stroke={C.green} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M4 27H26" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 10L26 10" stroke={C.green} strokeWidth="1" opacity="0.4"/>
      <path d="M10 10L10 27" stroke={C.green} strokeWidth="1" opacity="0.3"/>
      <path d="M20 10L20 27" stroke={C.green} strokeWidth="1" opacity="0.3"/>
      <circle cx="15" cy="18" r="3" stroke={C.green} strokeWidth="1.3"/>
      <path d="M15 15L15 21" stroke={C.green} strokeWidth="0.8" opacity="0.5"/>
      <path d="M12 18L18 18" stroke={C.green} strokeWidth="0.8" opacity="0.5"/>
    </svg>
  );
}

const SERVICE_SVG = { strategy: ServiceIconStrategy, events: ServiceIconEvents, sports: ServiceIconSports };

// ============================================================
// MenuSubLink
// ============================================================
function MenuSubLink({ label, subtitle, href, onClose }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href || '#'}
      onClick={(e) => {
        if (href && !href.startsWith('http')) {
          // Let browser navigate
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

// ============================================================
// MenuLink
// ============================================================
function MenuLink({ label, href, onClose, hasChildren, children }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleClick = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setExpanded(!expanded);
    } else {
      if (href) {
        // Let browser follow the link
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

// ============================================================
// MenuDrawer
// ============================================================
function MenuDrawer({ open, onClose }) {
  return (
    <>
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

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <MenuLink label="Projetos" href="index.html#projects" onClose={onClose} hasChildren>
              <MenuSubLink label="Lir 725" subtitle="Porto" href="project.html?p=lir-725" onClose={onClose} />
              <MenuSubLink label="Villas Sto. Tirso" subtitle="Santo Tirso" href="project.html?p=villas-sto-tirso" onClose={onClose} />
            </MenuLink>
            <MenuLink label="Sobre Nos" href="index.html#about" onClose={onClose} />
            <MenuLink label="Consultoria" href="consultancy.html" onClose={onClose} />
            <MenuLink label="Sustentabilidade" href="index.html#sustainability" onClose={onClose} />
            <MenuLink label="Contacto" href="index.html#contact" onClose={onClose} />
          </nav>
        </div>

        <div style={{ borderTop: '1px solid rgba(238,232,218,0.15)', paddingTop: 32 }}>
          <p style={{
            fontWeight: 300,
            fontSize: 13, lineHeight: 1.7, letterSpacing: '0.03em',
            color: 'rgba(238,232,218,0.6)', margin: 0,
          }}>
            Porto - Santo Tirso<br />
            contact@orma.pt
          </p>
        </div>
      </div>
    </>
  );
}

// ============================================================
// Nav
// ============================================================
function Nav() {
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
        <a href="index.html" style={{ display: 'block', lineHeight: 0 }}>
          <img
            src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png"
            alt="Orma"
            style={{ height: 28, width: 'auto', display: 'block' }}
          />
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: 8,
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-end', justifyContent: 'center',
            gap: isMobile ? 6 : 7, width: 48, height: 48,
          }}
          aria-label="Menu"
        >
          <span style={{ display: 'block', width: isMobile ? 28 : 32, height: 1.5, background: C.bege, transition: 'all 0.3s' }} />
          <span style={{ display: 'block', width: isMobile ? 20 : 24, height: 1.5, background: C.bege, transition: 'all 0.3s' }} />
          {!isMobile && <span style={{ display: 'block', width: 32, height: 1.5, background: C.bege, transition: 'all 0.3s' }} />}
        </button>
      </nav>
    </>
  );
}

// ============================================================
// Inject keyframes
// ============================================================
(function injectKeyframes() {
  if (document.getElementById('consultancy-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'consultancy-keyframes';
  style.textContent = `
    @keyframes scrollPulse {
      0%, 100% { transform: scaleY(1); opacity: 0.6; }
      50% { transform: scaleY(1.6); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

// ============================================================
// 1. ConsultancyHero - fixed background, content scrolls over
// ============================================================
function ConsultancyHero() {
  const isMobile = useIsMobile();

  return (
    <section style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      zIndex: 1,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(31,32,34,0.15) 0%, rgba(31,32,34,0.55) 100%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: isMobile ? '0 24px 80px' : '0 64px 100px',
        maxWidth: 1280, margin: '0 auto',
      }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase',
          fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 20,
          animation: 'fadeIn 0.8s ease-out 0.3s both',
        }}>CONSULTORIA</div>
        <h1 style={{
          fontWeight: 300, fontSize: isMobile ? 40 : 64,
          lineHeight: 1.08, letterSpacing: '-0.02em',
          color: C.white, margin: 0, maxWidth: 700,
          animation: 'fadeIn 0.8s ease-out 0.5s both',
        }}>Clarity at Scale</h1>
        <p style={{
          fontWeight: 300, fontSize: isMobile ? 16 : 18,
          lineHeight: 1.7, color: 'rgba(255,255,255,0.8)',
          margin: 0, marginTop: 24, maxWidth: 600,
          animation: 'fadeIn 0.8s ease-out 0.7s both',
        }}>
          We help businesses, sports entities and brands simplify complexity, optimize operations and deliver memorable events.
        </p>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        zIndex: 3,
        animation: 'fadeIn 1s ease-out 1.2s both',
      }}>
        <div style={{
          width: 1, height: 32, background: 'rgba(255,255,255,0.4)',
          transformOrigin: 'top center',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </div>
    </section>
  );
}

// ============================================================
// 2. Approach - WordReveal with TreeMark watermark
// ============================================================
function Approach() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      position: 'relative',
      background: C.bege,
      padding: isMobile ? '80px 24px 100px' : '180px 64px 200px',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <WordReveal
          text="There is no universal model for growth. Orma builds custom frameworks that align with each client's industry, culture, and ambition."
          italic="industry, culture, and ambition."
          style={{
            fontWeight: 300, fontSize: isMobile ? 24 : 38, lineHeight: 1.5,
            letterSpacing: '-0.015em', color: C.ink, margin: 0, textWrap: 'balance',
          }}
        />
      </div>
    </section>
  );
}

// ============================================================
// 3. Services - GSAP animated vertical timeline (Pillars pattern)
// ============================================================
function ServiceCard({ item, index, isLeft, itemRef, dotRef, connectorRef, iconRef, titleRef, treeRef, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const IconComponent = SERVICE_SVG[item.kind];
  const treeRotations = [0, 0, 0];
  const treeSizes = [220, 200, 190];

  if (isMobile) {
    return (
      <div ref={itemRef} style={{
        display: 'flex',
        marginBottom: index < 2 ? 40 : 0,
        opacity: 0,
      }}>
        {/* Left: timeline rail */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          width: 32, flexShrink: 0, paddingTop: 4,
        }}>
          <div ref={dotRef} style={{
            width: 12, height: 12, borderRadius: '50%',
            background: C.green, border: '2.5px solid ' + C.white,
            boxShadow: '0 0 0 3px rgba(92,100,87,0.15)',
            flexShrink: 0,
            transform: 'scale(0)',
          }} />
          <div ref={connectorRef} style={{
            width: 1, flex: 1,
            background: index < 2 ? 'linear-gradient(to bottom, ' + C.green + ', ' + C.clearGreen + ')' : 'transparent',
            marginTop: 6,
            transformOrigin: 'top center',
            transform: 'scaleY(0)',
          }} />
        </div>

        {/* Right: card content */}
        <div style={{
          flex: 1,
          padding: '28px 24px 28px',
          background: C.bege,
          borderRadius: 6,
          marginLeft: 12,
        }}>
          <div ref={iconRef} style={{
            width: 48, height: 48, borderRadius: '50%',
            background: C.white,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
            boxShadow: '0 2px 12px rgba(92,100,87,0.1)',
            transform: 'scale(0)',
          }}>
            {IconComponent && <IconComponent />}
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 10 }}>
            <h3 ref={titleRef} style={{
              fontWeight: 600, fontSize: 18, color: C.ink,
              margin: 0, letterSpacing: '-0.01em', lineHeight: 1.3,
              transform: 'translateY(100%)',
            }}>{item.title}</h3>
          </div>
          <div style={{ width: 24, height: 2, background: C.terracota, marginBottom: 12, borderRadius: 1, opacity: 0.6 }} />
          <p style={{
            fontSize: 13, lineHeight: 1.7, color: C.green, margin: 0,
          }}>{item.body}</p>
        </div>

        <div ref={treeRef} style={{ display: 'none' }} />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: isLeft ? 'flex-start' : 'flex-end',
      position: 'relative',
      marginBottom: index < 2 ? 140 : 0,
    }}>
      {/* Tree on the OPPOSITE side */}
      {!isLeft && (
        <div ref={treeRef} className="service-tree" style={{
          width: 'calc(50% - 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: 'auto',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: treeSizes[index], height: treeSizes[index],
            transform: 'rotate(' + treeRotations[index] + 'deg)',
          }}>
            <TreeMark opacity={0.12} style={{ filter: 'sepia(1) saturate(0.3) hue-rotate(60deg) brightness(0.92)' }} />
          </div>
        </div>
      )}

      {/* Timeline dot */}
      <div ref={dotRef} style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 16, height: 16, borderRadius: '50%',
        background: C.green, border: '3px solid ' + C.white,
        transform: 'translate(-50%, -50%) scale(0)',
        zIndex: 3,
        boxShadow: '0 0 0 5px rgba(92,100,87,0.15)',
      }} />

      {/* Connector line */}
      <div ref={connectorRef} style={{
        position: 'absolute', top: '50%',
        height: 1,
        background: 'linear-gradient(' + (isLeft ? 'to right' : 'to left') + ', ' + C.clearGreen + ', ' + C.green + ')',
        zIndex: 2,
        transformOrigin: isLeft ? 'right center' : 'left center',
        transform: 'scaleX(0)',
        ...(isLeft
          ? { left: 'calc(50% - 60px)', width: 60 }
          : { right: 'calc(50% - 60px)', width: 60, left: 'auto' }
        ),
      }} />

      {/* Content card */}
      <div
        ref={itemRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 'calc(50% - 80px)',
          opacity: 0,
          padding: '48px 48px 44px',
          background: C.bege,
          borderRadius: 6,
          position: 'relative',
          boxShadow: hovered
            ? '0 12px 40px rgba(31,32,34,0.08), 0 2px 8px rgba(31,32,34,0.04)'
            : '0 4px 20px rgba(31,32,34,0.04), 0 1px 4px rgba(31,32,34,0.02)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'box-shadow 0.4s ease, transform 0.4s ease',
          ...(isLeft ? { marginRight: 'auto' } : { marginLeft: 'auto' }),
        }}
      >
        <div ref={iconRef} style={{
          width: 72, height: 72, borderRadius: '50%',
          background: C.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28,
          boxShadow: '0 2px 12px rgba(92,100,87,0.1)',
          transform: 'scale(0)',
        }}>
          {IconComponent && <IconComponent />}
        </div>

        <div style={{ overflow: 'hidden', marginBottom: 16 }}>
          <h3 ref={titleRef} style={{
            fontWeight: 600, fontSize: 24, color: C.ink,
            margin: 0, letterSpacing: '-0.01em', lineHeight: 1.3,
            transform: 'translateY(100%)',
          }}>{item.title}</h3>
        </div>

        <div style={{ width: 32, height: 2, background: C.terracota, marginBottom: 18, borderRadius: 1, opacity: 0.6 }} />

        <p style={{
          fontSize: 15, lineHeight: 1.8, color: C.green, margin: 0,
        }}>{item.body}</p>
      </div>

      {/* Tree on the OPPOSITE side */}
      {isLeft && (
        <div ref={treeRef} className="service-tree" style={{
          width: 'calc(50% - 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: 'auto',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: treeSizes[index], height: treeSizes[index],
            transform: 'rotate(' + treeRotations[index] + 'deg)',
          }}>
            <TreeMark opacity={0.12} style={{ filter: 'sepia(1) saturate(0.3) hue-rotate(60deg) brightness(0.92)' }} />
          </div>
        </div>
      )}
    </div>
  );
}

function Services() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const itemRefs = useRef([]);
  const dotRefs = useRef([]);
  const connectorRefs = useRef([]);
  const iconRefs = useRef([]);
  const titleRefs = useRef([]);
  const treeRefs = useRef([]);

  const items = [
    { kind: 'strategy', title: 'Strategic & Operational Consulting', body: 'From organizational design to process optimization, we simplify structures and streamline operations so your team can focus on what matters.' },
    { kind: 'events', title: 'Event Strategy & Management', body: 'End-to-end event planning - from venue selection and logistics to on-site execution and post-event analysis. Every detail, every time.' },
    { kind: 'sports', title: 'Sports & Match Operations', body: 'Advisory for clubs, federations and sporting organizations - matchday operations, venue strategy and fan experience design.' },
  ];

  useEffect(() => {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const triggers = [];

    // Animate the vertical line drawing (desktop only)
    const line = lineRef.current;
    if (line) {
      const lineTween = gsap.fromTo(line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            end: 'bottom 35%',
            scrub: 0.6,
          },
        }
      );
      triggers.push(lineTween.scrollTrigger);
    }

    // Animate each service card with staggered internal elements
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const isLeft = i % 2 === 0;
      const connector = connectorRefs.current[i];
      const icon = iconRefs.current[i];
      const title = titleRefs.current[i];
      const dot = dotRefs.current[i];

      const isMob = window.innerWidth < 768;
      const cardTween = gsap.fromTo(el,
        { opacity: 0, x: isMob ? 0 : (isLeft ? -80 : 80), y: isMob ? 40 : 30 },
        {
          opacity: 1, x: 0, y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
      triggers.push(cardTween.scrollTrigger);

      // Dot bounce
      if (dot) {
        const dotTween = gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.6,
            ease: 'back.out(3)',
            scrollTrigger: {
              trigger: el,
              start: 'top 72%',
              toggleActions: 'play none none none',
            },
          }
        );
        triggers.push(dotTween.scrollTrigger);
      }

      // Connector line draw
      if (connector) {
        const conProp = isMob ? 'scaleY' : 'scaleX';
        const conTween = gsap.fromTo(connector,
          { [conProp]: 0 },
          {
            [conProp]: 1,
            duration: isMob ? 0.9 : 0.7,
            delay: 0.2,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: el,
              start: 'top 72%',
              toggleActions: 'play none none none',
            },
          }
        );
        triggers.push(conTween.scrollTrigger);
      }

      // Icon scale in
      if (icon) {
        const iconTween = gsap.fromTo(icon,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.7,
            delay: 0.3,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
        triggers.push(iconTween.scrollTrigger);
      }

      // Title clip reveal
      if (title) {
        const titleTween = gsap.fromTo(title,
          { y: '100%' },
          {
            y: '0%',
            duration: 0.8,
            delay: 0.45,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
        triggers.push(titleTween.scrollTrigger);
      }

      // Tree on opposite side — subtle fade + scale
      const tree = treeRefs.current[i];
      if (tree) {
        const treeTween = gsap.fromTo(tree,
          { opacity: 0, scale: 0.85 },
          {
            opacity: 1, scale: 1,
            duration: 1.2,
            delay: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
        triggers.push(treeTween.scrollTrigger);
      }
    });

    return () => triggers.forEach(t => t && t.kill());
  }, []);

  return (
    <section ref={sectionRef} style={{
      background: C.white,
      padding: isMobile ? '80px 24px 80px' : '140px 64px 180px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 100, position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: 12, letterSpacing: '0.3em', color: C.terracota,
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 20,
        }}>Our Services</div>
        <WordReveal
          text="From strategy to execution - integrated solutions for complex challenges."
          italic="complex challenges."
          style={{
            fontWeight: 300, fontSize: isMobile ? 22 : 32, lineHeight: 1.5,
            letterSpacing: '-0.01em', color: C.ink, margin: '0 auto',
            maxWidth: 640, textWrap: 'balance',
          }}
        />
      </div>

      {/* Timeline container */}
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Central vertical line — hidden on mobile */}
        {!isMobile && (
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0,
            width: 1, marginLeft: -0.5,
          }}>
            <div ref={lineRef} style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(to bottom, ' + C.clearGreen + ', ' + C.green + ', ' + C.clearGreen + ')',
              transformOrigin: 'top center',
              transform: 'scaleY(0)',
            }} />
          </div>
        )}

        {/* Service items */}
        {items.map((it, i) => {
          const isLeft = i % 2 === 0;
          return (
            <ServiceCard
              key={it.title}
              item={it}
              index={i}
              isLeft={isLeft}
              isMobile={isMobile}
              itemRef={el => itemRefs.current[i] = el}
              dotRef={el => dotRefs.current[i] = el}
              connectorRef={el => connectorRefs.current[i] = el}
              iconRef={el => iconRefs.current[i] = el}
              titleRef={el => titleRefs.current[i] = el}
              treeRef={el => treeRefs.current[i] = el}
            />
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// 4. BattleTested - GSAP pinned scroll (Farm Minerals pattern)
// ============================================================
function BattleTested() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (isMobile || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.6,
        },
      });

      tl.fromTo(imageRef.current,
        { width: '100%', left: '0%', borderRadius: 0 },
        { width: '48%', left: '52%', borderRadius: 16, duration: 1, ease: 'power2.inOut' },
        0
      );

      tl.fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.3
      );

      tl.fromTo(textRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
        0.4
      );
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    return (
      <section style={{ background: C.bege, overflow: 'hidden' }}>
        <div style={{ height: 300, overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1800&q=80" alt="Track Record"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '48px 24px 80px' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.3em', color: C.green, textTransform: 'uppercase', fontWeight: 600, marginBottom: 24 }}>
            TRACK RECORD
          </div>
          <h2 style={{ fontWeight: 300, fontSize: 24, lineHeight: 1.2, letterSpacing: '-0.01em', color: C.ink, margin: '0 0 24px' }}>
            Shaped by decades of international experience
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: C.green, margin: '0 0 16px' }}>
            Orma is shaped by years of international consulting experience at Deloitte, combined with hands-on operational leadership. Strategy is only valuable when it translates into action.
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(92,100,87,0.7)', margin: 0 }}>
            Strategy, operations, project delivery and events are treated as one connected system - because they are.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} style={{
      position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: C.bege,
    }}>
      <div ref={imageRef} style={{
        position: 'absolute', top: 0, left: '0%', width: '100%', height: '100%',
        overflow: 'hidden', zIndex: 2,
      }}>
        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1800&q=80" alt="Track Record"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(238,232,218,0.6) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 64px' }}>
        <div ref={labelRef} style={{ opacity: 0, fontSize: 12, letterSpacing: '0.3em', color: C.green, textTransform: 'uppercase', fontWeight: 600, marginBottom: 40 }}>
          TRACK RECORD
        </div>
        <div ref={textRef} style={{ opacity: 0 }}>
          <h2 style={{ fontWeight: 300, fontSize: 36, lineHeight: 1.15, letterSpacing: '-0.02em', color: C.ink, margin: '0 0 32px' }}>
            Shaped by decades of international experience
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: C.green, margin: '0 0 20px', maxWidth: 480 }}>
            Orma is shaped by years of international consulting experience at Deloitte, combined with hands-on operational leadership. Strategy is only valuable when it translates into action.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(92,100,87,0.65)', margin: 0, maxWidth: 480 }}>
            Strategy, operations, project delivery and events are treated as one connected system - because they are.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 5. WhyUs - GSAP animated section (WhyOrma pattern)
// ============================================================
function WhyUs() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const textColRef = useRef(null);
  const communityRef = useRef(null);
  const cardRefs = useRef([]);
  const borderRefs = useRef([]);

  const whyRevealText = 'With over a decade of experience in international consulting, event management, and sports operations, Orma combines strategic depth with operational precision.';
  const communityText = 'We partner with organizations that value clarity - from global brands to local institutions - delivering results that last beyond the engagement.';

  const stats = [
    { num: '10', suffix: '+', label: 'Years of experience', icon: 'years' },
    { num: '50', suffix: '+', label: 'Projects delivered', icon: 'projects' },
    { num: '100', suffix: '%', label: 'Execution-driven', icon: 'reinvest' },
  ];

  useEffect(() => {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const triggers = [];

    // Section label fade in
    if (labelRef.current) {
      const t = gsap.fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
        }
      );
      triggers.push(t.scrollTrigger);
    }

    // Left column — text block slides up
    if (textColRef.current) {
      const t = gsap.fromTo(textColRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15,
          scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
        }
      );
      triggers.push(t.scrollTrigger);
    }

    // Community paragraph fade in (delayed)
    if (communityRef.current) {
      const t = gsap.fromTo(communityRef.current,
        { opacity: 0, y: 24 },
        { opacity: 0.65, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.6,
          scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
        }
      );
      triggers.push(t.scrollTrigger);
    }

    // Stat cards — staggered fade up with border draw
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const t = gsap.fromTo(card,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out',
          delay: 0.2 + i * 0.15,
          scrollTrigger: { trigger: section, start: 'top 65%', toggleActions: 'play none none none' }
        }
      );
      triggers.push(t.scrollTrigger);
    });

    // Border draw — terracota border height animates from 0 to 100%
    borderRefs.current.forEach((border, i) => {
      if (!border) return;
      const t = gsap.fromTo(border,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.7, ease: 'power2.out',
          delay: 0.4 + i * 0.15,
          scrollTrigger: { trigger: section, start: 'top 65%', toggleActions: 'play none none none' }
        }
      );
      triggers.push(t.scrollTrigger);
    });

    return () => triggers.forEach(t => t && t.kill());
  }, []);

  return (
    <section ref={sectionRef} style={{
      position: 'relative',
      background: C.green,
      padding: isMobile ? '80px 24px' : '140px 64px',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', right: -240, bottom: -200, width: 800, height: 800, pointerEvents: 'none' }}>
        <TreeMark opacity={0.08} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div ref={labelRef} style={{
          fontSize: 12, letterSpacing: '0.3em', color: C.bege,
          textTransform: 'uppercase', fontWeight: 600, marginBottom: isMobile ? 32 : 56,
          opacity: 0,
        }}>Why Orma</div>

        <div style={isMobile
          ? { display: 'flex', flexDirection: 'column', gap: 40 }
          : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }
        }>

          {/* LEFT — Narrative text */}
          <div>
            <div ref={textColRef} style={{ opacity: 0 }}>
              <WordReveal
                text={whyRevealText}
                style={{
                  fontSize: isMobile ? 20 : 28, lineHeight: 1.55, color: C.white, margin: 0, fontWeight: 300,
                  letterSpacing: '-0.01em',
                }}
              />
            </div>
            <p ref={communityRef} style={{
              fontSize: isMobile ? 14 : 15, lineHeight: 1.8, color: C.bege, margin: '36px 0 0', fontWeight: 400, opacity: 0,
              maxWidth: 480,
            }}>
              {communityText}
            </p>
          </div>

          {/* RIGHT — Stats grid */}
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 16,
            }}>
              {stats.map((stat, i) => {
                const IconComp = STAT_ICONS[stat.icon];
                const isFullWidth = i === 2;
                return (
                  <div key={i} ref={el => cardRefs.current[i] = el} style={{
                    padding: isMobile ? '24px 20px' : '28px 24px',
                    background: 'rgba(238,232,218,0.08)',
                    borderRadius: 8,
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: 0,
                    ...(isFullWidth && !isMobile ? { gridColumn: '1 / -1' } : {}),
                  }}>
                    {/* Animated terracota border */}
                    <div ref={el => borderRefs.current[i] = el} style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: 3, background: C.terracota, borderRadius: '3px 0 0 3px',
                      transformOrigin: 'top center', transform: 'scaleY(0)',
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      {IconComp && React.createElement(IconComp)}
                      <div style={{
                        fontSize: 10, letterSpacing: '0.2em', color: 'rgba(238,232,218,0.7)',
                        textTransform: 'uppercase', fontWeight: 600,
                      }}>{stat.label}</div>
                    </div>
                    <div style={{
                      fontWeight: 500, fontSize: isMobile ? 48 : 56, lineHeight: 1, letterSpacing: '-0.03em',
                      color: C.bege,
                    }}>
                      <RollingNumber value={stat.num} suffix={stat.suffix} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ============================================================
// 6. Footer - EXACT copy from homepage
// ============================================================
function Footer() {
  const isMobile = useIsMobile();
  const footerRef = useScrollReveal();

  return (
    <footer style={{
      background: '#3D4239', color: C.bege,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Giant watermark "orma." text */}
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr',
          gap: isMobile ? 48 : 80,
          paddingBottom: isMobile ? 56 : 80,
        }}>
          {/* Left — Big CTA */}
          <div>
            <div style={{
              fontSize: 11, letterSpacing: '0.3em', color: C.clearGreen,
              textTransform: 'uppercase', fontWeight: 600, marginBottom: 28,
            }}>Contact</div>
            <h2 style={{
              fontWeight: 300, fontSize: isMobile ? 36 : 56, lineHeight: 1.1,
              letterSpacing: '-0.02em', color: C.bege, margin: 0,
            }}>
              Let's talk about your next <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.terracota }}>project.</em>
            </h2>

            <div style={{ display: 'flex', gap: 16, marginTop: isMobile ? 32 : 44, flexWrap: 'wrap' }}>
              <a href="index.html#contact" style={{
                position: 'relative', overflow: 'hidden',
                display: 'inline-block', padding: '16px 36px',
                background: C.terracota, color: C.white,
                fontWeight: 600, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 40,
              }}
              onMouseEnter={e => {
                const fill = e.currentTarget.querySelector('.footer-btn-fill');
                if (fill) fill.style.transform = 'translateX(0)';
              }}
              onMouseLeave={e => {
                const fill = e.currentTarget.querySelector('.footer-btn-fill');
                if (fill) fill.style.transform = 'translateX(-101%)';
              }}
              >
                <span className="footer-btn-fill" style={{
                  position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.15)',
                  transform: 'translateX(-101%)',
                  transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  borderRadius: 'inherit',
                }} />
                <span style={{ position: 'relative', zIndex: 1 }}>Get in touch</span>
              </a>
              <a href="index.html#projects" style={{
                position: 'relative', overflow: 'hidden',
                display: 'inline-block', padding: '16px 36px',
                background: 'transparent', color: C.bege,
                fontWeight: 500, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 40,
                border: '1px solid rgba(238,232,218,0.25)',
              }}
              onMouseEnter={e => {
                const fill = e.currentTarget.querySelector('.footer-btn-fill2');
                if (fill) fill.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = 'rgba(238,232,218,0.5)';
              }}
              onMouseLeave={e => {
                const fill = e.currentTarget.querySelector('.footer-btn-fill2');
                if (fill) fill.style.transform = 'translateX(-101%)';
                e.currentTarget.style.borderColor = 'rgba(238,232,218,0.25)';
              }}
              >
                <span className="footer-btn-fill2" style={{
                  position: 'absolute', inset: 0, background: 'rgba(238,232,218,0.08)',
                  transform: 'translateX(-101%)',
                  transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  borderRadius: 'inherit',
                }} />
                <span style={{ position: 'relative', zIndex: 1 }}>Our projects</span>
              </a>
            </div>
          </div>

          {/* Right — Contact details */}
          <div style={{ paddingTop: isMobile ? 0 : 16 }}>
            {[
              { label: 'Email', value: 'contact@orma.pt', href: 'mailto:contact@orma.pt' },
              { label: 'Phone', value: '+351 916 503 974', href: 'tel:+351916503974' },
              { label: 'Address', value: 'Praça do Bom Sucesso, n.º 159\nPiso 1, Loja 200\n4150-146 Porto, Portugal' },
            ].map((item, i) => (
              <div key={item.label} style={{
                borderTop: i === 0 ? '1px solid rgba(238,232,218,0.12)' : 'none',
                borderBottom: '1px solid rgba(238,232,218,0.12)',
                padding: '20px 0',
              }}>
                <div style={{
                  fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: C.clearGreen, fontWeight: 600, marginBottom: 6,
                }}>{item.label}</div>
                {item.href ? (
                  <a href={item.href} style={{
                    fontSize: 15, color: C.bege, lineHeight: 1.5,
                    textDecoration: 'none', transition: 'opacity 0.3s',
                  }}>{item.value}</a>
                ) : (
                  <div style={{
                    fontSize: 15, color: C.bege, lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                  }}>{item.value}</div>
                )}
              </div>
            ))}

            {/* Social links */}
            <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
              {[
                { name: 'Instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg> },
                { name: 'LinkedIn', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
              ].map(s => (
                <a key={s.name} href="#" aria-label={s.name} style={{
                  color: C.clearGreen, transition: 'color 0.3s, opacity 0.3s',
                  display: 'flex', alignItems: 'center',
                }}
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
            <img src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png" alt="Orma" loading="lazy" style={{ height: 28, width: 'auto', display: 'block' }} />
            <span>&copy; {new Date().getFullYear()} Orma. All rights reserved.</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="https://docs.google.com/document/d/107iYVCpO5_59dvI3KhUq_LoafRZwY1-89oZtNZJutyA/edit" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(177,180,169,0.6)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="https://docs.google.com/document/d/1O4AEvDYWC2lBJgqIiTjNrDMOZFl1THq7r-Ay4dkOkRs/edit" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(177,180,169,0.6)', textDecoration: 'none' }}>Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// FloatingButtons - WhatsApp + Scroll to top
// ============================================================
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
      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(31,32,34,0.7)', backdropFilter: 'blur(6px)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          opacity: showTop ? 1 : 0,
          pointerEvents: showTop ? 'auto' : 'none',
          transform: showTop ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 14V2M3 6l5-4 5 4" />
        </svg>
      </button>
      {/* WhatsApp */}
      <a
        href="https://wa.me/351220000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
    </div>
  );
}

// ============================================================
// ConsultancyPage - main export
// ============================================================
function ConsultancyPage() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      fontFamily: '"General Sans", system-ui, sans-serif',
    }}>
      <Nav />
      <ConsultancyHero />
      {/* Spacer for fixed hero */}
      <div style={{ height: '100vh' }} />
      {/* Content scrolls over the fixed hero */}
      <div style={{ position: 'relative', zIndex: 3, background: C.white }}>
        <Approach />
        <Services />
        <BattleTested />
        <WhyUs />
        <Footer />
      </div>
      <FloatingButtons />
    </div>
  );
}

window.ConsultancyPage = ConsultancyPage;
