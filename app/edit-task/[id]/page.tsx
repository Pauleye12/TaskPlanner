"use client";

import React from "react";
import { useParams } from "next/navigation";
import TaskForm from "@/components/TaskForm";

import { useTaskContext } from "@/components/TaskContext";
import Link from "next/link";

export default function EditTaskPage() {
  // const router = useRouter();
  const params = useParams();
  const { tasks } = useTaskContext();

  const taskId = params.id as string;
  const task = tasks.find((t) => t.id === taskId);

  // const handleClose = () => {
  //   router.push("/");
  // };

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Task</h1>
          <Link
            className="text-white bg-indigo-600 rounded-lg px-4 py-2 "
            href={"/"}
          >
            Back to Calendar
          </Link>
        </div>
        <TaskForm task={task} />
      </div>
    </div>
  );
}
