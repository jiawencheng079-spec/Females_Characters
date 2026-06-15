import { useState } from 'react'
import MainMenu from './components/MainMenu/MainMenu'
import Prologue from './components/Prologue/Prologue'
import TitleCard from './components/TitleCard/TitleCard'
import Chapter1 from './components/Chapter1/Chapter1'
import { loadGame, deleteSave, hasSave, saveGame, ProgressStage } from './utils/gameSave'

type GamePhase = 'menu' | 'prologue' | 'titleCard' | 'chapter1'

function App() {
  const [phase, setPhase] = useState<GamePhase>('menu')
  const [resumeProgress, setResumeProgress] = useState(ProgressStage.NOT_STARTED)

  /** 新游戏：清除旧存档，从序章开始 */
  const handleStartGame = () => {
    deleteSave()
    setResumeProgress(ProgressStage.NOT_STARTED)
    setPhase('prologue')
  }

  /** 继续游戏：读取存档并跳转 */
  const handleContinueGame = () => {
    const save = loadGame()
    if (!save) return
    setResumeProgress(save.progress)
    // 根据存档阶段跳转（跳过前置阶段）
    if (save.phase === 'chapter1') {
      // 直接进入 chapter1，跳过序章和标题卡
      setPhase('chapter1')
    } else {
      setPhase(save.phase as GamePhase)
    }
  }

  /** 从游戏中离开 → 存档并返回主菜单 */
  const handleLeaveGame = (progress: ProgressStage) => {
    saveGame({ phase: 'chapter1', progress, savedAt: Date.now() })
    setPhase('menu')
  }

  return (
    <>
      {phase === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onContinueGame={handleContinueGame}
          onSettings={() => {}}
          onAbout={() => {}}
          hasSavedGame={hasSave()}
        />
      )}

      {phase === 'prologue' && (
        <Prologue onContinue={() => setPhase('titleCard')} />
      )}

      {phase === 'titleCard' && (
        <TitleCard
          title="江永村：白昼"
          onContinue={() => setPhase('chapter1')}
        />
      )}

      {phase === 'chapter1' && (
        <Chapter1
          resumeProgress={resumeProgress}
          onLeave={handleLeaveGame}
          onComplete={() => deleteSave()}
        />
      )}
    </>
  )
}

export default App
