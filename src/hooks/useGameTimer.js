import { useEffect, useRef, useState } from 'react'

/**
 * Countdown timer shared by every quiz game. Ticks down from `timeLimit`
 * while `isActive` and calls `onExpire` once when it hits zero.
 *
 * `onExpire` is read through a ref rather than a direct effect dependency:
 * callers typically recreate it whenever score-related state changes, which
 * would otherwise tear down and restart the pending setTimeout on every
 * answer, causing the countdown to drift instead of ticking once per second.
 */
export const useGameTimer = (timeLimit, { isActive, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit)

  const onExpireRef = useRef(onExpire)
  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    if (!isActive) return

    if (timeLeft <= 0) {
      onExpireRef.current()
      return
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, isActive])

  return timeLeft
}
