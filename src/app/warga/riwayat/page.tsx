import { prisma } from "@/lib/prisma";
import LoanRequestTable from "@/components/LoanRequestTable";

export const dynamic = "force-dynamic";

export default async function RiwayatPage() {
  const requests = await prisma.loanRequest.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const serialized = requests.map((r) => ({
    ...r,
    eventDate: r.eventDate.toISOString(),
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="font-display font-semibold text-xl mb-1">Riwayat Pengajuan</h1>
      <p className="text-sm text-ink/50 mb-6">Ketuk salah satu untuk lihat detail barang.</p>
      <LoanRequestTable requests={serialized as any} />
    </div>
  );
}
