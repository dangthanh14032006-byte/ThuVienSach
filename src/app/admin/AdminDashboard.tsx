"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Eye,
  Download,
  Users,
  PlusCircle,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Database,
  ArrowLeft,
} from "lucide-react";

interface Props {
  initialBooks: any[];
  authors: any[];
  categories: any[];
  stats: {
    totalBooks: number;
    totalViews: number;
    totalDownloads: number;
    totalAuthors: number;
    totalCategories: number;
  };
}

export default function AdminDashboard({
  initialBooks,
  authors,
  categories,
  stats,
}: Props) {
  const [books, setBooks] = useState(initialBooks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    authorId: authors[0]?.id || "",
    categoryId: categories[0]?.id || "",
    publisher: "NXB Tổng Hợp",
    publishYear: new Date().getFullYear().toString(),
    pageCount: "250",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    isFeatured: true,
  });

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setFormData((prev) => ({ ...prev, title: val, slug }));
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Thất bại khi thêm sách vào PostgreSQL");

      setMessage({
        type: "success",
        text: "Thêm sách mới thành công! Dữ liệu đã được lưu trực tiếp vào PostgreSQL trên Supabase.",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBook = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa cuốn sách "${title}" khỏi PostgreSQL?`)) return;

    try {
      const res = await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
        setMessage({ type: "success", text: `Đã xóa cuốn sách "${title}" khỏi cơ sở dữ liệu.` });
      }
    } catch (e) {
      alert("Không thể xóa sách, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Bảng Điều Khiển Quản Trị Hệ Thống (CMS)
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Database className="w-3 h-3" />
                  PostgreSQL Supabase [Đang kết nối]
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Xem Trang Web
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Thêm Sách Mới
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2 text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Real-time KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tổng Đầu Sách</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{stats.totalBooks}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Đã lưu trong PostgreSQL</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tổng Lượt Xem</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {stats.totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-teal-600 font-semibold mt-1">Lượt đọc trực tuyến</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tổng Lượt Tải Về</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {stats.totalDownloads.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">PDF & EPUB đã tải</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tác Giả / Chuyên Mục</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {stats.totalAuthors} / {stats.totalCategories}
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1">Đang phân loại</div>
        </div>
      </div>

      {/* Book Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-slate-900 text-sm">Kho Sách Trong PostgreSQL</h2>
          <span className="text-xs text-slate-400 font-medium">Hiện có {books.length} cuốn sách</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Tác Phẩm</th>
                <th className="py-3 px-4">Tác Giả</th>
                <th className="py-3 px-4">Chuyên Mục</th>
                <th className="py-3 px-4 text-center">Lượt Đọc</th>
                <th className="py-3 px-4 text-center">Lượt Tải</th>
                <th className="py-3 px-4 text-center">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100"}
                        alt={book.title}
                        className="w-10 h-13 object-cover rounded-lg shadow-xs shrink-0"
                      />
                      <div className="max-w-xs">
                        <span className="font-bold text-slate-900 block truncate">{book.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{book.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{book.author?.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {book.category?.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium">{book.viewCount}</td>
                  <td className="py-3 px-4 text-center font-mono font-medium">{book.downloadCount}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px]">
                      {book.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/sach/${book.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl hover:bg-slate-200 text-slate-600 transition"
                        title="Xem ngoài web"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteBook(book.id, book.title)}
                        className="p-2 rounded-xl hover:bg-rose-100 text-rose-600 transition"
                        title="Xóa sách"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                Thêm Sách Mới Vào PostgreSQL
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tiêu đề sách *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Tuổi Trẻ Đáng Giá Bao Nhiêu"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Đường dẫn tĩnh (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-xl bg-slate-50 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tác giả *</label>
                  <select
                    value={formData.authorId}
                    onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-xl bg-white"
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chuyên mục *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-xl bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mô tả / Tóm tắt nội dung
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Giới thiệu tác phẩm..."
                  className="w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    URL Ảnh bìa (Cover Image)
                  </label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Đường dẫn File PDF (S3/R2/URL)
                  </label>
                  <input
                    type="url"
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="featured" className="font-semibold text-slate-700 cursor-pointer">
                  Đánh dấu là Sách Tiêu Biểu (Hiển thị spotlight trang chủ)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-md transition"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu Vào PostgreSQL"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
