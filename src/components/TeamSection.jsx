import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Crown, Rocket, TrendingUp, BarChart3, Mic, Landmark,
  Settings, PersonStanding, Users, Mail, MessageCircle,
} from 'lucide-react'
import { TEAM, TEAM_DEPARTMENTS } from '../data'
import { useWhatsApp } from '../hooks/useWhatsApp'
import { useSocialLinks } from '../hooks/useSocialLinks'

// Telegram brand mark (lucide has no brand logos)
const TelegramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.55-1.1.55l.4-5.56 10.13-9.17c.44-.39-.1-.61-.68-.22L7.06 12.6l-5.5-1.71c-1.2-.37-1.21-1.2.26-1.79l21.5-8.28c1-.36 1.87.24 1.59 1.97z"/>
  </svg>
)

/* Real vector icons only (lucide) — one per department.
   A department that isn't listed here falls back to the generic "Users" icon,
   so adding a new department in data/index.js can never break this section. */
const DEPT_ICONS = {
  'Leadership':           Crown,
  'Campaign Management':  Rocket,
  'Audience Growth':      TrendingUp,
  'Analytics & Strategy': BarChart3,
  'Artist Relations':     Mic,
  'Finance':              Landmark,
  'Operations':           Settings,
  'Dance Department':     PersonStanding,
}

const deptIcon = (dept) => DEPT_ICONS[dept] || Users
const pad = (n) => String(n).padStart(2, '0')

export default function TeamSection() {
  const [activeDept, setActiveDept] = useState('All')
  const waLink = useWhatsApp()
  const { telegramLink } = useSocialLinks()

  const visibleDepts = activeDept === 'All' ? TEAM_DEPARTMENTS : [activeDept]

  return (
    <section className="tm-section" id="team" aria-labelledby="team-heading">
      <div className="tm-inner">

        {/* ── Header ── */}
        <header className="tm-head">
          <span className="tm-eyebrow"><span className="tm-eyebrow-rule" aria-hidden="true" />Our People</span>
          <h2 id="team-heading" className="tm-title">
            The Team Behind <em>Echorise</em>
          </h2>
          <p className="tm-lede">
            {TEAM.length} music industry professionals dedicated to amplifying every artist we work with.
          </p>

          <dl className="tm-facts">
            <div><dt>Team members</dt><dd>{TEAM.length}</dd></div>
            <div><dt>Departments</dt><dd>{TEAM_DEPARTMENTS.length}</dd></div>
            <div><dt>Reply time</dt><dd>24 hrs</dd></div>
          </dl>
        </header>

        {/* ── Department filter ── */}
        <div className="tm-filters" role="group" aria-label="Filter the team by department">
          <button
            type="button"
            className={`tm-chip${activeDept === 'All' ? ' is-active' : ''}`}
            aria-pressed={activeDept === 'All'}
            onClick={() => setActiveDept('All')}
          >
            All
          </button>
          {TEAM_DEPARTMENTS.map((dept) => {
            const Icon = deptIcon(dept)
            const isActive = activeDept === dept
            return (
              <button
                key={dept}
                type="button"
                className={`tm-chip${isActive ? ' is-active' : ''}`}
                aria-pressed={isActive}
                onClick={() => setActiveDept(dept)}
              >
                <Icon size={15} strokeWidth={2} aria-hidden="true" />
                {dept}
              </button>
            )
          })}
        </div>

        {/* ── Departments ── */}
        <div className="tm-depts">
          {visibleDepts.map((dept) => {
            const members = TEAM.filter((m) => m.dept === dept)
            if (members.length === 0) return null
            const Icon = deptIcon(dept)
            return (
              <div key={dept} className={`tm-dept${dept === 'Leadership' ? ' tm-dept--lead' : ''}`}>
                <div className="tm-dept-head">
                  <span className="tm-dept-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.75} /></span>
                  <h3 className="tm-dept-name">{dept}</h3>
                  <span className="tm-dept-count">
                    {members.length} {members.length === 1 ? 'member' : 'members'}
                  </span>
                </div>

                <ul className="tm-grid">
                  {members.map((m, i) => (
                    <li key={`${m.name}-${m.role}`} className="tm-cell">
                      <span className="tm-idx">{pad(i + 1)}</span>
                      <div className="tm-person">
                        {m.photo && (
                          <img className="tm-photo" src={m.photo} alt="" loading="lazy" width="48" height="48" />
                        )}
                        <div>
                          <div className="tm-name">{m.name}</div>
                          <div className="tm-role">{m.role}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* ── Talk to the team ── */}
        <div className="tm-cta">
          <div>
            <h3 className="tm-cta-title">Questions before you order?</h3>
            <p className="tm-cta-text">Talk to the team directly. Every inquiry gets a reply within 24 hours.</p>
          </div>
          <div className="tm-cta-actions">
            <a href="mailto:support@echorisemedia.com" className="tm-btn tm-btn--solid">
              <Mail size={16} aria-hidden="true" /> Email us
            </a>
            {waLink !== '#' && (
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="tm-btn tm-btn--line">
                <MessageCircle size={16} aria-hidden="true" /> WhatsApp
              </a>
            )}
            {telegramLink && (
              <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="tm-btn tm-btn--line">
                <TelegramIcon /> Telegram
              </a>
            )}
            <Link to="/contact" className="tm-btn tm-btn--line">Contact form</Link>
          </div>
        </div>

      </div>
    </section>
  )
}
