import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const NAMES = [
  'Diya', 'Sweets', 'Lights', 'Rangoli',
  'Crackers', 'Gifts', 'Lamp', 'Sparkler',
  'Lantern', 'Marigold', 'Candle', 'Star',
  'Garland', 'Bell', 'Peacock', 'Lotus',
]
const CARDS = NAMES.map((title, i) => ({
  id: i + 1,
  title,
  hue: Math.round((i * 360) / NAMES.length),
}))

export default function CardFlip() {
  const scope = useRef(null)
  const { contextSafe } = useGSAP({ scope })

  const grounded = { y: 0, rotationX: 0, rotationY: 0, scale: 1, transformPerspective: 900 }
  const MAX_TILT = 45

  // Card position relative to the grid center, each axis normalized to -1..1.
  const norms = (card) => {
    const d = card.parentElement.getBoundingClientRect()
    const c = card.getBoundingClientRect()
    return {
      nx: (c.left + c.width / 2 - (d.left + d.width / 2)) / (d.width / 2),
      ny: (c.top + c.height / 2 - (d.top + d.height / 2)) / (d.height / 2),
    }
  }

  // Radial peek: each card tilts toward its own corner of the grid (lifting that
  // corner), fading to a near-flat lift for cards close to the center.
  const tiltVars = (card) => {
    const { nx, ny } = norms(card)
    return {
      y: -10,
      rotationX: ny * MAX_TILT,
      rotationY: -nx * MAX_TILT,
      scale: 1.03,
      transformPerspective: 900,
    }
  }

  // Flip spins the same horizontal direction the card's peek leans.
  const flipDir = (card) => (norms(card).nx <= 0 ? 1 : -1)

  const flip = contextSafe((e) => {
    const card = e.currentTarget
    const flipped = card.classList.toggle('is-flipped')
    gsap.to(card.querySelector('.flip-card__inner'), {
      rotationY: flipped ? 180 * flipDir(card) : 0,
      duration: 0.6,
      ease: 'power2.inOut',
    })
    // flipped cards sit flat; an unflipped card stays lifted since the pointer is still on it
    gsap.to(card, {
      ...(flipped ? grounded : tiltVars(card)),
      duration: 0.5,
      ease: 'power2.out',
    })
  })

  const onEnter = contextSafe((e) => {
    if (e.currentTarget.classList.contains('is-flipped')) return
    gsap.to(e.currentTarget, { ...tiltVars(e.currentTarget), duration: 0.35, ease: 'power2.out' })
  })

  const onLeave = contextSafe((e) => {
    if (e.currentTarget.classList.contains('is-flipped')) return
    gsap.to(e.currentTarget, { ...grounded, duration: 0.4, ease: 'power2.out' })
  })

  const flipAll = contextSafe(() => {
    const cards = [...scope.current.querySelectorAll('.flip-card')]
    const turnUp = cards.some((c) => !c.classList.contains('is-flipped'))
    cards.forEach((c) => c.classList.toggle('is-flipped', turnUp))
    gsap.to(scope.current.querySelectorAll('.flip-card__inner'), {
      rotationY: (i, t) => (turnUp ? 180 * flipDir(t.parentElement) : 0),
      duration: 0.6,
      ease: 'power2.inOut',
      stagger: 0.08,
    })
    gsap.to(cards, { ...grounded, duration: 0.5, ease: 'power2.out' })
  })

  return (
    <section className="panel" ref={scope}>
      <header className="panel__head">
        <h2>Card flip</h2>
        <p>
          Hover tilts each card toward its corner of the grid (radial from the center), and a
          click flips the <code>preserve-3d</code> cover over on the Y axis in the same direction
          it leans.
        </p>
      </header>

      <div className="flip-controls">
        <button type="button" onClick={flipAll}>
          Flip all
        </button>
        <span className="flip-hint">click any card to turn it over</span>
      </div>

      <div className="flip-deck">
        {CARDS.map((c) => (
          <div
            key={c.id}
            className="flip-card"
            style={{ '--hue': c.hue }}
            onClick={flip}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <div className="flip-card__inner">
              <div className="flip-card__face flip-card__cover">
                <span className="flip-card__mark" aria-hidden="true">
                  &#10026;
                </span>
              </div>
              <div className="flip-card__face flip-card__back">
                <span className="flip-card__dot" aria-hidden="true" />
                <span className="flip-card__label">{c.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
