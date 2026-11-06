import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Download,
  ArrowRight,
  Compass,
  Star,
  Quote,
  ShieldCheck,
  CheckCircle2,
  Flame,
} from "lucide-react";
import BookCard from "@/components/BookCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // ISR cache 60s

export default async function HomePage() {
  let featuredBooks: any[] = [];
  let latestBooks: any[] = [];
  let categories: any[] = [];
  let spotlightBook: any = null;

  try {
    featuredBooks = await prisma.book.findMany({
      where: { status: "PUBLISHED" },
      include: { author: true, category: true, files: true },
      take: 6,
      orderBy: { viewCount: "desc" },
    });

    latestBooks = await prisma.book.findMany({
      where: { status: "PUBLISHED" },
      include: { author: true, category: true, files: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    categories = await prisma.category.findMany({
      include: { _count: { select: { books: true } } },
    });

    spotlightBook = featuredBooks[0] || null;
  } catch (error) {
    console.error("Database query error:", error);
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Spotlight Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/90 to-slate-900 text-white py-16 md:py-24">
        {/* Glow ambient spots */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Không Gian Tri Thức & Ebook Mở Hoàn Toàn Miễn Phí</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Mở Ra Thế Giới Với{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">
                  Từng Trang Sách Số
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl font-light leading-relaxed">
                Đọc trực tuyến hàng ngàn cuốn sách kinh điển, phát triển bản thân, kỹ năng sống và tư duy kinh tế. Hỗ trợ đầy đủ định dạng PDF và EPUB với trải nghiệm đọc tùy biến cao cấp.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/sach"
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition group"
                >
                  <Compass className="w-4 h-4 text-slate-950" />
                  <span>Khám Phá Toàn Bộ Kho Sách</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/sach?format=PDF"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-300" />
                  <span>Kho Ebook PDF Chọn Lọc</span>
                </Link>
              </div>

              {/* Quick Metrics Bar */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">5,000+</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">Đầu Sách Chọn Lọc</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">Miễn Phí Mọi Lúc</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-300">Supabase</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">PostgreSQL Cloud</div>
                </div>
              </div>
            </div>

            {/* Right: Featured Book Spotlight */}
            {spotlightBook && (
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative group w-full max-w-sm">
                  {/* Decorative glow behind book */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/30 to-teal-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition" />

                  <div className="relative bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-amber-400" />
                        Tác Phẩm Tiêu Biểu Trong Tuần
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px]">
                        ★ {spotlightBook.ratingAvg.toFixed(1)}
                      </span>
                    </div>

                    <div className="flex gap-5 items-center">
                      <div className="w-28 sm:w-32 aspect-[3/4.2] rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                        <img
                          src={spotlightBook.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600"}
                          alt={spotlightBook.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {spotlightBook.category?.name}
                        </span>
                        <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug">
                          {spotlightBook.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          Tác giả: <span className="text-slate-200 font-medium">{spotlightBook.author?.name}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-3 font-light pt-1">
                          {spotlightBook.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <Link
                        href={`/doc-sach/${spotlightBook.slug}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center shadow-lg transition flex items-center justify-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Đọc Ngay Bây Giờ
                      </Link>
                      <Link
                        href={`/sach/${spotlightBook.slug}`}
                        className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition"
                      >
                        Chi Tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Curated Categories Bar */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Chuyên Mục Tri Thức
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Khám phá kho tàng sách được phân loại kỹ lưỡng theo từng lĩnh vực
              </p>
            </div>
            <Link
              href="/sach"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/sach?category=${cat.slug}`}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    {cat._count?.books || 0} tác phẩm
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center transition">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Charts: Most Read Books */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  Bảng Xếp Hạng Đọc Nhiều Nhất
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Những cuốn sách được cộng đồng độc giả tìm đọc và tải về nhiều nhất
              </p>
            </div>
            <Link
              href="/sach?sort=views"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
            >
              Bảng xếp hạng đầy đủ <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredBooks.map((book, index) => (
              <BookCard
                key={book.id}
                id={book.id}
                rank={index + 1}
                title={book.title}
                slug={book.slug}
                coverImage={book.coverImage}
                authorName={book.author?.name}
                categoryName={book.category?.name}
                viewCount={book.viewCount}
                downloadCount={book.downloadCount}
                ratingAvg={book.ratingAvg}
                hasPdf={book.files?.some((f: any) => f.format === "PDF")}
                hasEpub={book.files?.some((f: any) => f.format === "EPUB")}
              />
            ))}
          </div>
        </section>

        {/* Inspirational Reading Quote Banner */}
        <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
            <Quote className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
            <blockquote className="text-base sm:text-xl font-medium italic leading-relaxed text-slate-100">
              “Một cuốn sách hay cho ta một điều tốt, một người bạn tốt cho ta một điều hay. Đọc sách không chỉ để biết nhiều hơn, mà để thấu hiểu sâu sắc hơn về cuộc đời.”
            </blockquote>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              — Triết Lý Đọc Sách Thư Viện Sách Online
            </p>
          </div>
        </section>

        {/* Latest Books Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  Sách Mới Cập Nhật
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Vừa được thêm vào cơ sở dữ liệu PostgreSQL trong tuần này
              </p>
            </div>
            <Link
              href="/sach?sort=newest"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
            >
              Xem toàn bộ <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {latestBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                slug={book.slug}
                coverImage={book.coverImage}
                authorName={book.author?.name}
                categoryName={book.category?.name}
                viewCount={book.viewCount}
                downloadCount={book.downloadCount}
                ratingAvg={book.ratingAvg}
                hasPdf={book.files?.some((f: any) => f.format === "PDF")}
                hasEpub={book.files?.some((f: any) => f.format === "EPUB")}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
