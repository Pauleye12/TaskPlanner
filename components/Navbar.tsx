import React from "react";
import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { useTaskContext } from "./TaskContext";

const Navbar = () => {
  const { setIsWorkHoursSet } = useTaskContext();
  return (
    <header className="fixed left-0 top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl relative flex justify-between gap-6 mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <h1 className="text-black font-bold flex gap-2 justify-center items-center text-xl">
          <CalendarCheck className="text-indigo-600 font-bold text-2xl " />{" "}
          Smart TaskPlanner{" "}
        </h1>
        <ul className="flex gap-7 items-center">
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
    </header>
  );
};

export default Navbar;
