"use client";

import { AnimatePresence, motion } from "framer-motion";
import config from "@/app/config";
import HeaderMenu from "@/components/HeaderMenu";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 sm:gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative size-10 sm:size-12 rounded-xl overflow-hidden shrink-0 border-2 border-emerald-100 shadow-md transition-all group-hover:border-emerald-300 group-hover:shadow-lg"
            >
              <Image
                src="/icon.png"
                alt="Logo"
                fill
                className="object-contain"
                sizes="48px"
              />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-serif font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-teal-500 transition-all">
                {config.siteName}
              </h1>
              <p className="text-xs text-slate-400 -mt-0.5">Quản lý gia phả</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <HeaderMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Trang chủ</span>
              </Link>
              <Link
                href="/dashboard/members"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Thành viên</span>
              </Link>
              <Link
                href="/dashboard/events"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Sự kiện</span>
              </Link>
              <Link
                href="/dashboard/kinship"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Quan hệ</span>
              </Link>
              <div className="pt-2 border-t border-slate-200">
                <HeaderMenu />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
