'use client'

import React, { useState } from 'react'
import { useTaskContext } from './TaskContext'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const OverdueTasksWarning: React.FC = () => {
  const { getOverdueTasks } = useTaskContext()
  const [isOpen, setIsOpen] = useState(false)

  const overdueTasks = getOverdueTasks()

  if (overdueTasks.length === 0) {
    return null
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          {overdueTasks.length} Overdue {overdueTasks.length === 1 ? 'Task' : 'Tasks'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Overdue Tasks</h4>
            <p className="text-sm text-muted-foreground">
              The following tasks are overdue:
            </p>
          </div>
          <ul className="space-y-2">
            {overdueTasks.map((task) => (
              <li key={task.id} className="text-sm">
                {task.title} - Due: {task.end.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default OverdueTasksWarning

