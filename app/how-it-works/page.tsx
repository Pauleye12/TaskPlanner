"use client";
import DocsCard from "@/components/DocsCard";
import React from "react";
const Docs = [
  {
    id: 1,
    Title: "Set Up Work-Hour",
    content:
      "On launch of the app, you will be required to set up your work-hour to better help you organise your tasks. *you can still proceed to change your work hour anytime from the navigation links.",
    image: "/Images/workhourBg.jpg",
  },
  {
    id: 2,
    Title: "Calendar View",
    content:
      "After setting up your work hours, the default view for the task calendar is the day view. For personal preference, the view can be toggled from day to week to monthly view.",
    image: "/Images/calendar.jpeg",
  },

  {
    id: 3,
    Title: "Add Task",
    content:
      "To add tasks, click on any of the buttons depending on your view and proceed to fill in your task details",
    image: "/Images/buttons.jpg",
  },

  {
    id: 4,
    Title: "Edit Task",
    content:
      "Details and properties of tasks can be adjusted and changed after the task has been set by clicking on the specific task (The Time would have to be reset again during the edit or it defaults to the next available valid time ).",
    image: "/Images/editBg.jpg",
  },

  {
    id: 5,
    Title: "Advanced Options: ",
    content:
      "Repeat Task: Tasks can be set to repeat daily, weekly, monthly or yearly Splittable Tasks: Tasks can be set to be split across times (To be completed in parts).Work hours: Tasks can be set to be done during the pre-set work hours or outside the work hours",
    image: "/Images/advancedBg.jpg",
  },
];
const HowItWorks = () => {
  return (
    <div className="w-full py-20  flex justify-center items-center bg-gray-900 ">
      <div className="max-w-[1300px] px-4 w-full flex flex-col gap-[100px] ">
        {Docs.map((doc, index) => (
          <DocsCard {...doc} key={index} />
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
