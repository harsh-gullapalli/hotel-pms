import type { ReactNode } from 'react';
import { Sparkline } from './ui';

export function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="pms-label">{label}</span>
      {children}
      {error ? (
        <span className="text-[12px] font-medium" style={{ color: 'var(--color-danger-text)' }} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="pms-helper">{hint}</span>
      ) : null}
    </label>
  );
}

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (t: T) => void;
  label: string;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-[10px] border p-1" role="tablist" aria-label={label} style={{ borderColor: 'var(--color-border)', background: 'var(--color-muted-surface)' }}>
      {tabs.map((t) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(t.id)}
            className="whitespace-nowrap rounded-[8px] px-3.5 py-2 text-[13px] font-semibold"
            style={{
              background: selected ? 'var(--color-surface)' : 'transparent',
              color: selected ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
              boxShadow: selected ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
  summary,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  summary: string;
}) {
  if (totalPages <= 1) return <p className="pms-helper">{summary}</p>;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="pms-helper">{summary}</p>
      <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
        <button type="button" disabled={page === 0} onClick={() => onChange(page - 1)} className="pms-btn-ghost px-3 py-1.5 disabled:opacity-40" aria-label="Previous page">
          ←
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            aria-current={i === page ? 'page' : undefined}
            aria-label={`Page ${i + 1}`}
            className="tnum rounded-[8px] border px-3 py-1.5 text-[12.5px] font-semibold"
            style={{
              borderColor: i === page ? 'var(--color-primary)' : 'var(--color-border)',
              background: i === page ? 'var(--color-primary)' : 'var(--color-surface)',
              color: i === page ? 'var(--color-primary-foreground)' : 'var(--color-ink-secondary)',
            }}
          >
            {i + 1}
          </button>
        ))}
        <button type="button" disabled={page === totalPages - 1} onClick={() => onChange(page + 1)} className="pms-btn-ghost px-3 py-1.5 disabled:opacity-40" aria-label="Next page">
          →
        </button>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  spark,
  onClick,
}: {
  label: string;
  value: string;
  hint?: string;
  spark?: readonly number[];
  onClick?: () => void;
}) {
  const inner = (
    <>
      <p className="pms-label">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="pms-kpi-value tnum">{value}</p>
        {spark ? <Sparkline points={spark} width={96} height={30} /> : null}
      </div>
      {hint ? <p className="pms-helper mt-1.5">{hint}</p> : null}
    </>
  );
  if (!onClick) return <section className="pms-card p-4">{inner}</section>;
  return (
    <button type="button" onClick={onClick} className="pms-card pms-card-hover p-4 text-left" aria-label={`${label}: ${value}. View details`}>
      {inner}
    </button>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
  pressedLabel,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  pressedLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={pressedLabel}
      className="whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-semibold"
      style={{
        borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
        background: active ? 'var(--color-primary)' : 'var(--color-surface)',
        color: active ? 'var(--color-primary-foreground)' : 'var(--color-ink-secondary)',
      }}
    >
      {children}
    </button>
  );
}

/** Card wrapper for mobile: renders children as stacked cards under `md`, table on desktop. */
export function ResponsiveTable({ children, minWidth = 720 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="pms-table" style={{ minWidth: `${minWidth}px` }}>
        {children}
      </table>
    </div>
  );
}
