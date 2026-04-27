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
// Tree watermark — abstract organic motif
// ============================================================
function TreeMark({ color = C.green, opacity = 0.08, style = {} }) {
  return (
    <svg viewBox="0 0 400 400" style={{ display: 'block', opacity, ...style }} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="round">
        <circle cx="200" cy="200" r="92" />
        <path d="M200 292 L200 380" />
        <path d="M200 200 C 170 160, 140 140, 110 130" />
        <path d="M200 200 C 230 160, 260 140, 290 130" />
        <path d="M200 200 C 160 200, 120 210, 80 230" />
        <path d="M200 200 C 240 200, 280 210, 320 230" />
        <path d="M200 200 C 180 240, 160 270, 140 300" />
        <path d="M200 200 C 220 240, 240 270, 260 300" />
        <path d="M200 200 C 200 160, 200 120, 200 70" />
      </g>
      <g fill={color}>
        <ellipse cx="110" cy="130" rx="14" ry="6" transform="rotate(-25 110 130)" />
        <ellipse cx="290" cy="130" rx="14" ry="6" transform="rotate(25 290 130)" />
        <ellipse cx="80" cy="230" rx="14" ry="6" transform="rotate(-10 80 230)" />
        <ellipse cx="320" cy="230" rx="14" ry="6" transform="rotate(10 320 230)" />
        <ellipse cx="140" cy="300" rx="14" ry="6" transform="rotate(45 140 300)" />
        <ellipse cx="260" cy="300" rx="14" ry="6" transform="rotate(-45 260 300)" />
        <ellipse cx="200" cy="70" rx="14" ry="6" />
        <circle cx="200" cy="200" r="6" />
      </g>
    </svg>
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
// 1. Nav — Green, sticky, with Schedule a visit button
// ============================================================
function Nav() {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      height: 68,
      padding: '0 56px',
      background: C.green,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100,
    }}>
      <Wordmark color={C.bege} size={24} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        {['Home', 'About', 'Projects', 'Contact'].map((l, i) => (
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
        }}>Schedule a visit</button>
      </div>
    </nav>
  );
}

// ============================================================
// 2. Hero — 35/65 split, image dominates
// ============================================================
function Hero() {
  return (
    <section data-screen-label="01 Hero" style={{
      position: 'relative',
      height: 880,
      background: C.white,
      display: 'grid',
      gridTemplateColumns: '35fr 65fr',
      overflow: 'hidden',
    }}>
      {/* tree watermark behind text */}
      <div style={{ position: 'absolute', left: -160, top: 80, width: 720, height: 720, pointerEvents: 'none', zIndex: 1 }}>
        <TreeMark color={C.clearGreen} opacity={0.32} />
      </div>

      {/* left: text */}
      <div style={{
        padding: '0 48px 0 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          fontFamily: '"General Sans", sans-serif',
          fontSize: 12, letterSpacing: '0.3em',
          color: C.green, textTransform: 'uppercase', fontWeight: 600,
          marginBottom: 36,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ width: 32, height: 1, background: C.green }} />
          Porto · Santo Tirso
        </div>

        <h1 style={{
          fontFamily: '"General Sans", sans-serif',
          fontWeight: 300, fontSize: 76, lineHeight: 1.0,
          letterSpacing: '-0.025em', color: C.ink, margin: 0, textWrap: 'balance',
        }}>
          Designed for the way you <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.green }}>live.</em>
        </h1>

        <p style={{
          fontFamily: '"General Sans", sans-serif',
          fontWeight: 400, fontSize: 17, lineHeight: 1.7,
          color: C.green, marginTop: 32, marginBottom: 0, maxWidth: 420,
        }}>
          Homes shaped by clarity, light, and purpose — built by a family of architects, engineers and craftspeople in northern Portugal.
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
            fontSize: 13, color: C.green, textDecoration: 'none',
            fontWeight: 500, borderBottom: `1px solid ${C.green}66`, paddingBottom: 2,
          }}>Our story →</a>
        </div>
      </div>

      {/* right: full bleed image */}
      <div style={{ position: 'relative' }}>
        <Placeholder
          label="Interior render — bright living room, floor-to-ceiling windows, oak floor, single green armchair, monstera plant, warm afternoon light"
          tone="green"
          style={{ position: 'absolute', inset: 0 }}
          captionPos="bottom-right"
        />
      </div>

      {/* stats strip at bottom */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: C.grey,
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
            borderLeft: i === 0 ? 'none' : `1px solid ${C.clearGreen}66`,
            fontFamily: '"General Sans", sans-serif',
          }}>
            <span style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.green, fontWeight: 600 }}>{k}</span>
            <span style={{ fontSize: 13, color: C.ink, fontWeight: 500, letterSpacing: '0.04em' }}>{v}</span>
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
  return (
    <section data-screen-label="02 Promise" style={{
      position: 'relative',
      background: C.bege,
      padding: '180px 64px 200px',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 760, height: 760, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
        <TreeMark color={C.green} opacity={0.07} />
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <h2 style={{
          fontFamily: '"General Sans", sans-serif',
          fontWeight: 300, fontSize: 38, lineHeight: 1.5,
          letterSpacing: '-0.015em', color: C.ink, margin: 0, textWrap: 'balance',
        }}>
          We don't just build homes. We design the foundation for how your family <em style={{ fontStyle: 'italic', color: C.green, fontWeight: 300 }}>grows</em>.
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
  const items = [
    { kind: 'land', title: 'Land Vision', body: 'We identify locations where city convenience meets natural surroundings. Every site is chosen for its balance between access, quality of life, and long-term value.' },
    { kind: 'design', title: 'Thoughtful Design', body: 'We collaborate with architects to create layouts that feel intuitive, balanced, and filled with natural light. Spaces shaped by how families actually live.' },
    { kind: 'trust', title: 'Trusted Construction', body: '40+ years of building experience. We work with partners who share our respect for quality, integrity, and responsible execution.' },
  ];
  return (
    <section data-screen-label="03 Pillars" style={{
      background: C.white,
      padding: '160px 64px 140px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          fontFamily: '"General Sans", sans-serif',
          fontSize: 12, letterSpacing: '0.3em', color: C.terracota,
          textTransform: 'uppercase', fontWeight: 600, textAlign: 'center', marginBottom: 80,
        }}>Our Approach</div>

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
// 5. Featured projects — staggered cards, transitions to green
// ============================================================
function Projects() {
  const projects = [
    {
      code: 'ORMA / 01', name: 'Lir 725', location: 'Porto',
      blurb: 'A residential building designed in response to its surrounding urban context. Clarity, light, and considered proportions.',
      photoLabel: 'Architectural render — Lir 725, Porto facade at dusk, warm interior lights, cedar cladding',
      meta: '12 apartments · 2026 — 2027',
    },
    {
      code: 'ORMA / 02', name: 'Villas Sto. Tirso', location: 'Santo Tirso',
      blurb: 'A residential project set within a low-density, naturally defined environment. Room to breathe, room to grow.',
      photoLabel: 'Architectural render — Villas Sto. Tirso, six villas in landscape, low afternoon sun',
      meta: '6 villas · 2026 — 2028',
    },
  ];

  return (
    <section data-screen-label="04 Projects" style={{
      background: `linear-gradient(180deg, ${C.white} 0%, ${C.white} 65%, ${C.green} 65%, ${C.green} 100%)`,
      padding: '140px 64px 0',
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
            Spaces conceived to support the future you're building.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
          {projects.map((p, i) => (
            <article key={p.name} style={{
              background: C.white,
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              transform: i === 1 ? 'translateY(72px)' : 'none',
              display: 'grid',
              gridTemplateRows: 'auto auto',
            }}>
              <Placeholder label={p.photoLabel} tone={i === 0 ? 'green' : 'warm'} style={{ width: '100%', aspectRatio: '5 / 4' }} />
              <div style={{ padding: '36px 36px 40px' }}>
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
  return (
    <section data-screen-label="05 Why Orma" style={{
      position: 'relative',
      background: C.green,
      padding: '160px 64px',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', right: -240, bottom: -200, width: 800, height: 800, pointerEvents: 'none' }}>
        <TreeMark color={C.bege} opacity={0.08} />
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
              ['40+', 'years of construction experience'],
              ['2', 'projects in development'],
              ['100%', 'net income reinvested in community'],
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
              Led by a new generation that lives the realities of young families and active couples, we design with real life in mind. Our fresh perspective brings a clear understanding of modern routines, daily movement, and the desire for balance.
            </p>
            <div style={{ marginTop: 56 }}>
              <Placeholder
                label="Portrait — second-generation team in studio, soft window light"
                tone="dark"
                style={{ width: '100%', aspectRatio: '4 / 3' }}
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
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
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
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <div style={{
            fontFamily: '"General Sans", sans-serif',
            fontSize: 12, letterSpacing: '0.3em', color: C.terracota,
            textTransform: 'uppercase', fontWeight: 600, marginBottom: 24,
          }}>Andar Modelo · Visit Us</div>
          <h2 style={{
            fontFamily: '"General Sans", sans-serif',
            fontWeight: 300, fontSize: 44, lineHeight: 1.1,
            letterSpacing: '-0.02em', color: C.ink, margin: 0, textWrap: 'balance',
          }}>
            Visit our model apartment.
          </h2>
          <p style={{
            fontFamily: '"General Sans", sans-serif',
            fontSize: 17, lineHeight: 1.7, color: C.green, marginTop: 28, marginBottom: 0, maxWidth: 460,
          }}>
            You're one step away from seeing your future home. Come experience the quality, the light, and the space in person.
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
            <input style={inputStyle} placeholder="Full name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input style={inputStyle} placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input style={inputStyle} placeholder="Phone *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
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
            }}>{sent ? 'Visit requested ✓' : 'Schedule a visit →'}</button>
          </form>

          {/* photo strip */}
          <div style={{ display: 'grid', gap: 12 }}>
            <Placeholder label="Living" tone="green" style={{ flex: 1, minHeight: 0 }} />
            <Placeholder label="Kitchen" tone="bege" style={{ flex: 1, minHeight: 0 }} />
            <Placeholder label="Terrace" tone="warm" style={{ flex: 1, minHeight: 0 }} />
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
  return (
    <section data-screen-label="07 Community" style={{
      background: C.white,
      padding: '140px 64px 120px',
      textAlign: 'center',
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
          Every year, we reinvest part of our net income into the communities where our projects take shape. It's our way of ensuring the places families choose to live continue to grow with them.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 64 }}>
          {[
            'Local school garden',
            'Riverside walk',
            'Library renovation',
            'Youth football',
          ].map((label, i) => (
            <div key={label} style={{
              width: 130, height: 130, borderRadius: '50%',
              border: `1px solid ${C.green}66`,
              padding: 4, overflow: 'hidden',
            }}>
              <Placeholder
                label={label}
                tone={['bege', 'green', 'warm', 'grey'][i]}
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                captionPos="bottom-left"
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
  return (
    <section data-screen-label="08 Final CTA" style={{
      background: C.bege,
      padding: '120px 64px',
      textAlign: 'center',
    }}>
      <h2 style={{
        fontFamily: '"General Sans", sans-serif',
        fontWeight: 300, fontSize: 36, lineHeight: 1.2,
        letterSpacing: '-0.02em', color: C.ink, margin: 0,
      }}>
        Ready to take the next step?
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
        <TreeMark color={C.bege} opacity={0.03} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 56, paddingBottom: 64, borderBottom: `1px solid ${C.bege}22` }}>
          <div>
            <Wordmark color={C.bege} size={32} withSubline />
            <p style={{
              fontFamily: '"General Sans", sans-serif',
              fontSize: 14, lineHeight: 1.7, color: C.clearGreen, marginTop: 28, maxWidth: 320,
            }}>
              Building residential projects in northern Portugal since 1985 — a family practice now run by its second generation.
            </p>
          </div>
          {[
            { title: 'Navigate', items: ['Home', 'About', 'Projects', 'Contact'] },
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
            <a href="#" style={{ color: C.clearGreen, textDecoration: 'none' }}>Terms</a>
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
      width: 1440,
      height: 3600,
      overflow: 'auto',
      background: C.white,
      position: 'relative',
      fontFamily: '"General Sans", system-ui, sans-serif',
    }}>
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
    </div>
  );
}

window.DesktopHomepage = DesktopHomepage;
window.OrmaTokens = C;
window.OrmaTreeMark = TreeMark;
window.OrmaWordmark = Wordmark;
window.OrmaPlaceholder = Placeholder;
