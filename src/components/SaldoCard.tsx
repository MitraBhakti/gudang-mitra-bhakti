import { formatRupiah } from "@/lib/utils";

export default function SaldoCard({
  balance,
  totalIncome,
  totalExpense,
}: {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}) {
  return (
    <div className="bg-primary text-white rounded-2xl p-6 sm:p-8">
      <p className="text-primary-light/80 text-sm mb-1.5">Saldo Kas Gudang Saat Ini</p>
      <p className="font-display text-4xl sm:text-5xl font-semibold tabular tracking-tight">
        {formatRupiah(balance)}
      </p>
      <div className="flex gap-6 mt-6 pt-5 border-t border-white/15">
        <div>
          <p className="text-xs text-primary-light/70 mb-1">Total Pemasukan</p>
          <p className="font-medium tabular">{formatRupiah(totalIncome)}</p>
        </div>
        <div>
          <p className="text-xs text-primary-light/70 mb-1">Total Pengeluaran</p>
          <p className="font-medium tabular">{formatRupiah(totalExpense)}</p>
        </div>
      </div>
    </div>
  );
}
