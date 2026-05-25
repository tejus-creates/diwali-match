import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const CARDS = [
  { id: 'marigold', title: 'Marigold', hue: 32 },
  { id: 'rangoli', title: 'Rangoli', hue: 320 },
  { id: 'lantern', title: 'Lantern', hue: 8 },
  { id: 'sparkler', title: 'Sparkler', hue: 48 },
]

export default function HoverLift() {
  const scope = useRef(null)
  const { contextSafe } = useGSAP({ scope })

  const onEnter = contextSafe((e) => {
    const card = e.currentTarget
    gsap.to(card, { y: -14, scale: 1.045, duration: 0.35, ease: 'power3.out' })
    gsap.to(card.querySelector('.card__glow'), {
      opacity: 1,
      duration: 0.35,
      ease: 'power3.out',
    })
  })

  const onLeave = contextSafe((e) => {
    const card = e.currentTarget
    gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power3.out' })
    gsap.to(card.querySelector('.card__glow'), {
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out',
    })
  })

  return (
    <section className="panel" ref={scope}>
      <header className="panel__head">
        <h2>Hover lift</h2>
        <p>
          Tweens <code>y</code> &amp; <code>scale</code> on pointer enter/leave through{' '}
          <code>contextSafe</code> so listeners stay scoped and revertible.
        </p>
      </header>

      <div className="card-grid">
        {CARDS.map((c) => (
          <article
            key={c.id}
            className="card"
            style={{ '--hue': c.hue }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <span className="card__glow" aria-hidden="true" />
            <span className="card__dot" aria-hidden="true" />
            <h3>{c.title}</h3>
            <p>hover me</p>
          </article>
        ))}
      </div>
    </section>
  )
}
