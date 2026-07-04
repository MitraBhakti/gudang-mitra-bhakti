import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatTanggal } from "@/lib/utils";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Hanya admin yang bisa memproses pengajuan" }, { status: 403 });
  }

  const body = await req.json();
  const { action, rejectReason } = body as {
    action: "approve" | "reject" | "markPaid";
    rejectReason?: string;
  };

  const loanRequest = await prisma.loanRequest.findUnique({ where: { id: params.id } });
  if (!loanRequest) {
    return NextResponse.json({ error: "Pengajuan tidak ditemukan" }, { status: 404 });
  }

  if (action === "approve") {
    if (loanRequest.status !== "PENDING") {
      return NextResponse.json({ error: "Pengajuan sudah diproses sebelumnya" }, { status: 400 });
    }
    const updated = await prisma.loanRequest.update({
      where: { id: params.id },
      data: { status: "APPROVED", approvedAt: new Date() },
    });
    return NextResponse.json(updated);
  }

  if (action === "reject") {
    if (loanRequest.status !== "PENDING") {
      return NextResponse.json({ error: "Pengajuan sudah diproses sebelumnya" }, { status: 400 });
    }
    const updated = await prisma.loanRequest.update({
      where: { id: params.id },
      data: { status: "REJECTED", rejectedAt: new Date(), rejectReason: rejectReason ?? null },
    });
    return NextResponse.json(updated);
  }

  if (action === "markPaid") {
    if (loanRequest.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Pengajuan harus disetujui dulu sebelum ditandai lunas" },
        { status: 400 }
      );
    }

    const [updated] = await prisma.$transaction([
      prisma.loanRequest.update({
        where: { id: params.id },
        data: { status: "PAID", paidAt: new Date() },
      }),
      prisma.transaction.create({
        data: {
          type: "INCOME",
          description: `Sewa perkakas - ${loanRequest.borrowerName} (dipakai ${formatTanggal(
            loanRequest.eventDate
          )})`,
          amount: loanRequest.totalAmount,
          loanRequestId: loanRequest.id,
        },
      }),
    ]);

    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Aksi tidak dikenali" }, { status: 400 });
}
