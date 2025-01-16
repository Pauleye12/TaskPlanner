import * as React from "react";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  return (
    <div className={`relative  ${className}`}>
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-3 h-fit  py-2"
      />
      <Clock
        className="absolute pointer-events-none right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={16}
      />
    </div>
  );
}
