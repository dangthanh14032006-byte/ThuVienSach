import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ReaderViewer from "./ReaderViewer";

interface Props {
  params: {
    slug: string;
  };
}

export default async function ReadBookPage({ params }: Props) {
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

  const pdfFile = book.files.find((f) => f.format === "PDF") || book.files[0];

  return (
    <ReaderViewer
      bookTitle={book.title}
      bookSlug={book.slug}
      authorName={book.author.name}
      fileUrl={pdfFile?.fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
      downloadUrl={pdfFile?.fileUrl}
    />
  );
}
