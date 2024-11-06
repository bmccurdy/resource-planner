import { PATTERN_MAP } from "@/constants/shift-calendar"
import type { ShiftWeek, ShiftPattern } from "@/types/shift-calendar"

export function generatePatternShifts(pattern: ShiftPattern, weeks: number, currentShifts: ShiftWeek[]): ShiftWeek[] {
  const selectedPattern = PATTERN_MAP[pattern]
  if (!selectedPattern) return currentShifts

  return Array.from({ length: weeks }, (_, i) => ({
    name: `Week ${i + 1}`,
    shifts: Array.from({ length: 7 }, (_, j) => 
      selectedPattern[(i * 7 + j) % selectedPattern.length]
    )
  }))
}

export function toggleShiftDay(
  shifts: ShiftWeek[],
  weekIndex: number,
  dayIndex: number,
  pattern: ShiftPattern
): ShiftWeek[] {
  if (pattern !== "custom") return shifts

  return shifts.map((week, wIndex) =>
    wIndex === weekIndex
      ? {
          ...week,
          shifts: week.shifts.map((shift, sIndex) =>
            sIndex === dayIndex ? (shift ? 0 : 1) : shift
          )
        }
      : week
  )
} 