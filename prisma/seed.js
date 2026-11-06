const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing data
  await prisma.comment.deleteMany({});
  await prisma.readingHistory.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.bookFile.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.author.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Admin User
  const admin = await prisma.user.create({
    data: {
      name: "Quản Trị Viên",
      email: "admin@thuviensach.vn",
      password: "admin123_change_me",
      role: "ADMIN",
    },
  });

  // 3. Create Categories
  const catKyNang = await prisma.category.create({
    data: {
      name: "Kỹ Năng Sống",
      slug: "ky-nang-song",
      description: "Sách phát triển bản thân, kỹ năng giao tiếp và tư duy thành công",
      icon: "Sparkles",
    },
  });

  const catVanHoc = await prisma.category.create({
    data: {
      name: "Văn Học - Tiểu Thuyết",
      slug: "van-hoc-tieu-thuyet",
      description: "Tiểu thuyết kinh điển, văn học thế giới và Việt Nam",
      icon: "BookOpen",
    },
  });

  const catKinhTe = await prisma.category.create({
    data: {
      name: "Kinh Tế - Khởi Nghiệp",
      slug: "kinh-te-khoi-nghiep",
      description: "Quản trị kinh doanh, tài chính cá nhân và đầu tư",
      icon: "TrendingUp",
    },
  });

  // 4. Create Authors
  const authorDale = await prisma.author.create({
    data: {
      name: "Dale Carnegie",
      slug: "dale-carnegie",
      bio: "Nhà văn và nhà thuyết trình người Mỹ, người phát triển các lớp học nổi tiếng về tự cải thiện bản thân.",
      avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop",
    },
  });

  const authorPaulo = await prisma.author.create({
    data: {
      name: "Paulo Coelho",
      slug: "paulo-coelho",
      bio: "Tiểu thuyết gia nổi tiếng người Brazil, tác giả cuốn sách kinh điển Nhà Giả Kim.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
  });

  const authorRobert = await prisma.author.create({
    data: {
      name: "Robert Kiyosaki",
      slug: "robert-kiyosaki",
      bio: "Tác giả, doanh nhân và nhà đầu tư người Mỹ, tác giả loạt sách Cha Giàu Cha Nghèo.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    },
  });

  // 5. Create Sample Books
  const book1 = await prisma.book.create({
    data: {
      title: "Đắc Nhân Tâm (How to Win Friends and Influence People)",
      slug: "dac-nhan-tam",
      description: "Đắc Nhân Tâm là cuốn sách kinh điển về nghệ thuật ứng xử và thu phục lòng người của Dale Carnegie. Tác phẩm đã được dịch ra hầu hết các ngôn ngữ trên thế giới và liên tục đứng đầu danh mục sách bán chạy nhất của The New York Times.",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      publisher: "NXB Tổng Hợp TP.HCM",
      publishYear: 2021,
      pageCount: 320,
      status: "PUBLISHED",
      isFeatured: true,
      viewCount: 15420,
      downloadCount: 3890,
      ratingAvg: 4.9,
      ratingCount: 182,
      authorId: authorDale.id,
      categoryId: catKyNang.id,
      files: {
        create: [
          {
            format: "PDF",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: 14500000,
          },
          {
            format: "EPUB",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: 4200000,
          },
        ],
      },
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: "Nhà Giả Kim (The Alchemist)",
      slug: "nha-gia-kim",
      description: "Tất cả những trải nghiệm trong chuyến phiêu lưu theo đuổi vận mệnh của chàng chăn cừu Santiago đã giúp cậu thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc, sự hòa hợp với vũ trụ và con người.",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      publisher: "NXB Văn Học",
      publishYear: 2020,
      pageCount: 228,
      status: "PUBLISHED",
      isFeatured: true,
      viewCount: 24890,
      downloadCount: 7120,
      ratingAvg: 4.8,
      ratingCount: 295,
      authorId: authorPaulo.id,
      categoryId: catVanHoc.id,
      files: {
        create: [
          {
            format: "PDF",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: 9800000,
          },
        ],
      },
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: "Dạy Con Làm Giàu - Tập 1 (Cha Giàu Cha Nghèo)",
      slug: "day-con-lam-giau-tap-1",
      description: "Cuốn sách mở đầu loạt sách kinh điển về giáo dục tài chính của Robert Kiyosaki, làm sáng tỏ sự khác biệt trong tư duy kiếm tiền và đầu tư giữa người giàu, người nghèo và tầng lớp trung lưu.",
      coverImage: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&auto=format&fit=crop&q=80",
      publisher: "NXB Trẻ",
      publishYear: 2022,
      pageCount: 304,
      status: "PUBLISHED",
      isFeatured: true,
      viewCount: 18900,
      downloadCount: 5200,
      ratingAvg: 4.7,
      ratingCount: 140,
      authorId: authorRobert.id,
      categoryId: catKinhTe.id,
      files: {
        create: [
          {
            format: "PDF",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            fileSize: 12300000,
          },
        ],
      },
    },
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
