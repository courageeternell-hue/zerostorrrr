"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertTriangle,
  Camera,
  Info,
  Lock,
  Save,
  Send,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GAME_CATEGORIES } from "@/lib/games";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

const MIN_PRICE = 10000;
const MAX_PRICE = 100000000;

const listingSchema = z.object({
  game: z.enum(
    ["free-fire", "mobile-legends", "pubg-mobile", "roblox", "genshin-impact", "lainnya"],
    { message: "Pilih kategori game" },
  ),
  title: z
    .string()
    .trim()
    .min(10, "Judul minimal 10 karakter agar informatif")
    .max(90, "Judul maksimal 90 karakter"),
  price: z.coerce
    .number({ message: "Harga wajib diisi" })
    .int("Harga harus bilangan bulat")
    .min(MIN_PRICE, `Harga minimal ${formatRupiah(MIN_PRICE)}`)
    .max(MAX_PRICE, "Harga terlalu besar"),
  description: z
    .string()
    .trim()
    .min(30, "Deskripsi minimal 30 karakter — jelaskan isi akun dengan jujur")
    .max(2000, "Deskripsi maksimal 2000 karakter"),
  level: z.string().trim().max(20).optional().or(z.literal("")),
  rank: z.string().trim().max(40).optional().or(z.literal("")),
  server: z.string().trim().max(40).optional().or(z.literal("")),
  skinCount: z.coerce
    .number({ message: "Isi angka atau kosongkan" })
    .int()
    .min(0, "Tidak boleh negatif")
    .max(100000)
    .optional(),
  heroCount: z.coerce
    .number({ message: "Isi angka atau kosongkan" })
    .int()
    .min(0, "Tidak boleh negatif")
    .max(100000)
    .optional(),
  highlights: z.string().trim().max(300).optional().or(z.literal("")),
  confirmOwnership: z.literal(true, { message: "Wajib dikonfirmasi untuk pengajuan" }),
});

type ListingForm = z.input<typeof listingSchema>;
type ListingOutput = z.output<typeof listingSchema>;

const draftSchema = listingSchema.pick({ game: true, title: true, price: true });

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 2;

export function SellForm() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<typeof GAME_CATEGORIES>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const response = await fetch("/api/public/categories", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Gagal mengambil kategori.");

        if (mounted) {
          const activeSlugs = new Set<string>(
            (payload.categories ?? []).map((category: { slug: string }) => category.slug)
          );
          setActiveCategories(GAME_CATEGORIES.filter((game) => activeSlugs.has(game.slug)));
        }
      } catch (error) {
        if (mounted) {
          setActiveCategories([]);
          toast.error(error instanceof Error ? error.message : "Gagal mengambil kategori.");
        }
      } finally {
        if (mounted) setCategoriesLoading(false);
      }
    }

    void loadCategories();
    return () => { mounted = false; };
  }, []);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [confirmOwnership, setConfirmOwnership] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ListingForm>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      game: undefined,
      title: "",
      price: "",
      description: "",
      level: "",
      rank: "",
      server: "",
      skinCount: "",
      heroCount: "",
      highlights: "",
    },
  });

  const gameValue = watch("game");

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setImageError(null);
    const next = [...images];
    for (const file of Array.from(files)) {
      if (next.length >= MAX_IMAGES) {
        setImageError(`Maksimal ${MAX_IMAGES} gambar`);
        break;
      }
      if (!file.type.startsWith("image/")) {
        setImageError("File harus berupa gambar");
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setImageError(`Ukuran gambar maksimal ${MAX_SIZE_MB}MB (${file.name})`);
        continue;
      }
      next.push(URL.createObjectURL(file));
      setImageFiles((prev) => [...prev, file]);
    }
    setImages(next);
  }

  function removeImage(index: number) {
    const preview = images[index];
    if (preview) URL.revokeObjectURL(preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadListingImages() {
    const supabase = createSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Silakan login terlebih dahulu.");
    }

    const paths: string[] = [];

    for (const file of imageFiles) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from("listing-images")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        if (paths.length) {
          await supabase.storage.from("listing-images").remove(paths);
        }
        throw new Error(`Gagal mengunggah ${file.name}: ${error.message}`);
      }

      paths.push(path);
    }

    return paths;
  }

  /** Gambar hanya pratinjau sesi — upload permanen butuh backend. */
  function collectData(data: ListingOutput) {
    return {
      game: data.game,
      title: data.title,
      price: data.price,
      description: data.description,
      level: data.level || undefined,
      rank: data.rank || undefined,
      server: data.server || undefined,
      skinCount: data.skinCount,
      heroCount: data.heroCount,
      highlights:
        data.highlights
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 6) ?? [],
      imagePreviews: images,
      imagesPersisted: false,
    };
  }

  async function onSubmit(data: ListingOutput) {
    if (!confirmOwnership) {
      setConfirmError(true);
      return;
    }

    setConfirmError(false);

    let imagePaths: string[] = [];

    try {
      imagePaths = await uploadListingImages();

      const payload = collectData(data);

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: payload.game,
          title: payload.title,
          price: payload.price,
          description: payload.description,
          level: payload.level,
          rank: payload.rank,
          server: payload.server,
          skinCount: payload.skinCount,
          heroCount: payload.heroCount,
          highlights: payload.highlights,
          imagePaths,
          status: "menunggu_review",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan listing.");
      }

      images.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setImageFiles([]);

      toast.success("Listing berhasil diajukan!", {
        description: `“${data.title}” tersimpan dan menunggu review moderator.`,
      });

      router.push("/profil?tab=listing");
    } catch (error) {
      if (imagePaths.length) {
        const supabase = createSupabaseClient();
        await supabase.storage.from("listing-images").remove(imagePaths);
      }

      toast.error("Gagal mengajukan listing", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
    }
  }

  async function onSaveDraft() {
    const ok = await trigger(["game", "title", "price"], { shouldFocus: true });

    if (!ok) {
      toast.error("Draft belum lengkap", {
        description: "Isi kategori game, judul, dan harga terlebih dahulu.",
      });
      return;
    }

    const game = gameValue as (typeof GAME_CATEGORIES)[number]["slug"];
    const title = String(watch("title") ?? "").trim();
    const price = Number(watch("price")) || 0;

    if (!game || title.length < 3 || price < MIN_PRICE) {
      toast.error("Draft belum lengkap", {
        description: "Kategori, judul, dan harga minimal Rp10.000 wajib diisi.",
      });
      return;
    }

    let imagePaths: string[] = [];

    try {
      imagePaths = await uploadListingImages();

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game,
          title,
          price,
          description:
            String(watch("description") ?? "") ||
            "Draft listing — deskripsi belum dilengkapi.",
          level: String(watch("level") ?? "") || null,
          rank: String(watch("rank") ?? "") || null,
          server: String(watch("server") ?? "") || null,
          skinCount: watch("skinCount") ? Number(watch("skinCount")) : null,
          heroCount: watch("heroCount") ? Number(watch("heroCount")) : null,
          highlights: [],
          imagePaths,
          status: "draft",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan draft.");
      }

      images.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setImageFiles([]);
      reset();

      toast.success("Draft berhasil disimpan", {
        description: "Draft tersimpan di akunmu dan bisa dilanjutkan nanti.",
      });

      router.push("/profil?tab=listing");
    } catch (error) {
      if (imagePaths.length) {
        const supabase = createSupabaseClient();
        await supabase.storage.from("listing-images").remove(imagePaths);
      }

      toast.error("Gagal menyimpan draft", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(listingSchema.parse(values)))}
      noValidate
      className="space-y-5"
    >
      {/* Pernyataan keamanan */}
      <div className="rounded-2xl glass-red p-4">
        <p className="flex items-start gap-2.5 text-sm leading-relaxed text-white/90">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            <strong>Kami tidak pernah meminta password akun game.</strong> Serah terima
            akun hanya terjadi setelah pembayaran terverifikasi oleh sistem. Waspadai
            siapa pun yang memintamu membagikan kredensial di luar platform.
          </span>
        </p>
      </div>

      {/* Informasi utama */}
      <section className="rounded-2xl glass liquid-sheen p-5 md:p-6">
        <h2 className="font-display text-lg font-bold">Informasi Utama</h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="sf-game">Kategori game *</Label>
            <Select
              value={gameValue ?? undefined}
              onValueChange={(v) => setValue("game", v as ListingForm["game"], { shouldValidate: true })}
            >
              <SelectTrigger id="sf-game" disabled={categoriesLoading || activeCategories.length === 0} aria-invalid={!!errors.game} className="h-11 w-full bg-white/5 ring-white/10">
                <SelectValue placeholder={categoriesLoading ? "Memuat kategori..." : "Pilih kategori game"} />
              </SelectTrigger>
              <SelectContent>
                {activeCategories.map((g) => (
                  <SelectItem key={g.slug} value={g.slug}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.game && <FieldError message={errors.game.message} />}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sf-title">Judul listing *</Label>
            <Input
              id="sf-title"
              placeholder="cth. Akun ML Mythic — 45 Skin, 88 Hero"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && <FieldError message={errors.title.message} />}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sf-price">Harga (Rupiah) *</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                Rp
              </span>
              <Input
                id="sf-price"
                inputMode="numeric"
                className="pl-10"
                placeholder="250000"
                {...register("price")}
                aria-invalid={!!errors.price}
              />
            </div>
            {errors.price ? (
              <FieldError message={errors.price.message} />
            ) : (
              Number(watch("price")) > 0 && (
                <p className="text-xs text-muted-foreground">
                  {formatRupiah(Number(watch("price")))} + biaya layanan 2,5%
                </p>
              )
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sf-desc">Deskripsi akun *</Label>
            <Textarea
              id="sf-desc"
              rows={5}
              placeholder="Jelaskan isi akun secara jujur: koleksi, riwayat binding, kebiasaan main, dan hal lain yang perlu diketahui pembeli."
              {...register("description")}
              aria-invalid={!!errors.description}
            />
            {errors.description && <FieldError message={errors.description.message} />}
          </div>
        </div>
      </section>

      {/* Detail akun */}
      <section className="rounded-2xl glass liquid-sheen p-5 md:p-6">
        <h2 className="font-display text-lg font-bold">Informasi Akun</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Opsional, tetapi listing dengan detail lengkap lebih cepat terjual.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="sf-level">Level akun</Label>
            <Input id="sf-level" placeholder="cth. 60" {...register("level")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sf-rank">Rank / Tier</Label>
            <Input id="sf-rank" placeholder="cth. Mythic Glory" {...register("rank")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sf-server">Server</Label>
            <Input id="sf-server" placeholder="cth. Indonesia" {...register("server")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sf-skin">Jumlah skin</Label>
            <Input id="sf-skin" inputMode="numeric" placeholder="cth. 32" {...register("skinCount")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sf-hero">Jumlah hero / karakter</Label>
            <Input id="sf-hero" inputMode="numeric" placeholder="cth. 88" {...register("heroCount")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sf-highlights">Item unggulan (pisahkan koma)</Label>
            <Input
              id="sf-highlights"
              placeholder="cth. Skin Collector, Emblem max, Bundle langka"
              {...register("highlights")}
            />
          </div>
        </div>
      </section>

      {/* Unggah gambar */}
      <section className="rounded-2xl glass liquid-sheen p-5 md:p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <Camera className="h-5 w-5 text-brand" aria-hidden />
          Unggah Gambar
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Maksimal {MAX_IMAGES} gambar, {MAX_SIZE_MB}MB per gambar. Gunakan foto asli
          milikmu — listing dengan gambar jelas lebih dipercaya pembeli.
        </p>

        {images.length > 0 && (
          <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {images.map((src, i) => (
              <li key={src} className="group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/15">
                { }
                <img src={src} alt={`Pratinjau gambar ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label={`Hapus gambar ${i + 1}`}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-label="Pilih gambar akun"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 px-4 py-8 text-center transition-colors hover:border-brand/50 hover:bg-brand/5",
          )}
        >
          <UploadCloud className="h-8 w-8 text-muted-foreground" aria-hidden />
          <span className="text-sm font-medium">Ketuk untuk memilih gambar</span>
          <span className="text-xs text-muted-foreground">PNG, JPG, atau WebP</span>
        </button>
        {imageError && <FieldError message={imageError} />}
        <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Catatan demo: gambar hanya tersimpan sebagai pratinjau sesi browser. Upload
          permanen memerlukan object storage + backend (lihat README).
        </p>
      </section>

      {/* Konfirmasi */}
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl glass p-4">
        <input
          type="checkbox"
          checked={confirmOwnership}
          onChange={(e) => {
            setConfirmOwnership(e.target.checked);
            if (e.target.checked) setConfirmError(false);
          }}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          Saya menyatakan bahwa akun yang saya daftarkan adalah <strong className="text-foreground">milik saya
          atau saya memiliki izin penuh</strong> untuk menjualnya, dan seluruh informasi
          yang saya berikan adalah benar.
        </span>
      </label>
      {confirmError && <FieldError message="Centang pernyataan kepemilikan untuk mengajukan listing" />}

      {/* Aksi */}
      <div className="sticky bottom-24 z-10 flex gap-3 rounded-2xl glass-strong p-3 md:static md:bottom-auto md:rounded-2xl">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          className="h-12 flex-1 border-white/15 bg-white/5 text-sm font-semibold hover:bg-white/10 hover:text-foreground md:flex-none md:px-6"
        >
          <Save className="mr-2 h-4 w-4" aria-hidden />
          Simpan Draft
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 flex-1 bg-brand text-sm font-bold text-white hover:bg-brand-strong glow-red md:flex-none md:px-8"
        >
          {isSubmitting ? (
            <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Send className="mr-2 h-4 w-4" aria-hidden />
          )}
          Ajukan Listing
        </Button>
      </div>

      <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        Pengajuan memasuki antrean review moderator (simulasi — pada produksi, review
        dikelola admin melalui dashboard yang dilindungi autentikasi server).
      </p>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-center gap-1 text-xs font-medium text-brand">
      <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
      {message}
    </p>
  );
}
