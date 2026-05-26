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

  const flip = contextSafe((e) => {
    const card = e.currentTarget
    const flipped = card.classList.toggle('is-flipped')
    gsap.to(card.querySelector('.flip-card__inner'), {
      rotationY: flipped ? 180 : 0,
      duration: 0.6,
      ease: 'power2.inOut',
    })
  })

  const flipAll = contextSafe(() => {
    const cards = [...scope.current.querySelectorAll('.flip-card')]
    const turnUp = cards.some((c) => !c.classList.contains('is-flipped'))
    cards.forEach((c) => c.classList.toggle('is-flipped', turnUp))
    gsap.to(scope.current.querySelectorAll('.flip-card__inner'), {
      rotationY: turnUp ? 180 : 0,
      duration: 0.6,
      ease: 'power2.inOut',
      stagger: 0.08,
    })
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
          <div key={c.id} className="flip-card" style={{ '--hue': c.hue }} onClick={flip}>
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
