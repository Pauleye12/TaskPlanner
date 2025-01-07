'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import TaskForm from '@/components/TaskForm'
import { Button } from '@/components/ui/button'
import { useTaskContext } from '@/components/TaskContext'

export default function EditTaskPage() {
  const router = useRouter()
  const params = useParams()
  const { tasks } = useTaskContext()

  const taskId = params.id as string
  const task = tasks.find(t => t.id === taskId)

  const handleClose = () => {
    router.push('/')
  }

  if (!task) {
    return <div>Task not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Task</h1>
          <Button onClick={handleClose} variant="outline">Back to Calendar</Button>
        </div>
        <TaskForm task={task} onClose={handleClose} />
      </div>
    </div>
  )
}

