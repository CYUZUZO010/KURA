import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, PieChart, Repeat, Upload, TrendingUp, Check, Star,
  LayoutGrid, ArrowLeftRight
} from 'lucide-react'
import ThemeToggleButton from '../components/shared/ThemeToggleButton'

/* ---------- Scroll-reveal wrapper ---------- */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`landing-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const FEATURES = [
  { icon: ArrowLeftRight, title: 'Effortless transactions', text: 'Log income and expenses in seconds, filter by category or date, and see everything in one clean list.' },
  { icon: PieChart, title: 'Budgets that keep pace', text: 'Set a monthly limit per category and watch a live progress bar as you spend — before you go over.' },
  { icon: Repeat, title: 'Recurring, automated', text: 'Rent, salary, subscriptions — set the schedule once and KURA posts them for you, on time, every time.' },
  { icon: Upload, title: 'Import in one drop', text: 'Drag in a bank statement CSV and KURA turns it into categorized transactions instantly.' },
]

const PRICING = [
  { name: 'Starter', price: '$0', period: '/forever', features: ['Unlimited transactions', 'Up to 5 budgets', 'CSV import', 'Basic analytics'], cta: 'Get started', highlight: false },
  { name: 'Personal', price: '$6', period: '/month', features: ['Everything in Starter', 'Unlimited budgets', 'Recurring transactions', 'Full analytics & trends'], cta: 'Get started', highlight: true },
  { name: 'Household', price: '$12', period: '/month', features: ['Everything in Personal', 'Shared budgets', 'Multiple accounts', 'Priority support'], cta: 'Get started', highlight: false },
]

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="landing">
      {/* ---------- Nav ---------- */}
      <header className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <div className="landing-brand-mark">K</div>
            <span>KURA</span>
          </div>
          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonial">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
  <ThemeToggleButton />
  <Link to="/login" className="btn btn-primary btn-sm">Get Started</Link>
</div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="landing-hero">
        <div className="landing-hero-glow" />
        
        <Reveal delay={80}>
          <h1 className="landing-h1">See where your money<br />actually goes.</h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="landing-sub">
            KURA tracks spending, keeps budgets honest, and turns a messy bank statement
            into a clear picture — without the clutter of a typical finance app.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="landing-hero-actions">
  <Link to="/login" className="btn btn-primary btn-sm">Get Started</Link>
            <a href="#features" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: 14 }}>
              See features
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="landing-mockup">
            <div className="landing-mockup-bar">
              <span /> <span /> <span />
            </div>
            <div className="landing-mockup-body">
              <div className="landing-mockup-sidebar">
                <div className="landing-mockup-pill active"><LayoutGrid size={13} /> Dashboard</div>
                <div className="landing-mockup-pill"><ArrowLeftRight size={13} /> Transactions</div>
                <div className="landing-mockup-pill"><PieChart size={13} /> Budgets</div>
              </div>
              <div className="landing-mockup-main">
                <div className="landing-mockup-stats">
                  <div className="landing-mockup-stat">
                    <div className="landing-mockup-label">Income</div>
                    <div className="landing-mockup-value positive">$4,200</div>
                  </div>
                  <div className="landing-mockup-stat">
                    <div className="landing-mockup-label">Expenses</div>
                    <div className="landing-mockup-value negative">$2,860</div>
                  </div>
                  <div className="landing-mockup-stat">
                    <div className="landing-mockup-label">Net savings</div>
                    <div className="landing-mockup-value positive">$1,340</div>
                  </div>
                </div>
                <div className="landing-mockup-chart">
                  <TrendingUp size={16} color="var(--color-positive)" />
                  <div className="landing-mockup-chart-line" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="landing-section">
        <Reveal><div className="landing-section-head">
          <div className="text-label">Features</div>
          <h2 className="landing-h2">Everything a budget needs. Nothing it doesn't.</h2>
        </div></Reveal>

        <div className="landing-feature-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <div className="landing-feature-card">
                <div className="landing-feature-icon"><f.icon size={18} strokeWidth={1.8} /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section id="pricing" className="landing-section landing-section-sunken">
        <Reveal><div className="landing-section-head">
          <div className="text-label">Pricing</div>
          <h2 className="landing-h2">Simple, transparent pricing. No hidden fees.</h2>
        </div></Reveal>

        <div className="landing-pricing-grid">
          {PRICING.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 100}>
              <div className={`landing-pricing-card ${tier.highlight ? 'highlight' : ''}`}>
                {tier.highlight && <div className="landing-pricing-badge">Most popular</div>}
                <div className="landing-pricing-name">{tier.name}</div>
                <div className="landing-pricing-price">{tier.price}<span>{tier.period}</span></div>
                <ul className="landing-pricing-list">
                  {tier.features.map((f) => (
                    <li key={f}><Check size={14} color="var(--color-positive)" /> {f}</li>
                  ))}
                </ul>
                <Link to="/login" className={`btn ${tier.highlight ? 'btn-primary' : 'btn-secondary'} btn-block`}>
                  {tier.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Testimonial ---------- */}
      <section id="testimonial" className="landing-section">
        <Reveal>
          <div className="landing-testimonial">
            <div className="landing-stars">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="var(--color-warning)" color="var(--color-warning)" />)}
            </div>
            <p>
              "I finally stopped guessing where my paycheck went. KURA's budgets made me
              change how I spend within the first month — and the CSV import saved me hours."
            </p>
            <div className="landing-testimonial-author">
              <div className="landing-testimonial-avatar">JM</div>
              <div>
                <div className="landing-testimonial-name">Jordan Mensah</div>
                <div className="landing-testimonial-role">Freelance designer</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="landing-cta">
        <Reveal>
          <h2 className="landing-h2">Ready to see where it's really going?</h2>
          <p className="landing-sub" style={{ margin: '10px auto 24px' }}>Free to start. No credit card required.</p>
          <Link to="/login" className="btn btn-primary" style={{ padding: '12px 26px', fontSize: 14 }}>
            Get Started <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="landing-footer">
        <div className="landing-brand">
          <div className="landing-brand-mark">K</div>
          <span>KURA</span>
        </div>
        <div className="text-muted" style={{ fontSize: 12.5 }}>© {new Date().getFullYear()} KURA. All rights reserved.</div>
      </footer>
    </div>
  )
}
