import { useState, useRef, useEffect } from 'react'
import TitleCard from '../TitleCard/TitleCard'
import './ChapterNight.css'

const MOVE_SPEED = 500
const SCENE_SCALE = 2.5
const SCENE_IMG = '/assets/FirstLevel/mainscene.png'

interface ChapterNightProps {
  onReturnToMenu: () => void
  isDictionaryOpen: boolean
}

function ChapterNight({ onReturnToMenu, isDictionaryOpen }: ChapterNightProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const playerWorldRef = useRef({ x: 0, y: 0 })
  const cameraRef = useRef({ x: 0, y: 0 })
  const [playerScreenDelta, setPlayerScreenDelta] = useState({ dx: 0, dy: 0 })
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 })
  const [imgReady, setImgReady] = useState(false)
  const [titleDone, setTitleDone] = useState(false)
  const keysRef = useRef<Set<string>>(new Set())
  const animRef = useRef<number>(0)
  const vpRef = useRef({ w: window.innerWidth, h: window.innerHeight })

  // 预加载图片
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImgNatural({ w: img.naturalWidth, h: img.naturalHeight })
      setImgReady(true)
    }
    img.src = SCENE_IMG
    return () => { img.onload = null }
  }, [])

  const sceneW = imgNatural.w * SCENE_SCALE
  const sceneH = imgNatural.h * SCENE_SCALE
  const maxX = Math.max(0, sceneW - vpRef.current.w)
  const maxY = Math.max(0, sceneH - vpRef.current.h)

  // 键盘监听
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (isDictionaryOpen || !titleDone) return
      const k = e.key.toLowerCase()
      if (['w', 'a', 's', 'd'].includes(k)) {
        e.preventDefault()
        keysRef.current.add(k)
      }
    }
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['w', 'a', 's', 'd'].includes(k)) {
        keysRef.current.delete(k)
        if (k === 'a') keysRef.current.delete('a')
        if (k === 'd') keysRef.current.delete('d')
        if (k === 'w') keysRef.current.delete('w')
        if (k === 's') keysRef.current.delete('s')
      }
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [isDictionaryOpen, titleDone])

  useEffect(() => {
    if (isDictionaryOpen) keysRef.current.clear()
  }, [isDictionaryOpen])

  // 窗口 resize
  useEffect(() => {
    const onResize = () => {
      vpRef.current = { w: window.innerWidth, h: window.innerHeight }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // 动画帧 — WASD 平移
  useEffect(() => {
    if (!imgReady || isDictionaryOpen || !titleDone) return

    let lastTime = performance.now()
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v))

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000
      lastTime = now

      let dx = 0, dy = 0
      const keys = keysRef.current
      if (keys.has('a')) dx -= 1
      if (keys.has('d')) dx += 1
      if (keys.has('w')) dy -= 1
      if (keys.has('s')) dy += 1

      if (dx !== 0 && dy !== 0) {
        dx /= Math.SQRT2
        dy /= Math.SQRT2
      }

      const speed = MOVE_SPEED * dt
      const halfW = vpRef.current.w / 2
      const halfH = vpRef.current.h / 2

      playerWorldRef.current.x += dx * speed
      playerWorldRef.current.y += dy * speed

      const camX = clamp(playerWorldRef.current.x, halfW, sceneW - halfW)
      const camY = clamp(playerWorldRef.current.y, halfH, sceneH - halfH)
      cameraRef.current = { x: camX, y: camY }

      setOffset({ x: camX - halfW, y: camY - halfH })

      let screenDx = playerWorldRef.current.x - camX
      let screenDy = playerWorldRef.current.y - camY

      const maxDx = halfW - 20
      const maxDy = halfH - 20
      screenDx = clamp(screenDx, -maxDx, maxDx)
      screenDy = clamp(screenDy, -maxDy, maxDy)

      if (playerWorldRef.current.x - camX !== screenDx) {
        playerWorldRef.current.x = camX + screenDx
      }
      if (playerWorldRef.current.y - camY !== screenDy) {
        playerWorldRef.current.y = camY + screenDy
      }

      setPlayerScreenDelta({ dx: screenDx, dy: screenDy })
      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [imgReady, maxX, maxY, isDictionaryOpen, titleDone, sceneW, sceneH])

  // 初始位置：画面右下角
  useEffect(() => {
    if (!imgReady) return
    const hw = vpRef.current.w / 2
    const hh = vpRef.current.h / 2
    cameraRef.current = { x: maxX + hw, y: maxY + hh }
    playerWorldRef.current = { x: cameraRef.current.x, y: cameraRef.current.y }
    setOffset({ x: maxX, y: maxY })
    setPlayerScreenDelta({ dx: 0, dy: 0 })
  }, [imgReady, maxX, maxY])

  const handleTitleContinue = () => setTitleDone(true)

  return (
    <div className="chapter-night">
      {/* 报幕卡片 */}
      {!titleDone && (
        <TitleCard
          title="江永村：深宵"
          subtitle="夜色笼罩的江永村，似乎隐藏着结局的线索"
          onContinue={handleTitleContinue}
        />
      )}

      {/* 加载中 */}
      {!imgReady && (
        <div className="chapter-night-loading">
          <p>场景加载中…</p>
        </div>
      )}

      {/* 场景 */}
      {imgReady && titleDone && (
        <div
          className="chapter-night-scene"
          style={{
            width: sceneW,
            height: sceneH,
            transform: `translate(${-offset.x}px, ${-offset.y}px)`,
          }}
        >
          <img
            src={SCENE_IMG}
            alt="江永村夜景"
            className="chapter-night-bg"
            draggable={false}
          />
        </div>
      )}

      {/* 黑夜滤镜遮罩 */}
      {imgReady && titleDone && (
        <div className="chapter-night-overlay" />
      )}

      {/* 操作提示 */}
      {titleDone && (
        <div className="chapter-night-hint">
          WASD 移动 | 探索夜晚的江永村
        </div>
      )}

      {/* 返回主菜单按钮 */}
      {titleDone && (
        <button
          className="chapter-night-return-btn"
          type="button"
          onClick={onReturnToMenu}
        >
          返回主菜单
        </button>
      )}

      {/* 玩家标记点 */}
      {titleDone && (
        <div
          className="chapter-night-player-marker"
          aria-hidden="true"
          style={{
            transform: `translate(calc(-50% + ${playerScreenDelta.dx}px), calc(-50% + ${playerScreenDelta.dy}px))`,
          }}
        />
      )}
    </div>
  )
}

export default ChapterNight
