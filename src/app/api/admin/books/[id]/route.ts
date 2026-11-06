import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.book.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Đã xóa sách thành công" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lỗi khi xóa sách" },
      { status: 500 }
    );
  }
}
