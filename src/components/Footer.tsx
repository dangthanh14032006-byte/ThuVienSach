import Link from "next/link";
import { BookOpen, ShieldAlert, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-wide">
                Thư Viện Sách Online
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Dự án chia sẻ ebook, tài liệu học tập và đọc sách phi lợi nhuận. Hỗ trợ đầy đủ định dạng PDF, EPUB, MOBI giúp bạn tiếp cận tri thức mọi lúc mọi nơi.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-lg max-w-md">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                <strong>Miễn trừ trách nhiệm:</strong> Mọi ebook được sưu tầm từ cộng đồng mạng nhằm mục đích nghiên cứu học tập cá nhân.
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Danh Mục Sách</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/sach?category=ky-nang-song" className="hover:text-white transition">
                  Kỹ Năng Sống
                </Link>
              </li>
              <li>
                <Link href="/sach?category=van-hoc-tieu-thuyet" className="hover:text-white transition">
                  Văn Học - Tiểu Thuyết
                </Link>
              </li>
              <li>
                <Link href="/sach?category=kinh-te-khoi-nghiep" className="hover:text-white transition">
                  Kinh Tế - Khởi Nghiệp
                </Link>
              </li>
              <li>
                <Link href="/sach?format=PDF" className="hover:text-white transition">
                  Kho Ebook PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Liên Hệ & Quản Trị</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Trang Quản Trị (Admin CMS)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Chính sách bản quyền (DMCA)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Yêu cầu thêm sách mới
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Thư Viện Sách Online. Mọi quyền được bảo lưu.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Xây dựng với <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> phục vụ cộng đồng yêu sách
          </p>
        </div>
      </div>
    </footer>
  );
}
