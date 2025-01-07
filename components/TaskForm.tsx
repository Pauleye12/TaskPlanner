"use client";

import React, { useState, useEffect } from "react";
import { useTaskContext, Task, Priority, RepeatType } from "./TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";
import ToastNotification from "./ToastNotification";

interface TaskFormProps {
  task?: Task;
  onClose?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task ? new Date(task.start) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    task ? format(task.start, "HH:mm") : format(new Date(), "HH:mm")
  );
  const [duration, setDuration] = useState(task?.duration.toString() || "60");
  const [priority, setPriority] = useState<Priority>(
    task?.priority || "medium"
  );
  const [description, setDescription] = useState(task?.description || "");
  const [repeat, setRepeat] = useState<RepeatType>(task?.repeat || "none");
  const [repeatUntil, setRepeatUntil] = useState<Date | undefined>(
    task?.repeatUntil || undefined
  );
  const [isSplittable, setIsSplittable] = useState(task?.isSplittable || false);
  const [isWorkHours, setIsWorkHours] = useState<boolean>(
    task?.isWorkHours ?? true
  );
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [notification, setNotification] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const { addTask, updateTask } = useTaskContext();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setSelectedDate(new Date(task.start));
      setSelectedTime(format(task.start, "HH:mm"));
      setDuration(task.duration.toString());
      setPriority(task.priority);
      setDescription(task.description);
      setRepeat(task.repeat);
      setRepeatUntil(task.repeatUntil || undefined);
      setIsSplittable(task.isSplittable);
      setIsWorkHours(task.isWorkHours);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date for the task.",
        variant: "destructive",
      });
      return;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startTime = set(selectedDate, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    });

    const taskData = {
      title,
      start: startTime,
      duration: parseInt(duration, 10),
      priority,
      description,
      repeat,
      repeatUntil: repeat !== "none" && repeatUntil ? repeatUntil : null,
      isSplittable,
      isWorkHours,
    };

    let newNotification;
    if (task) {
      newNotification = updateTask(task.id, taskData);
    } else {
      newNotification = addTask(taskData);
    }

    if (newNotification) {
      setNotification(newNotification);
    } else {
      toast({
        title: task ? "Task Updated" : "Task Added",
        description: `${title} has been ${
          task ? "updated" : "added"
        } successfully.`,
      });
    }

    if (onClose) onClose();
  };

  // const findNextAvailableSlot = (
  //   date: Date,
  //   taskDuration: number,
  //   mustBeWorkHours: boolean
  // ): Date => {
  //   const dayOfWeek = date
  //     .toLocaleDateString("en-US", { weekday: "long" })
  //     .toLowerCase() as DayOfWeek;
  //   const dayWorkHours = workHours[dayOfWeek];

  //   if (mustBeWorkHours && !dayWorkHours.isWorkDay) {
  //     // Move to the next work day
  //     const nextDay = new Date(date);
  //     nextDay.setDate(nextDay.getDate() + 1);
  //     return findNextAvailableSlot(nextDay, taskDuration, mustBeWorkHours);
  //   }

  //   let startOfDay = new Date(date);
  //   let endOfDay = new Date(date);

  //   if (mustBeWorkHours) {
  //     startOfDay.setHours(
  //       parseInt(dayWorkHours.startTime.split(":")[0], 10),
  //       parseInt(dayWorkHours.startTime.split(":")[1], 10),
  //       0,
  //       0
  //     );
  //     endOfDay.setHours(
  //       parseInt(dayWorkHours.endTime.split(":")[0], 10),
  //       parseInt(dayWorkHours.endTime.split(":")[1], 10),
  //       0,
  //       0
  //     );
  //   } else {
  //     startOfDay.setHours(0, 0, 0, 0);
  //     endOfDay.setHours(23, 59, 59, 999);
  //   }

  //   let currentSlot = startOfDay;
  //   while (isBefore(currentSlot, endOfDay)) {
  //     const slotEnd = addMinutes(currentSlot, taskDuration);

  //     // Check if the slot overlaps with any existing tasks
  //     const isOverlapping = tasks.some(
  //       (existingTask) =>
  //         isBefore(currentSlot, existingTask.end) &&
  //         isAfter(slotEnd, existingTask.start)
  //     );

  //     if (!isOverlapping && isBefore(slotEnd, endOfDay)) {
  //       return currentSlot;
  //     }

  //     currentSlot = addMinutes(currentSlot, 15); // Move to next 15-minute slot
  //   }

  //   // If no slot found today, try the next day
  //   const nextDay = new Date(date);
  //   nextDay.setDate(nextDay.getDate() + 1);
  //   return findNextAvailableSlot(nextDay, taskDuration, mustBeWorkHours);
  // };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-900 text-white p-6 rounded-lg"
    >
      <div>
        <Label htmlFor="title" className="text-white">
          Task Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-gray-800 text-white border-gray-700"
        />
      </div>
      <div>
        <Label htmlFor="date" className="text-white">
          Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                "bg-gray-800 text-white border-gray-700"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-800">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="bg-gray-800 text-white"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="time" className="text-white">
          Time
        </Label>
        <TimePicker
          value={selectedTime}
          onChange={(value) => setSelectedTime(value)}
          className="bg-gray-800 text-white border-gray-700"
        />
      </div>
      <div>
        <Label htmlFor="duration" className="text-white">
          Duration (minutes)
        </Label>
        <Input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          min="1"
          className="bg-gray-800 text-white border-gray-700"
        />
      </div>
      <div>
        <Label htmlFor="priority" className="text-white">
          Priority
        </Label>
        <Select
          value={priority}
          onValueChange={(value: Priority) => setPriority(value)}
        >
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description" className="text-white">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="bg-gray-800 text-white border-gray-700"
        />
      </div>
      <div>
        <Button
          type="button"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="w-full justify-between bg-gray-800 text-white hover:bg-gray-700"
        >
          Advanced Options
          {showAdvancedOptions ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </div>
      {showAdvancedOptions && (
        <div className="space-y-4 mt-4 p-4 bg-gray-800 rounded-lg">
          <div>
            <Label htmlFor="repeat" className="text-white">
              Repeat
            </Label>
            <Select
              value={repeat}
              onValueChange={(value: RepeatType) => setRepeat(value)}
            >
              <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select repeat option" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {repeat !== "none" && (
            <div>
              <Label htmlFor="repeatUntil" className="text-white">
                Repeat Until
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !repeatUntil && "text-muted-foreground",
                      "bg-gray-700 text-white border-gray-600"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {repeatUntil ? (
                      format(repeatUntil, "PPP")
                    ) : (
                      <span>Pick an end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-700">
                  <Calendar
                    mode="single"
                    selected={repeatUntil}
                    onSelect={setRepeatUntil}
                    initialFocus
                    className="bg-gray-700 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="splittable" className="text-white">
              Splittable Task
            </Label>
            <Switch
              id="splittable"
              checked={isSplittable}
              onCheckedChange={setIsSplittable}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="workHours" className="text-white">
              During Work Hours
            </Label>
            <Switch
              id="workHours"
              checked={isWorkHours}
              onCheckedChange={setIsWorkHours}
            />
          </div>
        </div>
      )}
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {task ? "Update Task" : "Add Task"}
      </Button>
      {notification && (
        <ToastNotification
          title={notification.title}
          description={notification.description}
          onClose={() => setNotification(null)}
        />
      )}
    </form>
  );
};

export default TaskForm;
