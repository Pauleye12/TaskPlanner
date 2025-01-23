"use client";

// import { useEffect } from "react";
import TaskCalendar from "@/components/TaskCalendar";
import WorkHoursSetup from "@/components/WorkHoursSetup";
import { useTaskContext } from "@/components/TaskContext";
import { motion } from "framer-motion";
// import Navbar from "@/components/Navbar";

const MainContent = () => {
  const { isWorkHoursSet } = useTaskContext();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {isWorkHoursSet ? <TaskCalendar /> : <WorkHoursSetup />}
    </motion.div>
  );
};

export default function Home() {
  // useEffect(() => {
  //   document.body.classList.add('bg-gradient')
  // }, [])

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      ></motion.div>
      <MainContent />
    </main>
  );
}
