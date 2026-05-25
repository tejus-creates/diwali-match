import { useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(Flip)

const INITIAL = [
  { id: 1, title: 'Diya', hue: 32 },
  { id: 2, title: 'Sweets', hue: 320 },
  { id: 3, title: 'Lights', hue: 48 },
  { id: 4, title: 'Rangoli', hue: 168 },
  { id: 5, title: 'Crackers', hue: 8 },
  { id: 6, title: 'Gifts', hue: 268 },
]

export default function FlipDemo() {
  const scope = useRef(null)
  const flipState = useRef(null)
  const [layout, setLayout] = useState('grid')
  const [items, setItems] = useState(INITIAL)
  const [active, setActive] = useState(null)

  const capture = () => {
    flipState.current = Flip.getState(scope.current.querySelectorAll('.flip-item'), {
      props: 'borderRadius',
    })
  }

  const toggleLayout = () => {
    capture()
    setLayout((l) => (l === 'grid' ? 'list' : 'grid'))
  }

  const shuffle = () => {
    capture()
    setItems((arr) => {
      const next = [...arr]
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[next[i], next[j]] = [next[j], next[i]]
      }
      return next
    })
  }

  const onItemClick = (id) => {
    capture()
    setActive((cur) => (cur === id ? null : id))
  }

  useGSAP(
    () => {
      if (!flipState.current) return
      Flip.from(flipState.current, {
        duration: 0.6,
        ease: 'power2.inOut',
        absolute: true,
        stagger: 0.04,
      })
    },
    { dependencies: [layout, items, active], scope },
  )

  return (
    <section className="panel" ref={scope}>
      <header className="panel__head">
        <h2>Flip</h2>
        <p>
          Capture <code>Flip.getState()</code> before a React render, then{' '}
          <code>Flip.from()</code> after commit to interpolate layout, order, and size.
        </p>
      </header>

      <div className="flip-controls">
        <button type="button" onClick={toggleLayout}>
          Layout: {layout}
        </button>
        <button type="button" onClick={shuffle}>
          Shuffle
        </button>
        <span className="flip-hint">click any tile to expand</span>
      </div>

      <ul className={`flip-board flip-board--${layout}`}>
        {items.map((item) => (
          <li
            key={item.id}
            className={`flip-item${active === item.id ? ' is-active' : ''}`}
            style={{ '--hue': item.hue }}
            onClick={() => onItemClick(item.id)}
          >
            <span className="flip-item__dot" aria-hidden="true" />
            <span className="flip-item__label">{item.title}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
