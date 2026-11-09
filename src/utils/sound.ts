let audioContext: AudioContext | null = null
let muted = false

export function setMuted(next: boolean): void {
  muted = next
}

export function isMuted(): boolean {
  return muted
}

function context(): AudioContext {
  if (!audioContext) audioContext = new AudioContext()
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}

export function unlockAudio(): void {
  if (muted) return
  context()
}

function tone(
  ac: AudioContext,
  frequency: number,
  start: number,
  attack: number,
  duration: number,
  peak: number,
  type: OscillatorType = 'sine',
): void {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(peak, start + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

/** 清脆木鱼：短噪声敲击加一段下落的木质共鸣。 */
export function playMuyuSound(): void {
  if (muted) return
  const ac = context()
  const t = ac.currentTime
  const duration = 0.16
  const length = Math.floor(ac.sampleRate * duration)
  const buffer = ac.createBuffer(1, length, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) {
    const env = Math.exp(-i / (ac.sampleRate * 0.012))
    data[i] = (Math.random() * 2 - 1) * env
  }
  const noise = ac.createBufferSource()
  noise.buffer = buffer
  const filter = ac.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(1480, t)
  filter.Q.setValueAtTime(1.4, t)
  const noiseGain = ac.createGain()
  noiseGain.gain.setValueAtTime(0.62, t)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(ac.destination)
  noise.start(t)
  noise.stop(t + duration)

  const body = ac.createOscillator()
  const bodyGain = ac.createGain()
  body.type = 'sine'
  body.frequency.setValueAtTime(340, t)
  body.frequency.exponentialRampToValueAtTime(150, t + 0.12)
  bodyGain.gain.setValueAtTime(0.0001, t)
  bodyGain.gain.exponentialRampToValueAtTime(0.42, t + 0.008)
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
  body.connect(bodyGain)
  bodyGain.connect(ac.destination)
  body.start(t)
  body.stop(t + 0.22)
}

/** 528Hz 颂钵：基频加轻微失谐泛音，长衰减。 */
export function playSingingBowlSound(): void {
  if (muted) return
  const ac = context()
  const t = ac.currentTime
  const partials = [
    { ratio: 1, gain: 0.2 },
    { ratio: 2.01, gain: 0.07 },
    { ratio: 2.98, gain: 0.035 },
    { ratio: 4.16, gain: 0.018 },
  ]
  for (const partial of partials) {
    tone(ac, 528 * partial.ratio, t, 0.06, 3.4, partial.gain)
  }
}
