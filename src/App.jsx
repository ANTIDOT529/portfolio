import { useEffect } from 'react'
import Lenis from 'lenis'
import { profile, projects, skills, university } from './data.js'

// Плавная прокрутка колесом и тачпадом; для тех, кто отключил анимации, остаётся обычная
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      anchors: { offset: -24 },
    })
    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])
}

function Wordmark() {
  return (
    <a className="wordmark" href="#top" aria-label="ANTIDOT">
      ANTI<span>DOT</span>
    </a>
  )
}

function Header() {
  return (
    <header className="nav">
      <Wordmark />
      <nav className="nav-links">
        <a href="#about">Обо мне</a>
        <a href="#projects">Проекты</a>
        <a href="#skills">Навыки</a>
        <a href="#university">Университет</a>
        <a href="#contacts">Контакты</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <div id="top" className="hero">
      <div className="hero-text">
        <p className="eyebrow">{profile.role}</p>
        <h1>
          {profile.name[0]} <span>{profile.name[1]}</span>
        </h1>
        <p className="hero-tagline">{profile.tagline}</p>
        <a className="btn" href="#projects">
          Смотреть проекты
        </a>
      </div>
    </div>
  )
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function Project({ p, n }) {
  return (
    <article className="project">
      <header className="project-head">
        <span className="project-n">{String(n).padStart(2, '0')}</span>
        <h3>{p.title}</h3>
        <span className="project-status">
          <i className={p.status.includes('приостановлена') ? 'dot paused' : 'dot'} />
          {p.status}
        </span>
      </header>
      <div className="project-body">
      <div className="project-text">
        <p>{p.summary}</p>
        <p className="stack">
          {p.kind}. {p.stack.join(', ')}
        </p>
        <details>
          <summary>Что решал технически</summary>
          <ul>
            {p.problems.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </details>
        {(p.links.store || p.links.source || p.links.soon) && (
          <p className="project-links">
            {p.links.store && (
              <a href={p.links.store} target="_blank" rel="noreferrer">
                {p.links.storeLabel || 'Страница в магазине'}
              </a>
            )}
            {p.links.soon && <span className="soon">{p.links.soon}</span>}
            {p.links.source && (
              <a href={p.links.source} target="_blank" rel="noreferrer">
                Исходный код
              </a>
            )}
          </p>
        )}
      </div>
      <div className="stage" style={{ background: p.tint }}>
        {p.images.length > 0 ? (
          p.images.map((src) => <img key={src} src={src} alt={'Скриншот: ' + p.title} width="640" height="1138" loading="lazy" decoding="async" />)
        ) : (
          <span className="stage-title">{p.title}</span>
        )}
      </div>
      </div>
    </article>
  )
}

function Contacts() {
  const c = profile.contacts
  const items = [
    c.vk && { label: 'ВКонтакте', href: c.vk, text: c.vk.replace(/^https?:\/\//, '') },
    c.telegram && { label: 'Telegram', href: c.telegram, text: c.telegram.replace(/^https?:\/\//, '') },
    c.email && { label: 'Почта', href: 'mailto:' + c.email, text: c.email },
  ].filter(Boolean)
  if (items.length === 0) return <p className="muted">Контакты скоро появятся здесь.</p>
  return (
    <div className="contact-panel">
      <div className="contact-intro">
        <p className="contact-lead">Буду рад знакомству и разговору о работе.</p>
        <p className="muted">Напишите в удобном для вас месте.</p>
      </div>
      <ul className="contacts">
        {items.map((i) => (
          <li key={i.label}>
            <span>{i.label}</span>
            <a href={i.href} target="_blank" rel="noreferrer">
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function App() {
  useSmoothScroll()
  return (
    <>
      <Header />
      <main className="wrap">
        <Hero />

        <Section id="about" title="Обо мне">
          <div className="about">
            {profile.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>

        <Section id="projects" title="Проекты">
          <div className="projects">
            {projects.map((p, i) => (
              <Project key={p.id} p={p} n={i + 1} />
            ))}
          </div>
        </Section>

        <div className="duo">
        <Section id="skills" title="Навыки">
          <h3 className="skills-label">Изучаю</h3>
          <ul className="skills">
            {skills.learning.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <h3 className="skills-label">Хочу освоить</h3>
          <ul className="skills want">
            {skills.want.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Section>

        <Section id="university" title="Университет">
          <h3 className="skills-label">Языки</h3>
          <ul className="skills">
            {university.languages.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <h3 className="skills-label">Программы</h3>
          <ul className="skills">
            {university.tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Section>
        </div>

        <Section id="contacts" title="Контакты">
          <Contacts />
        </Section>
      </main>
      <div className="big-mark" aria-hidden="true">
        ANTI<span>DOT</span>
      </div>
      <footer className="footer wrap">
        <span>Максим Круглов, 2026</span>
      </footer>
    </>
  )
}
