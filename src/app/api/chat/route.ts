import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Blacklist keywords for security guardrail
const BLOCKED_KEYWORDS = [
  "mat khau",
  "mật khẩu",
  "password",
  "passwd",
  "admin",
  "quan tri",
  "quản trị",
  "token",
  "jwt",
  "secret",
  "hash",
  "pbkdf2",
  "database_url",
  "supabase",
  "connstring",
  "tai khoan cua",
  "tài khoản của",
  "email cua",
  "email của",
  "danh sach user",
  "danh sách user",
  "danh sach nguoi dung",
  "danh sách người dùng",
  "hack",
  "inject",
  "xoa sach",
  "xóa sách",
  "bo qua chi dan",
  "bỏ qua chỉ dẫn",
  "ignore previous instructions",
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Vui lòng nhập nội dung câu hỏi" },
        { status: 400 }
      );
    }

    const cleanInput = message.toLowerCase().trim();

    // =========================================================================
    // TẦNG 1: KIỂM SOÁT BẢO MẬT (SECURITY GUARDRAIL)
    // Chặn tuyệt đối câu hỏi về mật khẩu, tài khoản người dùng và quản trị hệ thống
    // =========================================================================
    const isViolated = BLOCKED_KEYWORDS.some((kw) => cleanInput.includes(kw));

    if (isViolated) {
      return NextResponse.json({
        reply:
          "Xin lỗi bạn, tôi là **Thủ Thư AI** của thư viện và chỉ có nhiệm vụ hỗ trợ tìm kiếm tác phẩm, giới thiệu nội dung tóm tắt và hướng dẫn đọc sách. 🔒 **Tôi tuyệt đối không được phép cung cấp hoặc thảo luận về thông tin tài khoản, mật khẩu hay phạm vi quản trị hệ thống.**",
        securityBlocked: true,
      });
    }

    // =========================================================================
    // TẦNG 2: TRUY VẤN DỮ LIỆU THỜI GIAN THỰC TỪ POSTGRESQL (SUPABASE)
    // =========================================================================
    const books = await prisma.book.findMany({
      where: { status: "PUBLISHED" },
      include: { author: true, category: true, files: true },
      take: 20,
    });

    const categories = await prisma.category.findMany();

    // =========================================================================
    // TẦNG 3: BỘ MÁY XỬ LÝ TRẢ LỜI KIẾN THỨC (KNOWLEDGE ENGINE)
    // =========================================================================

    // If Gemini API Key is configured in environment, use Gemini
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey && geminiKey !== "khoa_cua_ban" && geminiKey.trim().length > 10) {
      try {
        const systemPrompt = `
Bạn là "Thủ Thư AI" - Trợ lý thông minh, am hiểu sách và thân thiện của website Thư Viện Sách Online.

DỮ LIỆU KHO SÁCH HIỆN CÓ TRONG POSTGRESQL (SUPABASE):
${books
  .map(
    (b) =>
      `- Tên sách: "${b.title}" | Tác giả: ${b.author.name} | Thể loại: ${b.category.name} | Link đọc online: /doc-sach/${b.slug} | Chi tiết: /sach/${b.slug} | Đánh giá: ${b.ratingAvg}/5 | Tóm tắt: ${b.description}`
  )
  .join("\n")}

DANH MỤC THỂ LOẠI: ${categories.map((c) => c.name).join(", ")}.

QUY TẮC CỐT LÕI VÀ BẢO MẬT:
1. Bạn chỉ trả lời các câu hỏi về sách, gợi ý tác phẩm, tóm tắt và hướng dẫn đọc sách dựa trên dữ liệu thư viện có ở trên.
2. TUYỆT ĐỐI KHÔNG tiết lộ mật khẩu, tài khoản, email người dùng, hash, hay bất kỳ thông tin nào về quản trị viên/admin.
3. Khi gợi ý sách, bạn PHẢI đính kèm link đọc trực tuyến định dạng markdown [Đọc sách online](/doc-sach/slug).
`;

        // Use Google Gemini 3.5 Flash with fallback to Gemini 3.1 Flash Lite
        const models = ["models/gemini-3.5-flash", "models/gemini-3.1-flash-lite"];
        let aiText = "";

        for (const model of models) {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: `${systemPrompt}\n\nĐộc giả hỏi: "${message}"` }],
                  },
                ],
              }),
            }
          );

          if (response.ok) {
            const aiData = await response.json();
            aiText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiText) break;
          }
        }

        if (aiText) {
          return NextResponse.json({ reply: aiText });
        }
      } catch (geminiError) {
        console.error("Gemini API Error, falling back to local engine:", geminiError);
      }
    }

    // Fallback Grounded Intelligence Engine (Hoạt động ngay cả khi chưa gắn API Key ngoài)
    let reply = "";

    // 1. Search by book name
    const matchedBook = books.find((b) =>
      cleanInput.includes(b.title.toLowerCase()) ||
      b.title.toLowerCase().includes(cleanInput) ||
      cleanInput.includes(b.author.name.toLowerCase())
    );

    // 2. Search by category
    const matchedCat = categories.find((c) =>
      cleanInput.includes(c.name.toLowerCase()) ||
      cleanInput.includes(c.slug.toLowerCase())
    );

    if (cleanInput.includes("chao") || cleanInput.includes("chào") || cleanInput.includes("hello") || cleanInput.includes("hi")) {
      reply = `Xin chào bạn! 👋 Tôi là **Thủ Thư AI** của Thư Viện Sách Online. 

Tôi có thể giúp bạn:
- 🔍 Tìm kiếm các tác phẩm theo tên sách, tác giả hoặc thể loại yêu thích.
- 📖 Tóm tắt nội dung các cuốn sách kinh điển có trong thư viện.
- ⚡ Cung cấp đường link đọc sách online hoặc tải ebook PDF/EPUB miễn phí.

Hôm nay bạn muốn tìm cuốn sách nào?`;
    } else if (cleanInput.includes("doc nhu the nao") || cleanInput.includes("đọc như thế nào") || cleanInput.includes("huong dan") || cleanInput.includes("hướng dẫn")) {
      reply = `Để đọc sách trực tuyến trên thư viện, bạn chỉ cần thực hiện 2 bước rất đơn giản:

1. Chọn cuốn sách bạn yêu thích từ trang chủ hoặc mục [Kho Sách](/sach).
2. Nhấn vào nút xanh **"Đọc Sách Online Ngay"**.

Trình đọc sách hỗ trợ:
- Đổi màu nền (Sáng, Giấy cổ Sepia dịu mắt, Chế độ ban đêm Slate).
- Thu phóng trang (Zoom in/out) và chế độ xem Toàn Màn Hình. Bạn cũng có thể bấm **Tải PDF** để lưu về đọc offline nhé!`;
    } else if (matchedBook) {
      reply = `Dạ, thư viện hiện đang có cuốn sách **"${matchedBook.title}"** của tác giả **${matchedBook.author.name}**!

📌 **Thông tin tác phẩm:**
- **Thể loại:** ${matchedBook.category.name}
- **Đánh giá:** ★ ${matchedBook.ratingAvg.toFixed(1)}/5 (${matchedBook.viewCount.toLocaleString()} lượt đọc)
- **Tóm tắt:** ${matchedBook.description || "Tác phẩm kinh điển được đông đảo độc giả yêu thích."}

👉 Bạn có thể:
- [📖 Bấm vào đây để Đọc Sách Online ngay](/doc-sach/${matchedBook.slug})
- [📄 Xem trang Chi tiết & Tải PDF](/sach/${matchedBook.slug})`;
    } else if (matchedCat) {
      const catBooks = books.filter((b) => b.categoryId === matchedCat.id);
      reply = `Trong chuyên mục **"${matchedCat.name}"**, thư viện hiện có các tác phẩm tiêu biểu sau:

${catBooks
  .map(
    (b, i) =>
      `${i + 1}. **[${b.title}](/sach/${b.slug})** - Tác giả: ${b.author.name} (★ ${b.ratingAvg.toFixed(1)})`
  )
  .join("\n")}

Bạn có muốn tôi giới thiệu chi tiết hoặc mở đọc cuốn nào trong số này không?`;
    } else if (cleanInput.includes("sach hay") || cleanInput.includes("sách hay") || cleanInput.includes("goi y") || cleanInput.includes("gợi ý") || cleanInput.includes("khuyen doc") || cleanInput.includes("khuyên đọc")) {
      const topBooks = [...books].sort((a, b) => b.viewCount - a.viewCount).slice(0, 3);
      reply = `Dưới đây là **Top 3 cuốn sách được đọc nhiều nhất** trong thư viện hiện tại:

${topBooks
  .map(
    (b, i) =>
      `${i + 1}. **[${b.title}](/sach/${b.slug})** - ${b.author.name}\n   *Thể loại:* ${b.category.name} | *Lượt đọc:* ${b.viewCount.toLocaleString()}`
  )
  .join("\n\n")}

Bạn hãy chọn một cuốn để tôi mở trình đọc trực tuyến cho bạn nhé!`;
    } else {
      reply = `Tôi đã tìm kiếm trong kho sách PostgreSQL với từ khóa của bạn. Hiện tại thư viện đang có sẵn các tác phẩm nổi bật:

${books
  .slice(0, 3)
  .map((b) => `• **[${b.title}](/sach/${b.slug})** của tác giả *${b.author.name}*`)
  .join("\n")}

Bạn có thể tìm cụ thể hơn theo tên sách, tác giả (ví dụ: *Dale Carnegie*, *Paulo Coelho*) hoặc yêu cầu tôi tóm tắt cuốn bạn quan tâm nhé!`;
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Lỗi kết nối với Thủ Thư AI. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
