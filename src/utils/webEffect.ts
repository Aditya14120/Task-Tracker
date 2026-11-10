import confetti from 'canvas-confetti';
import { SuitTheme } from '../types/todo';

const COMIC_WORDS = ['THWIP!', 'BAM!', 'POW!', 'ZIP!', 'CRACK!', 'BOOM!'];

export function getRandomComicWord(): string {
  return COMIC_WORDS[Math.floor(Math.random() * COMIC_WORDS.length)];
}

export function fireWebBurst(x: number, y: number, suit: SuitTheme): void {
  // Normalize screen coordinates (0 to 1)
  const normX = Math.max(0.05, Math.min(0.95, x / window.innerWidth));
  const normY = Math.max(0.05, Math.min(0.95, y / window.innerHeight));

  // 1. Core high-speed web filament spray
  confetti({
    particleCount: 28,
    spread: 60,
    origin: { x: normX, y: normY },
    colors: suit.confettiColors,
    startVelocity: 25,
    scalar: 0.8,
    ticks: 80,
    shapes: ['circle', 'square'],
  });

  // 2. Trailing web streamers
  setTimeout(() => {
    confetti({
      particleCount: 16,
      angle: 60,
      spread: 45,
      origin: { x: normX, y: normY },
      colors: [suit.primaryColor, suit.webColor],
      startVelocity: 18,
      scalar: 0.6,
      ticks: 70,
    });
  }, 50);
}
