import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  entries,
  type DictionaryEntry,
  type DictionaryPuzzle,
} from './dictionaryData'

type DictionaryEntryId = DictionaryEntry['id']

export type DictionaryFeedback =
  | {
      type: 'error' | 'success'
      message: string
    }
  | null

const SUCCESS_CLOSE_DELAY = 1100

export function useDictionary() {
  const successTimerRef = useRef<number | null>(null)
  const initiallyUnlocked = useMemo(
    () =>
      entries
        .filter((entry) => entry.status === 'unlocked')
        .map((entry) => entry.id),
    [],
  )
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false)
  const [activeEntryId, setActiveEntryId] =
    useState<DictionaryEntryId | null>(null)
  const [activePuzzle, setActivePuzzle] =
    useState<DictionaryPuzzle | null>(null)
  const [feedback, setFeedback] = useState<DictionaryFeedback>(null)
  const [isResolvingPuzzle, setIsResolvingPuzzle] = useState(false)
  const [unlockedEntryIds, setUnlockedEntryIds] =
    useState<readonly DictionaryEntryId[]>(initiallyUnlocked)

  const clearSuccessTimer = useCallback(() => {
    if (successTimerRef.current === null) return
    window.clearTimeout(successTimerRef.current)
    successTimerRef.current = null
  }, [])

  useEffect(() => clearSuccessTimer, [clearSuccessTimer])

  const openDictionary = useCallback((puzzle?: DictionaryPuzzle) => {
    clearSuccessTimer()
    setActivePuzzle(puzzle ?? null)
    setActiveEntryId(puzzle?.activeEntryId ?? null)
    setFeedback(null)
    setIsResolvingPuzzle(false)
    setIsDictionaryOpen(true)
  }, [clearSuccessTimer])

  const closeDictionary = useCallback(() => {
    if (isResolvingPuzzle) return
    clearSuccessTimer()
    setIsDictionaryOpen(false)
    setActivePuzzle(null)
    setFeedback(null)
    setIsResolvingPuzzle(false)
  }, [clearSuccessTimer, isResolvingPuzzle])

  const unlockEntry = useCallback((entryId: DictionaryEntryId) => {
    setUnlockedEntryIds((current) =>
      current.includes(entryId) ? current : [...current, entryId],
    )
    setActiveEntryId(entryId)
  }, [])

  const selectEntry = useCallback(
    (entryId: DictionaryEntryId) => {
      if (!activePuzzle) {
        setActiveEntryId(entryId)
        setFeedback(null)
        return
      }

      if (isResolvingPuzzle) return

      if (entryId !== activePuzzle.correctEntryId) {
        setFeedback({
          type: 'error',
          message: '这个意思好像对不上这句话。',
        })
        return
      }

      const matchedEntry = entries.find((entry) => entry.id === entryId)
      if (!matchedEntry) {
        setFeedback({
          type: 'error',
          message: '词条数据缺失，暂时无法完成解锁。',
        })
        return
      }

      unlockEntry(entryId)
      setIsResolvingPuzzle(true)
      setFeedback({
        type: 'success',
        message: `已解锁：${matchedEntry.label} / ${matchedEntry.meaning}`,
      })

      successTimerRef.current = window.setTimeout(() => {
        setIsDictionaryOpen(false)
        setActivePuzzle(null)
        setFeedback(null)
        setIsResolvingPuzzle(false)
        successTimerRef.current = null
        activePuzzle.onSuccess()
      }, SUCCESS_CLOSE_DELAY)
    },
    [activePuzzle, isResolvingPuzzle, unlockEntry],
  )

  return {
    isDictionaryOpen,
    openDictionary,
    closeDictionary,
    unlockEntry,
    activeEntryId,
    setActiveEntryId,
    activePuzzle,
    feedback,
    isResolvingPuzzle,
    selectEntry,
    unlockedEntryIds,
  }
}
