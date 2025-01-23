import { TaskProvider } from "@/components/TaskContext";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Smart Task Planner",
  description: "Plan your tasks efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TaskProvider>
          <div className="min-h-screen bg-gray-950 pt-[80px] lg:pb-2 pb-6 p-2 ">
            <Navbar />
            {children}
          </div>
        </TaskProvider>
      </body>
    </html>
  );
}
