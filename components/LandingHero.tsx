"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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
        className="max-w-5xl text-center space-y-10 w-full relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div
          className="space-y-6 flex flex-col items-center"
          variants={fadeIn}
        >
          {/* Simple badge */}
          <div className="inline-flex items-center justify-center gap-2 px-5 py-3 text-base font-semibold text-amber-800 bg-amber-100 rounded-full border-2 border-amber-300">
            <Sparkles className="size-5 text-amber-600" />
            Nền tảng gia phả hiện đại & bảo mật
          </div>

          {/* Main title - Large and clear */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-stone-900 leading-tight">
            <span className="block">{siteName}</span>
          </h1>

          {/* Description - Large and readable */}
          <p className="text-xl sm:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Gìn giữ và lưu truyền những giá trị, cội nguồn và truyền thống tốt
            đẹp của dòng họ cho các thế hệ mai sau.
          </p>
        </motion.div>

        {/* Login button - Large and clear */}
        <motion.div
          className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
          variants={fadeIn}
        >
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 text-xl font-bold text-white bg-stone-800 border-2 border-stone-900 hover:bg-stone-900 rounded-2xl shadow-lg transition-all duration-200 min-w-[280px]"
          >
            <span className="flex items-center gap-3">
              Đăng nhập để xem thông tin
              <ArrowRight className="size-6" />
            </span>
          </Link>
        </motion.div>

        {/* Features - Simple cards */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t-2 border-stone-200 pt-10"
          variants={staggerContainer}
        >
          {[
            {
              icon: <Users className="size-8 text-amber-600" />,
              title: "Quản lý Thành viên",
              desc: "Cập nhật thông tin chi tiết của từng thành viên trong dòng họ một cách nhanh chóng và bảo mật.",
            },
            {
              icon: <Network className="size-8 text-amber-600" />,
              title: "Sơ đồ Phả hệ",
              desc: "Xem trực quan sơ đồ phả hệ, thế hệ và mối quan hệ gia đình với giao diện dễ thao tác.",
            },
            {
              icon: <ShieldCheck className="size-8 text-amber-600" />,
              title: "Bảo mật Tối đa",
              desc: "Dữ liệu riêng tư được phân quyền chặt chẽ, bảo vệ an toàn trên hệ thống đám mây.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn}
              className="bg-white p-6 rounded-2xl border-2 border-stone-200 hover:border-amber-300 transition-all duration-200"
            >
              <div className="p-4 bg-amber-100 rounded-2xl mb-4 inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-base text-stone-600 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
}
