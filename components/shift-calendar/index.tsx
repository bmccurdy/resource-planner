"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDays, format, startOfWeek } from "date-fns"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
      setShifts(generatePatternShifts(pattern, parseInt(weekRange), shifts))
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Shift Calendar</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle className="text-base font-bold">Shift Calendar</SheetTitle>
          <SheetDescription className="text-sm">View and manage shifts for multiple weeks</SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" size="icon" onClick={() => handleWeekChange('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-base font-medium">
              {format(currentWeek, "MMMM d")} - {format(addDays(currentWeek, 7 * parseInt(weekRange) - 1), "MMMM d, yyyy")}
            </h2>
            <Button variant="outline" size="icon" onClick={() => handleWeekChange('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-4">
            <Select value={weekRange} onValueChange={setWeekRange}>
              <SelectTrigger className="w-full">
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

          <div className="mb-4">
            <Label className="mb-2 block text-sm font-medium">Shift Pattern</Label>
            <RadioGroup value={pattern} onValueChange={(value) => setPattern(value as ShiftPattern)} className="flex space-x-4">
              {[
                { value: "custom", label: "Custom" },
                { value: "1-1", label: "1 - 1" },
                { value: "2-2", label: "2 - 2" },
                { value: "4-3", label: "4 - 3" },
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={value} />
                  <Label htmlFor={value}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            {shifts.slice(0, parseInt(weekRange)).map((week, weekIndex) => (
              <WeekView
                key={`${week.name}-${weekIndex}`}
                week={week}
                weekIndex={weekIndex}
                currentWeek={currentWeek}
                onToggleShift={handleToggleShift}
              />
            ))}
          </div>

          <Button className="mt-4 w-full" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
} 