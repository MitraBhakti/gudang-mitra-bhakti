import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Hanya admin yang bisa mengubah barang" }, { status: 403 });
  }

  const body = await req.json();
  const { name, price, unit, isActive } = body;

  const item = await prisma.item.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(unit !== undefined && { unit }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Hanya admin yang bisa menghapus barang" }, { status: 403 });
  }

  // Nonaktifkan saja daripada dihapus permanen, supaya histori pengajuan lama tetap utuh
  const item = await prisma.item.update({
    where: { id: params.id },
    data: { isActive: false },
  });

  return NextResponse.json(item);
}
