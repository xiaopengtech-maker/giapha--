"use client";

import { motion } from "framer-motion";

export interface FooterProps {
  className?: string;
  showDisclaimer?: boolean;
}

export default function Footer({
  className = "",
  showDisclaimer = false,
}: FooterProps) {
  return (
    <footer
      className={`py-10 text-center text-sm ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <p className="inline-flex items-center gap-2 text-sm tracking-wide bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-2.5 rounded-full text-amber-800 border border-amber-200/60 shadow-sm hover:shadow-md transition-shadow">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-amber-500"></span>
              </span>
              Nội dung có thể thiếu sót. Vui lòng đóng góp để gia phả chính xác hơn.
            </p>
          </motion.div>
        )}
        
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="flex items-center justify-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
            <span className="text-slate-400">Made with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-rose-500"
            >
              ❤️
            </motion.span>
            <span className="text-slate-400">by</span>
            <a
              href="https://facebook.com/ducphu.private"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-700 hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-full"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Nguyễn Đức Phú
            </a>
          </p>
          
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} GiaPhaOS. Tất cả quyền được bảo vệ.
          </p>
        </div>
      </div>
    </footer>
  );
}
