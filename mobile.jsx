/* global React */
const { useState } = React;
const C = window.OrmaTokens;
const TreeMark = window.OrmaTreeMark;
const Wordmark = window.OrmaWordmark;
const Placeholder = window.OrmaPlaceholder;

function MobileHomepage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      width: 375,
      height: 1700,
      overflow: 'auto',
      background: C.white,
      position: 'relative',
      fontFamily: '"General Sans", system-ui, sans-serif',
    }}>
      {/* Status bar */}
      <div style={{
        height: 44, padding: '0 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: '"General Sans", sans-serif', fontWeight: 600, fontSize: 14,
        color: menuOpen ? C.bege : C.bege,
        background: C.green,
      }}>
        <span>9:41</span>
        <span style={{ width: 18, height: 10, border: `1px solid ${C.bege}`, borderRadius: 2, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1, background: C.bege, width: '70%', borderRadius: 1 }} />
        </span>
      </div>

      {/* Nav — green */}
      <nav style={{
        height: 56, padding: '0 22px',
        background: C.green,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Wordmark color={C.bege} size={20} />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 }}
        >
          <span style={{ width: 22, height: 1, background: C.bege, transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none', transition: '200ms' }} />
          <span style={{ width: 22, height: 1, background: C.bege, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: 22, height: 1, background: C.bege, transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none', transition: '200ms' }} />
        </button>
      </nav>

      {menuOpen && (
        <div style={{
          background: C.green, padding: '32px 22px 60px', minHeight: 600,
        }}>
          {['Home', 'About', 'Projects', 'Contact'].map((l, i) => (
            <a key={l} href="#" style={{
              display: 'block',
              fontFamily: '"General Sans", sans-serif',
              fontWeight: 300, fontSize: 36, letterSpacing: '-0.02em',
              color: C.bege, padding: '16px 0',
              borderBottom: `1px solid ${C.bege}22`, textDecoration: 'none',
              opacity: i === 0 ? 1 : 0.85,
            }}>{l}</a>
          ))}
          <button style={{
            width: '100%', marginTop: 36,
            background: C.terracota, color: C.white, border: 'none',
            padding: '18px 22px', fontFamily: '"General Sans", sans-serif',
            fontWeight: 500, fontSize: 13, letterSpacing: '0.16em',
            textTransform: 'uppercase', borderRadius: 6,
          }}>Schedule a visit →</button>
          <div style={{ marginTop: 36, fontFamily: '"General Sans", sans-serif', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.clearGreen }}>
            info@orma.pt
          </div>
        </div>
      )}

      {!menuOpen && (
        <>
          {/* Hero — image first */}
          <Placeholder
            label="Interior render — bright living, oak floor, monstera, afternoon light"
            tone="green"
            style={{ width: '100%', height: 380 }}
          />
          <div style={{ position: 'relative', padding: '40px 22px 32px' }}>
            <div style={{ position: 'absolute', right: -100, top: 0, width: 280, height: 280, pointerEvents: 'none' }}>
              <TreeMark color={C.clearGreen} opacity={0.32} />
            </div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                fontFamily: '"General Sans", sans-serif',
                fontSize: 11, letterSpacing: '0.28em', color: C.green,
                textTransform: 'uppercase', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22,
              }}>
                <span style={{ width: 22, height: 1, background: C.green }} />
                Porto · Santo Tirso
              </div>
              <h1 style={{
                fontFamily: '"General Sans", sans-serif',
                fontWeight: 300, fontSize: 42, lineHeight: 1.0, letterSpacing: '-0.025em',
                color: C.ink, margin: 0, textWrap: 'balance',
              }}>
                Designed for the way you <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.green }}>live.</em>
              </h1>
              <p style={{
                fontFamily: '"General Sans", sans-serif',
                fontSize: 16, lineHeight: 1.65, color: C.green,
                marginTop: 22, marginBottom: 28,
              }}>
                Homes shaped by clarity, light, and purpose — built by a family of architects, engineers and craftspeople in northern Portugal.
              </p>
              <button style={{
                width: '100%',
                background: C.terracota, color: C.white, border: 'none',
                padding: '18px 22px', fontFamily: '"General Sans", sans-serif',
                fontWeight: 500, fontSize: 13, letterSpacing: '0.16em',
                textTransform: 'uppercase', borderRadius: 6, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>Explore our projects</span><span>→</span>
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{
            background: C.grey,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
          }}>
            {[
              ['Est.', '1985'],
              ['Projects', '2'],
              ['Region', 'N. Portugal'],
              ['Family-led', 'Since gen. II'],
            ].map(([k, v]) => (
              <div key={k} style={{ background: C.grey, padding: '16px 18px' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.green, fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 14, color: C.ink, marginTop: 4, fontFamily: '"General Sans", sans-serif' }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Promise */}
          <div style={{ background: C.bege, padding: '72px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: 360, height: 360, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
              <TreeMark color={C.green} opacity={0.06} />
            </div>
            <p style={{
              fontFamily: '"General Sans", sans-serif',
              fontWeight: 300, fontSize: 24, lineHeight: 1.45,
              color: C.ink, margin: 0, position: 'relative', zIndex: 2,
              textWrap: 'balance',
            }}>
              We don't just build homes. We design the foundation for how your family <em style={{ fontStyle: 'italic', color: C.green, fontWeight: 300 }}>grows</em>.
            </p>
          </div>

          {/* Project card */}
          <div style={{ background: C.white, padding: '64px 22px 40px' }}>
            <div style={{
              fontFamily: '"General Sans", sans-serif',
              fontSize: 11, letterSpacing: '0.3em', color: C.green,
              textTransform: 'uppercase', fontWeight: 600, marginBottom: 14,
            }}>Our Projects</div>
            <h2 style={{
              fontFamily: '"General Sans", sans-serif',
              fontWeight: 300, fontSize: 28, lineHeight: 1.2,
              color: C.ink, margin: '0 0 28px', letterSpacing: '-0.02em',
            }}>
              Spaces conceived to support the future you're building.
            </h2>

            <article style={{
              background: C.white, borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden',
            }}>
              <Placeholder label="Lir 725 — Porto facade" tone="green" style={{ width: '100%', aspectRatio: '5 / 4' }} />
              <div style={{ padding: '24px' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: C.green, letterSpacing: '0.16em', marginBottom: 10, textTransform: 'uppercase' }}>
                  ORMA / 01 — Porto
                </div>
                <h3 style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 600, fontSize: 22, color: C.ink, margin: 0 }}>Lir 725</h3>
                <p style={{ fontFamily: '"General Sans", sans-serif', fontSize: 15, lineHeight: 1.6, color: C.green, margin: '14px 0 20px' }}>
                  A residential building designed in response to its surrounding urban context. Clarity, light, and considered proportions.
                </p>
                <a href="#" style={{
                  fontFamily: '"General Sans", sans-serif', fontSize: 12,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: C.terracota, fontWeight: 600, textDecoration: 'none',
                }}>Learn more →</a>
              </div>
            </article>
          </div>

          {/* Stats — green */}
          <div style={{ background: C.green, padding: '64px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -120, bottom: -120, width: 380, height: 380, pointerEvents: 'none' }}>
              <TreeMark color={C.bege} opacity={0.08} />
            </div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                fontFamily: '"General Sans", sans-serif',
                fontSize: 11, letterSpacing: '0.3em', color: C.clearGreen,
                textTransform: 'uppercase', fontWeight: 600, marginBottom: 32,
              }}>Why Orma</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {[
                  ['40+', 'years experience'],
                  ['2', 'in development'],
                  ['100%', 'reinvested locally'],
                  ['Gen. II', 'family-led'],
                ].map(([num, label], i) => (
                  <div key={i} style={{
                    padding: '20px 0',
                    borderTop: `1px solid ${C.clearGreen}55`,
                  }}>
                    <div style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 300, fontSize: 44, lineHeight: 1, color: C.terracota, letterSpacing: '-0.03em' }}>{num}</div>
                    <div style={{ fontFamily: '"General Sans", sans-serif', fontSize: 12, color: C.bege, marginTop: 8, lineHeight: 1.5 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visit form */}
          <div style={{ background: C.bege, padding: '64px 22px' }}>
            <div style={{
              fontFamily: '"General Sans", sans-serif',
              fontSize: 11, letterSpacing: '0.3em', color: C.terracota,
              textTransform: 'uppercase', fontWeight: 600, marginBottom: 14,
            }}>Andar Modelo</div>
            <h2 style={{
              fontFamily: '"General Sans", sans-serif',
              fontWeight: 300, fontSize: 30, lineHeight: 1.15,
              color: C.ink, margin: 0, letterSpacing: '-0.02em',
            }}>Visit our model apartment.</h2>
            <p style={{ fontFamily: '"General Sans", sans-serif', fontSize: 15, lineHeight: 1.65, color: C.green, marginTop: 16, marginBottom: 24 }}>
              You're one step away from seeing your future home.
            </p>
            <div style={{ background: `${C.white}cc`, padding: 22, borderRadius: 12, display: 'grid', gap: 14 }}>
              <input placeholder="Full name *" style={{ width: '100%', background: C.white, border: `1px solid ${C.clearGreen}`, padding: '14px 16px', fontFamily: '"General Sans", sans-serif', fontSize: 15, borderRadius: 6, outline: 'none' }} />
              <input placeholder="Email *" style={{ width: '100%', background: C.white, border: `1px solid ${C.clearGreen}`, padding: '14px 16px', fontFamily: '"General Sans", sans-serif', fontSize: 15, borderRadius: 6, outline: 'none' }} />
              <input placeholder="Phone *" style={{ width: '100%', background: C.white, border: `1px solid ${C.clearGreen}`, padding: '14px 16px', fontFamily: '"General Sans", sans-serif', fontSize: 15, borderRadius: 6, outline: 'none' }} />
              <button style={{
                background: C.terracota, color: C.white, border: 'none',
                padding: '18px 22px', fontFamily: '"General Sans", sans-serif',
                fontWeight: 500, fontSize: 13, letterSpacing: '0.16em',
                textTransform: 'uppercase', borderRadius: 6, cursor: 'pointer', marginTop: 8,
              }}>Schedule a visit →</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

window.MobileHomepage = MobileHomepage;
