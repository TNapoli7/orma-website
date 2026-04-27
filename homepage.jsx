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
// useScrollReveal — scroll-DRIVEN fade + slide (like ScrollTrigger)
// Directly manipulates DOM for 60fps, no React re-renders.
// ============================================================
function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = null;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const wh = window.innerHeight;
      // Element enters at bottom of viewport, fully revealed at 35% from top
      const enter = wh * 0.92;
      const full  = wh * 0.35;

      let p;
      if (rect.top >= enter) p = 0;
      else if (rect.top <= full) p = 1;
      else p = (enter - rect.top) / (enter - full);

      // Smoothstep for organic ease
      p = p * p * (3 - 2 * p);

      el.style.opacity = String(p);
      el.style.transform = 'translateY(' + ((1 - p) * 54).toFixed(1) + 'px)';
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial position
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
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
// 1. Nav — hides on scroll down, shows on scroll up
// ============================================================
function Nav() {
  const [visible, setVisible] = useState(true);
  const [inHero, setInHero] = useState(true);
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
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 68,
      padding: '0 56px',
      background: inHero ? 'transparent' : C.green,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100,
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease',
    }}>
      {/* O mark only — clip the wordmark to the first character */}
      <div style={{ width: 24, height: 22, overflow: 'hidden' }}>
        <img
          src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png"
          alt="Orma"
          style={{ height: 22, width: 'auto', display: 'block' }}
        />
      </div>
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

    </section>
  );
}

// ============================================================
// 3. Brand Promise — symmetrical breath
// ============================================================
function Promise() {
  const contentRef = useScrollReveal();
  return (
    <section data-screen-label="02 Promise" style={{
      position: 'relative',
      background: C.bege,
      padding: '180px 64px 200px',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 760, height: 760, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
        <TreeMark opacity={0.07} />
      </div>
      <div ref={contentRef} style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 2, willChange: 'opacity, transform' }}>
        <h2 style={{
          fontFamily: '"General Sans", sans-serif',
          fontWeight: 300, fontSize: 38, lineHeight: 1.5,
          letterSpacing: '-0.015em', color: C.ink, margin: 0, textWrap: 'balance',
        }}>
          Each project is designed with a focus on natural light, spatial clarity and the connection between indoor and outdoor living - creating spaces that feel intuitive, balanced and easy to <em style={{ fontStyle: 'italic', color: C.green, fontWeight: 300 }}>live in.</em>
        </h2>
      </div>
    </section>
  );
}

// ============================================================
// 4. Three Pillars — vertical dividers
// ============================================================
const PILLAR_ICONS = {
  land: 'icons/icone-optmistic.png',
  design: 'icons/icone-thoughtful-design.png',
  trust: 'icons/icone-experience-driven-work.png',
};

function PillarIcon({ kind }) {
  const src = PILLAR_ICONS[kind];
  if (!src) return null;
  return (
    <img src={src} alt="" width="48" height="48"
      style={{ display: 'block', objectFit: 'contain', opacity: 0.85 }} />
  );
}

function Pillars() {
  const contentRef = useScrollReveal();
  const items = [
    { kind: 'land', title: 'Land Vision & Opportunity', body: 'We begin by identifying strategic urban zones with strong potential for long-term living and value. Each location is chosen for its balance between city convenience, quality of life and access to nature.' },
    { kind: 'design', title: 'Architectural Design & Planning', body: 'Once a location is secured, we collaborate closely with architect studios to design spaces that feel intuitive, balanced and filled with natural light. Homes where families can grow at their own pace, surrounded by green areas and practical layouts.' },
    { kind: 'trust', title: 'Construction & Delivery', body: 'We work with experienced engineering and construction partners who share our respect for quality, integrity and responsible execution. Every project is monitored closely to ensure that what we build matches what we promised.' },
  ];
  return (
    <section data-screen-label="03 Pillars" style={{
      background: C.white,
      padding: '120px 64px 140px',
    }}>
      <div ref={contentRef} style={{ maxWidth: 1280, margin: '0 auto', willChange: 'opacity, transform' }}>
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
  const contentRef = useScrollReveal();
  const projects = [
    {
      code: 'ORMA / 01', name: 'Lir 725', location: 'Porto',
      blurb: 'A residential building in Porto designed in response to its surrounding context. The project balances a clear relationship with the street with the inclusion of private outdoor spaces. The result is a well-resolved development that combines efficiency, comfort and careful spatial organization.',
      image: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/04/Tardoz_Sunset-scaled.png',
      meta: '12 apartments · 2026 - 2027',
    },
    {
      code: 'ORMA / 02', name: 'Villas Sto. Tirso', location: 'Santo Tirso',
      blurb: 'A residential project in Santo Tirso set within a low-density and naturally defined environment. The design responds to the surrounding landscape, prioritising orientation, privacy and the relationship with outdoor space.',
      image: 'https://tiagoc108.sg-host.com/wp-content/uploads/2026/02/Comp-1-scaled-1.jpg',
      meta: '6 villas · 2026 - 2028',
    },
  ];

  return (
    <section data-screen-label="04 Projects" style={{
      background: `linear-gradient(180deg, ${C.white} 0%, ${C.white} 65%, ${C.green} 65%, ${C.green} 100%)`,
      padding: '140px 64px 0',
    }}>
      <div ref={contentRef} style={{ maxWidth: 1280, margin: '0 auto', willChange: 'opacity, transform' }}>
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
                  {p.code} - {p.location}
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
  const contentRef = useScrollReveal();
  return (
    <section data-screen-label="05 Why Orma" style={{
      position: 'relative',
      background: C.green,
      padding: '160px 64px',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', right: -240, bottom: -200, width: 800, height: 800, pointerEvents: 'none' }}>
        <TreeMark opacity={0.08} />
      </div>

      <div ref={contentRef} style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2, willChange: 'opacity, transform' }}>
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
      {/* Spacer — occupies flow space for the fixed hero */}
      <div style={{ height: '100vh' }} />
      {/* Content wrapper — scrolls over the fixed hero */}
      <div style={{ position: 'relative', zIndex: 2, background: C.bege }}>
        <Promise />
        <Pillars />
        <Projects />
        <WhyOrma />
        <Visit />
        <Community />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}

window.DesktopHomepage = DesktopHomepage;
window.OrmaTokens = C;
window.OrmaTreeMark = TreeMark;
window.OrmaWordmark = Wordmark;
window.OrmaPlaceholder = Placeholder;
