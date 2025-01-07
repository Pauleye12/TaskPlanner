import { TaskProvider } from '@/components/TaskContext'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Smart Task Planner',
  description: 'Plan your tasks efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TaskProvider>
          {children}
        </TaskProvider>
      </body>
    </html>
  )
}

