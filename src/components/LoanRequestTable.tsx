"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah, formatTanggal, formatTanggalWaktu } from "@/lib/utils";
import StatusStempel from "./StatusStempel";

type LoanItem = { id: string; itemName: string; unit: string; qty: number; subtotal: number };
type LoanRequest = {
  id: string;
  borrowerName: string;
  phone: string | null;
  eventDate: string;
  notes: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  totalAmount: number;
  createdAt: string;
  rejectReason: string | null;
  items: LoanItem[];
};

export default function LoanRequestTable({
  requests,
  isAdmin = false,
  canDelete = false,
  onChanged,
}: {
  requests: LoanRequest[];
  isAdmin?: boolean;
  canDelete?: boolean;
  onChanged?: () => void;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  async function runAction(id: string, action: "approve" | "reject" | "markPaid", extra?: object) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/loan-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Gagal memproses pengajuan");
      } else {
        onChanged?.();
        router.refresh();
      }
    } finally {
      setBusyId(null);
      setRejectingId(null);
      setRejectReason("");
    }
  }

  async function handleDelete(id: string, borrowerName: string) {
    if (!confirm(`Hapus riwayat pengajuan "${borrowerName}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    setBusyId(id);
    try {
      const res = await fetch(`/api/loan-requests/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Gagal menghapus riwayat");
      } else {
        onChanged?.();
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  if (requests.length === 0) {
    return <div className="text-center py-12 text-ink/40 text-sm">Belum ada pengajuan.</div>;
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => {
        const expanded = expandedId === r.id;
        return (
          <div key={r.id} className="border border-paper-dark rounded-xl bg-white overflow-hidden">
            <button
              onClick={() => setExpandedId(expanded ? null : r.id)}
              className="w-full flex items-center justify-between gap-3 p-4 text-left"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{r.borrowerName}</p>
                <p className="text-xs text-ink/50 mt-0.5">
                  Dipakai {formatTanggal(r.eventDate)} · {formatRupiah(r.totalAmount)}
                </p>
              </div>
              <StatusStempel status={r.status} />
            </button>

            {expanded && (
              <div className="px-4 pb-4 pt-1 border-t border-paper-dark space-y-3">
                <ul className="text-sm text-ink/70 space-y-1 mt-3">
                  {r.items.map((it) => (
                    <li key={it.id} className="flex justify-between">
                      <span>
                        {it.itemName} × {it.qty} {it.unit}
                      </span>
                      <span className="tabular">{formatRupiah(it.subtotal)}</span>
                    </li>
                  ))}
                </ul>

                {r.phone && <p className="text-xs text-ink/50">Kontak: {r.phone}</p>}
                {r.notes && <p className="text-xs text-ink/50">Catatan: {r.notes}</p>}
                {r.rejectReason && (
                  <p className="text-xs text-danger">Alasan ditolak: {r.rejectReason}</p>
                )}
                <p className="text-xs text-ink/40">Diajukan {formatTanggalWaktu(r.createdAt)}</p>

                {isAdmin && r.status === "PENDING" && (
                  <div className="flex gap-2 pt-1">
                    <button
                      disabled={busyId === r.id}
                      onClick={() => runAction(r.id, "approve")}
                      className="flex-1 bg-primary text-white rounded-lg py-2 text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      Setujui
                    </button>
                    <button
                      disabled={busyId === r.id}
                      onClick={() => setRejectingId(rejectingId === r.id ? null : r.id)}
                      className="flex-1 bg-danger-light text-danger rounded-lg py-2 text-sm font-medium hover:bg-danger/10 transition-colors disabled:opacity-50"
                    >
                      Tolak
                    </button>
                  </div>
                )}

                {isAdmin && rejectingId === r.id && (
                  <div className="flex gap-2 pt-1">
                    <input
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Alasan penolakan (opsional)"
                      className="flex-1 rounded-lg border border-paper-dark px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button
                      disabled={busyId === r.id}
                      onClick={() => runAction(r.id, "reject", { rejectReason })}
                      className="bg-danger text-white rounded-lg px-3 text-sm font-medium disabled:opacity-50"
                    >
                      Kirim
                    </button>
                  </div>
                )}

                {isAdmin && r.status === "APPROVED" && (
                  <button
                    disabled={busyId === r.id}
                    onClick={() => runAction(r.id, "markPaid")}
                    className="w-full bg-accent text-white rounded-lg py-2 text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
                  >
                    Tandai Lunas (catat sebagai pemasukan)
                  </button>
                )}

                {canDelete && (
                  <button
                    disabled={busyId === r.id}
                    onClick={() => handleDelete(r.id, r.borrowerName)}
                    className="w-full bg-white border border-danger text-danger rounded-lg py-2 text-sm font-medium hover:bg-danger-light transition-colors disabled:opacity-50"
                  >
                    {busyId === r.id ? "Menghapus..." : "🗑️ Hapus Riwayat"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
