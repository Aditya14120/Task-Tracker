import { SuitId, SuitTheme } from '../types/todo';

export const SUITS: Record<SuitId, SuitTheme> = {
  classic: {
    id: 'classic',
    name: 'Classic Red & Blue',
    alias: 'Peter Parker',
    tagline: 'With great power comes great responsibility.',
    primaryColor: '#E11D48', // Crimson Red
    secondaryColor: '#2563EB', // Royal Blue
    accentColor: '#F59E0B',
    bgCanvas: '#09090b',
    surfaceCard: '#18181b',
    surfaceBorder: '#27272a',
    headerBg: '#0f172a',
    lensColor: '#ffffff',
    lensOutline: '#09090b',
    webColor: '#ffffff',
    confettiColors: ['#E11D48', '#2563EB', '#ffffff', '#F59E0B'],
  },
  symbiote: {
    id: 'symbiote',
    name: 'Symbiote Black Suit',
    alias: 'Alien Costume',
    tagline: 'Infinite webs. Unmatched speed. Pure dark adrenaline.',
    primaryColor: '#38BDF8', // Cyan / Liquid Silver Highlight
    secondaryColor: '#94A3B8', // Slate Silver
    accentColor: '#F8FAFC',
    bgCanvas: '#030712', // Deep Jet Black
    surfaceCard: '#0f172a',
    surfaceBorder: '#1e293b',
    headerBg: '#020617',
    lensColor: '#f8fafc',
    lensOutline: '#020617',
    webColor: '#38bdf8',
    confettiColors: ['#ffffff', '#0f172a', '#38BDF8', '#94A3B8'],
  },
};
