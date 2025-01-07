'use client'

import React from 'react'
import { useTaskContext } from './TaskContext'
import TaskItem from './TaskItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TaskList: React.FC = () => {
  const { tasks } = useTaskContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default TaskList

