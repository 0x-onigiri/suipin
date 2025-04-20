'use client'

import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'

interface ConfettiProps {
  active: boolean
}

export function Confetti({ active }: ConfettiProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (active) {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      setIsVisible(true)

      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [active])

  if (!isVisible) return null

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.2}
    />
  )
}
