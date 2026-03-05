import Footer from "@/components/Footer";

export const metadata = {
  title: "Giới thiệu - GiaPhaOS",
  description: "Tìm hiểu về nền tảng quản lý gia phả trực tuyến GiaPhaOS",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] selection:bg-amber-200 selection:text-amber-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#fef3c7,transparent)] pointer-events-none"></div>

      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none flex justify-center">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-amber-300/20 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-rose-200/20 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      <main className="max-w-3xl mx-auto px-4 py-20 relative z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-8">
            Giới thiệu
          </h1>

          <div className="prose prose-stone prose-lg max-w-none">
            <p className="text-stone-600 leading-relaxed mb-6">
              <strong className="text-stone-800">GiaPhaOS</strong> là một
              giải pháp mã nguồn mở được thiết kế giúp các dòng họ, gia đình
              quản lý và lưu trữ thông tin gia phả một cách dễ dàng và hiện đại
              nhất.
            </p>

            <p className="text-stone-600 leading-relaxed mb-6">
              Với GiaPhaOS, bạn có thể:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-stone-600 mb-6">
              <li>Xây dựng cây phả hệ trực quan</li>
              <li>Quản lý thông tin chi tiết của từng thành viên</li>
              <li>Lưu trữ hình ảnh, tài liệu gia đình</li>
              <li>Theo dõi các sự kiện, ngày giỗ, sinh nhật</li>
              <li>Chia sẻ gia phả với các thành viên trong dòng họ</li>
            </ul>

            <p className="text-stone-600 leading-relaxed mb-6">
              Phần mềm được xây dựng trên nền tảng web hiện đại, cho phép truy
              cập từ bất kỳ thiết bị nào có kết nối internet mà không cần cài đặt
              phần mềm.
            </p>

            <h2 className="text-2xl font-bold text-stone-800 mt-8 mb-4">
              Công nghệ sử dụng
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-stone-600 mb-6">
              <li>Next.js - Framework React hiện đại</li>
              <li>Supabase - Nền tảng backend-as-a-service</li>
              <li>TailwindCSS - CSS framework</li>
              <li>Framer Motion - Thư viện animations</li>
            </ul>

            <h2 className="text-2xl font-bold text-stone-800 mt-8 mb-4">
              Liên hệ & Góp ý
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Nếu bạn có bất kỳ thắc mắc, đề xuất tính năng, báo lỗi khi sử
              dụng phần mềm, hoặc muốn thảo luận thì xin vui lòng gửi email về
              địa chỉ:
            </p>
            <p className="text-stone-600 leading-relaxed mb-2">
              <a
                href="mailto:xiaopengtech@gmail.com"
                className="font-semibold text-amber-700 hover:text-amber-600 transition-colors inline-flex items-center gap-1.5"
              >
                xiaopengtech@gmail.com
              </a>
            </p>
            <p className="text-stone-600 leading-relaxed mb-6">
              <a
                href="https://facebook.com/ducphu.private"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5"
              >
                Liên hệ qua Facebook
              </a>
            </p>

            <h2 className="text-2xl font-bold text-stone-800 mt-8 mb-4">
              Đóng góp
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              GiaPhaOS là phần mềm mã nguồn mở, bạn có thể đóng góp vào dự án
              thông qua{" "}
              <a
                href="https://github.com/homielab/giapha-os"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-amber-700 hover:text-amber-600 transition-colors"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer className="bg-transparent relative z-10 border-none" />
    </div>
  );
}
