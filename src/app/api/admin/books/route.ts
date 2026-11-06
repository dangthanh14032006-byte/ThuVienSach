import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      coverImage,
      publisher,
      publishYear,
      pageCount,
      authorId,
      categoryId,
      isFeatured,
      pdfUrl,
      fileSize,
    } = body;

    if (!title || !slug || !authorId || !categoryId) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ Tiêu đề, Slug, Tác giả và Danh mục" },
        { status: 400 }
      );
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        slug,
        description,
        coverImage: coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
        publisher,
        publishYear: publishYear ? parseInt(publishYear) : new Date().getFullYear(),
        pageCount: pageCount ? parseInt(pageCount) : 100,
        isFeatured: Boolean(isFeatured),
        authorId,
        categoryId,
        files: {
          create: [
            {
              format: "PDF",
              fileUrl: pdfUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              fileSize: fileSize ? parseInt(fileSize) : 5000000,
            },
          ],
        },
      },
    });

    return NextResponse.json({ success: true, book: newBook }, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi khi thêm sách:", error);
    return NextResponse.json(
      { error: error?.message || "Lỗi hệ thống khi tạo sách" },
      { status: 500 }
    );
  }
}
