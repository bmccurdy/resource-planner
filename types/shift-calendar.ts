export interface ShiftWeek {
  name: string
  shifts: number[]
}

export type ShiftPattern = "custom" | "1-1" | "2-2" | "4-3"

export interface PatternMap {
  [key: string]: number[] | null
  "1-1": number[]
  "2-2": number[]
  "4-3": number[]
  "custom": null
} 