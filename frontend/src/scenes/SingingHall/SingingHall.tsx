import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { createSingingHallGameConfig } from './config'
import './SingingHall.css'

function SingingHall() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const game = new Phaser.Game(createSingingHallGameConfig(container))

    return () => {
      game.destroy(true)
    }
  }, [])

  return (
    <section className="singing-hall" aria-label="坐唱堂 / 歌扇空间">
      <div className="singing-hall__game" ref={containerRef} />
    </section>
  )
}

export default SingingHall
