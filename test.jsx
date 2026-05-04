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
// WordReveal
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
        const wordStyle = { display: 'inline', opacity: 0.15, transition: 'opacity 0.05s linear' };
        if (seg.em) {
          return (
            <span key={i}>
              <em data-word style={{ ...wordStyle, fontStyle: 'italic', color: C.green, fontWeight: 300 }}>{seg.word}</em>
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
// TreeMark
// ============================================================
function TreeMark({ opacity = 0.08, style = {} }) {
  return (
    <div style={{
      display: 'block', width: '100%', height: '100%',
      backgroundImage: 'url(https://tiagoc108.sg-host.com/wp-content/uploads/2025/12/orma-arvore-black-1.png)',
      backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
      opacity, ...style,
    }} aria-hidden="true" />
  );
}

// ============================================================
// RollingNumber
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

// ============================================================
// STAT_ICONS
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

// ============================================================
// MenuLink / MenuSubLink / MenuDrawer
// ============================================================
function MenuLink({ label, href, onClose, hasChildren, children }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const handleClick = (e) => {
    if (hasChildren) { e.preventDefault(); setExpanded(!expanded); }
    else { e.preventDefault(); onClose(); if (href) { const el = document.querySelector(href); if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 350); } }
  };
  return (
    <div>
      <a href={href || '#'} onClick={handleClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ fontWeight: 400, fontSize: 28, letterSpacing: '0.04em', textTransform: 'uppercase', color: C.bege, textDecoration: 'none', padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'opacity 0.3s', opacity: hovered ? 0.7 : 1, borderBottom: '1px solid rgba(238,232,218,0.15)', position: 'relative' }}>
        <span style={{ position: 'relative', display: 'inline-block' }}>
          {label}
          <span style={{ position: 'absolute', left: 0, bottom: -2, height: 1, background: C.bege, width: hovered ? '100%' : '0%', transition: 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }} />
        </span>
        {hasChildren && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.bege} strokeWidth="1"
            style={{ transition: 'transform 0.3s ease', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', marginLeft: 12, flexShrink: 0 }}>
            <polyline points="2,5 7,10 12,5" />
          </svg>
        )}
      </a>
      {hasChildren && (
        <div style={{ maxHeight: expanded ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)', paddingLeft: 16 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function MenuSubLink({ label, subtitle, onClose }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: 'block', textDecoration: 'none', padding: '12px 0', transition: 'opacity 0.3s', opacity: hovered ? 0.7 : 1 }}>
      <span style={{ fontWeight: 400, fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.bege, position: 'relative', display: 'inline-block' }}>
        {label}
        <span style={{ position: 'absolute', left: 0, bottom: -1, height: 1, background: C.bege, width: hovered ? '100%' : '0%', transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }} />
      </span>
      {subtitle && <span style={{ display: 'block', fontWeight: 300, fontSize: 12, letterSpacing: '0.06em', color: 'rgba(238,232,218,0.5)', marginTop: 2 }}>{subtitle}</span>}
    </a>
  );
}

function MenuDrawer({ open, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 199, background: 'rgba(0,0,0,0.45)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.4s ease' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: Math.min(420, window.innerWidth), maxWidth: '100vw', zIndex: 201, background: C.green, transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 56px 48px', overflowY: 'auto' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 72 }}>
            <img src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png" alt="Orma" style={{ height: 22, width: 'auto', display: 'block', opacity: 0.8 }} />
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={C.bege} strokeWidth="1" strokeLinecap="round">
                <line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <MenuLink label="Projects" href="#projects" onClose={onClose} hasChildren>
              <MenuSubLink label="Lir 725" subtitle="Porto" onClose={onClose} />
              <MenuSubLink label="Villas Sto. Tirso" subtitle="Santo Tirso" onClose={onClose} />
            </MenuLink>
            <MenuLink label="About" href="#about" onClose={onClose} />
            <MenuLink label="Contact" href="#contact" onClose={onClose} />
          </nav>
        </div>
        <div style={{ borderTop: '1px solid rgba(238,232,218,0.15)', paddingTop: 32 }}>
          <p style={{ fontWeight: 300, fontSize: 13, lineHeight: 1.7, letterSpacing: '0.03em', color: 'rgba(238,232,218,0.6)', margin: 0 }}>
            Porto - Santo Tirso<br />geral@orma.pt
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
      if (y < heroH * 0.5) setVisible(true);
      else if (y < lastScroll.current) setVisible(true);
      else if (y > lastScroll.current + 10) setVisible(false);
      lastScroll.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 80,
        padding: isMobile ? '0 20px' : '0 48px',
        background: inHero ? 'transparent' : 'rgba(92,100,87,0.95)',
        backdropFilter: inHero ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: inHero ? 'none' : 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 150,
        transform: visible || menuOpen ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease',
      }}>
        <a href="index.html" style={{ display: 'block', lineHeight: 0 }}>
          <img src="https://tiagoc108.sg-host.com/wp-content/uploads/2025/11/orma-bege-2.png" alt="Orma" style={{ height: 28, width: 'auto', display: 'block' }} />
        </a>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 7, width: 48, height: 48 }} aria-label="Menu">
          <span style={{ display: 'block', width: 32, height: 1.5, background: C.bege, transition: 'all 0.3s' }} />
          <span style={{ display: 'block', width: 24, height: 1.5, background: C.bege, transition: 'all 0.3s' }} />
          <span style={{ display: 'block', width: 32, height: 1.5, background: C.bege, transition: 'all 0.3s' }} />
        </button>
      </nav>
    </>
  );
}

// ============================================================
// Hero — simple image background
// ============================================================
function Hero() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      position: 'relative', width: '100%', height: '100vh', overflow: 'hidden',
    }}>
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80"
        alt="Architecture"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(31,32,34,0.15) 0%, rgba(31,32,34,0.45) 100%)' }} />
      <div style={{
        position: 'relative', zIndex: 2, height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: isMobile ? '0 24px' : '0 64px', maxWidth: 800,
      }}>
        <h1 style={{ fontWeight: 300, fontSize: isMobile ? 40 : 72, lineHeight: 1.05, letterSpacing: '-0.025em', color: C.white, margin: 0 }}>
          Test <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.bege }}>Page.</em>
        </h1>
        <p style={{ fontWeight: 400, fontSize: 18, lineHeight: 1.7, color: C.bege, marginTop: 32, opacity: 0.9, maxWidth: 520 }}>
          Sandbox for building and testing new sections.
        </p>
      </div>
    </section>
  );
}

// ============================================================
// WhyOrma — copied from homepage
// ============================================================
function WhyOrma() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const textColRef = useRef(null);
  const communityRef = useRef(null);
  const cardRefs = useRef([]);
  const borderRefs = useRef([]);

  const whyRevealText = 'Our team brings thoughtful guidance and dependable execution to every project, standing by your vision with the confidence this moment calls for.';
  const communityText = 'Every year, we reinvest part of our net income into the communities where our projects take shape - supporting local well-being and ensuring the places families choose to live continue to grow with them.';

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

    if (labelRef.current) {
      const t = gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' } });
      triggers.push(t.scrollTrigger);
    }
    if (textColRef.current) {
      const t = gsap.fromTo(textColRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15, scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' } });
      triggers.push(t.scrollTrigger);
    }
    if (communityRef.current) {
      const t = gsap.fromTo(communityRef.current, { opacity: 0, y: 24 }, { opacity: 0.65, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.6, scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' } });
      triggers.push(t.scrollTrigger);
    }
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const t = gsap.fromTo(card, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 + i * 0.15, scrollTrigger: { trigger: section, start: 'top 65%', toggleActions: 'play none none none' } });
      triggers.push(t.scrollTrigger);
    });
    borderRefs.current.forEach((border, i) => {
      if (!border) return;
      const t = gsap.fromTo(border, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'power2.out', delay: 0.4 + i * 0.15, scrollTrigger: { trigger: section, start: 'top 65%', toggleActions: 'play none none none' } });
      triggers.push(t.scrollTrigger);
    });

    return () => triggers.forEach(t => t && t.kill());
  }, []);

  return (
    <section ref={sectionRef} id="about" style={{
      position: 'relative', background: C.green,
      padding: isMobile ? '80px 24px' : '140px 64px', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', right: -240, bottom: -200, width: 800, height: 800, pointerEvents: 'none' }}>
        <TreeMark opacity={0.08} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div ref={labelRef} style={{ fontSize: 12, letterSpacing: '0.3em', color: C.bege, textTransform: 'uppercase', fontWeight: 600, marginBottom: isMobile ? 32 : 56, opacity: 0 }}>
          Why Orma
        </div>

        <div style={isMobile
          ? { display: 'flex', flexDirection: 'column', gap: 40 }
          : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }
        }>
          {/* LEFT - Narrative text */}
          <div>
            <div ref={textColRef} style={{ opacity: 0 }}>
              <WordReveal text={whyRevealText} style={{ fontSize: isMobile ? 20 : 28, lineHeight: 1.55, color: C.white, margin: 0, fontWeight: 300, letterSpacing: '-0.01em' }} />
            </div>
            <p ref={communityRef} style={{ fontSize: isMobile ? 14 : 15, lineHeight: 1.8, color: C.bege, margin: '36px 0 0', fontWeight: 400, opacity: 0, maxWidth: 480 }}>
              {communityText}
            </p>
          </div>

          {/* RIGHT - Stats grid */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              {stats.map((stat, i) => {
                const IconComp = STAT_ICONS[stat.icon];
                const isFullWidth = i === 2;
                return (
                  <div key={i} ref={el => cardRefs.current[i] = el} style={{
                    padding: isMobile ? '24px 20px' : '28px 24px',
                    background: 'rgba(238,232,218,0.08)', borderRadius: 8,
                    position: 'relative', overflow: 'hidden', opacity: 0,
                    ...(isFullWidth && !isMobile ? { gridColumn: '1 / -1' } : {}),
                  }}>
                    <div ref={el => borderRefs.current[i] = el} style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: 3, background: C.terracota, borderRadius: '3px 0 0 3px',
                      transformOrigin: 'top center', transform: 'scaleY(0)',
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      {IconComp && React.createElement(IconComp)}
                      <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(238,232,218,0.7)', textTransform: 'uppercase', fontWeight: 600 }}>{stat.label}</div>
                    </div>
                    <div style={{ fontWeight: 500, fontSize: isMobile ? 48 : 56, lineHeight: 1, letterSpacing: '-0.03em', color: C.bege }}>
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
// Sustainability — placeholder for new section
// ============================================================
function Sustainability() {
  const isMobile = useIsMobile();
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} id="sustainability" style={{
      position: 'relative', background: C.bege,
      padding: isMobile ? '80px 24px' : '140px 64px', overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.3em', color: C.green, textTransform: 'uppercase', fontWeight: 600, marginBottom: isMobile ? 32 : 56 }}>
          Sustainability
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 400, textAlign: 'center',
          border: '2px dashed rgba(92,100,87,0.2)', borderRadius: 16, padding: isMobile ? 32 : 64,
        }}>
          <div style={{ width: 80, height: 80, marginBottom: 32, opacity: 0.3 }}>
            <TreeMark opacity={1} />
          </div>
          <h2 style={{ fontWeight: 300, fontSize: isMobile ? 28 : 44, lineHeight: 1.2, letterSpacing: '-0.01em', color: C.ink, margin: '0 0 20px' }}>
            New section goes here
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: C.green, maxWidth: 520, margin: 0 }}>
            This is the placeholder for the sustainability section. Content and layout to be defined.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Footer — copied from homepage
// ============================================================
function Footer() {
  const isMobile = useIsMobile();
  const footerRef = useScrollReveal();

  return (
    <footer id="footer" style={{ background: '#3D4239', color: C.bege, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', bottom: isMobile ? -30 : -40, left: '50%', transform: 'translateX(-50%)',
        fontWeight: 700, fontSize: isMobile ? 160 : 280, letterSpacing: '-0.04em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.04)', whiteSpace: 'nowrap', pointerEvents: 'none', lineHeight: 0.85,
      }}>orma.</div>

      <div ref={footerRef} style={{
        maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2,
        padding: isMobile ? '80px 24px 32px' : '120px 64px 40px',
        willChange: 'opacity, transform',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: isMobile ? 48 : 80, paddingBottom: isMobile ? 56 : 80 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', color: C.clearGreen, textTransform: 'uppercase', fontWeight: 600, marginBottom: 28 }}>Contact</div>
            <h2 style={{ fontWeight: 300, fontSize: isMobile ? 36 : 56, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.bege, margin: 0 }}>
              Let's talk about your next <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.terracota }}>home.</em>
            </h2>
            <div style={{ display: 'flex', gap: 16, marginTop: isMobile ? 32 : 44, flexWrap: 'wrap' }}>
              <a href="#contact" onClick={e => { e.preventDefault(); const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} style={{
                position: 'relative', overflow: 'hidden', display: 'inline-block', padding: '16px 36px',
                background: C.terracota, color: C.white, fontWeight: 600, fontSize: 12, letterSpacing: '0.2em',
                textTransform: 'uppercase', textDecoration: 'none', borderRadius: 40,
              }}
              onMouseEnter={e => { const fill = e.currentTarget.querySelector('.footer-btn-fill'); if (fill) fill.style.transform = 'translateX(0)'; }}
              onMouseLeave={e => { const fill = e.currentTarget.querySelector('.footer-btn-fill'); if (fill) fill.style.transform = 'translateX(-101%)'; }}>
                <span className="footer-btn-fill" style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.15)', transform: 'translateX(-101%)', transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)', borderRadius: 'inherit' }} />
                <span style={{ position: 'relative', zIndex: 1 }}>Get in touch</span>
              </a>
              <a href="#" onClick={e => { e.preventDefault(); window.location.href = 'index.html'; }} style={{
                position: 'relative', overflow: 'hidden', display: 'inline-block', padding: '16px 36px',
                background: 'transparent', color: C.bege, fontWeight: 500, fontSize: 12, letterSpacing: '0.2em',
                textTransform: 'uppercase', textDecoration: 'none', borderRadius: 40,
                border: '1px solid rgba(238,232,218,0.25)',
              }}
              onMouseEnter={e => { const fill = e.currentTarget.querySelector('.footer-btn-fill'); if (fill) fill.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = 'rgba(238,232,218,0.5)'; }}
              onMouseLeave={e => { const fill = e.currentTarget.querySelector('.footer-btn-fill'); if (fill) fill.style.transform = 'translateX(-101%)'; e.currentTarget.style.borderColor = 'rgba(238,232,218,0.25)'; }}>
                <span className="footer-btn-fill" style={{ position: 'absolute', inset: 0, background: 'rgba(238,232,218,0.08)', transform: 'translateX(-101%)', transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)', borderRadius: 'inherit' }} />
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
              <div key={item.label} style={{ borderTop: i === 0 ? '1px solid rgba(238,232,218,0.12)' : 'none', borderBottom: '1px solid rgba(238,232,218,0.12)', padding: '20px 0' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.clearGreen, fontWeight: 600, marginBottom: 6 }}>{item.label}</div>
                {item.href ? (
                  <a href={item.href} style={{ fontSize: 15, color: C.bege, lineHeight: 1.5, textDecoration: 'none', transition: 'opacity 0.3s' }}>{item.value}</a>
                ) : (
                  <div style={{ fontSize: 15, color: C.bege, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.value}</div>
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
              {[
                { name: 'Instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg> },
                { name: 'LinkedIn', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
                { name: 'Facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
              ].map(s => (
                <a key={s.name} href="#" aria-label={s.name} style={{ color: C.clearGreen, transition: 'color 0.3s, opacity 0.3s', display: 'flex', alignItems: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.bege}
                  onMouseLeave={e => e.currentTarget.style.color = C.clearGreen}
                >{s.icon}</a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 16 : 0, paddingTop: 20,
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
// TestPage — main export
// ============================================================
function TestPage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', fontFamily: '"General Sans", system-ui, sans-serif' }}>
      <Nav />
      <Hero />
      <WhyOrma />
      <Sustainability />
      <Footer />
    </div>
  );
}

window.TestPage = TestPage;
