import React, { useState } from "react";
import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { useTaskContext } from "./TaskContext";
import {
  AlignVerticalJustifyEnd,
  CalendarPlus2,
  AlarmClockPlus,
  FileSearch,
} from "lucide-react";

const Navbar = () => {
  const { setIsWorkHoursSet } = useTaskContext();
  const [showOptions, setShowOptions] = useState(false);
  return (
    <header className="fixed left-0 top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl relative flex justify-between gap-6 mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <h1 className="text-black font-bold flex gap-2 justify-center items-center text-xl">
          <CalendarCheck className="text-indigo-600 font-bold text-2xl " />{" "}
          Smart TaskPlanner{" "}
        </h1>
        <ul className="lg:flex hidden gap-7 items-center">
          <li className="text-black font-medium ">
            <Link href={"/"}>How it Works</Link>
          </li>
          <li
            onClick={() => setIsWorkHoursSet(false)}
            className="text-black cursor-pointer font-medium "
          >
            Reset Workhours
          </li>
          <li className="bg-indigo-600 rounded-lg px-3 py-2 hover:bg-indigo-700 text-white">
            <Link href={"/add-task"}>Add Task</Link>
          </li>
        </ul>
      </div>

      <div className="fixed lg:hidden right-10 top-[800%]  ">
        <div
          className={`bg-transparent flex flex-col gap-5 text-indigo-600 mb-5 transition-all ${
            showOptions
              ? "scale-1 opacity-1 translate-y-0 "
              : "scale-0 opacity-0 translate-y-10"
          } `}
        >
          <Link
            href={"/"}
            onClick={() => setShowOptions((prev: boolean) => !prev)}
            className="w-16 h-16 flex justify-center items-center rounded-full border border-solid border-indigo-600 bg-white"
          >
            <FileSearch size={30} />
          </Link>
          <button
            onClick={() => {
              setIsWorkHoursSet(false);
              setShowOptions((prev: boolean) => !prev);
            }}
            className="w-16 h-16 flex justify-center items-center rounded-full border border-solid border-indigo-600 bg-white"
          >
            <AlarmClockPlus size={30} />
          </button>
          <Link
            onClick={() => setShowOptions((prev: boolean) => !prev)}
            href={"/add-task"}
            className="w-16 h-16 flex justify-center items-center rounded-full border border-solid border-indigo-600 bg-white"
          >
            <CalendarPlus2 size={30} />
          </Link>
        </div>
        <button
          onClick={() => setShowOptions((prev: boolean) => !prev)}
          className="p-4 rounded-full border border-solid border-indigo-600 bg-gray-900"
        >
          <AlignVerticalJustifyEnd size={36} className="text-indigo-600" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
