"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Network, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LogoutButton from "./LogoutButton";
import { useUser } from "./UserProvider";

export default function HeaderMenu() {
  const { user } = useUser();
  const userEmail = user?.email;
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 transition-all duration-200 border border-transparent hover:border-slate-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="size-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold shadow-md ring-2 ring-white"
          animate={{ scale: isOpen ? 1.05 : 1 }}
        >
          {userEmail ? (
            userEmail.charAt(0).toUpperCase()
          ) : (
            <User className="size-4" />
          )}
        </motion.div>
        <span className="hidden sm:inline-block text-sm font-medium text-slate-600">
          {userEmail?.split('@')[0]}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="size-4 text-slate-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100/60 py-2 z-50 overflow-hidden"
          >
            <div className="px-4 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/30">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Tài khoản
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {userEmail}
              </p>
            </div>

            <div className="py-2">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all group"
              >
                <Network className="size-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                Bảng điều khiển
              </Link>

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-all group"
              >
                <Settings className="size-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                Giới thiệu
              </Link>
            </div>

            <div className="border-t border-slate-100 mt-2 pt-2">
              <LogoutButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
