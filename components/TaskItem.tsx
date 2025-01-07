"use client";

import React, { useState } from "react";
import { useTaskContext, Task } from "./TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash } from "lucide-react";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask, markTaskAsCompleted } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleEdit = () => {
    if (isEditing) {
      updateTask(task.id, { title: editedTitle });
    }
    setIsEditing(!isEditing);
  };

  return (
    <li className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center space-x-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) =>
            markTaskAsCompleted(task.id, checked as boolean)
          }
        />
        {isEditing ? (
          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-48"
          />
        ) : (
          <span className={task.completed ? "line-through" : ""}>
            {task.title}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">
          {format(task.start, "HH:mm")}
        </span>
        <Button variant="ghost" size="icon" onClick={handleEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
};

export default TaskItem;
