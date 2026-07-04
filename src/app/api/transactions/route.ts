import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: admin & warga bisa melihat seluruh riwayat transaksi (transparansi)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
  });

  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
  });

  const totalIncome = totals.find((t) => t.type === "INCOME")?._sum.amount ?? 0;
  const totalExpense = totals.find((t) => t.type === "EXPENSE")?._sum.amount ?? 0;
  const balance = totalIncome - totalExpense;

  return NextResponse.json({ transactions, totalIncome, totalExpense, balance });
}

// POST: hanya admin yang bisa mencatat transaksi manual (mis. pembelian barang, donasi, dll)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Hanya admin yang bisa mencatat transaksi" }, { status: 403 });
  }

  const body = await req.json();
  const { type, description, amount, date } = body as {
    type: "INCOME" | "EXPENSE";
    description: string;
    amount: number;
    date?: string;
  };

  if (!type || !description || !amount || amount <= 0) {
    return NextResponse.json({ error: "Data transaksi tidak lengkap" }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      type,
      description,
      amount,
      date: date ? new Date(date) : new Date(),
    },
  });

  return NextResponse.json(transaction, { status: 201 });
}
