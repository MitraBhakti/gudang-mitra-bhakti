"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/utils";

type Item = { id: string; name: string; price: number; unit: string; isActive: boolean };

export default function LoanRequestForm() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
  const [borrowerName, setBorrowerName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/items")
      .then((r) => r.json())
      .then((data: Item[]) => setItems(data.filter((i) => i.isActive)));
  }, []);

  function toggleItem(id: string, checked: boolean) {
    setQtyMap((prev) => {
      const next = { ...prev };
      if (checked) next[id] = next[id] || 1;
      else delete next[id];
      return next;
    });
  }

  function setQty(id: string, qty: number) {
    setQtyMap((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  }

  const selectedItems = Object.entries(qtyMap).map(([itemId, qty]) => {
    const item = items.find((i) => i.id === itemId)!;
    return { itemId, qty, item };
  });
  const total = selectedItems.reduce((sum, s) => sum + (s.item?.price ?? 0) * s.qty, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (selectedItems.length === 0) {
      setError("Pilih minimal 1 barang yang ingin dipinjam.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/loan-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        borrowerName,
        phone,
        eventDate,
        notes,
        items: selectedItems.map((s) => ({ itemId: s.itemId, qty: s.qty })),
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal mengirim pengajuan");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/warga/riwayat"), 1200);
  }

  if (success) {
    return (
      <div className="text-center py-16">
        <div className="stempel stempel-approved mb-3 inline-flex">Terkirim</div>
        <p className="text-ink/60">Pengajuan berhasil dikirim, menunggu persetujuan admin.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Nama Peminjam</label>
          <input
            required
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
            className="w-full rounded-lg border border-paper-dark px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Nama warga"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">No. HP (opsional)</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-paper-dark px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Tanggal Dipakai</label>
          <input
            required
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded-lg border border-paper-dark px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Catatan (opsional)</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-paper-dark px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Acara pernikahan, dsb."
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Pilih Barang</p>
        <div className="border border-paper-dark rounded-xl divide-y divide-paper-dark overflow-hidden">
          {items.map((item) => {
            const checked = item.id in qtyMap;
            return (
              <label
                key={item.id}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                  checked ? "bg-primary-light" : "bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => toggleItem(item.id, e.target.checked)}
                  className="w-4 h-4 accent-primary shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-ink/50">
                    {formatRupiah(item.price)} / {item.unit}
                  </p>
                </div>
                {checked && (
                  <input
                    type="number"
                    min={1}
                    value={qtyMap[item.id]}
                    onChange={(e) => setQty(item.id, parseInt(e.target.value) || 1)}
                    onClick={(e) => e.preventDefault()}
                    className="w-16 rounded-lg border border-paper-dark px-2 py-1.5 text-sm text-center tabular"
                  />
                )}
              </label>
            );
          })}
          {items.length === 0 && (
            <p className="text-sm text-ink/40 p-4">Memuat daftar barang...</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between bg-accent-light rounded-xl px-4 py-3.5">
        <span className="text-sm font-medium text-accent-dark">Total Biaya Sewa</span>
        <span className="font-display font-semibold text-lg text-accent-dark tabular">
          {formatRupiah(total)}
        </span>
      </div>

      {error && <p className="text-sm text-danger bg-danger-light rounded-lg px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white rounded-lg py-3 font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {submitting ? "Mengirim..." : "Ajukan Peminjaman"}
      </button>
    </form>
  );
}
