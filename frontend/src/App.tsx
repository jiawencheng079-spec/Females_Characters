import MainMenu from './components/MainMenu/MainMenu'

function App() {
  const handleStartGame = () => {
    console.log('开始游戏')
  }

  const handleContinueGame = () => {
    console.log('继续游戏')
  }

  const handleSettings = () => {
    console.log('设置')
  }

  const handleAbout = () => {
    console.log('关于女书')
  }

  return (
    <MainMenu
      onStartGame={handleStartGame}
      onContinueGame={handleContinueGame}
      onSettings={handleSettings}
      onAbout={handleAbout}
    />
  )
}

export default App
