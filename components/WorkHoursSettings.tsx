"use client";

import React from "react";
import { useTaskContext, DayOfWeek } from "./TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const WorkHoursSettings: React.FC = () => {
  const { workHours, updateWorkHours } = useTaskContext();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Hours</CardTitle>
      </CardHeader>
      <CardContent>
        {(Object.keys(workHours) as DayOfWeek[]).map((day) => (
          <div key={day} className="mb-4">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${day}-toggle`} className="capitalize">
                {day}
              </Label>
              <Switch
                id={`${day}-toggle`}
                checked={workHours[day].isWorkDay}
                onCheckedChange={() => handleWorkDayToggle(day)}
              />
            </div>
            {workHours[day].isWorkDay && (
              <div className="mt-2 flex space-x-2">
                <div>
                  <Label htmlFor={`${day}-start`}>Start</Label>
                  <Input
                    id={`${day}-start`}
                    type="time"
                    value={workHours[day].startTime}
                    onChange={(e) =>
                      handleTimeChange(day, "startTime", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`${day}-end`}>End</Label>
                  <Input
                    id={`${day}-end`}
                    type="time"
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
      </CardContent>
    </Card>
  );
};

export default WorkHoursSettings;
