"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

function getRemaining(endTime: number) {
  return Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
}

export default function MaintenanceCountdown({
  eta,
}: {
  eta: string | null;
}) {
  const parsedEndTime = eta ? new Date(eta).getTime() : NaN;
  const validEta = Number.isFinite(parsedEndTime) && parsedEndTime > 0;
  const endTime = validEta ? parsedEndTime : 0;
  const [remaining, setRemaining] = useState(() =>
    endTime ? getRemaining(endTime) : 0
  );

  useEffect(() => {
    if (!endTime) return;

    const update = () => setRemaining(getRemaining(endTime));
    update();

    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [endTime]);

  if (!validEta) return null;

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const format = (value: number) => String(value).padStart(2, "0");

  return (
    <div className="mt-7 inline-flex flex-col items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-4">
      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/55">
        <Clock3 className="h-4 w-4 text-red-400" />
        {remaining > 0 ? "Maintenance berakhir dalam" : "Waktu maintenance selesai"}
      </span>
      <div className="font-mono text-4xl font-black tracking-wider text-red-400 tabular-nums">
        {format(hours)}:{format(minutes)}:{format(seconds)}
      </div>
      {remaining === 0 && (
        <p className="text-xs text-white/45">
          Situs sedang diperbarui. Silakan muat ulang halaman.
        </p>
      )}
    </div>
  );
}
