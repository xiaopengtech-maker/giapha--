"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Network,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

interface LandingHeroProps {
  siteName: string;
}

export default function LandingHero({ siteName }: LandingHeroProps) {
  return (
    <>
      <motion.div
        className="max-w-6xl text-center space-y-14 w-full relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Animated Badge */}
        <motion.div variants={fadeIn} className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full shadow-lg shadow-emerald-500/20 border border-emerald-200/60 bg-white/80 backdrop-blur-sm relative overflow-hidden group"
          >
            <Sparkles className="size-4 text-amber-500 animate-pulse" />
            <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Nền tảng gia phả hiện đại & bảo mật
            </span>
            <Star className="size-3 text-amber-400" />
          </motion.div>
        </motion.div>

        {/* Main Title */}
        <motion.div variants={fadeIn} className="space-y-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            <span className="block">
              <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
                {siteName}
              </span>
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
            Gìn giữ và lưu truyền những giá trị, cội nguồn và truyền thống tốt
            đẹp của dòng họ cho các thế hệ mai sau. 🌳
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full px-4 sm:px-0 relative"
          variants={fadeIn}
        >
          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-20 bg-emerald-500/20 blur-3xl rounded-full z-0 hidden sm:block" />

          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white rounded-2xl shadow-2xl shadow-emerald-900/20 hover:shadow-emerald-900/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <span className="relative z-10 flex items-center gap-3">
              Đăng nhập để xem thông tin
              <ArrowRight className="size-5 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left"
          variants={staggerContainer}
        >
          {[
            {
              icon: <Users className="size-7 text-emerald-600" />,
              title: "Quản lý Thành viên",
              desc: "Cập nhật thông tin chi tiết, tiểu sử và hình ảnh của từng thành viên trong dòng họ một cách nhanh chóng và bảo mật.",
            },
            {
              icon: <Network className="size-7 text-blue-600" />,
              title: "Sơ đồ Sáng tạo",
              desc: "Xem trực quan sơ đồ phả hệ, thế hệ và mối quan hệ gia đình với giao diện cây hiện đại, dễ thao tác.",
            },
            {
              icon: <ShieldCheck className="size-7 text-rose-600" />,
              title: "Bảo mật Tối đa",
              desc: "Dữ liệu riêng tư như số điện thoại, quê quán được phân quyền chặt chẽ, bảo vệ an toàn trên hệ thống đám mây.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 flex flex-col items-start"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl bg-gradient-to-br from-emerald-50/50 to-transparent" />

              {/* Icon */}
              <div className="relative z-10 p-4 bg-white rounded-2xl mb-6 shadow-lg ring-1 ring-slate-100 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="relative z-10 text-xl sm:text-2xl font-bold text-slate-800 mb-3 font-serif group-hover:text-slate-900 transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 text-slate-600 text-base leading-relaxed">
                {feature.desc}
              </p>

              {/* Arrow indicator */}
              <motion.div
                className="relative z-10 mt-4 flex items-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-slate-600 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
              >
                <span>Tìm hiểu thêm</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
}
