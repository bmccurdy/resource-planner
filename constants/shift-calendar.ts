import { PatternMap } from "@/types/shift-calendar"

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export const PATTERN_MAP: PatternMap = {
  "1-1": [1, 0],
  "2-2": [1, 1, 0, 0],
  "4-3": [1, 1, 1, 1, 0, 0, 0],
  "custom": null
} as const

export const INITIAL_SHIFTS = [
  { name: "Week 1", shifts: [1, 0, 1, 0, 1, 0, 1] },
  { name: "Week 2", shifts: [0, 1, 0, 1, 0, 1, 0] },
  { name: "Week 3", shifts: [1, 0, 1, 0, 1, 0, 1] },
  { name: "Week 4", shifts: [0, 1, 0, 1, 0, 1, 0] },
  { name: "Week 5", shifts: [1, 0, 1, 0, 1, 0, 1] },
  { name: "Week 6", shifts: [0, 1, 0, 1, 0, 1, 0] },
] 