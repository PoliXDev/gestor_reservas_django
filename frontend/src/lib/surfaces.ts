import type { Surface } from '../api/types'

export const SURFACE_LABELS = {
  CLAY: 'Tierra batida',
  GRASS: 'Hierba',
  HARD: 'Dura',
} as const

export type SurfaceKey = keyof typeof SURFACE_LABELS

export function surfaceLabel(surface: Surface | null): string {
  if (!surface) return 'Sin superficie'
  return SURFACE_LABELS[surface as SurfaceKey] ?? surface
}
