import Navbar from "@/components/Navbar";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pengajuan", label: "Pengajuan" },
  { href: "/admin/transaksi", label: "Transaksi" },
  { href: "/admin/perkakas", label: "Daftar Perkakas" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar role="admin" links={links} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </>
  );
}
