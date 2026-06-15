import EmbroideryRoom from './scenes/EmbroideryRoom/EmbroideryRoom'
import { DictionaryOverlay, useDictionary } from './systems/dictionary'
import './App.css'

function App() {
  const dictionary = useDictionary()

  return (
    <>
      <EmbroideryRoom openDictionary={dictionary.openDictionary} />
      <DictionaryOverlay
        isOpen={dictionary.isDictionaryOpen}
        activeEntryId={dictionary.activeEntryId}
        activePuzzle={dictionary.activePuzzle}
        feedback={dictionary.feedback}
        isResolvingPuzzle={dictionary.isResolvingPuzzle}
        unlockedEntryIds={dictionary.unlockedEntryIds}
        onClose={dictionary.closeDictionary}
        onSelectEntry={dictionary.selectEntry}
        onUnlockEntry={dictionary.unlockEntry}
      />
    </>
  )
}

export default App
