/* global React */
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
      backgroundImage: 'url(https://tiagoc108.sg-host.com/wp-content/uploads/2025/12/orma-arvore-black-1.png)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      opacity,
      ...style,
    }} aria-hidden="true" />
  );
}

// ============================================================
// SiteImage
// ============================================================
function SiteImage({ src, style = {} }) {
  return (
    <div style={{
      backgroundImage: `url(${src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      ...style,
    }} />
  );
}

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
            geral@orma.pt
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
// 1. ConsultancyHero
// ============================================================
function ConsultancyHero() {
  const isMobile = useIsMobile();

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      minHeight: 600,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(31,32,34,0.35) 0%, rgba(31,32,34,0.55) 100%)',
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
        }}>Consultoria</div>
        <h1 style={{
          fontWeight: 300, fontSize: isMobile ? 40 : 64,
          lineHeight: 1.08, letterSpacing: '-0.02em',
          color: C.white, margin: 0, maxWidth: 700,
        }}>Clarity at Scale</h1>
        <p style={{
          fontWeight: 300, fontSize: isMobile ? 16 : 18,
          lineHeight: 1.7, color: 'rgba(255,255,255,0.8)',
          margin: 0, marginTop: 24, maxWidth: 600,
        }}>
          We help businesses, sports entities and brands simplify complexity, optimize operations and deliver memorable events.
        </p>
      </div>
    </section>
  );
}

// ============================================================
// 2. TailoredByDesign
// ============================================================
function TailoredByDesign() {
  const isMobile = useIsMobile();
  const revealRef = useScrollReveal();

  return (
    <section ref={revealRef} style={{
      background: C.white,
      padding: isMobile ? '80px 24px' : '120px 64px',
      willChange: 'opacity, transform',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 48 : 80,
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase',
            fontWeight: 600, color: C.green, marginBottom: 28,
          }}>A Nossa Abordagem</div>
          <WordReveal
            text="There is no universal model for growth. Orma builds custom frameworks that align with each client's industry, culture, and ambition."
            style={{
              fontWeight: 300, fontSize: isMobile ? 28 : 42,
              lineHeight: 1.2, letterSpacing: '-0.01em',
              color: C.ink, margin: 0,
            }}
          />
        </div>
        <SiteImage
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80"
          style={{
            width: '100%',
            height: isMobile ? 320 : 480,
            borderRadius: 4,
          }}
        />
      </div>
    </section>
  );
}

// ============================================================
// 3. Services
// ============================================================
function Services() {
  const isMobile = useIsMobile();
  const revealRef = useScrollReveal();

  const services = [
    {
      num: '01',
      title: 'Strategic, Operational & Project Consulting',
      desc: 'From organizational design to process optimization, we simplify structures and streamline operations.',
    },
    {
      num: '02',
      title: 'Event Strategy & Operational Management',
      desc: 'End-to-end event planning - from venue selection and logistics to on-site execution and post-event analysis.',
    },
    {
      num: '03',
      title: 'Sports Consulting & Professional Match Operations',
      desc: 'Advisory for clubs, federations and sporting organizations - matchday operations, venue strategy and fan experience.',
    },
  ];

  return (
    <section ref={revealRef} style={{
      background: C.bege,
      padding: isMobile ? '80px 24px' : '120px 64px',
      willChange: 'opacity, transform',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase',
          fontWeight: 600, color: C.green, marginBottom: 16,
        }}>Servicos</div>
        <h2 style={{
          fontWeight: 300, fontSize: isMobile ? 32 : 48,
          lineHeight: 1.1, letterSpacing: '-0.02em',
          color: C.ink, margin: 0, marginBottom: isMobile ? 48 : 64,
        }}>What we deliver</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 40 : 48,
        }}>
          {services.map((s) => (
            <ServiceCard key={s.num} {...s} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ num, title, desc, isMobile }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderTop: `2px solid ${C.green}`,
        padding: isMobile ? '32px 0' : '36px 0',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div style={{
        fontSize: 13, fontWeight: 600, color: C.clearGreen,
        letterSpacing: '0.1em', marginBottom: 16,
      }}>{num}</div>
      <h3 style={{
        fontWeight: 500, fontSize: isMobile ? 20 : 22,
        lineHeight: 1.3, color: C.ink, margin: 0, marginBottom: 14,
      }}>{title}</h3>
      <p style={{
        fontWeight: 300, fontSize: 16, lineHeight: 1.7,
        color: 'rgba(31,32,34,0.7)', margin: 0,
      }}>{desc}</p>
    </div>
  );
}

// ============================================================
// 4. BattleTested
// ============================================================
function BattleTested() {
  const isMobile = useIsMobile();

  return (
    <section style={{
      background: C.green,
      padding: isMobile ? '100px 24px' : '140px 64px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -60, bottom: -40,
        width: 400, height: 400, opacity: 0.06, pointerEvents: 'none',
      }}>
        <TreeMark opacity={1} />
      </div>
      <div style={{
        maxWidth: 900, margin: '0 auto',
        position: 'relative', zIndex: 2,
      }}>
        <WordReveal
          text="Orma is shaped by years of international consulting experience at Deloitte, combined with hands-on operational leadership. Strategy is only valuable when it translates into action."
          style={{
            fontWeight: 300, fontSize: isMobile ? 26 : 38,
            lineHeight: 1.35, letterSpacing: '-0.01em',
            color: C.bege, margin: 0, textAlign: 'center',
          }}
        />
      </div>
    </section>
  );
}

// ============================================================
// 5. EndToEnd
// ============================================================
function EndToEnd() {
  const isMobile = useIsMobile();
  const revealRef = useScrollReveal();

  return (
    <section ref={revealRef} style={{
      background: C.white,
      padding: isMobile ? '80px 24px' : '120px 64px',
      willChange: 'opacity, transform',
    }}>
      <div style={{
        maxWidth: 720, margin: '0 auto', textAlign: 'center',
      }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase',
          fontWeight: 600, color: C.green, marginBottom: 28,
        }}>Integracao</div>
        <p style={{
          fontWeight: 300, fontSize: isMobile ? 22 : 28,
          lineHeight: 1.5, color: C.ink, margin: 0,
          letterSpacing: '-0.01em',
        }}>
          Strategy, operations, project delivery and events are treated as one connected system - because they are.
        </p>
      </div>
    </section>
  );
}

// ============================================================
// 6. WhyUs
// ============================================================
function WhyUs() {
  const isMobile = useIsMobile();
  const revealRef = useScrollReveal();

  const points = [
    { value: '10+', label: 'Years of consulting experience' },
    { value: '50+', label: 'Events managed internationally' },
    { value: '3', label: 'Core practice areas' },
    { value: '100%', label: 'Execution-driven approach' },
  ];

  return (
    <section ref={revealRef} style={{
      background: C.grey,
      padding: isMobile ? '80px 24px' : '120px 64px',
      willChange: 'opacity, transform',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase',
          fontWeight: 600, color: C.green, marginBottom: 28,
        }}>Porque a Orma</div>
        <p style={{
          fontWeight: 300, fontSize: isMobile ? 17 : 18,
          lineHeight: 1.7, color: 'rgba(31,32,34,0.8)',
          margin: 0, marginBottom: isMobile ? 48 : 64, maxWidth: 680,
        }}>
          With over a decade of experience in international consulting, event management, and sports operations, Orma combines strategic depth with operational precision.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? 32 : 48,
        }}>
          {points.map((p, i) => (
            <div key={i} style={{
              borderTop: `1px solid ${C.clearGreen}`,
              paddingTop: 20,
            }}>
              <div style={{
                fontWeight: 300, fontSize: isMobile ? 36 : 48,
                lineHeight: 1, color: C.green,
                letterSpacing: '-0.02em', marginBottom: 8,
              }}>{p.value}</div>
              <div style={{
                fontWeight: 400, fontSize: 14, lineHeight: 1.5,
                color: 'rgba(31,32,34,0.6)', letterSpacing: '0.02em',
              }}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 7. ContactForm
// ============================================================
function ContactForm() {
  const isMobile = useIsMobile();
  const revealRef = useScrollReveal();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '', termos: false });
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    fontSize: 15, fontWeight: 300,
    fontFamily: '"General Sans", system-ui, sans-serif',
    color: C.white,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    outline: 'none',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    transition: 'border-color 0.3s, background 0.3s',
  };

  const handleChange = (field) => (e) => {
    const val = field === 'termos' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" ref={revealRef} style={{
      background: C.green,
      padding: isMobile ? '80px 24px' : '120px 64px',
      position: 'relative',
      overflow: 'hidden',
      willChange: 'opacity, transform',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <h2 style={{
          fontWeight: 300, fontSize: isMobile ? 30 : 42,
          lineHeight: 1.15, letterSpacing: '-0.02em',
          color: C.bege, margin: 0, marginBottom: 48,
          textAlign: 'center',
        }}>
          Vamos conversar sobre o seu projecto
        </h2>

        {submitted ? (
          <div style={{ textAlign: 'center', color: C.bege }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
            <p style={{ fontWeight: 300, fontSize: 18, lineHeight: 1.6 }}>
              Obrigado pela sua mensagem. Entraremos em contacto brevemente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 20,
          }}>
            <input
              type="text" placeholder="Nome" required
              value={form.nome} onChange={handleChange('nome')}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
            <input
              type="email" placeholder="Email" required
              value={form.email} onChange={handleChange('email')}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
            <input
              type="tel" placeholder="Telefone"
              value={form.telefone} onChange={handleChange('telefone')}
              style={{ ...inputStyle, gridColumn: isMobile ? 'auto' : '1 / -1' }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
            <textarea
              placeholder="Mensagem" rows={5} required
              value={form.mensagem} onChange={handleChange('mensagem')}
              style={{
                ...inputStyle,
                gridColumn: isMobile ? 'auto' : '1 / -1',
                resize: 'vertical',
                minHeight: 120,
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
            <label style={{
              gridColumn: isMobile ? 'auto' : '1 / -1',
              display: 'flex', alignItems: 'flex-start', gap: 12,
              fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.5, cursor: 'pointer',
            }}>
              <input
                type="checkbox" required
                checked={form.termos} onChange={handleChange('termos')}
                style={{ marginTop: 3, accentColor: C.terracota }}
              />
              Aceito os Termos e Condicoes e a Politica de Privacidade.
            </label>
            <div style={{ gridColumn: isMobile ? 'auto' : '1 / -1', textAlign: 'center', marginTop: 8 }}>
              <button type="submit" style={{
                position: 'relative', overflow: 'hidden',
                padding: '16px 40px',
                background: C.terracota, color: C.white,
                border: 'none', borderRadius: 40,
                fontFamily: '"General Sans", system-ui, sans-serif',
                fontWeight: 600, fontSize: 12, letterSpacing: '0.15em',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                const fill = e.currentTarget.querySelector('.form-btn-fill');
                if (fill) fill.style.transform = 'translateX(0)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                const fill = e.currentTarget.querySelector('.form-btn-fill');
                if (fill) fill.style.transform = 'translateX(-101%)';
              }}
              >
                <span className="form-btn-fill" style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(255,255,255,0.15)',
                  transform: 'translateX(-101%)',
                  transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  borderRadius: 'inherit',
                }} />
                <span style={{ position: 'relative', zIndex: 1 }}>Enviar Mensagem</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

// ============================================================
// 8. Footer
// ============================================================
function Footer() {
  const isMobile = useIsMobile();
  const footerRef = useScrollReveal();

  return (
    <footer style={{
      background: '#3D4239', color: C.bege,
      position: 'relative', overflow: 'hidden',
    }}>
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
              <a href="#contact" onClick={e => { e.preventDefault(); const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} style={{
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

          <div style={{ paddingTop: isMobile ? 0 : 16 }}>
            {[
              { label: 'Email', value: 'info@orma.pt', href: 'mailto:info@orma.pt' },
              { label: 'Phone', value: '+351 220 000 000', href: 'tel:+351220000000' },
              { label: 'Address', value: 'Rua de Cedofeita 123\nPorto, Portugal' },
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

            <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
              {[
                { name: 'Instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg> },
                { name: 'LinkedIn', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
                { name: 'Facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
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
            <img src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png" alt="Orma" loading="lazy" style={{ height: 18, opacity: 0.5 }} />
            <span>&copy; {new Date().getFullYear()} Orma. All rights reserved.</span>
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
      <a
        href="https://wa.me/351220000000"
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
      overflow: 'hidden',
      background: C.white,
      position: 'relative',
      fontFamily: '"General Sans", system-ui, sans-serif',
    }}>
      <Nav />
      <ConsultancyHero />
      <TailoredByDesign />
      <Services />
      <BattleTested />
      <EndToEnd />
      <WhyUs />
      <ContactForm />
      <Footer />
      <FloatingButtons />
    </div>
  );
}

window.ConsultancyPage = ConsultancyPage;
