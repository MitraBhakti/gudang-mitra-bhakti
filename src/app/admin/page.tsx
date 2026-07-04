import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SaldoCard from "@/components/SaldoCard";
import TransactionTable from "@/components/TransactionTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [transactions, pendingCount] = await Promise.all([
    prisma.transaction.findMany({ orderBy: { date: "desc" }, take: 8 }),
    prisma.loanRequest.count({ where: { status: "PENDING" } }),
  ]);

  const allTx = await prisma.transaction.findMany();
  const totalIncome = allTx.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense = allTx.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8">
      <SaldoCard balance={balance} totalIncome={totalIncome} totalExpense={totalExpense} />

      {pendingCount > 0 && (
        <Link
          href="/admin/pengajuan"
          className="block bg-accent-light border border-accent/20 rounded-xl p-4 hover:bg-accent-light/70 transition-colors"
        >
          <p className="text-sm font-medium text-accent-dark">
            {pendingCount} pengajuan peminjaman menunggu tinjauanmu →
          </p>
        </Link>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Transaksi Terbaru</h2>
          <Link href="/admin/transaksi" className="text-sm text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        <TransactionTable
          transactions={transactions.map((t) => ({ ...t, date: t.date.toISOString() }))}
        />
      </div>
    </div>
  );
}
