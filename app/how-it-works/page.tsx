"use client";
import DocsCard from "@/components/DocsCard";
import React from "react";
const Docs = [
  {
    id: 1,
    Title: "Set Up Work-Hour",
    content:
      " Upon launching the application for the first time, users are prompted to configure their work-hour preferences. This allows the app to organize tasks more efficiently by aligning them with the user's working schedule. Work hours can be modified at any time via the navigation menu, giving users flexibility in adjusting their schedule as needed.",
    image: "/Images/workhourBg.jpg",
  },
  {
    id: 2,
    Title: "Calendar View",
    content:
      "The app defaults to a Day View of the task calendar after the initial work-hour setup. Users can toggle between three calendar views for better usability. Day View - Displays tasks for the current day in hourly slots. Week View - Provides a weekly overview of tasks. Month View - Shows tasks for the entire month, offering a macro-level perspective of the schedule.",
    image: "/Images/calendar.jpeg",
  },

  {
    id: 3,
    Title: "Add Task",
    content:
      "Tasks can be added by clicking the 'Add Task' button. A Task Details Form allows users to define task properties, including:Title, Description, Date and Time, Priority level",
    image: "/Images/buttons.jpg",
  },

  {
    id: 4,
    Title: "Edit Task",
    content:
      "Task Modification: Existing tasks can be edited by selecting the specific task from the calendar interface. Time Validation: During the editing process, the task's time must be explicitly set again. If not specified, the system will default the task's time to the next valid time slot.",
    image: "/Images/editBg.jpg",
  },

  {
    id: 5,
    Title: "Advanced Options: ",
    content:
      "Repeating Tasks: Users can configure tasks to repeat automatically on a Daily, Weekly, Monthly, Yearly basis. Splittable Tasks: Tasks can be configured to span across multiple time slots, enabling users to divide larger tasks into smaller, manageable parts. Work Hour Constraints: Tasks can either adhere to pre-defined work hours or be assigned to occur outside these hours based on user preferences.",
    image: "/Images/advancedBg.jpg",
  },
];
const HowItWorks = () => {
  return (
    <div className="w-full py-20  flex justify-center items-center  ">
      <div className="max-w-[1300px] px-4 w-full flex flex-col gap-[100px] ">
        {Docs.map((doc, index) => (
          <DocsCard {...doc} key={index} />
        ))}
        <div className="w-full text-white text-lg flex flex-col gap-2 ">
          <h1 className="text-3xl text-indigo-600 font-medium mb-3 ">
            Default Behavior
          </h1>
          <p>
            <span className="font-semibold">Work Hour Alignment:</span> By
            default, tasks are assigned to time slots within the user&apos;s
            pre-set work hours unless explicitly configured otherwise.
          </p>
          <p>
            <span className="font-semibold">Default Time: </span> When creating
            a new task, the system automatically defaults to the current date
            and time unless the user specifies a different time.
          </p>
          <p>
            <span className="font-semibold">Out-of-Hours Adjustment:</span> If a
            task is scheduled outside the pre-set work hours and is marked to
            occur within work hours, the system will: Automatically shift the
            task to the next available valid time slot within the user&apos;s
            work-hour schedule.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
