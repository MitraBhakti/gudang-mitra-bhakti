"use client";

import { useEffect, useState, useCallback } from "react";
import { formatRupiah } from "@/lib/utils";

type Item = { id: string; name: string; price: number; unit: string; isActive: boolean };

export default function PerkakasPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/items");
    setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(item: Item) {
    setEditingId(item.id);
    setName(item.name);
    setPrice(String(item.price));
    setUnit(item.unit);
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setPrice("");
    setUnit("pcs");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name, price: Number(price), unit };

    if (editingId) {
      await fetch(`/api/items/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    load();
  }

  async function toggleActive(item: Item) {
    await fetch(`/api/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-xl mb-1">Daftar Sewa Perkakas</h1>
        <p className="text-sm text-ink/50">
          Barang nonaktif tidak muncul di form pengajuan warga, tapi histori lama tetap tersimpan.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-paper-dark rounded-xl p-4 space-y-3"
      >
        <p className="text-sm font-medium">{editingId ? "Edit Barang" : "Tambah Barang Baru"}</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama barang"
            className="rounded-lg border border-paper-dark px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 sm:col-span-1"
          />
          <input
            required
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Harga (Rp)"
            className="rounded-lg border border-paper-dark px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Satuan (pcs / 100 pcs / hari / m²)"
            className="rounded-lg border border-paper-dark px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            {editingId ? "Simpan Perubahan" : "Tambah"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-ink/50 hover:text-ink px-3"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-ink/40 text-center py-12">Memuat...</p>
      ) : (
        <div className="border border-paper-dark rounded-xl bg-white divide-y divide-paper-dark overflow-hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 p-3.5 ${
                !item.isActive ? "opacity-40" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-ink/50">
                  {formatRupiah(item.price)} / {item.unit}
                </p>
              </div>
              <div className="flex gap-3 shrink-0 text-sm">
                <button onClick={() => startEdit(item)} className="text-primary hover:underline">
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(item)}
                  className={item.isActive ? "text-danger hover:underline" : "text-primary hover:underline"}
                >
                  {item.isActive ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
