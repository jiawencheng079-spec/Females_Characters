import { useCallback, useEffect, useState } from 'react'
import './Prologue.css'

interface PrologueProps {
  onContinue: () => void
}

const PROLOGUE_LINES = [
  '湖南江永的群山深处，曾流传着一种只在女性之间使用的文字。',
  '她们把它写在三朝书上，写在扇面与帕子上，也在女红与歌声之间，一代一代传下去。',
  '那些修长如柳叶的字，记录着祝福、离别、牵挂，也藏着不便说出口的心事。',
  '这种文字，叫女书。',
  '现在，一段尘封的女书故事等待你来开启。',
] as const

function Prologue({ onContinue }: PrologueProps) {
  const [lineIndex, setLineIndex] = useState(0)
  const isLastLine = lineIndex === PROLOGUE_LINES.length - 1

  const advance = useCallback(() => {
    if (isLastLine) {
      onContinue()
      return
    }

    setLineIndex((current) => current + 1)
  }, [isLastLine, onContinue])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'e') return
      event.preventDefault()
      advance()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [advance])

  return (
    <div className="prologue">
      <div className="prologue-bg" />
      <div className="prologue-shade" />

      <section
        className="prologue-narration-overlay"
        aria-label="序言"
        onClick={advance}
      >
        <div className="prologue-narration-box">
          <p className="prologue-narration-line" key={lineIndex}>
            {PROLOGUE_LINES[lineIndex]}
          </p>
          <span className="prologue-narration-click-hint">E / 点击继续</span>
        </div>
      </section>
    </div>
  )
}

export default Prologue
