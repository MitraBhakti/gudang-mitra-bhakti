import { formatRupiah, formatTanggal } from "@/lib/utils";

type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  description: string;
  amount: number;
  date: string;
};

export default function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-ink/40 text-sm">
        Belum ada transaksi yang tercatat.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr className="text-left text-ink/50 text-xs uppercase tracking-wide border-b border-paper-dark">
            <th className="py-2.5 px-4 sm:px-0 font-medium">Tanggal</th>
            <th className="py-2.5 px-4 font-medium">Keterangan</th>
            <th className="py-2.5 px-4 sm:px-0 font-medium text-right">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b border-paper-dark/60 last:border-0">
              <td className="py-3 px-4 sm:px-0 text-ink/60 whitespace-nowrap align-top">
                {formatTanggal(t.date)}
              </td>
              <td className="py-3 px-4 align-top">{t.description}</td>
              <td
                className={`py-3 px-4 sm:px-0 text-right tabular whitespace-nowrap align-top font-medium ${
                  t.type === "INCOME" ? "text-primary" : "text-danger"
                }`}
              >
                {t.type === "INCOME" ? "+" : "-"} {formatRupiah(t.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
