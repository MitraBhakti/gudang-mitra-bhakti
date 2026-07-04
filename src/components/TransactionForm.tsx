"use client";

import { useState } from "react";

export default function TransactionForm({ onAdded }: { onAdded: () => void }) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, description, amount: Number(amount), date }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal menyimpan transaksi");
      return;
    }

    setDescription("");
    setAmount("");
    onAdded();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-paper-dark rounded-xl p-4 space-y-3"
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("EXPENSE")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === "EXPENSE" ? "bg-danger text-white" : "bg-danger-light text-danger"
          }`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => setType("INCOME")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === "INCOME" ? "bg-primary text-white" : "bg-primary-light text-primary"
          }`}
        >
          Pemasukan
        </button>
      </div>

      <input
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Keterangan (mis. Beli gorden baru)"
        className="w-full rounded-lg border border-paper-dark px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />

      <div className="flex gap-3">
        <input
          required
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Jumlah (Rp)"
          className="flex-1 rounded-lg border border-paper-dark px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
        <input
          required
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-paper-dark px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {error && <p className="text-sm text-danger bg-danger-light rounded-lg px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-ink text-white rounded-lg py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-60"
      >
        {submitting ? "Menyimpan..." : "Catat Transaksi"}
      </button>
    </form>
  );
}
