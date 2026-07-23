function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export default function CategoryBreakdownChart({ data }) {
  if (!data?.length) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--color-text-faint)', fontSize: 13 }}>
        No expenses recorded for this period yet.
      </div>
    )
  }

  const max = Math.max(...data.map((d) => d.total))

  return (
    <div className="flex-col gap-4">
      {data.slice(0, 8).map((row) => (
        <div key={row.categoryId}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span style={{ width: 8, height: 8, borderRadius: 2, background: row.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{row.categoryName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-mono-num" style={{ fontSize: 13, fontWeight: 600 }}>
                {formatCurrency(row.total)}
              </span>
              <span className="text-muted text-mono-num" style={{ fontSize: 12, width: 38, textAlign: 'right' }}>
                {row.percentage}%
              </span>
            </div>
          </div>
          <div style={{ height: 6, background: 'var(--color-surface-sunken)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${max > 0 ? (row.total / max) * 100 : 0}%`,
                background: row.color,
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
