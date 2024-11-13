"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDays, format, startOfWeek } from "date-fns"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { WeekView } from "./week-view"
import { INITIAL_SHIFTS } from "@/constants/shift-calendar"
import { generatePatternShifts, toggleShiftDay } from "@/utils/shift-utils"
import type { ShiftPattern } from "@/types/shift-calendar"

export default function ShiftCalendar() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))
  const [shifts, setShifts] = useState(INITIAL_SHIFTS)
  const [weekRange, setWeekRange] = useState("6")
  const [pattern, setPattern] = useState<ShiftPattern>("custom")
  const { toast } = useToast()

  useEffect(() => {
    if (pattern !== "custom") {
      setShifts(currentShifts => generatePatternShifts(pattern, parseInt(weekRange), currentShifts))
    }
  }, [pattern, weekRange])

  const handleWeekChange = (direction: 'next' | 'prev') => {
    const multiplier = direction === 'next' ? 1 : -1
    setCurrentWeek(addDays(currentWeek, 7 * parseInt(weekRange) * multiplier))
  }

  const handleToggleShift = (weekIndex: number, dayIndex: number) => {
    setShifts(currentShifts => toggleShiftDay(currentShifts, weekIndex, dayIndex, pattern))
  }

  const handleSaveChanges = () => {
    console.log("Saving shifts:", shifts, "Pattern:", pattern)
    toast({
      title: "Changes saved",
      description: "Your shift schedule has been updated successfully.",
    })
  }

  const handleShiftPattern = (weekIndex: number, offset: number) => {
    setShifts(currentShifts => {
      return currentShifts.map((week, idx) => {
        if (idx === weekIndex) {
          const newShifts = [...week.shifts]
          if (offset > 0) {
            // Shift right
            const last = newShifts.pop()!
            newShifts.unshift(last)
          } else {
            // Shift left
            const first = newShifts.shift()!
            newShifts.push(first)
          }
          return { ...week, shifts: newShifts }
        }
        return week
      })
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-blue-500 to-blue-600 border-none hover:from-blue-600 hover:to-blue-700 transition-all duration-300 px-6 py-3 rounded-md font-medium text-white hover:text-white"
        >
          Open Shift Calendar
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-full overflow-y-auto max-h-screen bg-white"
      >
        <div className="mt-8 space-y-2">
          <div className="flex justify-between items-center bg-white">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleWeekChange('prev')}
              className="hover:bg-blue-50 border-blue-200"
            >
              <ChevronLeft className="h-4 w-4 text-blue-600" />
            </Button>
            <h2 className="text-md font-semibold text-gray-900 px-6 py-3">
              {format(currentWeek, "MMM d")} - {format(addDays(currentWeek, 7 * parseInt(weekRange) - 1), "MMM d, yyyy")}
            </h2>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleWeekChange('next')}
              className="hover:bg-blue-50 border-blue-200"
            >
              <ChevronRight className="h-4 w-4 text-blue-600" />
            </Button>
          </div>

          <div className="space-y-2 bg-white p-3 rounded-md border">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Number of Weeks</Label>
              <Select value={weekRange} onValueChange={setWeekRange}>
                <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select number of weeks" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Week' : 'Weeks'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Shift Pattern</Label>
              <RadioGroup 
                value={pattern} 
                onValueChange={(value) => setPattern(value as ShiftPattern)} 
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { value: "custom", label: "Custom" },
                  { value: "1-1", label: "1 - 1" },
                  { value: "2-2", label: "2 - 2" },
                  { value: "4-3", label: "4 - 3" },
                ].map(({ value, label }) => (
                  <div 
                    key={value} 
                    className="relative flex items-center space-x-2 bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer group"
                  >
                    <RadioGroupItem value={value} id={value} className="text-blue-600" />
                    <Label htmlFor={value} className="text-sm text-gray-700 group-hover:text-blue-700 cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-2">
            {shifts.slice(0, parseInt(weekRange)).map((week, weekIndex) => (
              <WeekView
                key={`${week.name}-${weekIndex}`}
                week={week}
                weekIndex={weekIndex}
                currentWeek={currentWeek}
                onToggleShift={handleToggleShift}
                onShiftPattern={pattern === "custom" ? handleShiftPattern : undefined}
              />
            ))}
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-6 rounded-md transition-all duration-300"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
} 