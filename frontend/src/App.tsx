import { useState } from 'react'
import MainMenu from './components/MainMenu/MainMenu'
import Prologue from './components/Prologue/Prologue'
import TitleCard from './components/TitleCard/TitleCard'
import Chapter1 from './components/Chapter1/Chapter1'

type GamePhase = 'menu' | 'prologue' | 'titleCard' | 'chapter1'

function App() {
  const [phase, setPhase] = useState<GamePhase>('menu')

  return (
    <>
      {phase === 'menu' && (
        <MainMenu
          onStartGame={() => setPhase('prologue')}
          onContinueGame={() => console.log('继续游戏')}
          onSettings={() => {}}
          onAbout={() => {}}
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

      {phase === 'chapter1' && <Chapter1 />}
    </>
  )
}

export default App
