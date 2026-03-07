"use client";

import { motion } from "framer-motion";
import { List, ListTree, Network, Pentagon } from "lucide-react";
import { useDashboard } from "./DashboardContext";

export type ViewMode = "list" | "tree-vertical" | "tree-horizontal" | "tree-pentagonal" | "mindmap";

export default function ViewToggle() {
  const { view: currentView, setView } = useDashboard();

  const tabs = [
    {
      id: "list",
      label: "Danh sách",
      icon: <List className="w-4 h-4" />,
    },
    {
      id: "tree-vertical",
      label: "Cây dọc",
      icon: <Network className="w-4 h-4" />,
    },
    {
      id: "tree-horizontal",
      label: "Cây ngang",
      icon: <Network className="w-4 h-4 rotate-90" />,
    },
    {
      id: "tree-pentagonal",
      label: "Ngũ giác",
      icon: <Pentagon className="w-4 h-4" />,
    },
    {
      id: "mindmap",
      label: "Mindmap",
      icon: <ListTree className="w-4 h-4" />,
    },
  ] as const;

  return (
    <div className="flex items-center justify-center p-1.5 bg-white rounded-2xl shadow-lg border border-slate-200/60 w-fit mx-auto mt-6 mb-4">
      {tabs.map((tab) => {
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as ViewMode)}
            className={`relative px-4 sm:px-5 py-2 text-sm font-medium rounded-xl transition-all duration-300 ease-out flex items-center gap-2 ${
              isActive
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-300 ${isActive ? "text-emerald-600" : "text-slate-400"}`}
            >
              {tab.icon}
            </span>
            <span className="relative z-10 hidden sm:block font-heading font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
