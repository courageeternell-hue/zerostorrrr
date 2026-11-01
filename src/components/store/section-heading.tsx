import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id?: string;
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: LucideIcon;
  className?: string;
}

export function SectionHeading({
  id,
  title,
  subtitle,
  actionHref,
  actionLabel = "Lihat semua",
  icon: Icon,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-3 md:mb-6", className)}>
      <div>
        <h2 id={id} className="flex items-center gap-2 font-display text-xl font-bold tracking-tight md:text-2xl">
          {Icon && <Icon className="h-5 w-5 text-brand" aria-hidden />}
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actionHref && (
        <Link
          href={actionHref}
          className="group inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-ring"
        >
          {actionLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      )}
    </div>
  );
}
