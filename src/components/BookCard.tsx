import Link from "next/link";
import { Star, Eye, Download, BookOpen, Sparkles } from "lucide-react";

export interface BookCardProps {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  authorName?: string;
  categoryName?: string;
  viewCount: number;
  downloadCount: number;
  ratingAvg: number;
  hasPdf?: boolean;
  hasEpub?: boolean;
  rank?: number;
}

export default function BookCard({
  title,
  slug,
  coverImage,
  authorName,
  categoryName,
  viewCount,
  downloadCount,
  ratingAvg,
  hasPdf = true,
  hasEpub = false,
  rank,
}: BookCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Cover Container */}
      <Link
        href={`/sach/${slug}`}
        className="relative block aspect-[3/4.2] bg-gradient-to-tr from-slate-100 to-slate-200 overflow-hidden"
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:-rotate-0.5 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
            <BookOpen className="w-10 h-10 mb-2 opacity-40" />
            <span className="text-[11px] font-medium">Chưa có bìa</span>
          </div>
        )}

        {/* Rank Number Badge (If in Top Charts) */}
        {rank !== undefined && (
          <div className="absolute top-2 left-2 w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shadow-lg border border-white/20">
            #{rank}
          </div>
        )}

        {/* Format Badges (PDF / EPUB) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {hasPdf && (
            <span className="bg-slate-900/85 backdrop-blur text-rose-400 font-extrabold text-[9px] px-2 py-0.5 rounded-full border border-rose-500/30 shadow-xs">
              PDF
            </span>
          )}
          {hasEpub && (
            <span className="bg-slate-900/85 backdrop-blur text-emerald-400 font-extrabold text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/30 shadow-xs">
              EPUB
            </span>
          )}
        </div>

        {/* Hover Quick Action */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs text-center shadow-lg flex items-center justify-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <BookOpen className="w-3.5 h-3.5" />
            Đọc Ngay
          </span>
        </div>
      </Link>

      {/* Book Metadata */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {categoryName && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider">
              {categoryName}
            </span>
          )}

          <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 mt-1.5 group-hover:text-emerald-700 transition leading-snug">
            <Link href={`/sach/${slug}`}>{title}</Link>
          </h3>

          <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-1">
            {authorName || "Đang cập nhật tác giả"}
          </p>
        </div>

        {/* Stats Row */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span>{ratingAvg.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-2.5 font-medium">
            <span className="flex items-center gap-1 text-slate-400" title="Lượt xem">
              <Eye className="w-3 h-3" />
              {viewCount > 1000 ? `${(viewCount / 1000).toFixed(1)}k` : viewCount}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold" title="Lượt tải">
              <Download className="w-3 h-3" />
              {downloadCount > 1000 ? `${(downloadCount / 1000).toFixed(1)}k` : downloadCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
