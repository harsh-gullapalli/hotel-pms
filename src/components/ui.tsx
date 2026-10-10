import type { ReactNode } from 'react';
import type { BadgeTone } from './status';

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: 'bg-success-bg text-success-text border-success-border',
  info: 'bg-info-bg text-info-text border-info-border',
  warning: 'bg-warning-bg text-warning-text border-warning-border',
  danger: 'bg-danger-bg text-danger-text border-danger-border',
  neutral: 'bg-neutral-bg text-neutral-text border-neutral-border',
};

export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <span className={`pms-badge border ${TONE_CLASSES[tone]}`}>
      <span className="pms-badge-dot" aria-hidden="true" />
      {children}
    </span>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`pms-card p-5 ${className}`}>{children}</section>;
}

export function CardTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="pms-section-title">{title}</h3>
        {subtitle ? <p className="pms-helper mt-1">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Sparkline({ points, width = 120, height = 36 }: { points: readonly number[]; width?: number; height?: number }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);
  const d = points
    .map((p, i) => {
      const x = i * step;
      const y = height - 4 - ((p - min) / span) * (height - 8);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="overflow-visible">
      <path d={d} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={width}
        cy={height - 4 - ((points[points.length - 1] - min) / span) * (height - 8)}
        r="3"
        fill="var(--color-primary)"
      />
    </svg>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full"
      style={{ background: 'var(--color-divider)' }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: 'var(--color-primary)' }}
      />
    </div>
  );
}

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full text-[12px] font-semibold"
      style={{ background: 'var(--color-soft)', color: 'var(--color-dark-accent)' }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-8 text-center">
      <p className="text-[13px] font-semibold" style={{ color: 'var(--color-ink)' }}>
        {title}
      </p>
      <p className="pms-helper">{hint}</p>
    </div>
  );
}
