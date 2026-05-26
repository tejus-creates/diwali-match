import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const CARDS = [
  { id: 1, title: 'Diya', hue: 32 },
  { id: 2, title: 'Sweets', hue: 320 },
  { id: 3, title: 'Rangoli', hue: 168 },
  { id: 4, title: 'Lantern', hue: 268 },
]

export default function CardFlip() {
  const scope = useRef(null)
  const { contextSafe } = useGSAP({ scope })

  const grounded = { y: 0, rotationY: 0, scale: 1, transformPerspective: 900 }
  const MAX_PEEK = 45

  // Each card peeks open from its own outer edge: left cards turn left, right
  // cards turn right, easing toward 0 in the middle.
  const peekAngle = (card) => {
    const cards = [...card.parentElement.children]
    const mid = (cards.length - 1) / 2
    if (mid === 0) return 0
    const norm = (cards.indexOf(card) - mid) / mid // -1 (left) .. +1 (right)
    return -norm * MAX_PEEK
  }

  // Flip spins the same rotational direction the card's peek leans.
  const flipDir = (card) => (peekAngle(card) >= 0 ? 1 : -1)

  const liftVars = (card) => ({
    y: -10,
    rotationY: peekAngle(card),
    scale: 1.03,
    transformPerspective: 900,
  })

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
      ...(flipped ? grounded : liftVars(card)),
      duration: 0.5,
      ease: 'power2.out',
    })
  })

  const onEnter = contextSafe((e) => {
    if (e.currentTarget.classList.contains('is-flipped')) return
    gsap.to(e.currentTarget, { ...liftVars(e.currentTarget), duration: 0.35, ease: 'power2.out' })
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
          A cover turning over on the Y axis: GSAP tweens <code>rotationY</code> on a{' '}
          <code>preserve-3d</code> inner whose two faces hide their backfaces. Click a card to
          flip it.
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
