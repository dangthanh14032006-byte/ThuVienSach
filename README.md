# Thư Viện Sách & Đọc Sách Online (Ebook Platform)

Nền tảng đọc sách trực tuyến và tải tài liệu Ebook (PDF, EPUB) được phát triển tương tự mô hình **thuviensach.vn**.

---

## 🚀 Các Tính Năng Đã Hoàn Thiện (MVP)

### 1. Phân Hệ Người Đọc (Reader Portal)
- **Trang chủ (`/`):** Hero banner, chuyên mục nổi bật, khối sách tiêu biểu và sách mới cập nhật.
- **Kho sách & Bộ lọc (`/sach`):** Lọc theo danh mục, định dạng (PDF/EPUB), tìm kiếm từ khóa theo tên sách và tác giả.
- **Trang chi tiết sách (`/sach/[slug]`):** Thông tin sách chi tiết, tác giả, nhà xuất bản, năm xuất bản, nút tải PDF/EPUB, sách tương tự cùng chuyên mục.
- **Trình đọc sách trực tuyến (`/doc-sach/[slug]`):** Đọc PDF trực tiếp, hỗ trợ đổi chế độ nền đọc (Sáng, Giấy cũ / Sepia, Đêm / Dark Mode), phóng to/thu nhỏ (Zoom), chế độ toàn màn hình.

### 2. Phân Hệ Quản Trị (Admin CMS Portal)
- **Bảng điều khiển (`/admin`):** Thống kê tổng số đầu sách, tổng lượt xem, tổng lượt tải về, số lượng tác giả.
- **Quản lý sách:** Bảng danh sách sách, thao tác xóa sách, xem trực tiếp ngoài trang độc giả.
- **Thêm sách mới:** Form nhập sách kèm tự động tạo slug chuẩn SEO, chọn tác giả, danh mục, liên kết ảnh bìa và file PDF.

---

## 🛠 Hướng Dẫn Chạy Dự Án

### 1. Cài đặt phụ thuộc & Database (Đã thực hiện sẵn)
```bash
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 2. Khởi chạy máy chủ phát triển (Development Server)
```bash
npm run dev
```
Mở trình duyệt truy cập:
* **Giao diện Người đọc:** [http://localhost:3000](http://localhost:3000)
* **Giao diện Quản trị (CMS):** [http://localhost:3000/admin](http://localhost:3000/admin)

### 3. Xem và chỉnh sửa cơ sở dữ liệu qua giao diện Prisma Studio
```bash
npx prisma studio
```
Truy cập [http://localhost:5555](http://localhost:5555) để xem trực tiếp các bảng dữ liệu.

---

## 📂 Cấu Trúc Dự Án

```text
├── prisma/
│   ├── schema.prisma      # Định nghĩa mô hình dữ liệu (SQLite / PostgreSQL)
│   └── seed.js            # Dữ liệu sách mẫu ban đầu
├── src/
│   ├── app/
│   │   ├── admin/         # Giao diện CMS Quản trị
│   │   ├── api/admin/     # API xử lý Thêm/Xóa sách
│   │   ├── doc-sach/      # Trình đọc sách trực tuyến
│   │   ├── sach/          # Danh mục & Chi tiết từng cuốn sách
│   │   ├── layout.tsx     # Layout chính (Header + Footer)
│   │   └── page.tsx       # Trang chủ
│   ├── components/        # Component tái sử dụng (Navbar, Footer, BookCard...)
│   └── lib/               # Prisma singleton client
```
