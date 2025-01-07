"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isBefore,
  isAfter,
  addMinutes,
  // set,
  // isWithinInterval,
  differenceInHours,
  format,
} from "date-fns";

export type Priority = "low" | "medium" | "high";
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
export type RepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface WorkHours {
  [key: string]: {
    isWorkDay: boolean;
    startTime: string;
    endTime: string;
  };
}

// Add type guard to ensure only DayOfWeek keys are used
export type WorkHoursType = Record<
  DayOfWeek,
  {
    isWorkDay: boolean;
    startTime: string;
    endTime: string;
  }
>;

export interface Task {
  id: string;
  title: string;
  start: Date;
  end: Date;
  duration: number; // in minutes
  priority: Priority;
  description: string;
  repeat: RepeatType;
  repeatUntil: Date | null;
  isSplittable: boolean;
  isWorkHours: boolean;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  workHours: WorkHours;
  isWorkHoursSet: boolean;
  addTask: (
    task: Omit<Task, "id" | "end" | "completed">
  ) => { title: string; description: string } | null;
  updateTask: (
    id: string,
    updates: Partial<Task>
  ) => { title: string; description: string } | null;
  deleteTask: (id: string) => void;
  updateWorkHours: (newWorkHours: WorkHours) => void;
  setIsWorkHoursSet: (value: boolean) => void;
  markTaskAsCompleted: (id: string, completed: boolean) => void;
  getOverdueTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const defaultWorkHours: WorkHours = {
  monday: { isWorkDay: true, startTime: "09:00", endTime: "17:00" },
  tuesday: { isWorkDay: true, startTime: "09:00", endTime: "17:00" },
  wednesday: { isWorkDay: true, startTime: "09:00", endTime: "17:00" },
  thursday: { isWorkDay: true, startTime: "09:00", endTime: "17:00" },
  friday: { isWorkDay: true, startTime: "09:00", endTime: "17:00" },
  saturday: { isWorkDay: false, startTime: "09:00", endTime: "17:00" },
  sunday: { isWorkDay: false, startTime: "09:00", endTime: "17:00" },
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workHours, setWorkHours] = useState<WorkHours>(defaultWorkHours);
  const [isWorkHoursSet, setIsWorkHoursSet] = useState(false);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedWorkHours = localStorage.getItem("workHours");
    const storedIsWorkHoursSet = localStorage.getItem("isWorkHoursSet");
    if (storedTasks) {
      setTasks(
        JSON.parse(storedTasks, (key, value) => {
          if (key === "start" || key === "end" || key === "repeatUntil") {
            return value ? new Date(value) : null;
          }
          return value;
        })
      );
    }
    if (storedWorkHours) {
      setWorkHours(JSON.parse(storedWorkHours));
    }
    if (storedIsWorkHoursSet) {
      setIsWorkHoursSet(JSON.parse(storedIsWorkHoursSet));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("workHours", JSON.stringify(workHours));
    localStorage.setItem("isWorkHoursSet", JSON.stringify(isWorkHoursSet));
  }, [tasks, workHours, isWorkHoursSet]);

  const findNextAvailableSlot = (
    initialDate: Date,
    taskDuration: number,
    mustBeWorkHours: boolean
  ): Date => {
    let currentDate = new Date(initialDate);
    let attempts = 0;
    const maxAttempts = 7; // Limit search to 7 days to prevent infinite loop

    while (attempts < maxAttempts) {
      const dayOfWeek = currentDate
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase() as DayOfWeek;
      const dayWorkHours = workHours[dayOfWeek];

      if (mustBeWorkHours && !dayWorkHours.isWorkDay) {
        // Move to the next day if it's not a work day
        currentDate = addDays(currentDate, 1);
        currentDate.setHours(0, 0, 0, 0);
        attempts++;
        continue;
      }

      const startOfDay = new Date(currentDate);
      const endOfDay = new Date(currentDate);

      if (mustBeWorkHours) {
        startOfDay.setHours(
          parseInt(dayWorkHours.startTime.split(":")[0], 10),
          parseInt(dayWorkHours.startTime.split(":")[1], 10),
          0,
          0
        );
        endOfDay.setHours(
          parseInt(dayWorkHours.endTime.split(":")[0], 10),
          parseInt(dayWorkHours.endTime.split(":")[1], 10),
          0,
          0
        );
      } else {
        startOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 999);
      }

      let currentSlot = isAfter(currentDate, startOfDay)
        ? currentDate
        : startOfDay;

      while (isBefore(currentSlot, endOfDay)) {
        const slotEnd = addMinutes(currentSlot, taskDuration);

        if (isAfter(slotEnd, endOfDay)) {
          break; // Move to the next day if the task doesn't fit in the remaining time
        }

        // Check if the slot overlaps with any existing tasks
        const isOverlapping = tasks.some(
          (existingTask) =>
            isBefore(currentSlot, existingTask.end) &&
            isAfter(slotEnd, existingTask.start)
        );

        if (!isOverlapping) {
          return currentSlot;
        }

        currentSlot = addMinutes(currentSlot, 15); // Move to next 15-minute slot
      }

      // Move to the next day
      currentDate = addDays(currentDate, 1);
      currentDate.setHours(0, 0, 0, 0);
      attempts++;
    }

    // If no slot found within maxAttempts days, return the initial date
    return initialDate;
  };

  const generateRecurringTasks = (task: Task): Task[] => {
    const recurringTasks: Task[] = [];
    let currentDate = new Date(task.start);

    while (task.repeatUntil && isBefore(currentDate, task.repeatUntil)) {
      const newTask: Task = {
        ...task,
        id: `${task.id}-${currentDate.getTime()}`,
        start: findNextAvailableSlot(
          currentDate,
          task.duration,
          task.isWorkHours
        ),
        completed: false,
      };
      newTask.end = new Date(newTask.start.getTime() + task.duration * 60000);
      recurringTasks.push(newTask);

      switch (task.repeat) {
        case "daily":
          currentDate = addDays(currentDate, 1);
          break;
        case "weekly":
          currentDate = addWeeks(currentDate, 1);
          break;
        case "monthly":
          currentDate = addMonths(currentDate, 1);
          break;
        case "yearly":
          currentDate = addYears(currentDate, 1);
          break;
        default:
          break;
      }
    }

    return recurringTasks;
  };

  const notifySchedulingIssue = (
    task: Omit<Task, "id" | "end" | "completed">,
    scheduledTime: Date
  ) => {
    const timeDifference = differenceInHours(scheduledTime, task.start);
    if (timeDifference > 24) {
      // We'll implement the actual toast notification in a separate component
      console.log(
        `Scheduling Notice: The task "${
          task.title
        }" couldn't be scheduled at the requested time. It has been scheduled for ${format(
          scheduledTime,
          "PPpp"
        )}.`
      );
      return {
        title: "Scheduling Notice",
        description: `The task "${
          task.title
        }" couldn't be scheduled at the requested time. It has been scheduled for ${format(
          scheduledTime,
          "PPpp"
        )}.`,
      };
    }
    return null;
  };

  const addTask = (task: Omit<Task, "id" | "end" | "completed">) => {
    const startTime = findNextAvailableSlot(
      task.start,
      task.duration,
      task.isWorkHours
    );

    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      start: startTime,
      end: addMinutes(startTime, task.duration),
      repeatUntil: task.repeat !== "none" ? task.repeatUntil : null,
      completed: false,
    };

    const notification = notifySchedulingIssue(task, startTime);

    if (newTask.repeat !== "none" && newTask.repeatUntil) {
      const recurringTasks = generateRecurringTasks(newTask);
      setTasks((prevTasks) => [...prevTasks, ...recurringTasks]);
    } else {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }

    return notification;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    let notification = null;
    setTasks((prevTasks) => {
      const taskToUpdate = prevTasks.find((task) => task.id === id);
      if (!taskToUpdate) return prevTasks;

      const isRecurring =
        taskToUpdate.repeat !== "none" && taskToUpdate.repeatUntil;
      const updatedTask = { ...taskToUpdate, ...updates };

      if (updates.start || updates.duration || updates.isWorkHours) {
        const newStartTime = findNextAvailableSlot(
          updates.start || taskToUpdate.start,
          updates.duration || taskToUpdate.duration,
          updates.isWorkHours !== undefined
            ? updates.isWorkHours
            : taskToUpdate.isWorkHours
        );
        updatedTask.start = newStartTime;
        updatedTask.end = addMinutes(newStartTime, updatedTask.duration);
        notification = notifySchedulingIssue(updatedTask, newStartTime);
      }

      if (isRecurring) {
        // Remove all instances of the recurring task
        const filteredTasks = prevTasks.filter(
          (task) => !task.id.startsWith(id.split("-")[0])
        );
        // Generate new recurring tasks
        const newRecurringTasks = generateRecurringTasks(updatedTask);
        return [...filteredTasks, ...newRecurringTasks];
      } else {
        return prevTasks.map((task) => (task.id === id ? updatedTask : task));
      }
    });
    return notification;
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => {
      const taskToDelete = prevTasks.find((task) => task.id === id);
      if (!taskToDelete) return prevTasks;

      if (taskToDelete.repeat !== "none" && taskToDelete.repeatUntil) {
        // If it's a recurring task, delete all instances
        return prevTasks.filter(
          (task) => !task.id.startsWith(id.split("-")[0])
        );
      } else {
        // If it's a single task, just delete that one
        return prevTasks.filter((task) => task.id !== id);
      }
    });
  };

  const updateWorkHours = (newWorkHours: WorkHours) => {
    setWorkHours(newWorkHours);
  };

  const markTaskAsCompleted = (id: string, completed: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed } : task))
    );
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter((task) => !task.completed && isAfter(now, task.end));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        workHours,
        isWorkHoursSet,
        addTask,
        updateTask,
        deleteTask,
        updateWorkHours,
        setIsWorkHoursSet,
        markTaskAsCompleted,
        getOverdueTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
