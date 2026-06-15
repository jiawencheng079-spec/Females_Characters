import type { DictionaryPuzzle } from '../../systems/dictionary'
import { clueContent } from './embroideryRoomSceneData'

export const clueOrder = ['红妆', '女红', '灯', '今', '名', '言'] as const

export type ClueName = (typeof clueOrder)[number]
export type ObjectClueName = Extract<ClueName, '红妆' | '女红' | '灯'>
export type DialogueClueName = Extract<ClueName, '今' | '名' | '言'>

type PercentValue = `${number}%`

export type PercentRect = {
  left?: PercentValue
  right?: PercentValue
  top?: PercentValue
  bottom?: PercentValue
  width: PercentValue
  height?: PercentValue
}

type SceneObjectBase = {
  id: string
  title: string
  description: string
  image: string
  imagePosition: PercentRect
  hotspotPosition: PercentRect
  ariaLabel: string
}

export type ClueSceneObjectConfig = SceneObjectBase & {
  kind: 'clue'
  title: ObjectClueName
  nushuImages: readonly string[]
}

export type CultureSceneObjectConfig = SceneObjectBase & {
  kind: 'culture'
}

export type SceneObjectConfig =
  | ClueSceneObjectConfig
  | CultureSceneObjectConfig

export type DialoguePuzzleConfig = Pick<
  DictionaryPuzzle,
  'activeEntryId' | 'contextSentence' | 'correctEntryId'
> & {
  id: string
  label: DialogueClueName
  nushuImage: string
  beforeLines: readonly string[]
  puzzleLine: string
  solvedLine: string
  afterLines: readonly string[]
}

export type NpcConfig = {
  id: string
  name: string
  image: string
  imagePosition: PercentRect
  hotspotPosition: PercentRect
  ariaLabel: string
  completedLine: string
}

export const nushuImages: Record<ClueName, readonly string[]> = {
  红妆: [
    '/assets/nushu/hong.png',
    '/assets/nushu/zhuang.png',
  ],
  女红: [
    '/assets/nushu/nv.png',
    '/assets/nushu/hong.png',
  ],
  灯: ['/assets/nushu/deng.png'],
  今: ['/assets/nushu/jin.png'],
  名: ['/assets/nushu/ming.png'],
  言: ['/assets/nushu/yan.png'],
}

export const sceneObjects: readonly SceneObjectConfig[] = [
  {
    id: 'red-makeup',
    kind: 'clue',
    title: clueContent['red-makeup'].title,
    description: clueContent['red-makeup'].description,
    image: '/assets/scenes/embroidery-room/props/red-makeup.png',
    nushuImages: nushuImages.红妆,
    imagePosition: { left: '13%', top: '57%', width: '17%' },
    hotspotPosition: {
      left: '16%',
      top: '64%',
      width: '11%',
      height: '23%',
    },
    ariaLabel: '查看主线线索红妆',
  },
  {
    id: 'needlework',
    kind: 'clue',
    title: clueContent.needlework.title,
    description: clueContent.needlework.description,
    image: '/assets/scenes/embroidery-room/props/needlework.png',
    nushuImages: nushuImages.女红,
    imagePosition: { left: '37%', top: '56%', width: '17%' },
    hotspotPosition: {
      left: '40.5%',
      top: '63%',
      width: '11%',
      height: '24%',
    },
    ariaLabel: '查看主线线索女红',
  },
  {
    id: 'lamp',
    kind: 'clue',
    title: clueContent.lamp.title,
    description: clueContent.lamp.description,
    image: '/assets/scenes/embroidery-room/props/lamp.png',
    nushuImages: nushuImages.灯,
    imagePosition: { left: '69%', top: '49%', width: '14%' },
    hotspotPosition: {
      left: '72%',
      top: '52%',
      width: '8%',
      height: '31%',
    },
    ariaLabel: '查看主线线索灯',
  },
  {
    id: 'handkerchief',
    kind: 'culture',
    title: clueContent.handkerchief.title,
    description: clueContent.handkerchief.description,
    image: '/assets/scenes/embroidery-room/props/handkerchief.png',
    imagePosition: { left: '61%', top: '62%', width: '13.5%' },
    hotspotPosition: {
      left: '63%',
      top: '68%',
      width: '10%',
      height: '20%',
    },
    ariaLabel: '查看文化物件绣帕',
  },
  {
    id: 'sewing-basket',
    kind: 'culture',
    title: clueContent['sewing-basket'].title,
    description: clueContent['sewing-basket'].description,
    image: '/assets/scenes/embroidery-room/props/sewing-basket.png',
    imagePosition: { left: '76%', top: '58%', width: '14%' },
    hotspotPosition: {
      left: '77%',
      top: '64%',
      width: '13%',
      height: '25%',
    },
    ariaLabel: '查看文化物件女红篮和针线',
  },
  {
    id: 'mirror-box',
    kind: 'culture',
    title: clueContent['mirror-box'].title,
    description: clueContent['mirror-box'].description,
    image: '/assets/scenes/embroidery-room/props/mirror-box.png',
    imagePosition: { left: '87%', top: '61%', width: '13%' },
    hotspotPosition: {
      left: '87.2%',
      top: '65%',
      width: '11.8%',
      height: '24%',
    },
    ariaLabel: '查看文化物件木梳和镜匣',
  },
]

export const dialoguePuzzles: readonly DialoguePuzzleConfig[] = [
  {
    id: 'embroiderer-jin',
    label: '今',
    activeEntryId: 'jin',
    correctEntryId: 'jin',
    nushuImage: '/assets/nushu/jin.png',
    beforeLines: ['这方帕，不能拖到明日了。'],
    puzzleLine: '我{{nushu}}日就要把它绣完。',
    solvedLine: '我今日就要把它绣完。',
    afterLines: [],
    contextSentence: '我 {{nushu}} 日就要把它绣完。',
  },
  {
    id: 'embroiderer-ming',
    label: '名',
    activeEntryId: 'ming',
    correctEntryId: 'ming',
    nushuImage: '/assets/nushu/ming.png',
    beforeLines: ['送人的帕，不能只绣花。'],
    puzzleLine: '帕角要留她的{{nushu}}。',
    solvedLine: '帕角要留她的名。',
    afterLines: ['这样多年以后，也还记得是谁送的。'],
    contextSentence: '帕角要留她的 {{nushu}} 。',
  },
  {
    id: 'embroiderer-yan',
    label: '言',
    activeEntryId: 'yan',
    correctEntryId: 'yan',
    nushuImage: '/assets/nushu/yan.png',
    beforeLines: ['有些话，到了出门那日，反倒说不出口。'],
    puzzleLine: '口中不能{{nushu}}，就让针线替她写。',
    solvedLine: '口中不能言，就让针线替她写。',
    afterLines: ['所以帕上的字，不只是字。'],
    contextSentence: '口中不能 {{nushu}} ，就让针线替她写。',
  },
]

export const npcConfig: NpcConfig = {
  id: 'embroiderer',
  name: '绣娘',
  image: '/assets/embroidery-room/npc/xiuniang.png',
  imagePosition: {
    left: '51.5%',
    bottom: '2%',
    width: '11.8%',
    height: '87%',
  },
  hotspotPosition: {
    left: '51.5%',
    bottom: '2%',
    width: '11.8%',
    height: '87%',
  },
  ariaLabel: '与绣娘交谈',
  completedLine: '这些字，已经都被你认出来了。',
}
