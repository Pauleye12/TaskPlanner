"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Calendar,
  momentLocalizer,
  Views,
  View,
  EventProps,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  useTaskContext,
  Task,
  // Priority,
  // WorkHours,
  DayOfWeek,
} from "./TaskContext";
// import TaskForm from "./TaskForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { format, addMinutes } from "date-fns";
import { useRouter } from "next/navigation";
import OverdueTasksWarning from "./OverdueTasksWarning";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const TaskCalendar: React.FC = () => {
  const {
    tasks,
    deleteTask,
    workHours,
    setIsWorkHoursSet,
    markTaskAsCompleted,
  } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const router = useRouter();
  const [view, setView] = useState<View>(Views.DAY);

  const eventStyleGetter = (event: Task) => {
    let backgroundColor = "";
    let borderColor = "";
    switch (event.priority) {
      case "low":
        backgroundColor = "rgba(72, 187, 120, 0.7)";
        borderColor = "#2F855A";
        break;
      case "medium":
        backgroundColor = "rgba(246, 173, 85, 0.7)";
        borderColor = "#C05621";
        break;
      case "high":
        backgroundColor = "rgba(245, 101, 101, 0.7)";
        borderColor = "#C53030";
        break;
    }
    return {
      style: {
        backgroundColor: event.completed
          ? "rgba(156, 163, 175, 0.7)"
          : backgroundColor,
        borderColor: event.completed ? "#6B7280" : borderColor,
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "8px",
        color: event.completed ? "#4B5563" : "#1A202C",
        fontWeight: "bold",
        padding: "4px",
        transition: "all 0.3s ease",
        opacity: event.completed ? 0.6 : 1,
      },
    };
  };

  const handleSelectEvent = (event: Task) => {
    setSelectedTask(event);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setSelectedTask(null);
    }
  };

  const isWithinWorkHours = (start: Date, end: Date) => {
    const dayOfWeek = start
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase() as DayOfWeek;
    const dayWorkHours = workHours[dayOfWeek];

    if (!dayWorkHours.isWorkDay) return false;

    const startTime = format(start, "HH:mm");
    const endTime = format(end, "HH:mm");

    return (
      startTime >= dayWorkHours.startTime && endTime <= dayWorkHours.endTime
    );
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.isWorkHours ? isWithinWorkHours(task.start, task.end) : true
    );
  }, [tasks, workHours]);

  const handleResetWorkHours = () => {
    setIsWorkHoursSet(false);
  };

  // const handleAddTask = () => {
  //   router.push("/add-task");
  // };

  const handleTaskCompletion = (task: Task, checked: boolean) => {
    markTaskAsCompleted(task.id, checked);
  };

  const handleViewChange = useCallback(
    (newView: View) => {
      setView(newView);
    },
    [setView]
  );

  const handleNavigate = useCallback(() => {
    // console.log("Calendar navigated to:", format(date, "PPP"));
    // TODO: Implement date navigation logic if needed
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-teal-400 to-blue-500">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Your Tasks</h2>
          <div className="space-x-2">
            <Link
              href={"/add-task"}
              className="bg-teal-600 rounded-lg px-3 py-2 hover:bg-teal-700 text-white"
            >
              Add Task
            </Link>
            <Button
              onClick={handleResetWorkHours}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Reset Work Hours
            </Button>
            {/* <Button
              onClick={() => handleViewChange(Views.DAY)}
              className="text-white"
            >
              Day
            </Button>
            <Button
              onClick={() => handleViewChange(Views.WEEK)}
              className="text-white"
            >
              Week
            </Button>
            <Button
              onClick={() => handleViewChange(Views.MONTH)}
              className="text-white"
            >
              Month
            </Button> */}
          </div>
        </div>
        <OverdueTasksWarning />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Calendar
            localizer={localizer}
            events={filteredTasks}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            view={view}
            onView={handleViewChange}
            onNavigate={handleNavigate}
            defaultView={Views.DAY}
            className="rounded-lg overflow-hidden custom-calendar"
            components={{
              event: (props: EventProps<Task>) => (
                <div>
                  <Checkbox
                    checked={props.event.completed}
                    onCheckedChange={(checked: boolean) =>
                      handleTaskCompletion(props.event, checked as boolean)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>{props.title}</span>
                </div>
              ),
            }}
          />
        </motion.div>
      </div>
      <AnimatePresence>
        {selectedTask && (
          <Dialog
            open={!!selectedTask}
            onOpenChange={() => setSelectedTask(null)}
          >
            <DialogContent className="bg-gray-900 text-white">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white">
                    {selectedTask.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-2">
                  <p>
                    <span className="font-semibold">Start:</span>{" "}
                    {format(selectedTask.start, "PPpp")}
                  </p>
                  <p>
                    <span className="font-semibold">End:</span>{" "}
                    {format(
                      addMinutes(selectedTask.start, selectedTask.duration),
                      "PPpp"
                    )}
                  </p>
                  <p>
                    <span className="font-semibold">Duration:</span>{" "}
                    {selectedTask.duration} minutes
                  </p>
                  <p>
                    <span className="font-semibold">Priority:</span>{" "}
                    <Badge
                      variant={
                        selectedTask.priority as
                          | "default"
                          | "secondary"
                          | "destructive"
                      }
                    >
                      {selectedTask.priority}
                    </Badge>
                  </p>
                  <p>
                    <span className="font-semibold">Description:</span>{" "}
                    {selectedTask.description}
                  </p>
                  <p>
                    <span className="font-semibold">Repeat:</span>{" "}
                    {selectedTask.repeat}
                  </p>
                  <p>
                    <span className="font-semibold">Splittable:</span>{" "}
                    {selectedTask.isSplittable ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Work Hours:</span>{" "}
                    {selectedTask.isWorkHours ? "During" : "Outside"}
                  </p>
                  <p>
                    <span className="font-semibold">Completed:</span>{" "}
                    {selectedTask.completed ? "Yes" : "No"}
                  </p>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="destructive" onClick={handleDeleteTask}>
                    Delete
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push(`/edit-task/${selectedTask.id}`)}
                  >
                    Edit
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskCalendar;
