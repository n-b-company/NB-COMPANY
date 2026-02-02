import { InfoGridProps } from '@/types';

export default function InfoGrid({ items }: InfoGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
        >
          <div className="text-primary rounded-lg bg-zinc-800 p-2.5">
            <item.icon size={20} />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              {item.label}
            </p>
            {item.value && (
              <p className="text-base leading-tight font-extrabold text-white">{item.value}</p>
            )}
            {item.subValue && (
              <p
                className={`mt-1 text-xs font-medium ${
                  item.special ? 'text-primary' : 'text-zinc-500'
                }`}
              >
                {item.subValue}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
