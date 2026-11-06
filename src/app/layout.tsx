import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";

export const metadata: Metadata = {
  title: "Thư Viện Sách Online - Đọc Sách & Ebook PDF Miễn Phí",
  description:
    "Thư viện sách số, đọc sách online, tải ebook PDF, EPUB miễn phí với hàng ngàn đầu sách chọn lọc kinh điển, kỹ năng sống, kinh tế và văn học.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Floating AI Librarian Chatbot Widget */}
        <ChatbotWidget />
      </body>
    </html>
  );
}
