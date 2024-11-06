import { format, addDays } from "date-fns"
import { DAYS_OF_WEEK } from "@/constants/shift-calendar"
import type { ShiftWeek } from "@/types/shift-calendar"

interface WeekViewProps {
  week: ShiftWeek
  weekIndex: number
  currentWeek: Date
  onToggleShift: (weekIndex: number, dayIndex: number) => void
}

export function WeekView({ week, weekIndex, currentWeek, onToggleShift }: WeekViewProps) {
  return (
    <div className="space-y-2">
      <div className="font-medium text-center text-xs text-gray-600 bg-muted/50 p-2 rounded">
        {format(addDays(currentWeek, weekIndex * 7), "MMM d")} - {format(addDays(currentWeek, (weekIndex + 1) * 7 - 1), "MMM d")}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={`${day}-${weekIndex}-${index}`} className="space-y-1">
            <div className="font-normal text-xs text-center">{day}</div>
            <button
              onClick={() => onToggleShift(weekIndex, index)}
              className={`p-2 w-full ${
                week.shifts[index] ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              } rounded hover:opacity-80 transition-opacity text-sm`}
            >
              {week.shifts[index] ? "On" : "Off"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 