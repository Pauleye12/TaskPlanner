"use client";

import React from "react";
// import { useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
// import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AddTaskPage() {
  // const router = useRouter();

  // const handleClose = () => {
  //   router.push("/");
  // };

  return (
    <div className="min-h-screen bg-gray-950 text-white  px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col-reverse gap-3  md:flex-row md:justify-between items-center pt-8 mb-6">
          <h1 className="text-2xl font-bold">Add New Task</h1>
          <Link
            className="text-white bg-transparent md:bg-indigo-600 rounded-lg -translate-x-5 md:translate-x-0 px-3 md:px-4 py-1 md:py-2 self-start "
            href={"/"}
          >
            <ChevronLeft className="md:hidden text-white w-10 h-10 " />
            <span className="hidden md:inline"> Back to Calendar</span>
          </Link>
        </div>
        <TaskForm />
      </div>
    </div>
  );
}
