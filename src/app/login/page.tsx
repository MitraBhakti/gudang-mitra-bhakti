"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Username atau password salah.");
      return;
    }

    // Ambil session untuk tahu role, lalu arahkan ke dashboard yang sesuai
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    router.push(session?.user?.role === "admin" ? "/admin" : "/warga");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="stempel stempel-approved mb-4">Buku Kas Terbuka</div>
          <h1 className="font-display text-2xl font-semibold leading-snug">
            Gudang Mitra Bhakti
          </h1>
          <p className="text-sm text-ink/60 mt-1">Dukuh Prosutan</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-paper-dark rounded-xl p-6 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-paper-dark px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              placeholder="admin / warga"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-paper-dark px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-danger bg-danger-light rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg py-2.5 font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-xs text-ink/40 mt-6">
          Satu akun warga dipakai bersama seluruh warga Dukuh Prosutan.
        </p>
      </div>
    </main>
  );
}
