"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type NavLink = { href: string; label: string };

export default function Navbar({ role, links }: { role: "admin" | "warga"; links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-paper-dark bg-white/70 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-display font-semibold text-base truncate">Gudang Mitra Bhakti</span>
          <span className="text-xs text-ink/40 hidden sm:inline">
            {role === "admin" ? "Admin" : "Warga"}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-ink/50 hover:text-danger transition-colors shrink-0"
        >
          Keluar
        </button>
      </div>
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto pb-0">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
                active
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-ink/50 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
