import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

/** Tampilan kosong yang konsisten di seluruh aplikasi. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl glass liquid-sheen px-6 py-14 text-center ${className ?? ""}`}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl glass-red">
        <Icon className="h-7 w-7 text-brand" aria-hidden />
      </span>
      <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
