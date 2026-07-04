import LoanRequestForm from "@/components/LoanRequestForm";

export default function AjukanPage() {
  return (
    <div>
      <h1 className="font-display font-semibold text-xl mb-1">Ajukan Peminjaman Perkakas</h1>
      <p className="text-sm text-ink/50 mb-6">
        Pilih barang yang ingin dipinjam, lalu kirim. Admin akan meninjau pengajuanmu.
      </p>
      <LoanRequestForm />
    </div>
  );
}
