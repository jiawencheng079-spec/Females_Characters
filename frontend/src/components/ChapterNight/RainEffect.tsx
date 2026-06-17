import { useRef, useEffect } from 'react'

interface RainEffectProps {
  active: boolean
}

function RainEffect({ active }: RainEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const opacityRef = useRef(0)       // 渐入动画
  const dropsRef = useRef<{ x: number; y: number; speed: number; length: number; alpha: number }[]>([])

  // 初始化雨滴数据
  useEffect(() => {
    if (!dropsRef.current.length) {
      const w = window.innerWidth
      const h = window.innerHeight
      const count = 100
      for (let i = 0; i < count; i++) {
        dropsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          speed: 400 + Math.random() * 450,      // 下落速度 px/s
          length: 18 + Math.random() * 40,        // 雨滴长度
          alpha: 0.08 + Math.random() * 0.30,     // 单滴透明度
        })
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let lastTime = performance.now()
    const fadeSpeed = 1.8  // 渐入速度（每秒增加的量）

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      // 渐入/渐出
      if (active) {
        opacityRef.current = Math.min(1, opacityRef.current + fadeSpeed * dt)
      } else {
        opacityRef.current = Math.max(0, opacityRef.current - fadeSpeed * dt)
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (opacityRef.current <= 0.001) {
        animRef.current = requestAnimationFrame(animate)
        return
      }

      const globalAlpha = opacityRef.current

      for (const drop of dropsRef.current) {
        drop.y += drop.speed * dt
        if (drop.y > canvas.height + drop.length) {
          drop.y = -drop.length
          drop.x = Math.random() * canvas.width
        }

        ctx.strokeStyle = `rgba(170, 200, 230, ${(drop.alpha * globalAlpha).toFixed(3)})`
        ctx.lineWidth = 1.8
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        // 微微倾斜，模拟风雨
        ctx.lineTo(drop.x - 3, drop.y + drop.length)
        ctx.stroke()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 4,
        pointerEvents: 'none',
      }}
    />
  )
}

export default RainEffect
