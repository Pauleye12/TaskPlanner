'use client'

import { useEffect } from 'react'
import TaskCalendar from '@/components/TaskCalendar'
import WorkHoursSetup from '@/components/WorkHoursSetup'
import { useTaskContext } from '@/components/TaskContext'
import { motion } from 'framer-motion'

const MainContent = () => {
  const { isWorkHoursSet } = useTaskContext()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {isWorkHoursSet ? <TaskCalendar /> : <WorkHoursSetup />}
    </motion.div>
  )
}

export default function Home() {
  useEffect(() => {
    document.body.classList.add('bg-gradient')
  }, [])

  return (
    <main className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-8 text-5xl font-bold text-white text-center shadow-text">
          Smart Task Planner
        </h1>
      </motion.div>
      <MainContent />
    </main>
  )
}

