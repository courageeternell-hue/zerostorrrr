"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Copy,
  CreditCard,
  FileImage,
  Loader2,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type Application = {
  id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
};

const BANK_ACCOUNT = "5726285680";

export default function PartnerPage() {
  const [userId, setUserId] = useState("");
  const [application, setApplication] = useState<Application | null>(null);
  const [isPartner, setIsPartner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (active) setLoading(false);
        return;
      }

      const [partnerResult, applicationResult] = await Promise.all([
        supabase
          .from("partner_memberships")
          .select("status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle(),
        supabase
          .from("partner_applications")
          .select("id, amount, status, admin_note, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (!active) return;

      setUserId(user.id);
      setIsPartner(Boolean(partnerResult.data));
      setApplication(applicationResult.data as Application | null);
      setLoading(false);
    }

    void loadStatus();

    return () => {
      active = false;
    };
  }, []);

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(BANK_ACCOUNT);
      toast.success("Nomor rekening berhasil disalin.");
    } catch {
      toast.error("Gagal menyalin nomor rekening.");
    }
  }

  async function submitApplication() {
    if (!userId) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    if (!file) {
      toast.error("Pilih bukti transfer terlebih dahulu.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Format bukti harus JPG, PNG, atau WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5 MB.");
      return;
    }

    setSubmitting(true);
    setUploading(true);

    const supabase = createClient();
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("partner-payments")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    setUploading(false);

    if (uploadError) {
      setSubmitting(false);
      toast.error(`Upload gagal: ${uploadError.message}`);
      return;
    }

    const response = await fetch("/api/partner/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proofPath: path }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setSubmitting(false);
      toast.error(payload.error || "Gagal mengirim pengajuan.");
      return;
    }

    setApplication({
      ...payload,
      admin_note: null,
    });
    setFile(null);
    setSubmitting(false);
    toast.success("Pengajuan berhasil dikirim. Tunggu verifikasi admin.");
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-brand" />
        <h1 className="text-2xl font-bold">Join Partner ZERO STORE</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Silakan login terlebih dahulu untuk mengajukan keanggotaan Partner.
        </p>
        <Button asChild className="mt-6">
          <Link href="/profil">Login / Masuk</Link>
        </Button>
      </div>
    );
  }

  if (isPartner) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card className="border-brand/30">
          <CardContent className="p-8 text-center">
            <BadgeCheck className="mx-auto h-14 w-14 text-brand" />
            <h1 className="mt-4 text-2xl font-bold">Kamu Partner Aktif!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sekarang kamu bisa mulai menjual akun di ZERO STORE.
            </p>
            <Button asChild className="mt-6">
              <Link href="/jual">Mulai Jual Akun</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusLabel = {
    pending: "Menunggu Verifikasi",
    approved: "Disetujui",
    rejected: "Ditolak",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke toko
      </Link>

      <div className="mb-7">
        <div className="flex items-center gap-2 text-brand">
          <ShieldCheck className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">
            ZERO STORE PARTNER
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight">
          Jadi Partner <span className="text-brand">ZERO STORE</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Bergabung sebagai Partner dan mulai kelola listing akun game milikmu sendiri.
        </p>
      </div>

      <Card className="mb-6 overflow-hidden border-brand/30">
        <div className="bg-gradient-to-r from-red-950 to-neutral-950 p-6 text-white">
          <p className="text-sm text-white/70">Biaya keanggotaan Partner</p>
          <p className="mt-2 text-4xl font-black">Rp1.500.000</p>
          <p className="mt-2 text-xs text-white/60">
            Pembayaran satu kali melalui transfer bank.
          </p>
        </div>
        <CardContent className="space-y-4 p-5">
          <div>
            <p className="text-xs text-muted-foreground">Bank tujuan</p>
            <p className="font-bold">BCA</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nomor rekening</p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xl font-bold tracking-wider">{BANK_ACCOUNT}</p>
              <Button size="sm" variant="outline" onClick={copyAccount}>
                <Copy className="mr-2 h-4 w-4" />
                Salin
              </Button>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Atas nama</p>
            <p className="font-semibold">Muhammad Rahma Dana Atmaja</p>
          </div>
        </CardContent>
      </Card>

      {application && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5 text-brand" />
              Status Pengajuan Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold">
              {statusLabel[application.status]}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Dikirim: {new Date(application.created_at).toLocaleString("id-ID")}
            </p>
            {application.admin_note && (
              <p className="mt-3 rounded-lg bg-muted p-3 text-sm">
                Catatan admin: {application.admin_note}
              </p>
            )}
            {application.status === "pending" && (
              <p className="mt-3 text-sm text-muted-foreground">
                Pengajuanmu sedang diperiksa admin. Kamu belum perlu mengirim ulang.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {application?.status !== "pending" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kirim Bukti Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-dashed p-5 text-center">
              <input
                id="partner-proof"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
              <label
                htmlFor="partner-proof"
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                {file ? (
                  <FileImage className="h-9 w-9 text-brand" />
                ) : (
                  <UploadCloud className="h-9 w-9 text-muted-foreground" />
                )}
                <span className="text-sm font-semibold">
                  {file ? file.name : "Pilih foto bukti transfer"}
                </span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG, WEBP • Maksimal 5 MB
                </span>
              </label>
            </div>

            <Button
              className="w-full"
              disabled={!file || submitting}
              onClick={submitApplication}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploading ? "Mengunggah bukti..." : "Mengirim pengajuan..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Kirim Pengajuan Partner
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Keanggotaan aktif setelah pembayaran diperiksa dan disetujui admin.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
