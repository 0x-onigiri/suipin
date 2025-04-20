import { type Participant } from '@/types'

export type ParticipantWithStyle = Participant & {
  style: {
    backgroundColor: string
    textColor: 'black' | 'white'
  }
}

/**
 * 色の明るさを計算し、テキスト色を決定する関数
 * @param hexColor 16進数のカラーコード
 * @returns テキスト色（'black'または'white'）
 */
function getTextColorForBackground(hexColor: string): 'black' | 'white' {
  // カラーコードからRGB値を抽出
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)

  // 明るさを計算（YIQ式）- これは人間の目の感度に基づいている
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // 明るさに基づいてテキスト色を返す
  return brightness > 128 ? 'black' : 'white'
}

/**
 * 美的に調和のとれた背景色のセット
 */
const backgroundColors = [
  '#ff8f43', // オレンジ
  '#70bbe0', // 水色
  '#f9d423', // 黄色
  '#82ca9c', // 緑
  '#ff6b6b', // 赤
  '#9f90cf', // 紫
  '#ffb347', // 橙
  '#5e9cea', // 青
  '#e05c97', // ピンク
  '#6ec071', // エメラルド
  '#d863bb', // マゼンタ
  '#8bc480', // 薄緑
  '#f97c7c', // サーモンピンク
  '#729ecd', // スカイブルー
  '#caa568', // ベージュ
  '#a177ef', // バイオレット
  '#67c1c1', // ターコイズ
  '#f5989d', // コーラル
]

/**
 * 配列をシャッフルする関数
 * @param array シャッフルする配列
 * @returns シャッフルされたコピー配列
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 名前配列からスタイル情報を持つオブジェクト配列を生成する
 * @param names 名前の配列
 * @returns スタイル情報を持つオブジェクト配列
 */
function generateNameStyleObjects(participants: Participant[]): ParticipantWithStyle[] {
  // 名前の数が色の数より多い場合は色を繰り返し使用できるようにする
  let colors = [...backgroundColors]
  while (colors.length < participants.length) {
    colors = colors.concat(backgroundColors)
  }

  // 色をシャッフル
  const shuffledColors = shuffleArray(colors).slice(0, participants.length)

  // 名前とスタイル情報を持つオブジェクト配列を生成
  return participants.map((p, index) => {
    const backgroundColor = shuffledColors[index]
    return {
      ...p,
      style: {
        backgroundColor,
        textColor: getTextColorForBackground(backgroundColor),
      },
    }
  })
}

export { generateNameStyleObjects }
