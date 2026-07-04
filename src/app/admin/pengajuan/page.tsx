"use client";

import { useEffect, useState, useCallback } from "react";
import LoanRequestTable from "@/components/LoanRequestTable";

type LoanRequest = any;

const FILTERS = [
  { value: "ALL", label: "Semua" },
  { value: "PENDING", label: "Menunggu" },
  { value: "APPROVED", label: "Disetujui" },
  { value: "PAID", label: "Lunas" },
  { value: "REJECTED", label: "Ditolak" },
];

export default function PengajuanPage() {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/loan-requests");
    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div>
      <h1 className="font-display font-semibold text-xl mb-1">Pengajuan Peminjaman</h1>
      <p className="text-sm text-ink/50 mb-5">
        Setujui atau tolak pengajuan warga. Setelah lunas, tandai lunas agar tercatat otomatis di kas.
      </p>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? "bg-primary text-white"
                : "bg-white border border-paper-dark text-ink/60 hover:bg-paper-dark/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink/40 text-center py-12">Memuat...</p>
      ) : (
        <LoanRequestTable requests={filtered} isAdmin onChanged={load} />
      )}
    </div>
  );
}
