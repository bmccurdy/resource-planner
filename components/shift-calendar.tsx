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

// Initial shifts data
const initialShifts = [
  { name: "Week 1", shifts: [1, 0, 1, 0, 1, 0, 1] },
  { name: "Week 2", shifts: [0, 1, 0, 1, 0, 1, 0] },
  { name: "Week 3", shifts: [1, 0, 1, 0, 1, 0, 1] },
  { name: "Week 4", shifts: [0, 1, 0, 1, 0, 1, 0] },
  { name: "Week 5", shifts: [1, 0, 1, 0, 1, 0, 1] },
  { name: "Week 6", shifts: [0, 1, 0, 1, 0, 1, 0] },
]

export default function ShiftCalendar() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))
  const [shifts, setShifts] = useState(initialShifts)
  const [weekRange, setWeekRange] = useState("6")
  const [pattern, setPattern] = useState("custom")
  const { toast } = useToast()

  const generatePatternShifts = (pattern: string, weeks: number) => {
    const patternMap = {
      "1-1": [1, 0],
      "2-2": [1, 1, 0, 0],
      "4-3": [1, 1, 1, 1, 0, 0, 0],
      "custom": null
    }
    const selectedPattern = patternMap[pattern as keyof typeof patternMap]
    if (!selectedPattern) return shifts
  
    const newShifts = []
    for (let i = 0; i < weeks; i++) {
      const weekShifts = []
      for (let j = 0; j < 7; j++) {
        weekShifts.push(selectedPattern[(i * 7 + j) % selectedPattern.length])
      }
      newShifts.push({ name: `Week ${i + 1}`, shifts: weekShifts })
    }
    return newShifts
  }

  useEffect(() => {
    if (pattern !== "custom") {
      setShifts(generatePatternShifts(pattern, parseInt(weekRange)))
    }
  }, [pattern, weekRange])

  const nextWeek = () => setCurrentWeek(addDays(currentWeek, 7 * parseInt(weekRange)))
  const prevWeek = () => setCurrentWeek(addDays(currentWeek, -7 * parseInt(weekRange)))

  const toggleShift = (weekIndex: number, dayIndex: number) => {
    if (pattern !== "custom") {
      // Don't allow manual changes when a pattern is selected
      return
    }
    setShifts(currentShifts => 
      currentShifts.map((week, wIndex) => 
        wIndex === weekIndex
          ? { ...week, shifts: week.shifts.map((shift, shiftIndex) => 
              shiftIndex === dayIndex ? (shift ? 0 : 1) : shift
            ) }
          : week
      )
    )
  }
  
  const saveChanges = () => {
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
            <Button variant="outline" size="icon" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-base font-medium">
              {format(currentWeek, "MMMM d")} - {format(addDays(currentWeek, 7 * parseInt(weekRange) - 1), "MMMM d, yyyy")}
            </h2>
            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mb-4">
            <Select
              value={weekRange}
              onValueChange={(value) => setWeekRange(value)}
            >
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
            <RadioGroup value={pattern} onValueChange={setPattern} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-1" id="1-1" />
                <Label htmlFor="1-1">1 - 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2-2" id="2-2" />
                <Label htmlFor="2-2">2 - 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4-3" id="4-3" />
                <Label htmlFor="4-3">4 - 3</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-4">
            {shifts.slice(0, parseInt(weekRange)).map((week, weekIndex) => (
              <div key={`${week.name}-${weekIndex}`} className="space-y-2">
                <div className="font-medium text-center text-xs text-gray-600 bg-muted/50 p-2 rounded">
                  {format(addDays(currentWeek, weekIndex * 7), "MMM d")} - {format(addDays(currentWeek, (weekIndex + 1) * 7 - 1), "MMM d")}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={`${day}-${weekIndex}-${index}`} className="space-y-1">
                      <div className="font-normal text-xs text-center">{day}</div>
                      <button
                        onClick={() => toggleShift(weekIndex, index)}
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
            ))}
          </div>
          <Button className="mt-4 w-full" onClick={saveChanges}>Save Changes</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}