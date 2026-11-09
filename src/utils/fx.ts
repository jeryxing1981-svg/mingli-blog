import confetti from 'canvas-confetti'

export function burstGold(): void {
  void confetti({
    particleCount: 48,
    spread: 62,
    startVelocity: 28,
    scalar: 0.75,
    ticks: 120,
    origin: { y: 0.72 },
    colors: ['#f59e0b', '#fde68a', '#7c1d1d', '#fff7ed'],
    disableForReducedMotion: true,
  })
}
