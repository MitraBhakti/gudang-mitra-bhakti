"use client";

import { useEffect, useState, useCallback } from "react";
import TransactionTable from "@/components/TransactionTable";
import TransactionForm from "@/components/TransactionForm";
import { formatRupiah } from "@/lib/utils";

export default function TransaksiPage() {
  const [data, setData] = useState<{
    transactions: any[];
    totalIncome: number;
    totalExpense: number;
    balance: number;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/transactions");
    setData(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-semibold text-xl">Buku Kas</h1>
          {data && (
            <p className="text-sm text-ink/50 mt-0.5">
              Saldo: <span className="font-medium text-ink">{formatRupiah(data.balance)}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors shrink-0"
        >
          {showForm ? "Tutup" : "+ Catat Transaksi"}
        </button>
      </div>

      {showForm && (
        <TransactionForm
          onAdded={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      {data ? (
        <TransactionTable transactions={data.transactions} />
      ) : (
        <p className="text-sm text-ink/40 text-center py-12">Memuat...</p>
      )}
    </div>
  );
}
