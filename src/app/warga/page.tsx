import { prisma } from "@/lib/prisma";
import SaldoCard from "@/components/SaldoCard";
import TransactionTable from "@/components/TransactionTable";

export const dynamic = "force-dynamic";

export default async function WargaDashboard() {
  const transactions = await prisma.transaction.findMany({ orderBy: { date: "desc" } });
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8">
      <SaldoCard balance={balance} totalIncome={totalIncome} totalExpense={totalExpense} />

      <div>
        <h2 className="font-display font-semibold text-lg mb-4">Riwayat Kas</h2>
        <TransactionTable
          transactions={transactions.map((t) => ({ ...t, date: t.date.toISOString() }))}
        />
      </div>
    </div>
  );
}
