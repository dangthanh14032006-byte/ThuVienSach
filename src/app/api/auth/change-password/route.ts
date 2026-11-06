import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, verifyPassword, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để thực hiện đổi mật khẩu" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu mới phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Mật khẩu mới và xác nhận mật khẩu không trùng khớp" },
        { status: 400 }
      );
    }

    // Query user directly from PostgreSQL on Supabase
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy thông tin tài khoản trong cơ sở dữ liệu" },
        { status: 404 }
      );
    }

    // Verify current password
    const isCorrect = verifyPassword(currentPassword, user.password);
    if (!isCorrect) {
      return NextResponse.json(
        { error: "Mật khẩu hiện tại không chính xác" },
        { status: 400 }
      );
    }

    // Update new password in PostgreSQL
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashPassword(newPassword),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Đổi mật khẩu thành công! Mật khẩu mới đã được cập nhật vào PostgreSQL.",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: error?.message || "Lỗi hệ thống khi cập nhật mật khẩu" },
      { status: 500 }
    );
  }
}
