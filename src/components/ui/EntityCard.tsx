import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { EntityCardProps } from '@/types';
import { STATUS_STYLES } from '@/constants/constants';

export default function EntityCard({
  icon: Icon,
  imageUrl,
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

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {imageUrl ? (
              <div className="relative size-12 shrink-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ) : Icon ? (
              <div className="group-hover:text-primary flex size-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-500 shadow-inner transition-colors">
                <Icon size={22} />
              </div>
            ) : null}
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

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex flex-col items-end gap-1 text-right">
              {amount && <p className="text-xs font-black text-white">{amount}</p>}
              {statusText && (
                <span
                  className={`rounded-full border px-2 py-0.5 text-[9px] font-black tracking-tighter uppercase ${STATUS_STYLES[statusVariant]}`}
                >
                  {statusText}
                </span>
              )}
            </div>

            {/* Botón de acción integrado arriba si no hay metadata */}
            {actionHref && !metadata && (
              <div className="hover:text-primary hover:border-primary flex size-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-500 transition-all active:scale-90">
                <ArrowUpRight size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Solo mostrar abajo si hay metadata (detalles mas complejos) */}
        {metadata && metadata.length > 0 && (
          <div className="flex items-center justify-between border-t border-zinc-800/50 pt-3">
            <div className="flex items-center gap-4">
              {metadata.map((item, idx) => (
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
