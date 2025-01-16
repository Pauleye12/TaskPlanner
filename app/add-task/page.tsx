"use client";

import React from "react";
// import { useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
// import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AddTaskPage() {
  // const router = useRouter();

  // const handleClose = () => {
  //   router.push("/");
  // };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Add New Task</h1>
          <Link
            className="text-gray-900 bg-white rounded-lg px-4 py-2 "
            href={"/"}
          >
            Back to Calendar
          </Link>
        </div>
        <TaskForm />
      </div>
    </div>
  );
}
