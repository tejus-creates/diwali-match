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
    if (card.classList.contains('is-lifted')) return
    gsap.to(card, { y: -6, scale: 1.02, duration: 0.3, ease: 'power3.out' })
    gsap.to(card.querySelector('.card__glow'), {
      opacity: 0.55,
      duration: 0.3,
      ease: 'power3.out',
    })
  })

  const onLeave = contextSafe((e) => {
    const card = e.currentTarget
    if (card.classList.contains('is-lifted')) return
    gsap.to(card, { y: 0, scale: 1, duration: 0.35, ease: 'power3.out' })
    gsap.to(card.querySelector('.card__glow'), {
      opacity: 0,
      duration: 0.35,
      ease: 'power3.out',
    })
  })

  const onClick = contextSafe((e) => {
    const card = e.currentTarget
    const lifted = card.classList.toggle('is-lifted')
    gsap.to(card, {
      y: lifted ? -24 : -6,
      scale: lifted ? 1.07 : 1.02,
      duration: lifted ? 0.45 : 0.3,
      ease: lifted ? 'back.out(1.8)' : 'power3.out',
    })
    gsap.to(card.querySelector('.card__glow'), {
      opacity: lifted ? 1 : 0.55,
      duration: 0.35,
      ease: 'power3.out',
    })
  })

  return (
    <section className="panel" ref={scope}>
      <header className="panel__head">
        <h2>Hover lift</h2>
        <p>
          A subtle <code>y</code>/<code>scale</code> tween on hover; click to pop the card into a
          deeper lift (with a <code>back.out</code> ease) that stays pinned until you click again.
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
            onClick={onClick}
          >
            <span className="card__glow" aria-hidden="true" />
            <span className="card__dot" aria-hidden="true" />
            <h3>{c.title}</h3>
            <p>hover · click to pin</p>
          </article>
        ))}
      </div>
    </section>
  )
}
