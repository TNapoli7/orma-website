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
// useReveal — scroll-triggered fade-in
// ============================================================
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const revealStyle = (visible) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'none' : 'translateY(40px)',
  transition: 'opacity 0.7s ease, transform 0.7s ease',
});

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
// Sticky CTA Bar
// ============================================================
function StickyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: C.green,
      padding: '14px 56px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transform: show ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.4s ease',
      zIndex: 90,
      boxShadow: '0 -2px 20px rgba(0,0,0,0.1)',
    }}>
      <span style={{ fontFamily: '"General Sans", sans-serif', fontSize: 14, color: C.bege, fontWeight: 300 }}>
        Designed for Living — Discover our projects
      </span>
      <button style={{
        background: C.terracota, color: C.white, border: 'none',
        padding: '12px 28px', fontFamily: '"General Sans", sans-serif',
        fontWeight: 500, fontSize: 12, letterSpacing: '0.16em',
        textTransform: 'uppercase', borderRadius: 6, cursor: 'pointer',
      }}>Contact Us →</button>
    </div>
  );
}

// ============================================================
// Loading Screen — SVG O. mark with stroke draw animation
// ============================================================
function LoadingScreen() {
  const [phase, setPhase] = useState('draw'); // draw → fill → hold → reveal → done

  useEffect(() => {
    if (!document.getElementById('orma-loader-css')) {
      const style = document.createElement('style');
      style.id = 'orma-loader-css';
      style.textContent = `
        @keyframes ormaDraw {
          0%   { stroke-dashoffset: 1; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes ormaFillIn {
          0%   { fill-opacity: 0; }
          100% { fill-opacity: 1; }
        }
        @keyframes ormaDotScale {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ormaTagReveal {
          0%   { opacity: 0; letter-spacing: 0.5em; }
          100% { opacity: 0.7; letter-spacing: 0.28em; }
        }
      `;
      document.head.appendChild(style);
    }
    const t1 = setTimeout(() => setPhase('fill'), 1600);
    const t2 = setTimeout(() => setPhase('hold'), 2400);
    const t3 = setTimeout(() => setPhase('reveal'), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 'done') return null;

  const drawing = phase === 'draw';
  const filling = phase === 'fill' || phase === 'hold' || phase === 'reveal';
  const showTag = phase === 'hold' || phase === 'reveal';

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%',
      height: phase === 'reveal' ? '0vh' : '100vh',
      background: C.white,
      zIndex: 9999,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'height 1s cubic-bezier(0.65, 0, 0.35, 1)',
    }}
      onTransitionEnd={() => { if (phase === 'reveal') setPhase('done'); }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* SVG O. mark */}
        <svg viewBox="0 0 120 140" width="100" height="117" xmlns="http://www.w3.org/2000/svg">
          {/* Outer O — ellipse */}
          <ellipse
            cx="52" cy="60" rx="38" ry="50"
            fill="none"
            stroke={C.ink}
            strokeWidth="3"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: drawing ? 1 : 0,
              animation: drawing ? 'ormaDraw 1.4s cubic-bezier(0.65, 0, 0.35, 1) forwards' : 'none',
              fillOpacity: filling ? 1 : 0,
              fill: filling ? 'none' : 'none',
              pathLength: 1,
            }}
          />

          {/* Inner leaf/petal — organic curve inside the O */}
          <path
            d="M 52 12 C 52 12, 72 28, 68 56 C 65 76, 52 92, 40 102 C 36 105, 34 104, 36 100 C 42 86, 48 68, 46 48 C 44 30, 38 18, 52 12 Z"
            fill="none"
            stroke={C.ink}
            strokeWidth="1.5"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: drawing ? 1 : 0,
              animation: drawing ? 'ormaDraw 1.4s 0.3s cubic-bezier(0.65, 0, 0.35, 1) forwards' : 'none',
              fill: filling ? C.ink : 'none',
              fillOpacity: filling ? 1 : 0,
              transition: 'fill-opacity 0.6s ease',
              pathLength: 1,
            }}
          />

          {/* Dot */}
          <circle
            cx="102" cy="104" r="6"
            fill={C.ink}
            style={{
              transformOrigin: '102px 104px',
              animation: drawing
                ? 'ormaDotScale 0.5s 1.0s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                : 'none',
              opacity: drawing ? 0 : 1,
              transform: drawing ? 'scale(0)' : 'scale(1)',
            }}
          />

          {/* DESIGNED text */}
          <text
            x="52" y="126"
            textAnchor="middle"
            style={{
              fontFamily: '"General Sans", sans-serif',
              fontSize: 8.5,
              fontWeight: 500,
              letterSpacing: '0.28em',
              fill: C.ink,
              animation: showTag ? 'ormaTagReveal 0.6s ease forwards' : 'none',
              opacity: showTag ? undefined : 0,
            }}
          >DESIGNED</text>

          {/* FOR LIVING text */}
          <text
            x="52" y="137"
            textAnchor="middle"
            style={{
              fontFamily: '"General Sans", sans-serif',
              fontSize: 8.5,
              fontWeight: 500,
              letterSpacing: '0.28em',
              fill: C.ink,
              animation: showTag ? 'ormaTagReveal 0.6s 0.1s ease forwards' : 'none',
              opacity: showTag ? undefined : 0,
            }}
          >FOR LIVING</text>
        </svg>
      </div>
    </div>
  );
}

// ============================================================
// 1. Nav — hides on scroll down, shows on scroll up
// ============================================================
function Nav() {
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const heroH = window.innerHeight;
      if (y < heroH * 0.5) {
        // Always show nav in hero area
        setVisible(true);
      } else if (y < lastScroll.current) {
        // Scrolling UP → show
        setVisible(true);
      } else if (y > lastScroll.current + 10) {
        // Scrolling DOWN (with threshold) → hide
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
      height: 68,
      padding: '0 56px',
      background: C.green,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100,
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
    }}>
      <img
        src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png"
        alt="Orma"
        style={{ height: 22 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        {['Home', 'About Us', 'Projects', 'Contact Us'].map((l, i) => (
          <a key={l} href="#" style={{
            fontFamily: '"General Sans", sans-serif',
            fontWeight: 500, fontSize: 12, letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: C.bege, textDecoration: 'none',
            opacity: i === 0 ? 1 : 0.78,
          }}>{l}</a>
        ))}
        <button style={{
          background: C.terracota,
          color: C.white,
          border: 'none',
          padding: '12px 22px',
          fontFamily: '"General Sans", sans-serif',
          fontWeight: 500, fontSize: 12, letterSpacing: '0.16em',
          textTransform: 'uppercase',
          borderRadius: 6, cursor: 'pointer',
          marginLeft: 8,
        }}>Contact Us</button>
      </div>
    </nav>
  );
}

// ============================================================
// 2. Hero — Full-bleed video background
// ============================================================
function Hero() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section data-screen-label="01 Hero" style={{
      position: 'relative',
      height: '100vh',
      overflow: 'hidden',
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
        padding: '0 64px',
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
          fontWeight: 300, fontSize: 76, lineHeight: 1.0,
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 44 }}>
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

      {/* Stats strip at bottom */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: `${C.green}ee`,
        backdropFilter: 'blur(8px)',
        height: 64,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        zIndex: 3,
      }}>
        {[
          ['Est.', '1985'],
          ['In development', '2 projects'],
          ['Region', 'Northern Portugal'],
        ].map(([k, v], i) => (
          <div key={k} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
            borderLeft: i === 0 ? 'none' : `1px solid ${C.clearGreen}44`,
            fontFamily: '"General Sans", sans-serif',
          }}>
            <span style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.clearGreen, fontWeight: 600 }}>{k}</span>
            <span style={{ fontSize: 13, color: C.bege, fontWeight: 500, letterSpacing: '0.04em' }}>{v}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 3. Brand Promise — symmetrical breath
// ============================================================
function Promise() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} data-screen-label="02 Promise" style={{
      position: 'relative',
      background: C.bege,
      padding: '180px 64px 200px',
      overflow: 'hidden',
      textAlign: 'center',
      ...revealStyle(visible),
    }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 760, height: 760, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
        <TreeMark opacity={0.07} />
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <h2 style={{
          fontFamily: '"General Sans", sans-serif',
          fontWeight: 300, fontSize: 38, lineHeight: 1.5,
          letterSpacing: '-0.015em', color: C.ink, margin: 0, textWrap: 'balance',
        }}>
          Each project is designed with a focus on natural light, spatial clarity and the connection between indoor and outdoor living — creating spaces that feel intuitive, balanced and easy to <em style={{ fontStyle: 'italic', color: C.green, fontWeight: 300 }}>live in.</em>
        </h2>
      </div>
    </section>
  );
}

// ============================================================
// 4. Three Pillars — vertical dividers
// ============================================================
function PillarIcon({ kind }) {
  const props = { fill: 'none', stroke: C.green, strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'land') return (
    <svg viewBox="0 0 56 56" width="44" height="44">
      <path {...props} d="M6 42 L 22 30 L 34 38 L 50 22" />
      <circle cx="50" cy="22" r="2.5" {...props} />
      <path {...props} d="M6 50 L 50 50" opacity="0.4" />
    </svg>
  );
  if (kind === 'design') return (
    <svg viewBox="0 0 56 56" width="44" height="44">
      <rect x="8" y="8" width="40" height="40" {...props} />
      <path {...props} d="M8 22 L 48 22 M 22 8 L 22 48 M 34 22 L 34 48" />
    </svg>
  );
  if (kind === 'trust') return (
    <svg viewBox="0 0 56 56" width="44" height="44">
      <path {...props} d="M28 8 L 44 18 L 44 32 C 44 42, 36 48, 28 50 C 20 48, 12 42, 12 32 L 12 18 Z" />
      <path {...props} d="M20 30 L 26 36 L 36 24" />
    </svg>
  );
  return null;
}

function Pillars() {
  const [ref, visible] = useReveal();
  const items = [
    { kind: 'land', title: 'Land Vision & Opportunity', body: 'We begin by identifying strategic urban zones with strong potential for long-term living and value. Each location is chosen for its balance between city convenience, quality of life and access to nature.' },
    { kind: 'design', title: 'Architectural Design & Planning', body: 'Once a location is secured, we collaborate closely with architect studios to design spaces that feel intuitive, balanced and filled with natural light. Homes where families can grow at their own pace, surrounded by green areas and practical layouts.' },
    { kind: 'trust', title: 'Construction & Delivery', body: 'We work with experienced engineering and construction partners who share our respect for quality, integrity and responsible execution. Every project is monitored closely to ensure that what we build matches what we promised.' },
  ];
  return (
    <section ref={ref} data-screen-label="03 Pillars" style={{
      background: C.white,
      padding: '120px 64px 140px',
      ...revealStyle(visible),
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          fontFamily: '"General Sans", sans-serif',
          fontSize: 12, letterSpacing: '0.3em', color: C.terracota,
          textTransform: 'uppercase', fontWeight: 600, textAlign: 'center', marginBottom: 56,
        }}>Our Service</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {items.map((it, i) => (
            <div key={it.title} style={{
              padding: '0 56px',
              borderLeft: i === 0 ? 'none' : `1px solid ${C.grey}`,
            }}>
              <PillarIcon kind={it.kind} />
              <h3 style={{
                fontFamily: '"General Sans", sans-serif',
                fontWeight: 600, fontSize: 22, color: C.ink, margin: '40px 0 18px', letterSpacing: '-0.005em',
              }}>{it.title}</h3>
              <p style={{
                fontFamily: '"General Sans", sans-serif',
                fontSize: 16, lineHeight: 1.7, color: C.green, margin: 0,
              }}>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 5. Featured projects — editorial layout, image + text rows
// ============================================================
function Projects() {
  const [ref, visible] = useReveal();
  const projects = [
    {
      code: 'ORMA / 01', name: 'Lir 725', location: 'Porto',
      blurb: 'A residential building in Porto designed in response to its surrounding context. The project balances a clear relationship with the street with the inclusion of private outdoor spaces. The result is a well-resolved development that combines efficiency, comfort and careful spatial organization.',
      image: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/04/Tardoz_Sunset-scaled.png',
      meta: '12 apartments · 2026 — 2027',
    },
    {
      code: 'ORMA / 02', name: 'Villas Sto. Tirso', location: 'Santo Tirso',
      blurb: 'A residential project in Santo Tirso set within a low-density and naturally defined environment. The design responds to the surrounding landscape, prioritising orientation, privacy and the relationship with outdoor space.',
      image: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/Comp-1-scaled-1.jpg',
      meta: '6 villas · 2026 — 2028',
    },
  ];

  return (
    <section ref={ref} data-screen-label="04 Projects" style={{
      background: `linear-gradient(180deg, ${C.white} 0%, ${C.white} 65%, ${C.green} 65%, ${C.green} 100%)`,
      padding: '140px 64px 0',
      ...revealStyle(visible),
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 96 }}>
          <div style={{
            fontFamily: '"General Sans", sans-serif',
            fontSize: 12, letterSpacing: '0.3em', color: C.green,
            textTransform: 'uppercase', fontWeight: 600, marginBottom: 22,
          }}>Our Projects</div>
          <h2 style={{
            fontFamily: '"General Sans", sans-serif',
            fontWeight: 300, fontSize: 44, lineHeight: 1.2,
            letterSpacing: '-0.02em', color: C.ink, margin: 0, textWrap: 'balance', maxWidth: 760, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Light, Space and Balance.
          </h2>
        </div>

        <div style={{ display: 'grid', gap: 80 }}>
          {projects.map((p, i) => (
            <article key={p.name} style={{
              background: C.white,
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: i === 0 ? '60fr 40fr' : '40fr 60fr',
            }}>
              {i === 0 && (
                <SiteImage
                  src={p.image}
                  style={{ width: '100%', minHeight: 420 }}
                />
              )}
              <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.green, letterSpacing: '0.16em', marginBottom: 14, textTransform: 'uppercase' }}>
                  {p.code} — {p.location}
                </div>
                <h3 style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 600, fontSize: 26, color: C.ink, margin: 0, letterSpacing: '-0.01em' }}>{p.name}</h3>
                <div style={{ fontFamily: '"General Sans", sans-serif', fontSize: 12, color: C.green, marginTop: 8, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                  {p.meta}
                </div>
                <p style={{ fontFamily: '"General Sans", sans-serif', fontSize: 16, lineHeight: 1.7, color: C.green, margin: '20px 0 28px' }}>{p.blurb}</p>
                <a href="#" style={{
                  fontFamily: '"General Sans", sans-serif',
                  fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: C.terracota, textDecoration: 'none', fontWeight: 600,
                }}>Learn more →</a>
              </div>
              {i === 1 && (
                <SiteImage
                  src={p.image}
                  style={{ width: '100%', minHeight: 420 }}
                />
              )}
            </article>
          ))}
        </div>
        <div style={{ height: 200 }} />
      </div>
    </section>
  );
}

// ============================================================
// 6. Why Orma — dark green, big stats
// ============================================================
function WhyOrma() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} data-screen-label="05 Why Orma" style={{
      position: 'relative',
      background: C.green,
      padding: '160px 64px',
      overflow: 'hidden',
      ...revealStyle(visible),
    }}>
      <div style={{ position: 'absolute', right: -240, bottom: -200, width: 800, height: 800, pointerEvents: 'none' }}>
        <TreeMark opacity={0.08} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{
          fontFamily: '"General Sans", sans-serif',
          fontSize: 12, letterSpacing: '0.3em', color: C.clearGreen,
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 48,
        }}>Why Orma</div>

        <div style={{ display: 'grid', gridTemplateColumns: '40fr 60fr', gap: 96, alignItems: 'start' }}>
          <div>
            {[
              ['40+', 'years of experience'],
              ['2', 'projects in development'],
              ['100%', 'net income reinvested locally'],
            ].map(([num, label], i) => (
              <div key={i} style={{
                padding: '36px 0',
                borderTop: `1px solid ${C.clearGreen}55`,
                borderBottom: i === 2 ? `1px solid ${C.clearGreen}55` : 'none',
              }}>
                <div style={{
                  fontFamily: '"General Sans", sans-serif',
                  fontWeight: 300, fontSize: 80, lineHeight: 1, letterSpacing: '-0.04em',
                  color: C.terracota,
                }}>{num}</div>
                <div style={{
                  fontFamily: '"General Sans", sans-serif',
                  fontSize: 14, color: C.bege, marginTop: 14, letterSpacing: '0.02em',
                }}>{label}</div>
              </div>
            ))}
          </div>

          <div>
            <p style={{
              fontFamily: '"General Sans", sans-serif',
              fontSize: 19, lineHeight: 1.8, color: C.white, margin: 0, fontWeight: 300,
            }}>
              Our team brings thoughtful guidance and dependable execution to every project, standing by your vision with the confidence this moment calls for.
            </p>
            <div style={{ marginTop: 56 }}>
              <SiteImage
                src="https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/2.png"
                style={{ width: '100%', aspectRatio: '4 / 3', borderRadius: 8 }}
              />
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
  const [ref, visible] = useReveal();
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
    <section ref={ref} data-screen-label="06 Visit" style={{
      background: C.bege,
      padding: '140px 64px',
      ...revealStyle(visible),
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
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
            <div style={{ fontFamily: '"General Sans", sans-serif', fontSize: 14, color: C.ink, lineHeight: 1.6 }}>Tue — Sat · 10:00 — 18:00</div>
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
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} data-screen-label="07 Community" style={{
      background: C.white,
      padding: '140px 64px 120px',
      textAlign: 'center',
      ...revealStyle(visible),
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
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
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} data-screen-label="08 Final CTA" style={{
      background: C.bege,
      padding: '120px 64px',
      textAlign: 'center',
      ...revealStyle(visible),
    }}>
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
    </section>
  );
}

// ============================================================
// 10. Footer
// ============================================================
function Footer() {
  return (
    <footer data-screen-label="09 Footer" style={{
      background: C.ink, color: C.bege,
      padding: '88px 64px 36px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', right: -200, bottom: -200, width: 540, height: 540, pointerEvents: 'none' }}>
        <TreeMark opacity={0.03} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 56, paddingBottom: 64, borderBottom: `1px solid ${C.bege}22` }}>
          <div>
            <div>
              <img src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png" alt="Orma" style={{ height: 28 }} />
              <div style={{ fontFamily: '"General Sans", sans-serif', fontSize: 8, letterSpacing: '0.32em', color: C.bege, fontWeight: 500, textTransform: 'uppercase', marginTop: 8 }}>Designed for Living</div>
            </div>
            <p style={{
              fontFamily: '"General Sans", sans-serif',
              fontSize: 14, lineHeight: 1.7, color: C.clearGreen, marginTop: 28, maxWidth: 320,
            }}>
              Orma is a development company built on experience, thoughtful design and the belief that long-term value comes from balancing nature, space and urban convenience.
            </p>
          </div>
          {[
            { title: 'Navigate', items: ['Home', 'About Us', 'Projects', 'Contact Us'] },
            { title: 'Contact', items: ['info@orma.pt', '+351 220 000 000', 'Rua de Cedofeita 123', 'Porto, Portugal'] },
            { title: 'Follow', items: ['Instagram', 'LinkedIn', 'Facebook'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: '"General Sans", sans-serif', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.clearGreen, fontWeight: 600, marginBottom: 22 }}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                {col.items.map(it => (
                  <li key={it} style={{ fontFamily: '"General Sans", sans-serif', fontSize: 14, color: col.title === 'Contact' ? C.clearGreen : C.bege }}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 28, fontFamily: '"General Sans", sans-serif', fontSize: 12, color: C.clearGreen, letterSpacing: '0.04em' }}>
          <div>© 2026 Orma. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 28 }}>
            <a href="#" style={{ color: C.clearGreen, textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: C.clearGreen, textDecoration: 'none' }}>Terms & Conditions</a>
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
      <Promise />
      <Pillars />
      <Projects />
      <WhyOrma />
      <Visit />
      <Community />
      <FinalCTA />
      <Footer />
      <StickyBar />
    </div>
  );
}

window.DesktopHomepage = DesktopHomepage;
window.OrmaTokens = C;
window.OrmaTreeMark = TreeMark;
window.OrmaWordmark = Wordmark;
window.OrmaPlaceholder = Placeholder;
