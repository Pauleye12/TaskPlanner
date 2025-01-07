'use client'

import React, { useState } from 'react'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TaskForm from './TaskForm'

const Calendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <TaskForm selectedDate={date} />
      </CardContent>
    </Card>
  )
}

export default Calendar

