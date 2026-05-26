import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import HoverLift from './components/HoverLift.jsx'
import CardFlip from './components/CardFlip.jsx'

export default function App() {
  const scope = useRef(null)

  useGSAP(
    () => {
      gsap.from('.reveal', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.12,
      })
    },
    { scope },
  )

  return (
    <div className="app" ref={scope}>
      <header className="app__head reveal">
        <span className="app__badge">GSAP sandbox</span>
        <h1>diwali-match · animation lab</h1>
        <p>A scratch space for testing hover-lift tweens and 3D card flips.</p>
      </header>

      <main className="app__main">
        <div className="reveal">
          <HoverLift />
        </div>
        <div className="reveal">
          <CardFlip />
        </div>
      </main>
    </div>
  )
}
