import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BookCard from "@/components/BookCard";
import { Filter, Search, BookOpen, Sparkles, Layers, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface Props {
  searchParams: {
    search?: string;
    category?: string;
    format?: string;
    sort?: string;
  };
}

export default async function BooksPage({ searchParams }: Props) {
  const { search, category, format, sort = "newest" } = searchParams;

  // Build query
  const where: any = { status: "PUBLISHED" };

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (format) {
    where.files = {
      some: {
        format: format.toUpperCase(),
      },
    };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "rating") orderBy = { ratingAvg: "desc" };
  if (sort === "views") orderBy = { viewCount: "desc" };
  if (sort === "downloads") orderBy = { downloadCount: "desc" };

  const [books, categories] = await Promise.all([
    prisma.book.findMany({
      where,
      include: { author: true, category: true, files: true },
      orderBy,
    }),
    prisma.category.findMany({
      include: { _count: { select: { books: true } } },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
            Kho Tàng Sách Số
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {search ? `Tìm kiếm: "${search}"` : "Toàn Bộ Kho Sách & Ebook"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tìm thấy <span className="font-bold text-emerald-700">{books.length}</span> tác phẩm phù hợp từ cơ sở dữ liệu PostgreSQL
          </p>
        </div>

        {/* Clear filters if active */}
        {(search || category || format || sort !== "newest") && (
          <Link
            href="/sach"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3.5 py-2 rounded-xl self-start border border-rose-200 transition"
          >
            ✕ Xóa toàn bộ bộ lọc
          </Link>
        )}
      </div>

      {/* Modern Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Chuyên mục:
          </span>
          <Link
            href={`/sach?${new URLSearchParams({ ...searchParams, category: "" }).toString()}`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
              !category
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất Cả ({categories.reduce((sum, c) => sum + (c._count?.books || 0), 0)})
          </Link>

          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/sach?${new URLSearchParams({ ...searchParams, category: c.slug }).toString()}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                category === c.slug
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.name} ({c._count?.books || 0})
            </Link>
          ))}
        </div>

        {/* Format & Sorting Filters */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Format Selection */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Định dạng file:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <Link
                href={`/sach?${new URLSearchParams({ ...searchParams, format: "" }).toString()}`}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  !format ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tất cả
              </Link>
              <Link
                href={`/sach?${new URLSearchParams({ ...searchParams, format: "PDF" }).toString()}`}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  format === "PDF" ? "bg-white text-rose-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                PDF
              </Link>
              <Link
                href={`/sach?${new URLSearchParams({ ...searchParams, format: "EPUB" }).toString()}`}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  format === "EPUB" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                EPUB
              </Link>
            </div>
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sắp xếp theo:
            </span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <Link
                href={`/sach?${new URLSearchParams({ ...searchParams, sort: "newest" }).toString()}`}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  sort === "newest" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Mới nhất
              </Link>
              <Link
                href={`/sach?${new URLSearchParams({ ...searchParams, sort: "views" }).toString()}`}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  sort === "views" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Xem nhiều
              </Link>
              <Link
                href={`/sach?${new URLSearchParams({ ...searchParams, sort: "rating" }).toString()}`}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  sort === "rating" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Đánh giá cao
              </Link>
              <Link
                href={`/sach?${new URLSearchParams({ ...searchParams, sort: "downloads" }).toString()}`}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  sort === "downloads" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tải nhiều
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {books.map((book) => (
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
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy tác phẩm nào phù hợp</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Thử tìm bằng từ khóa chung hơn hoặc xóa bộ lọc để hiển thị toàn bộ kho sách.
          </p>
          <Link
            href="/sach"
            className="mt-4 inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 shadow-sm transition"
          >
            Quay Lại Toàn Bộ Sách
          </Link>
        </div>
      )}
    </div>
  );
}
