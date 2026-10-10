/** Minimal SVG charts using theme tokens. No charting dependency. */

export function BarChart({
  data,
  height = 170,
  label,
}: {
  data: { label: string; value: number; highlight?: boolean }[];
  height?: number;
  label: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div role="img" aria-label={label}>
      <div className="flex items-end gap-2 pt-2" style={{ height: `${height + 34}px` }}>
        {data.map((d) => (
          <div key={d.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
            <span className="tnum text-[11px] font-semibold" style={{ color: 'var(--color-ink-secondary)' }}>
              {d.value}
            </span>
            <div
              className="w-full rounded-t-[7px]"
              style={{
                height: `${Math.max(6, (d.value / max) * height)}px`,
                background: d.highlight ? 'var(--color-primary)' : 'var(--color-soft)',
              }}
            />
            <span className="w-full truncate text-center text-[11px] font-medium" style={{ color: 'var(--color-ink-muted)' }}>
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({
  slices,
  size = 148,
  label,
}: {
  slices: { label: string; value: number; color: string }[];
  size?: number;
  label: string;
}) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = 54;
  const C = 2 * Math.PI * R;
  const offsets: number[] = [];
  slices.reduce((acc, s) => {
    offsets.push(acc);
    return acc + s.value;
  }, 0);
  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label={label}>
        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--color-divider)" strokeWidth="18" />
        {slices.map((s, idx) => {
          const frac = s.value / total;
          const dash = `${frac * C} ${C}`;
          const rot = -90 + (offsets[idx] / total) * 360;
          return (
            <circle
              key={s.label}
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="18"
              strokeDasharray={dash}
              transform={`rotate(${rot} 70 70)`}
              strokeLinecap="butt"
            />
          );
        })}
        <text x="70" y="66" textAnchor="middle" fontSize="19" fontWeight="700" fill="var(--color-ink)">
          {total}
        </text>
        <text x="70" y="84" textAnchor="middle" fontSize="10" fill="var(--color-ink-secondary)">
          total
        </text>
      </svg>
      <ul className="flex min-w-[140px] flex-1 flex-col gap-1.5">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-2 text-[12.5px]">
            <span className="flex items-center gap-2" style={{ color: 'var(--color-ink-secondary)' }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} aria-hidden="true" />
              {s.label}
            </span>
            <span className="tnum font-semibold" style={{ color: 'var(--color-ink)' }}>
              {s.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
