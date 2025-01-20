"use client";

import React from "react";
import { useTaskContext, DayOfWeek } from "./TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const WorkHoursSetup: React.FC = () => {
  const { workHours, updateWorkHours, setIsWorkHoursSet } = useTaskContext();

  const handleWorkDayToggle = (day: DayOfWeek) => {
    updateWorkHours({
      ...workHours,
      [day]: { ...workHours[day], isWorkDay: !workHours[day].isWorkDay },
    });
  };

  const handleTimeChange = (
    day: DayOfWeek,
    field: "startTime" | "endTime",
    value: string
  ) => {
    updateWorkHours({
      ...workHours,
      [day]: { ...workHours[day], [field]: value },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsWorkHoursSet(true);
  };

  return (
    <Card className="w-full bg-gray-900 mt-10 border-none text-white   max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl   font-bold text-center">
          Set Your Work Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-7">
        <form onSubmit={handleSubmit} className="space-y-10  ">
          {(Object.keys(workHours) as DayOfWeek[]).map((day) => (
            <div key={day} className="space-y-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={`${day}-toggle`}
                  className="text-lg font-medium capitalize"
                >
                  {day}
                </Label>
                <Switch
                  id={`${day}-toggle`}
                  className=""
                  checked={workHours[day].isWorkDay}
                  onCheckedChange={() => handleWorkDayToggle(day)}
                />
              </div>
              {workHours[day].isWorkDay && (
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label
                      className="text-indigo-500  "
                      htmlFor={`${day}-start`}
                    >
                      Start Time
                    </Label>
                    <Input
                      id={`${day}-start`}
                      type="time"
                      className="focus-visible:border-indigo-600 bg-gray-800 border-gray-800 "
                      value={workHours[day].startTime}
                      onChange={(e) =>
                        handleTimeChange(day, "startTime", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label
                      className="text-indigo-500 font-medium"
                      htmlFor={`${day}-end`}
                    >
                      End Time
                    </Label>
                    <Input
                      id={`${day}-end`}
                      type="time"
                      className="focus-visible:border-indigo-600 bg-gray-800 border-gray-800 "
                      value={workHours[day].endTime}
                      onChange={(e) =>
                        handleTimeChange(day, "endTime", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Save Work Hours
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkHoursSetup;
