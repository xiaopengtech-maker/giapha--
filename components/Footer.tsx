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
      className={`py-8 text-center text-sm text-stone-500 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {showDisclaimer && (
          <p className="mb-4 text-xs tracking-wide bg-amber-50 inline-block px-3 py-1 rounded-full text-amber-800 border border-amber-200/50">
            Nội dung có thể thiếu sót. Vui lòng đóng góp để gia phả chính xác hơn.
          </p>
        )}
        <p className="flex items-center justify-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <a
            href="https://facebook.com/ducphu.private"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-stone-600 hover:text-amber-700 transition-colors inline-flex items-center gap-1.5"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            GiaPhaOS
          </a>
          by
          <a
            href="https://facebook.com/ducphu.private"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5"
          >
            Nguyen Duc Phu
          </a>
        </p>
      </div>
    </footer>
  );
}
