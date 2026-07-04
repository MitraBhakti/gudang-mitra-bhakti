import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: semua warga & admin boleh melihat daftar barang (untuk form pengajuan)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const items = await prisma.item.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(items);
}

// POST: hanya admin yang boleh menambah barang baru
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Hanya admin yang bisa menambah barang" }, { status: 403 });
  }

  const body = await req.json();
  const { name, price, unit } = body;

  if (!name || typeof price !== "number" || price <= 0 || !unit) {
    return NextResponse.json({ error: "Data barang tidak lengkap" }, { status: 400 });
  }

  const item = await prisma.item.create({
    data: { name, price, unit },
  });

  return NextResponse.json(item, { status: 201 });
}
