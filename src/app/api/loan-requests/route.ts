import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: admin & warga bisa melihat semua pengajuan (transparan, 1 akun warga dipakai bersama)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const loanRequests = await prisma.loanRequest.findMany({
    where: { isDeleted: false },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(loanRequests);
}

// POST: warga (atau admin) mengajukan peminjaman perkakas
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const body = await req.json();
  const { borrowerName, phone, eventDate, notes, items } = body as {
    borrowerName: string;
    phone?: string;
    eventDate: string;
    notes?: string;
    items: { itemId: string; qty: number }[];
  };

  if (!borrowerName || !eventDate || !items || items.length === 0) {
    return NextResponse.json(
      { error: "Nama peminjam, tanggal pakai, dan minimal 1 barang wajib diisi" },
      { status: 400 }
    );
  }

  // Ambil harga asli dari database, jangan percaya harga dari client
  const itemIds = items.map((i) => i.itemId);
  const dbItems = await prisma.item.findMany({ where: { id: { in: itemIds } } });

  if (dbItems.length !== itemIds.length) {
    return NextResponse.json({ error: "Ada barang yang tidak ditemukan" }, { status: 400 });
  }

  const loanItemsData = items.map((reqItem) => {
    const dbItem = dbItems.find((d) => d.id === reqItem.itemId)!;
    const qty = Math.max(1, Math.floor(reqItem.qty));
    return {
      itemId: dbItem.id,
      itemName: dbItem.name,
      price: dbItem.price,
      unit: dbItem.unit,
      qty,
      subtotal: dbItem.price * qty,
    };
  });

  const totalAmount = loanItemsData.reduce((sum, i) => sum + i.subtotal, 0);

  const loanRequest = await prisma.loanRequest.create({
    data: {
      borrowerName,
      phone,
      eventDate: new Date(eventDate),
      notes,
      totalAmount,
      items: { create: loanItemsData },
    },
    include: { items: true },
  });

  return NextResponse.json(loanRequest, { status: 201 });
}
