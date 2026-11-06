"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  ShieldCheck,
  Menu,
  X,
  User,
  LogOut,
  KeyRound,
  ChevronDown,
  Sparkles,
  Compass,
  Bookmark,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check session on mount with no-store cache
    fetch("/api/auth/me", { cache: "no-store", credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});

    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    setUserDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/sach?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-all duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                  Thư Viện Sách
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  PRO
                </span>
              </div>
              <span className="block text-[10px] text-slate-400 font-semibold tracking-wider -mt-0.5">
                TRI THỨC MỞ CHO NGƯỜI VIỆT
              </span>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <input
              type="text"
              placeholder="Tìm theo tên tác phẩm, tác giả, thể loại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 text-xs bg-slate-100/80 border border-slate-200 rounded-full focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-800 placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 group-focus-within:text-emerald-600 transition" />
            <kbd className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-xs">
              ↵ Enter
            </kbd>
          </form>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/sach"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition"
            >
              Tất Cả Sách
            </Link>
            <Link
              href="/sach?format=PDF"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition"
            >
              Kho PDF
            </Link>
            <Link
              href="/sach?category=ky-nang-song"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition"
            >
              Kỹ Năng
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-2" />

            {/* User Account / Auth Section */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-emerald-500 bg-white shadow-xs transition group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-slate-800 leading-tight max-w-[100px] truncate">
                      {currentUser.name}
                    </span>
                    <span className="block text-[9px] text-emerald-600 font-semibold leading-none">
                      {currentUser.role === "ADMIN" ? "Quản Trị" : "Độc Giả"}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/tai-khoan"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-medium transition"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>Hồ Sơ & Đổi Mật Khẩu</span>
                      </Link>

                      {currentUser.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-medium transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          <span>Bảng Quản Trị (CMS)</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 font-semibold transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng Xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold px-4 py-2.5 rounded-full text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition"
                >
                  Đăng Nhập
                </Link>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-full bg-slate-900 text-white hover:bg-emerald-700 shadow-sm transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quản Trị CMS</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              placeholder="Tìm kiếm tác phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 border rounded-lg focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="flex flex-col space-y-1">
            <Link href="/" className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">
              Trang Chủ
            </Link>
            <Link href="/sach" className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">
              Toàn Bộ Kho Sách
            </Link>
            <Link href="/sach?format=PDF" className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">
              Sách Điện Tử PDF
            </Link>

            {currentUser ? (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <Link
                  href="/tai-khoan"
                  className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Hồ Sơ & Đổi Mật Khẩu ({currentUser.name})
                </Link>
                {currentUser.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Bảng Quản Trị (CMS)
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                >
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <Link href="/login" className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg block">
                  Đăng Nhập / Đăng Ký Độc Giả
                </Link>
                <Link href="/admin/login" className="px-3 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Cổng Quản Trị Hệ Thống
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
