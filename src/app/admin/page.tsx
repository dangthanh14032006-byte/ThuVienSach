import { prisma } from "@/lib/prisma";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [books, authors, categories] = await Promise.all([
    prisma.book.findMany({
      include: { author: true, category: true, files: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalViews = books.reduce((sum, b) => sum + b.viewCount, 0);
  const totalDownloads = books.reduce((sum, b) => sum + b.downloadCount, 0);

  const stats = {
    totalBooks: books.length,
    totalViews,
    totalDownloads,
    totalAuthors: authors.length,
    totalCategories: categories.length,
  };

  return (
    <AdminDashboard
      initialBooks={books}
      authors={authors}
      categories={categories}
      stats={stats}
    />
  );
}
