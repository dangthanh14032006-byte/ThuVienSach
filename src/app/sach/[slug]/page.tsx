import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  BookOpen,
  Download,
  Star,
  Eye,
  Calendar,
  Layers,
  Building,
  User,
  Share2,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  FileText,
} from "lucide-react";
import BookCard from "@/components/BookCard";

interface Props {
  params: {
    slug: string;
  };
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = params;

  const book = await prisma.book.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      files: true,
    },
  });

  if (!book) {
    notFound();
  }

  // Increment view count in PostgreSQL
  try {
    await prisma.book.update({
      where: { id: book.id },
      data: { viewCount: { increment: 1 } },
    });
  } catch (e) {
    // ignore
  }

  // Related books from PostgreSQL
  const relatedBooks = await prisma.book.findMany({
    where: {
      categoryId: book.categoryId,
      id: { not: book.id },
      status: "PUBLISHED",
    },
    include: { author: true, category: true, files: true },
    take: 6,
  });

  const pdfFile = book.files.find((f) => f.format === "PDF");
  const epubFile = book.files.find((f) => f.format === "EPUB");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-emerald-700 transition">Trang chủ</Link>
        <span>/</span>
        <Link href={`/sach?category=${book.category.slug}`} className="hover:text-emerald-700 transition">
          {book.category.name}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{book.title}</span>
      </nav>

      {/* Main Book Presentation Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
          {/* Left Column: 3D Hardcover Book Showcase */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col items-center">
            <div className="relative group perspective-1000">
              <div className="w-56 sm:w-64 aspect-[3/4.3] rounded-2xl overflow-hidden shadow-2xl border border-slate-300/80 bg-slate-100 group-hover:scale-[1.02] transition-transform duration-300">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <BookOpen className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-xs">Chưa có ảnh bìa</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Badges Under Cover */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {pdfFile && (
                <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  PDF ({(pdfFile.fileSize ? pdfFile.fileSize / (1024 * 1024) : 10).toFixed(1)} MB)
                </span>
              )}
              {epubFile && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  EPUB ({(epubFile.fileSize ? epubFile.fileSize / (1024 * 1024) : 4).toFixed(1)} MB)
                </span>
              )}
            </div>

            {/* Cloud Storage verified badge */}
            <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dữ liệu lưu trữ trên PostgreSQL Cloud</span>
            </div>
          </div>

          {/* Right Column: Title, Metadata & Action Suite */}
          <div className="md:col-span-8 lg:col-span-8 space-y-6">
            <div>
              <Link
                href={`/sach?category=${book.category.slug}`}
                className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 hover:bg-emerald-200 transition"
              >
                {book.category.name}
              </Link>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-snug tracking-tight">
                {book.title}
              </h1>

              {/* Author & Stats Row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 pt-3 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Tác giả: </span>
                  <Link
                    href={`/sach?search=${encodeURIComponent(book.author.name)}`}
                    className="text-emerald-700 hover:underline"
                  >
                    {book.author.name}
                  </Link>
                </div>

                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  <span>{book.ratingAvg.toFixed(1)}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    ({book.ratingCount} đánh giá)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{book.viewCount.toLocaleString()} lượt đọc</span>
                </div>

                <div className="flex items-center gap-1 text-emerald-700 font-medium text-xs">
                  <Download className="w-3.5 h-3.5" />
                  <span>{book.downloadCount.toLocaleString()} lượt tải</span>
                </div>
              </div>
            </div>

            {/* Quick Metadata Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-100 text-xs">
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Nhà xuất bản</span>
                  <span className="font-bold text-slate-800">{book.publisher || "Đang cập nhật"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Năm xuất bản</span>
                  <span className="font-bold text-slate-800">{book.publishYear || "2023"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Số trang tài liệu</span>
                  <span className="font-bold text-slate-800">
                    {book.pageCount ? `${book.pageCount} trang` : "Bản đầy đủ"}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={`/doc-sach/${book.slug}`}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/25 flex items-center gap-2.5 transition group"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <BookOpen className="w-4 h-4" />
                <span>Đọc Sách Online Ngay</span>
              </Link>

              {pdfFile && (
                <a
                  href={pdfFile.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4 text-rose-400" />
                  <span>Tải File PDF</span>
                </a>
              )}

              {epubFile && (
                <a
                  href={epubFile.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>Tải File EPUB</span>
                </a>
              )}
            </div>

            {/* Book Description */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Tóm Tắt & Giới Thiệu Nội Dung
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-light">
                {book.description || "Tác phẩm này đang được ban biên tập cập nhật thêm phần giới thiệu nội dung tóm tắt chi tiết."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Books Section */}
      {relatedBooks.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Tác Phẩm Cùng Chuyên Mục
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Có thể bạn cũng sẽ yêu thích những cuốn sách này
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedBooks.map((relBook) => (
              <BookCard
                key={relBook.id}
                id={relBook.id}
                title={relBook.title}
                slug={relBook.slug}
                coverImage={relBook.coverImage}
                authorName={relBook.author?.name}
                categoryName={relBook.category?.name}
                viewCount={relBook.viewCount}
                downloadCount={relBook.downloadCount}
                ratingAvg={relBook.ratingAvg}
                hasPdf={relBook.files?.some((f: any) => f.format === "PDF")}
                hasEpub={relBook.files?.some((f: any) => f.format === "EPUB")}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
