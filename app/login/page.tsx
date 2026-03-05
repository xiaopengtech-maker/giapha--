"use client";

import config from "@/app/config";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Shield, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname === config.demoDomain || hostname === "developer.ducphu.com") {
        setIsDemo(true);
        setEmail("giaphaos@homielab.com");
        setPassword("giaphaos");
      }
    }
  }, []);

  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        if (password !== confirmPassword) {
          setError("Mật khẩu xác nhận không khớp.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          if (
            error.message.includes("relation") &&
            error.message.includes("does not exist")
          ) {
            router.push("/setup");
            return;
          }
          setError(error.message);
        } else if (data.user?.identities && data.user.identities.length === 0) {
          setError("Email này đã được đăng ký. Vui lòng đăng nhập.");
        } else {
          if (data.session) {
            router.push("/dashboard");
            router.refresh();
          } else {
            setSuccessMessage("Đăng ký thành công! Vui lòng chờ admin kích hoạt tài khoản.");
            setIsLogin(true);
            setConfirmPassword("");
            setPassword("");
          }
        }
      }
    } catch (err) {
      setError("Đã xảy ra lỗi không mong muốn");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fefefe]">
      {/* Back to Home button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-base font-semibold text-stone-600 hover:text-stone-900 bg-white px-5 py-3 rounded-2xl shadow-md border-2 border-stone-200 hover:border-stone-300"
      >
        <ArrowLeft className="size-5" />
        Trang chủ
      </Link>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="max-w-md w-full bg-white p-8 rounded-3xl border-2 border-stone-200 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-amber-100 rounded-2xl mb-4">
              <Shield className="size-10 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-stone-900">
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </h2>
            <p className="mt-2 text-base text-stone-500">
              {isLogin
                ? "Đăng nhập để xem gia phả"
                : "Tạo tài khoản thành viên mới"}
            </p>
            {isDemo && (
              <div className="mt-4 p-3 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <p className="text-sm font-semibold text-amber-800">
                  ⚠️ Website Demo - Dữ liệu không có thật
                </p>
              </div>
            )}
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-base font-semibold text-stone-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-stone-400" />
                <input
                  id="email"
                  type="email"
                  required
                  className="input pl-12"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-base font-semibold text-stone-700 mb-2"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-stone-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="input pl-12 pr-12"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (only for register) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-base font-semibold text-stone-700 mb-2"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-stone-400" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required={!isLogin}
                    className="input pl-12"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-base font-medium">
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 text-base font-medium">
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg"
            >
              {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Tạo tài khoản"}
            </button>

            {/* Toggle Login/Register */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  if (isLogin && isDemo) {
                    setError("Đây là trang demo. Hãy dùng tài khoản demo.");
                    return;
                  }
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="link text-lg"
              >
                {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <Footer className="bg-white border-t-2 border-stone-200" />
    </div>
  );
}
