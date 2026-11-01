"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function DaftarPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }

    setSubmitting(true);

    try {
      await signUp(name.trim(), email.trim(), password);
      setSuccess(true);
      toast.success("Pendaftaran berhasil!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Pendaftaran gagal. Silakan coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10 md:px-6">
      <div className="w-full rounded-3xl glass-strong liquid-sheen p-6 md:p-8">
        <Link
          href="/profil"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke halaman masuk
        </Link>

        {success ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="mt-5 font-display text-2xl font-bold">
              Akun berhasil dibuat!
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Pendaftaran untuk <strong>{email}</strong> berhasil dikirim.
              Jika verifikasi email aktif, silakan cek kotak masuk email kamu
              sebelum login.
            </p>
            <button
              onClick={() => router.push("/profil")}
              className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-strong"
            >
              Lanjut ke halaman masuk
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl glass-red">
                <UserPlus className="h-7 w-7 text-brand" />
              </span>
              <h1 className="mt-5 font-display text-2xl font-bold">
                Buat Akun ZERO STORE
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Daftar sekarang untuk mulai menggunakan akun ZERO STORE.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <label className="block text-sm font-medium">
                Nama lengkap
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="mt-1.5 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-brand"
                />
              </label>

              <label className="block text-sm font-medium">
                Email
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@email.com"
                  className="mt-1.5 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-brand"
                />
              </label>

              <label className="block text-sm font-medium">
                Password
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="mt-1.5 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-brand"
                />
              </label>

              <label className="block text-sm font-medium">
                Konfirmasi password
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Ulangi password"
                  className="mt-1.5 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-brand"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus className="h-4 w-4" />
                {submitting ? "Membuat akun..." : "Buat Akun"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link
                href="/profil"
                className="font-semibold text-brand hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
