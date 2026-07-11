import type { WorkoutClass } from '../types'

// Built-in class options. Always available even before the user has
// checked in to them; custom classes the user adds get merged in alongside these.
export const PRESET_CLASSES: WorkoutClass[] = [
  { id: 'preset-liftonics', name: 'Liftonics', preset: true, color: '#ff5a3c', createdAt: '' },
  { id: 'preset-st-marks-yoga', name: 'St Marks Yoga', preset: true, color: '#1f8a70', createdAt: '' },
  { id: 'preset-solidcore', name: 'Solidcore', preset: true, color: '#3c6cff', createdAt: '' },
  { id: 'preset-soulcycle', name: 'SoulCycle', preset: true, color: '#c23cff', createdAt: '' },
]

export const CLASS_COLOR_PALETTE = [
  '#ff5a3c',
  '#1f8a70',
  '#3c6cff',
  '#c23cff',
  '#e0a800',
  '#e0431f',
  '#0891b2',
  '#be185d',
]
