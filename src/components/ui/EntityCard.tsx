import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'inactive';

interface EntityCardProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  statusText?: string;
  statusVariant?: StatusVariant;
  amount?: string;
  metadata?: { icon: LucideIcon; text: string }[];
  actionHref?: string;
  headerLabel?: string;
  className?: string;
}

const statusStyles: Record<StatusVariant, string> = {
  success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-500',
  danger: 'border-red-500/20 bg-red-500/10 text-red-500',
  inactive: 'border-zinc-700 bg-zinc-800 text-zinc-500',
};

export default function EntityCard({
  icon: Icon,
  title,
  subtitle,
  statusText,
  statusVariant = 'success',
  amount,
  metadata,
  actionHref,
  headerLabel,
  className = '',
}: EntityCardProps) {
  const CardContent = (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all hover:bg-zinc-800/50 ${className}`}
    >
      {headerLabel && (
        <div className="border-b border-zinc-800 bg-zinc-950/30 px-4 py-2">
          <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
            {headerLabel}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="group-hover:text-primary flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-500 transition-colors">
                <Icon size={20} />
              </div>
            )}
            <div className="min-w-0">
              <h4 className="group-hover:text-primary truncate text-sm font-black text-white transition-colors">
                {title}
              </h4>
              {subtitle && (
                <p className="truncate text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
            {amount && <p className="text-sm font-black text-white">{amount}</p>}
            {statusText && (
              <span
                className={`rounded-full border px-2 py-0.5 text-[9px] font-black tracking-tighter uppercase ${statusStyles[statusVariant]}`}
              >
                {statusText}
              </span>
            )}
          </div>
        </div>

        {(metadata || actionHref) && (
          <div className="flex items-center justify-between border-t border-zinc-800/50 pt-3">
            <div className="flex items-center gap-4">
              {metadata?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-zinc-500">
                  <item.icon size={14} />
                  <span className="text-[10px] font-bold uppercase">{item.text}</span>
                </div>
              ))}
            </div>

            {actionHref && (
              <Link
                href={actionHref}
                className="hover:text-primary hover:border-primary flex size-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-500 transition-all active:scale-90"
              >
                <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return actionHref && !metadata ? <Link href={actionHref}>{CardContent}</Link> : CardContent;
}
