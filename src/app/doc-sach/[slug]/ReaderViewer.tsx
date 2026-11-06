"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Coffee,
  ZoomIn,
  ZoomOut,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface Props {
  bookTitle: string;
  bookSlug: string;
  authorName: string;
  fileUrl: string;
  downloadUrl?: string;
}

export default function ReaderViewer({
  bookTitle,
  bookSlug,
  authorName,
  fileUrl,
  downloadUrl,
}: Props) {
  const [theme, setTheme] = useState<"light" | "sepia" | "dark" | "black">("light");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "sepia":
        return "bg-[#fbf0d9] text-[#5c4934]";
      case "dark":
        return "bg-slate-900 text-slate-100";
      case "black":
        return "bg-black text-slate-200";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${getThemeClasses()} transition-colors duration-200 font-sans`}>
      {/* Top Reading Studio Header */}
      <header className="h-16 border-b border-slate-200/40 px-4 sm:px-6 flex items-center justify-between shadow-xs bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-30">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            href={`/sach/${bookSlug}`}
            className="p-2 rounded-xl hover:bg-slate-200/80 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
            title="Quay lại trang chi tiết tác phẩm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="hidden sm:block">
            <h1 className="text-xs sm:text-sm font-extrabold truncate max-w-sm sm:max-w-md text-slate-900 dark:text-white leading-tight">
              {bookTitle}
            </h1>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Tác giả: {authorName}
            </p>
          </div>
        </div>

        {/* Center: Reading Mode & Ambient Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Palette */}
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-lg transition ${
                theme === "light"
                  ? "bg-white text-amber-500 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Chế độ trang giấy sáng"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("sepia")}
              className={`p-1.5 rounded-lg transition ${
                theme === "sepia"
                  ? "bg-[#fbf0d9] text-[#8c6d46] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Chế độ giấy cổ điển (Dịu mắt)"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-lg transition ${
                theme === "dark"
                  ? "bg-slate-700 text-sky-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              title="Chế độ ban đêm (Slate)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom In/Out */}
          <div className="hidden md:flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 px-2.5 py-1 rounded-xl text-xs">
            <button
              onClick={() => setZoom(Math.max(70, zoom - 10))}
              className="p-1 hover:text-emerald-600 dark:hover:text-emerald-400"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-9 text-center font-mono text-[11px] font-bold">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-1 hover:text-emerald-600 dark:hover:text-emerald-400"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="Xem toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Download Shortcut */}
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải PDF</span>
            </a>
          )}
        </div>
      </header>

      {/* Main Reading Frame Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
        <div
          className="w-full max-w-5xl h-[calc(100vh-6rem)] rounded-2xl overflow-hidden shadow-2xl border border-slate-300/80 dark:border-slate-800 bg-white"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
        >
          {/* Native PDF / Embed Reader Engine */}
          <iframe
            src={`${fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-full border-0"
            title={`Trình đọc trực tuyến: ${bookTitle}`}
          />
        </div>
      </main>
    </div>
  );
}
