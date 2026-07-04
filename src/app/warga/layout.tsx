import Navbar from "@/components/Navbar";

const links = [
  { href: "/warga", label: "Transparansi" },
  { href: "/warga/ajukan", label: "Ajukan Peminjaman" },
  { href: "/warga/riwayat", label: "Riwayat Pengajuan" },
];

export default function WargaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar role="warga" links={links} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </>
  );
}
