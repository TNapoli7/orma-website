/* global React */
const { useState, useEffect, useRef } = React;

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
// useIsMobile — responsive breakpoint hook
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
// useScrollReveal — IntersectionObserver-triggered fade + slide
// Elements start invisible, animate in when entering viewport.
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
// WordReveal — scroll-driven word-by-word text reveal
// Each word starts faded, becomes opaque as user scrolls.
// Progress tied to scroll position (not one-shot).
// ============================================================
function WordReveal({ text, italic, style }) {
  const containerRef = useRef(null);

  // Split text into segments: regular words and the italic portion
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
      // Range: words start revealing when container top hits 85% of viewport
      // All words revealed when container top hits 25% of viewport
      const enter = wh * 0.85;
      const full = wh * 0.25;
      const totalWords = wordEls.length;

      wordEls.forEach((wordEl, i) => {
        // Each word has its own reveal point within the scroll range
        const wordStart = enter - (i / totalWords) * (enter - full);
        const wordEnd = wordStart - (enter - full) * 0.12; // each word reveals over ~12% of the range

        let p;
        if (rect.top >= wordStart) p = 0;
        else if (rect.top <= wordEnd) p = 1;
        else p = (wordStart - rect.top) / (wordStart - wordEnd);

        // Clamp
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
// SiteImage — real image via background-image
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
// Tree watermark — actual tree PNG
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
        <span style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500, fontSize: size, color, letterSpacing: '-0.02em', marginLeft: 2 }}>rma.</span>
      </div>
      {withSubline && (
        <div style={{ fontFamily: '"General Sans", sans-serif', fontSize: size * 0.28, letterSpacing: '0.32em', color, fontWeight: 500, textTransform: 'uppercase', marginLeft: size * 0.06 }}>Designed for Living</div>
      )}
    </div>
  );
}

function Placeholder({ label, tone = 'green', style = {}, captionPos = 'bottom-left' }) {
  const stripes = {
    green: `repeating-linear-gradient(135deg, ${C.green}22 0 2px, transparent 2px 14px), linear-gradient(160deg, ${C.clearGreen}66 0%, ${C.green}55 100%)`,
    bege: `repeating-linear-gradient(135deg, ${C.green}1c 0 2px, transparent 2px 14px), ${C.bege}`,
    grey: `repeating-linear-gradient(135deg, ${C.ink}14 0 2px, transparent 2px 14px), ${C.grey}`,
    dark: `repeating-linear-gradient(135deg, ${C.bege}22 0 2px, transparent 2px 14px), ${C.green}`,
    warm: `repeating-linear-gradient(135deg, ${C.terracota}22 0 2px, transparent 2px 14px), linear-gradient(160deg, ${C.bege} 0%, #d6c8a8 100%)`,
  }[tone];
  const captionColor = tone === 'dark' ? C.bege : C.green;
  const positions = {
    'bottom-left': { left: 18, bottom: 16 },
    'top-left': { left: 18, top: 16 },
    'bottom-right': { right: 18, bottom: 16 },
    'top-right': { right: 18, top: 16 },
  };
  return (
    <div style={{ position: 'relative', background: stripes, overflow: 'hidden', ...style }}>
      <div style={{
        position: 'absolute', ...positions[captionPos],
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 10, letterSpacing: '0.08em', color: captionColor,
        textTransform: 'uppercase',
        background: tone === 'dark' ? `${C.green}cc` : `${C.bege}dd`,
        padding: '5px 9px', borderRadius: 1, maxWidth: '70%',
      }}>{label}</div>
    </div>
  );
}


// ============================================================
// Loading Screen - smooth clip-path logo reveal
// ============================================================
function LoadingScreen() {
  const [phase, setPhase] = useState('reveal'); // reveal -> hold -> exit -> done

  useEffect(() => {
    if (!document.getElementById('orma-loader-css')) {
      const style = document.createElement('style');
      style.id = 'orma-loader-css';
      style.textContent = `
        @keyframes ormaReveal {
          0% {
            clip-path: inset(0 100% 0 0);
            opacity: 0.4;
            transform: scale(0.97);
          }
          20% {
            opacity: 1;
          }
          100% {
            clip-path: inset(0 0% 0 0);
            opacity: 1;
            transform: scale(1);
          }
        }
        .orma-logo-reveal {
          animation: ormaReveal 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `;
      document.head.appendChild(style);
    }
    const t1 = setTimeout(() => setPhase('hold'), 1700);
    const t2 = setTimeout(() => setPhase('exit'), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%',
      height: phase === 'exit' ? '0vh' : '100vh',
      background: C.green,
      zIndex: 9999,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'height 1s cubic-bezier(0.65, 0, 0.35, 1)',
    }}
      onTransitionEnd={() => { if (phase === 'exit') setPhase('done'); }}
    >
      <img
        className="orma-logo-reveal"
        src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/12/orma-bege-slogan-2.png"
        alt="Orma"
        style={{
          width: 220,
          height: 65,
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

// ============================================================
// 1. Nav — logo left, hamburger right, fullscreen overlay menu
// ============================================================
function MenuLink({ label, href, onClose, hasChildren, children }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleClick = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setExpanded(!expanded);
    } else {
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
          fontFamily: '"General Sans", sans-serif',
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

function MenuSubLink({ label, subtitle, onClose }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClose(); }}
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
        fontFamily: '"General Sans", sans-serif',
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
          display: 'block', fontFamily: '"General Sans", sans-serif',
          fontWeight: 300, fontSize: 12, letterSpacing: '0.06em',
          color: 'rgba(238,232,218,0.5)', marginTop: 2,
        }}>{subtitle}</span>
      )}
    </a>
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
        width: 420,
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
            <MenuLink label="Projects" onClose={onClose} hasChildren>
              <MenuSubLink label="Lir 725" subtitle="Porto" onClose={onClose} />
              <MenuSubLink label="Villas Sto. Tirso" subtitle="Santo Tirso" onClose={onClose} />
            </MenuLink>
            <MenuLink label="About" onClose={onClose} />
            <MenuLink label="Contact" onClose={onClose} />
          </nav>
        </div>

        {/* Bottom: contact info */}
        <div style={{ borderTop: '1px solid rgba(238,232,218,0.15)', paddingTop: 32 }}>
          <p style={{
            fontFamily: '"General Sans", sans-serif', fontWeight: 300,
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
        background: inHero ? 'transparent' : C.green,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 150,
        transform: visible || menuOpen ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease',
      }}>
        {/* Logo wordmark */}
        <a href="#" style={{ display: 'block', lineHeight: 0 }}>
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
// 2. Hero — Full-bleed video background
// ============================================================
function Hero() {
  const isMobile = useIsMobile();
  const [loaded, setLoaded] = useState(false);

  return (
    <section data-screen-label="01 Hero" style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      zIndex: 1,
    }}>
      {/* Video background */}
      <video
        autoPlay muted loop playsInline
        onCanPlay={() => setLoaded(true)}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="https://tiagoc108.sg-host.com/wp-content/uploads/2026/04/iStock-1463851868.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(31,32,34,0.35) 0%, rgba(31,32,34,0.55) 100%)',
        zIndex: 1,
      }} />

      {/* Tree watermark */}
      <div style={{ position: 'absolute', right: -120, bottom: -80, width: 600, height: 600, pointerEvents: 'none', zIndex: 1 }}>
        <TreeMark opacity={0.08} style={{ filter: 'brightness(10)' }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobile ? '0 24px' : '0 64px',
        maxWidth: 800,
      }}>
        <div style={{
          fontFamily: '"General Sans", sans-serif',
          fontSize: 12, letterSpacing: '0.3em',
          color: C.bege, textTransform: 'uppercase', fontWeight: 600,
          marginBottom: 36,
          display: 'flex', alignItems: 'center', gap: 14,
          opacity: 0.85,
        }}>
          <span style={{ width: 32, height: 1, background: C.bege }} />
          Porto · Santo Tirso
        </div>

        <h1 style={{
          fontFamily: '"General Sans", sans-serif',
          fontWeight: 300, fontSize: isMobile ? 40 : 76, lineHeight: 1.0,
          letterSpacing: '-0.025em', color: C.white, margin: 0, textWrap: 'balance',
        }}>
          Designed for <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.bege }}>Living.</em>
        </h1>

        <p style={{
          fontFamily: '"General Sans", sans-serif',
          fontWeight: 400, fontSize: 18, lineHeight: 1.7,
          color: C.bege, marginTop: 32, marginBottom: 0, maxWidth: 520,
          opacity: 0.9,
        }}>
          Spaces shaped around how you live, designed with clarity, light and purpose.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 20 : 28, marginTop: isMobile ? 32 : 44, flexWrap: 'wrap' }}>
          <button style={{
            background: C.terracota, color: C.white, border: 'none',
            padding: '16px 32px',
            fontFamily: '"General Sans", sans-serif',
            fontWeight: 500, fontSize: 13, letterSpacing: '0.16em',
            textTransform: 'uppercase', borderRadius: 6, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 12,
          }}>
            Explore our projects <span>→</span>
          </button>
          <a href="#" style={{
            fontFamily: '"General Sans", sans-serif',
            fontSize: 13, color: C.bege, textDecoration: 'none',
            fontWeight: 500, borderBottom: `1px solid ${C.bege}66`, paddingBottom: 2,
          }}>Our story →</a>
        </div>
      </div>

    </section>
  );
}

// ============================================================
// 3. Brand Promise — symmetrical breath
// ============================================================
function Promise() {
  const isMobile = useIsMobile();
  return (
    <section data-screen-label="02 Promise" style={{
      position: 'relative',
      background: C.bege,
      padding: isMobile ? '80px 24px 100px' : '180px 64px 200px',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: isMobile ? 400 : 760, height: isMobile ? 400 : 760, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
        <TreeMark opacity={0.07} />
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <WordReveal
          text="Each project is designed with a focus on natural light, spatial clarity and the connection between indoor and outdoor living - creating spaces that feel intuitive, balanced and easy to live in."
          italic="live in."
          style={{
            fontFamily: '"General Sans", sans-serif',
            fontWeight: 300, fontSize: isMobile ? 24 : 38, lineHeight: 1.5,
            letterSpacing: '-0.015em', color: C.ink, margin: 0, textWrap: 'balance',
          }}
        />
      </div>
    </section>
  );
}

// ============================================================
// 4. Three Pillars — animated vertical timeline (refined)
// ============================================================
function PillarIconLand() {
  return (
    <svg width="38" height="38" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 3L15 5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="15" cy="9" r="4" stroke={C.green} strokeWidth="1.5"/>
      <path d="M15 13L15 27" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 27H24" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 24C9 20 15 18 15 18C15 18 21 20 21 24" stroke={C.green} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function PillarIconDesign() {
  return (
    <svg width="38" height="38" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="22" height="18" rx="1.5" stroke={C.green} strokeWidth="1.5"/>
      <path d="M4 12H26" stroke={C.green} strokeWidth="1.2"/>
      <path d="M10 8V5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 8V5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="8" y="16" width="6" height="3" rx="0.5" stroke={C.green} strokeWidth="1" opacity="0.6"/>
      <rect x="16" y="16" width="6" height="3" rx="0.5" stroke={C.green} strokeWidth="1" opacity="0.6"/>
      <rect x="8" y="21" width="6" height="3" rx="0.5" stroke={C.green} strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}

function PillarIconTrust() {
  return (
    <svg width="38" height="38" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 27L6 13L15 6L24 13L24 27" stroke={C.green} strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="12" y="19" width="6" height="8" rx="0.5" stroke={C.green} strokeWidth="1.3"/>
      <circle cx="16.5" cy="23" r="0.8" fill={C.green}/>
      <path d="M3 27H27" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="10" y="15" width="3" height="2.5" rx="0.5" stroke={C.green} strokeWidth="1" opacity="0.5"/>
      <rect x="17" y="15" width="3" height="2.5" rx="0.5" stroke={C.green} strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}

const PILLAR_SVG = { land: PillarIconLand, design: PillarIconDesign, trust: PillarIconTrust };

function PillarCard({ item, index, isLeft, itemRef, dotRef, connectorRef, iconRef, titleRef, treeRef, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const IconComponent = PILLAR_SVG[item.kind];
  const treeRotations = [-8, 6, 12];
  const treeSizes = [220, 200, 190];

  if (isMobile) {
    return (
      <div ref={itemRef} style={{
        marginBottom: index < 2 ? 32 : 0,
        padding: '36px 28px 32px',
        background: C.bege,
        borderRadius: 6,
        opacity: 0,
      }}>
        <div ref={iconRef} style={{
          width: 56, height: 56, borderRadius: '50%',
          background: C.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
          boxShadow: '0 2px 12px rgba(92,100,87,0.1)',
          transform: 'scale(0)',
        }}>
          {IconComponent && <IconComponent />}
        </div>
        <div style={{ overflow: 'hidden', marginBottom: 12 }}>
          <h3 ref={titleRef} style={{
            fontFamily: '"General Sans", sans-serif',
            fontWeight: 600, fontSize: 20, color: C.ink,
            margin: 0, letterSpacing: '-0.01em', lineHeight: 1.3,
            transform: 'translateY(100%)',
          }}>{item.title}</h3>
        </div>
        <div style={{ width: 28, height: 2, background: C.terracota, marginBottom: 14, borderRadius: 1, opacity: 0.6 }} />
        <p style={{
          fontFamily: '"General Sans", sans-serif',
          fontSize: 14, lineHeight: 1.7, color: C.green, margin: 0,
        }}>{item.body}</p>
        {/* Hidden refs for GSAP compatibility */}
        <div ref={dotRef} style={{ display: 'none' }} />
        <div ref={connectorRef} style={{ display: 'none' }} />
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
      {/* Tree on the OPPOSITE side — appears before card if card is on the right */}
      {!isLeft && (
        <div ref={treeRef} className="pillar-tree" style={{
          width: 'calc(50% - 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: 'auto',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: treeSizes[index], height: treeSizes[index],
            transform: 'rotate(' + treeRotations[index] + 'deg)',
          }}>
            <TreeMark opacity={1} style={{ filter: 'sepia(1) saturate(0.3) hue-rotate(60deg) brightness(0.92)' }} />
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

      {/* Connector line (animated) */}
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
        {/* Icon in circular badge — inline SVG */}
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

        {/* Title with clip reveal */}
        <div style={{ overflow: 'hidden', marginBottom: 16 }}>
          <h3 ref={titleRef} style={{
            fontFamily: '"General Sans", sans-serif',
            fontWeight: 600, fontSize: 24, color: C.ink,
            margin: 0, letterSpacing: '-0.01em', lineHeight: 1.3,
            transform: 'translateY(100%)',
          }}>{item.title}</h3>
        </div>

        {/* Subtle divider */}
        <div style={{ width: 32, height: 2, background: C.terracota, marginBottom: 18, borderRadius: 1, opacity: 0.6 }} />

        {/* Description */}
        <p style={{
          fontFamily: '"General Sans", sans-serif',
          fontSize: 15, lineHeight: 1.8, color: C.green, margin: 0,
        }}>{item.body}</p>
      </div>

      {/* Tree on the OPPOSITE side — appears after card if card is on the left */}
      {isLeft && (
        <div ref={treeRef} className="pillar-tree" style={{
          width: 'calc(50% - 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: 'auto',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: treeSizes[index], height: treeSizes[index],
            transform: 'rotate(' + treeRotations[index] + 'deg)',
          }}>
            <TreeMark opacity={1} style={{ filter: 'sepia(1) saturate(0.3) hue-rotate(60deg) brightness(0.92)' }} />
          </div>
        </div>
      )}
    </div>
  );
}

function Pillars() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const itemRefs = useRef([]);
  const dotRefs = useRef([]);
  const connectorRefs = useRef([]);
  const iconRefs = useRef([]);
  const titleRefs = useRef([]);
  const treeRefs = useRef([]);
  const headingRef = useRef(null);

  const items = [
    { kind: 'land', title: 'Land Vision', body: 'We identify locations where city convenience meets natural surroundings. Every site is chosen for its balance between access, quality of life, and long-term value.' },
    { kind: 'design', title: 'Thoughtful Design', body: 'We collaborate with architects to create layouts that feel intuitive, balanced, and filled with natural light. Spaces shaped by how families actually live.' },
    { kind: 'trust', title: 'Trusted Construction', body: 'We work with experienced engineering and construction partners who share our respect for quality, integrity and responsible execution. Every project is monitored closely to ensure that what we build matches what we promised.' },
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

    // Animate each pillar card with staggered internal elements
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const isLeft = i % 2 === 0;
      const connector = connectorRefs.current[i];
      const icon = iconRefs.current[i];
      const title = titleRefs.current[i];
      const dot = dotRefs.current[i];

      // Card slide in — simple fade-up on mobile, slide from side on desktop
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
        const conTween = gsap.fromTo(connector,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.7,
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

      // Tree on opposite side — no GSAP for now, static watermark
    });

    return () => triggers.forEach(t => t && t.kill());
  }, []);

  return (
    <section ref={sectionRef} data-screen-label="03 Pillars" style={{
      background: C.white,
      padding: isMobile ? '80px 24px 80px' : '140px 64px 180px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Section heading — WordReveal */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 100, position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: '"General Sans", sans-serif',
          fontSize: 12, letterSpacing: '0.3em', color: C.terracota,
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 20,
        }}>Our Approach</div>
        <WordReveal
          text="From land to living - a process built on clarity, design and trust."
          italic="clarity, design and trust."
          style={{
            fontFamily: '"General Sans", sans-serif',
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

        {/* Pillar items */}
        {items.map((it, i) => {
          const isLeft = i % 2 === 0;
          return (
            <PillarCard
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
// 5. Featured projects — full-screen horizontal scroll (Verium style)
//    Uses GSAP ScrollTrigger to pin + translate horizontally
// ============================================================
function Projects() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const stRef = useRef(null); // ScrollTrigger instance
  const [activeIndex, setActiveIndex] = useState(0);

  const projects = [
    {
      code: 'ORMA / 01', name: 'Lir 725', location: 'Porto',
      blurb: 'A residential building in Porto designed in response to its surrounding context. The project balances a clear relationship with the street with the inclusion of private outdoor spaces.',
      image: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/04/Tardoz_Sunset-scaled.png',
      meta: '12 apartments - 2026 - 2027',
      bg: '#7A6E5D',
    },
    {
      code: 'ORMA / 02', name: 'Villas Sto. Tirso', location: 'Santo Tirso',
      blurb: 'A residential project in Santo Tirso set within a low-density and naturally defined environment. The design responds to the surrounding landscape, prioritising orientation, privacy and the relationship with outdoor space.',
      image: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/Comp-1-scaled-1.jpg',
      meta: '6 villas - 2026 - 2028',
      bg: '#4A5463',
    },
    {
      code: 'ORMA / 03', name: 'Coming Soon', location: '',
      blurb: 'A new project is on the horizon. Stay tuned for more details about our next development.',
      image: null,
      meta: 'Brevemente',
      isPlaceholder: true,
      bg: C.green,
    },
  ];

  const totalPanels = projects.length;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 0.6,
        snap: {
          snapTo: 1 / (totalPanels - 1),
          duration: { min: 0.3, max: 0.6 },
          ease: 'power1.inOut',
        },
        end: () => '+=' + (track.scrollWidth - window.innerWidth),
        invalidateOnRefresh: true,
        onUpdate: function(self) {
          const idx = Math.round(self.progress * (totalPanels - 1));
          setActiveIndex(idx);
        },
      },
    });

    stRef.current = tween.scrollTrigger;

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  const goToSlide = (idx) => {
    const st = stRef.current;
    if (!st) return;
    const targetProgress = idx / (totalPanels - 1);
    const targetScroll = st.start + targetProgress * (st.end - st.start);
    gsap.to(window, {
      scrollTo: targetScroll,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  };

  const goPrev = () => { if (activeIndex > 0) goToSlide(activeIndex - 1); };
  const goNext = () => { if (activeIndex < totalPanels - 1) goToSlide(activeIndex + 1); };

  const arrowStyle = (side) => ({
    position: 'absolute',
    top: '50%', [side]: 20,
    transform: 'translateY(-50%)',
    zIndex: 10,
    width: 48, height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.7)',
    transition: 'color 0.3s',
    padding: 0,
  });

  return (
    <section ref={sectionRef} data-screen-label="04 Projects" style={{
      overflow: 'hidden',
      background: projects[0].bg,
      position: 'relative',
    }}>
      {/* Navigation arrows */}
      {activeIndex > 0 && (
        <button onClick={goPrev} style={arrowStyle('left')} aria-label="Previous project">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {activeIndex < totalPanels - 1 && (
        <button onClick={goNext} style={arrowStyle('right')} aria-label="Next project">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      )}

      <div ref={trackRef} style={{
        display: 'flex',
        flexWrap: 'nowrap',
        width: (projects.length * 100) + 'vw',
        height: '100vh',
      }}>
        {projects.map((p, i) => (
          <div key={p.name} style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            flexShrink: 0,
            overflow: 'hidden',
            background: p.bg,
          }}>
            {/* Inner container - matches Verium's boxed layout */}
            <div style={{
              maxWidth: 1660,
              width: '100%',
              height: '100%',
              margin: '0 auto',
              padding: isMobile ? '0 24px' : '0 130px',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: isMobile ? 'center' : 'flex-start',
              gap: isMobile ? 24 : 48,
            }}>
              {/* Left column - text */}
              <div style={{
                flex: '1 1 50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: 0,
              }}>
                {/* Project name */}
                <h2 style={{
                  fontFamily: '"General Sans", sans-serif',
                  fontWeight: 300, fontSize: isMobile ? (p.isPlaceholder ? 28 : 32) : (p.isPlaceholder ? 40 : 48),
                  lineHeight: 1.15, letterSpacing: '-0.01em',
                  color: '#FFFFFF', margin: 0,
                }}>
                  {p.name}
                </h2>

                <p style={{
                  fontFamily: '"General Sans", sans-serif',
                  fontSize: 16, lineHeight: 1.8,
                  color: 'rgba(255,255,255,0.75)',
                  margin: '36px 0 0', maxWidth: 520,
                }}>
                  {p.blurb}
                </p>

                {/* Meta info with divider lines */}
                <div style={{ marginTop: 48 }}>
                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    padding: '18px 0',
                  }}>
                    <div style={{
                      fontFamily: '"General Sans", sans-serif',
                      fontSize: 12, letterSpacing: '0.2em',
                      textTransform: 'uppercase', fontWeight: 500,
                      color: 'rgba(255,255,255,0.7)',
                    }}>
                      {p.meta}
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }} />
                </div>

                {/* CTA button with left-to-right fill hover */}
                {!p.isPlaceholder && (
                  <a href="#" style={{
                    display: 'inline-block',
                    fontFamily: '"General Sans", sans-serif',
                    fontSize: 12, letterSpacing: '0.2em',
                    textTransform: 'uppercase', fontWeight: 600,
                    color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
                    padding: '16px 40px',
                    border: '1px solid rgba(255,255,255,0.35)',
                    marginTop: 40,
                    alignSelf: 'flex-end',
                    position: 'relative', overflow: 'hidden',
                    transition: 'border-color 0.4s ease',
                  }}
                    onMouseEnter={e => {
                      const fill = e.currentTarget.querySelector('.btn-fill');
                      if (fill) { fill.style.transform = 'translateX(0)'; }
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                    }}
                    onMouseLeave={e => {
                      const fill = e.currentTarget.querySelector('.btn-fill');
                      if (fill) { fill.style.transform = 'translateX(-101%)'; }
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                    }}
                  >
                    <span className="btn-fill" style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(255,255,255,0.12)',
                      transform: 'translateX(-101%)',
                      transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      pointerEvents: 'none',
                    }} />
                    <span style={{ position: 'relative', zIndex: 1 }}>Explore this project</span>
                  </a>
                )}
              </div>

              {/* Right column - image */}
              <div style={{
                flex: isMobile ? '0 0 auto' : '1 1 50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 0,
                height: isMobile ? 'auto' : '100%',
                maxHeight: isMobile ? '35vh' : 'none',
                paddingTop: isMobile ? 0 : 60,
                paddingBottom: isMobile ? 0 : 60,
                width: isMobile ? '100%' : 'auto',
              }}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: '100%',
                      maxHeight: '80vh',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '60%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0.15,
                  }}>
                    <TreeMark />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide counter - bottom right */}
      <div style={{
        position: 'absolute', bottom: isMobile ? 20 : 36, right: isMobile ? 24 : 48,
        fontFamily: '"General Sans", sans-serif',
        fontSize: 13, color: 'rgba(255,255,255,0.5)',
        fontWeight: 400, letterSpacing: '0.08em',
        zIndex: 10,
      }}>
        {String(activeIndex + 1).padStart(2, '0')} / {String(totalPanels).padStart(2, '0')}
      </div>
    </section>
  );
}

// ============================================================
// 6. Why Orma — dark green, big stats + community
// ============================================================

function RollingNumber({ value, suffix = '', duration = 2000 }) {
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
          const eased = 1 - Math.pow(1 - progress, 3);
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

const STAT_ICONS = {
  years: function() {
    return React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
      React.createElement('circle', { cx: 12, cy: 12, r: 9, stroke: C.clearGreen, strokeWidth: 1.5 }),
      React.createElement('path', { d: 'M12 7L12 12L16 14', stroke: C.clearGreen, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    );
  },
  projects: function() {
    return React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
      React.createElement('path', { d: 'M3 21L3 9L12 3L21 9L21 21', stroke: C.clearGreen, strokeWidth: 1.5, strokeLinejoin: 'round' }),
      React.createElement('rect', { x: 9, y: 14, width: 6, height: 7, rx: 0.5, stroke: C.clearGreen, strokeWidth: 1.5 })
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

function WhyOrma() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const textColRef = useRef(null);
  const communityRef = useRef(null);
  const cardRefs = useRef([]);
  const borderRefs = useRef([]);

  const whyRevealText = 'Our team brings thoughtful guidance and dependable execution to every project, standing by your vision with the confidence this moment calls for.';
  const communityText = 'Every year, we reinvest part of our net income into the communities where our projects take shape — supporting local well-being and ensuring the places families choose to live continue to grow with them.';

  const stats = [
    { num: '40', suffix: '+', label: 'Years of experience', icon: 'years' },
    { num: '2', suffix: '', label: 'Projects in dev', icon: 'projects' },
    { num: '100', suffix: '%', label: 'Net income reinvested locally', icon: 'reinvest' },
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
    <section ref={sectionRef} data-screen-label="05 Why Orma" style={{
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
          fontFamily: '"General Sans", sans-serif',
          fontSize: 12, letterSpacing: '0.3em', color: C.clearGreen,
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
                  fontFamily: '"General Sans", sans-serif',
                  fontSize: isMobile ? 20 : 28, lineHeight: 1.55, color: C.white, margin: 0, fontWeight: 300,
                  letterSpacing: '-0.01em',
                }}
              />
            </div>
            <p ref={communityRef} style={{
              fontFamily: '"General Sans", sans-serif',
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
                        fontFamily: '"General Sans", sans-serif',
                        fontSize: 10, letterSpacing: '0.2em', color: 'rgba(238,232,218,0.5)',
                        textTransform: 'uppercase', fontWeight: 600,
                      }}>{stat.label}</div>
                    </div>
                    <div style={{
                      fontFamily: '"General Sans", sans-serif',
                      fontWeight: 300, fontSize: isMobile ? 44 : 48, lineHeight: 1, letterSpacing: '-0.03em',
                      color: C.terracota,
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
// 7. Visit / conversion
// ============================================================
function Visit() {
  const contentRef = useScrollReveal();
  const [form, setForm] = useState({ name: '', email: '', phone: '', project: '', message: '' });
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);

  const inputStyle = {
    width: '100%',
    background: C.white,
    border: `1px solid ${C.clearGreen}`,
    padding: '14px 16px',
    fontFamily: '"General Sans", sans-serif',
    fontSize: 15,
    color: C.ink, outline: 'none', borderRadius: 6,
  };

  return (
    <section data-screen-label="06 Visit" style={{
      background: C.bege,
      padding: '140px 64px',
    }}>
      <div ref={contentRef} style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', willChange: 'opacity, transform' }}>
        <div>
          <div style={{
            fontFamily: '"General Sans", sans-serif',
            fontSize: 12, letterSpacing: '0.3em', color: C.terracota,
            textTransform: 'uppercase', fontWeight: 600, marginBottom: 24,
          }}>Get In Touch</div>
          <h2 style={{
            fontFamily: '"General Sans", sans-serif',
            fontWeight: 300, fontSize: 44, lineHeight: 1.1,
            letterSpacing: '-0.02em', color: C.ink, margin: 0, textWrap: 'balance',
          }}>
            Let's Talk About Your Next Step.
          </h2>
          <p style={{
            fontFamily: '"General Sans", sans-serif',
            fontSize: 17, lineHeight: 1.7, color: C.green, marginTop: 28, marginBottom: 0, maxWidth: 460,
          }}>
            If you'd like to know more about our projects or our approach, our team is here to assist you. Leave us a message and we'll respond with the information and support you need.
          </p>

          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '20px 28px', alignItems: 'baseline' }}>
            <div style={{ fontFamily: '"General Sans", sans-serif', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.green, fontWeight: 600 }}>Address</div>
            <div style={{ fontFamily: '"General Sans", sans-serif', fontSize: 14, color: C.ink, lineHeight: 1.6 }}>Rua de Cedofeita 123, 4050-179 Porto</div>
            <div style={{ fontFamily: '"General Sans", sans-serif', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.green, fontWeight: 600 }}>Hours</div>
            <div style={{ fontFamily: '"General Sans", sans-serif', fontSize: 14, color: C.ink, lineHeight: 1.6 }}>Tue - Sat · 10:00 - 18:00</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 24, alignItems: 'stretch' }}>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{
            background: `${C.white}aa`,
            padding: 36,
            borderRadius: 12,
            display: 'grid', gap: 18,
          }}>
            <input style={inputStyle} placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input style={inputStyle} placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input style={inputStyle} placeholder="Contact No" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <input style={inputStyle} placeholder="Project" value={form.project} onChange={e => setForm({...form, project: e.target.value})} />
            <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
            <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontFamily: '"General Sans", sans-serif', fontSize: 12, color: C.green, lineHeight: 1.5, marginTop: 4 }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: 3, accentColor: C.green }} />
              <span>I agree to the processing of my personal data in accordance with Orma's <a href="#" style={{ color: C.green, textDecoration: 'underline' }}>privacy policy</a>.</span>
            </label>
            <button type="submit" style={{
              background: C.terracota, color: C.white, border: 'none',
              padding: '16px 22px', fontFamily: '"General Sans", sans-serif',
              fontWeight: 500, fontSize: 13, letterSpacing: '0.16em',
              textTransform: 'uppercase', borderRadius: 6, cursor: 'pointer',
              marginTop: 8,
            }}>{sent ? 'Message sent ✓' : 'Get in touch →'}</button>
          </form>

          {/* photo strip */}
          <div style={{ display: 'grid', gap: 12 }}>
            <SiteImage
              src="https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/1-scaled.jpg"
              style={{ flex: 1, minHeight: 0, borderRadius: 6 }}
            />
            <SiteImage
              src="https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/3-scaled.jpg"
              style={{ flex: 1, minHeight: 0, borderRadius: 6 }}
            />
            <SiteImage
              src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/ee66e43983e1f35750e3d6d88040a7a8a3015d35.png"
              style={{ flex: 1, minHeight: 0, borderRadius: 6 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 8. Community — compact, centered
// ============================================================
function Community() {
  const contentRef = useScrollReveal();
  return (
    <section data-screen-label="07 Community" style={{
      background: C.white,
      padding: '140px 64px 120px',
      textAlign: 'center',
    }}>
      <div ref={contentRef} style={{ maxWidth: 800, margin: '0 auto', willChange: 'opacity, transform' }}>
        <div style={{
          fontFamily: '"General Sans", sans-serif',
          fontSize: 12, letterSpacing: '0.3em', color: C.terracota,
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 22,
        }}>Community</div>
        <h2 style={{
          fontFamily: '"General Sans", sans-serif',
          fontWeight: 300, fontSize: 38, lineHeight: 1.2,
          letterSpacing: '-0.02em', color: C.ink, margin: 0, textWrap: 'balance',
        }}>
          Giving Back to the Places We Build.
        </h2>
        <p style={{
          fontFamily: '"General Sans", sans-serif',
          fontSize: 17, lineHeight: 1.7, color: C.green, marginTop: 28, marginBottom: 0,
        }}>
          Every year, we reinvest part of our net income into the communities where our projects take shape. It is our way of contributing to local well-being, supporting meaningful initiatives and ensuring that the places families choose to live continue to grow with them.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 64 }}>
          {[
            { label: 'Local school garden', src: 'https://tiagoc108.sg-host.com/wp-content/uploads/2025/12/joel-muniz-qvzjG2pF4bE-unsplash-scaled.jpg' },
            { label: 'Riverside walk', src: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/04/Tardoz_Sunset-scaled.png' },
            { label: 'Library renovation', src: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/Comp-1-scaled-1.jpg' },
            { label: 'Youth football', src: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/2.png' },
          ].map((item) => (
            <div key={item.label} style={{
              width: 130, height: 130, borderRadius: '50%',
              border: `1px solid ${C.green}66`,
              padding: 4, overflow: 'hidden',
            }}>
              <SiteImage
                src={item.src}
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 9. Final CTA banner
// ============================================================
function FinalCTA() {
  const contentRef = useScrollReveal();
  return (
    <section data-screen-label="08 Final CTA" style={{
      background: C.bege,
      padding: '120px 64px',
      textAlign: 'center',
    }}>
      <div ref={contentRef} style={{ willChange: 'opacity, transform' }}>
      <h2 style={{
        fontFamily: '"General Sans", sans-serif',
        fontWeight: 300, fontSize: 36, lineHeight: 1.2,
        letterSpacing: '-0.02em', color: C.ink, margin: 0,
      }}>
        Let's Talk About Your Next Step!
      </h2>
      <button style={{
        marginTop: 36,
        background: C.terracota, color: C.white, border: 'none',
        padding: '18px 36px', fontFamily: '"General Sans", sans-serif',
        fontWeight: 500, fontSize: 13, letterSpacing: '0.16em',
        textTransform: 'uppercase', borderRadius: 6, cursor: 'pointer',
      }}>Get in touch →</button>
      <div style={{
        marginTop: 28,
        fontFamily: '"General Sans", sans-serif',
        fontSize: 14, color: C.green, letterSpacing: '0.04em',
      }}>info@orma.pt · +351 220 000 000</div>
      </div>
    </section>
  );
}

// ============================================================
// 10. Contact Form — background photo + Orma logo
// ============================================================
function ContactForm() {
  const isMobile = useIsMobile();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [focused, setFocused] = useState(null);
  const [sent, setSent] = useState(false);
  const sectionRef = useScrollReveal();

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const inputStyle = (field) => ({
    width: '100%',
    border: 'none',
    borderBottom: `1.5px solid ${focused === field ? C.terracota : C.clearGreen}`,
    background: 'transparent',
    padding: '14px 0',
    fontFamily: '"General Sans", sans-serif',
    fontSize: 16,
    color: C.ink,
    outline: 'none',
    transition: 'border-color 0.3s ease',
  });

  const labelStyle = {
    fontFamily: '"General Sans", sans-serif',
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.green,
    fontWeight: 600,
    marginBottom: 4,
    display: 'block',
  };

  return (
    <section data-screen-label="10 Contact" style={{
      position: 'relative',
      overflow: 'hidden',
      padding: isMobile ? '80px 24px' : '160px 64px',
      backgroundImage: 'url(https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/1-scaled.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center 30%',
    }}>
      {/* Bege overlay — very heavy so photo is barely visible texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `${C.bege}f0`,
      }} />

      <div ref={sectionRef} style={{
        maxWidth: 880, margin: '0 auto',
        position: 'relative', zIndex: 2,
        willChange: 'opacity, transform',
      }}>
        {/* Orma O. Symbol — inline SVG, serif O with organic yin-yang interior */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <svg width="52" height="60" viewBox="0 0 130 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Orma">
            {/* Outer O — serif style with thick/thin stroke contrast */}
            <path d="M55 6C28 6 6 32 6 72C6 112 28 138 55 138C82 138 104 112 104 72C104 32 82 6 55 6ZM55 18C75 18 90 40 90 72C90 104 75 126 55 126C35 126 20 104 20 72C20 40 35 18 55 18Z" fill={C.ink} />
            {/* Interior organic S-curve / yin-yang leaf */}
            <path d="M55 32C48 32 42 38 42 48C42 58 48 62 55 66C62 70 68 76 68 88C68 100 60 112 55 112C62 112 68 106 68 96C68 86 62 82 55 78C48 74 42 68 42 56C42 44 50 32 55 32Z" fill={C.ink} />
            {/* Period dot */}
            <circle cx="118" cy="132" r="7" fill={C.ink} />
          </svg>
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: '"General Sans", sans-serif',
          fontWeight: 300,
          fontSize: isMobile ? 32 : 48,
          lineHeight: 1.12,
          letterSpacing: '-0.02em',
          color: C.ink,
          textAlign: 'center',
          margin: '0 0 20px',
        }}>
          Your Home Is<br />Just The Start
        </h2>

        {/* Subtitle */}
        <p style={{
          fontFamily: '"General Sans", sans-serif',
          fontSize: 16,
          lineHeight: 1.7,
          color: C.green,
          textAlign: 'center',
          maxWidth: 480,
          margin: isMobile ? '0 auto 40px' : '0 auto 64px',
        }}>
          If you'd like to know more about our projects or our approach, our team is here to assist you.
        </p>

        {/* Form grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '28px' : '44px 56px' }}>
          <div>
            <label style={labelStyle}>Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              style={inputStyle('name')}
            />
          </div>
          <div>
            <label style={labelStyle}>Phone *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
              style={inputStyle('phone')}
            />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              style={inputStyle('email')}
            />
          </div>
          <div>
            <label style={labelStyle}>Questions / Comments *</label>
            <input
              type="text"
              value={form.message}
              onChange={handleChange('message')}
              onFocus={() => setFocused('message')}
              onBlur={() => setFocused(null)}
              style={inputStyle('message')}
            />
          </div>
        </div>

        {/* Consent */}
        <div style={{
          marginTop: 44,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <input type="checkbox" id="consent" style={{
            marginTop: 3,
            accentColor: C.terracota,
            width: 16, height: 16,
            cursor: 'pointer',
            flexShrink: 0,
          }} />
          <label htmlFor="consent" style={{
            fontFamily: '"General Sans", sans-serif',
            fontSize: 12,
            lineHeight: 1.6,
            color: C.green,
            cursor: 'pointer',
          }}>
            I agree to the processing of my personal data in accordance with Orma's <a href="#" style={{ color: C.green, textDecoration: 'underline' }}>privacy policy</a>.
          </label>
        </div>

        {/* Submit */}
        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <button
            onClick={() => setSent(true)}
            style={{
              background: C.terracota,
              color: C.white,
              border: 'none',
              padding: isMobile ? '18px 0' : '20px 56px',
              width: isMobile ? '100%' : 'auto',
              fontFamily: '"General Sans", sans-serif',
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              borderRadius: 40,
              cursor: 'pointer',
              transition: 'background 0.3s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#7a3610'; e.target.style.transform = 'scale(1.03)'; }}
            onMouseLeave={(e) => { e.target.style.background = C.terracota; e.target.style.transform = 'scale(1)'; }}
          >
            {sent ? 'Message Sent ✓' : 'Send Message →'}
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 11. Footer
// ============================================================
function Footer() {
  const isMobile = useIsMobile();
  const footerRef = useScrollReveal();

  return (
    <footer data-screen-label="09 Footer" style={{
      background: C.ink, color: C.bege,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Giant watermark "orma." text */}
      <div style={{
        position: 'absolute', bottom: isMobile ? -30 : -40, left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: '"General Sans", sans-serif',
        fontWeight: 700, fontSize: isMobile ? 160 : 280,
        letterSpacing: '-0.04em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.04)',
        whiteSpace: 'nowrap', pointerEvents: 'none',
        lineHeight: 0.85,
      }}>orma.</div>

      {/* Main content */}
      <div ref={footerRef} style={{
        maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2,
        padding: isMobile ? '80px 24px 32px' : '120px 64px 40px',
        willChange: 'opacity, transform',
      }}>

        {/* Top section — CTA headline + contact info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr',
          gap: isMobile ? 48 : 80,
          paddingBottom: isMobile ? 56 : 80,
        }}>

          {/* Left — Big CTA */}
          <div>
            <div style={{
              fontFamily: '"General Sans", sans-serif',
              fontSize: 11, letterSpacing: '0.3em', color: C.clearGreen,
              textTransform: 'uppercase', fontWeight: 600, marginBottom: 28,
            }}>Contact</div>
            <h2 style={{
              fontFamily: '"General Sans", sans-serif',
              fontWeight: 300, fontSize: isMobile ? 36 : 56, lineHeight: 1.1,
              letterSpacing: '-0.02em', color: C.bege, margin: 0,
            }}>
              Let's talk about your next <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.terracota }}>home.</em>
            </h2>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 16, marginTop: isMobile ? 32 : 44, flexWrap: 'wrap' }}>
              <a href="#" style={{
                display: 'inline-block', padding: '16px 36px',
                background: C.terracota, color: C.white,
                fontFamily: '"General Sans", sans-serif', fontWeight: 600,
                fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 40,
                transition: 'background 0.3s, transform 0.2s',
              }}>Get in touch</a>
              <a href="#" style={{
                display: 'inline-block', padding: '16px 36px',
                background: 'transparent', color: C.bege,
                fontFamily: '"General Sans", sans-serif', fontWeight: 500,
                fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 40,
                border: '1px solid rgba(238,232,218,0.25)',
                transition: 'border-color 0.3s, background 0.3s',
              }}>Our projects</a>
            </div>
          </div>

          {/* Right — Contact details */}
          <div style={{ paddingTop: isMobile ? 0 : 16 }}>
            {[
              { label: 'Email', value: 'info@orma.pt' },
              { label: 'Phone', value: '+351 220 000 000' },
              { label: 'Address', value: 'Rua de Cedofeita 123\nPorto, Portugal' },
            ].map((item, i) => (
              <div key={item.label} style={{
                borderTop: i === 0 ? '1px solid rgba(238,232,218,0.12)' : 'none',
                borderBottom: '1px solid rgba(238,232,218,0.12)',
                padding: '20px 0',
              }}>
                <div style={{
                  fontFamily: '"General Sans", sans-serif',
                  fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: C.clearGreen, fontWeight: 600, marginBottom: 6,
                }}>{item.label}</div>
                <div style={{
                  fontFamily: '"General Sans", sans-serif',
                  fontSize: 15, color: C.bege, lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                }}>{item.value}</div>
              </div>
            ))}

            {/* Social links */}
            <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
              {['Instagram', 'LinkedIn', 'Facebook'].map(name => (
                <a key={name} href="#" style={{
                  fontFamily: '"General Sans", sans-serif',
                  fontSize: 13, color: C.clearGreen, textDecoration: 'none',
                  transition: 'color 0.3s',
                }}>{name}</a>
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
          fontFamily: '"General Sans", sans-serif', fontSize: 12, color: 'rgba(177,180,169,0.6)', letterSpacing: '0.04em',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png" alt="Orma" style={{ height: 18, opacity: 0.5 }} />
            <span>© 2026 Orma. All rights reserved.</span>
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
// Desktop full
// ============================================================
function DesktopHomepage() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      overflow: 'hidden',
      background: C.white,
      position: 'relative',
      fontFamily: '"General Sans", system-ui, sans-serif',
    }}>
      <LoadingScreen />
      <Nav />
      <Hero />
      {/* Spacer — occupies flow space for the fixed hero */}
      <div style={{ height: '100vh' }} />
      {/* Content wrapper — scrolls over the fixed hero */}
      <div style={{ position: 'relative', zIndex: 2, background: C.bege }}>
        <Promise />
        <Pillars />
        <Projects />
        <WhyOrma />
        <ContactForm />
        <Footer />
      </div>

      {/* Floating buttons — WhatsApp + Scroll to top */}
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
            transition: 'transform 0.25s ease, opacity 0.25s ease',
            opacity: 0.85,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.85'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>
    </div>
  );
}

window.DesktopHomepage = DesktopHomepage;
window.OrmaTokens = C;
window.OrmaTreeMark = TreeMark;
window.OrmaWordmark = Wordmark;
window.OrmaPlaceholder = Placeholder;
