import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E5E2',
      borderRadius: 4,
      padding: '10px 12px',
      fontSize: 12.5,
    }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2" style={{ marginBottom: 2 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ color: '#6B6B68', textTransform: 'capitalize' }}>{p.dataKey}:</span>
          <span style={{ fontWeight: 600 }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2D5A27" stopOpacity={0.14} />
            <stop offset="100%" stopColor="#2D5A27" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A365D" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#1A365D" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="0" vertical={false} stroke="#EEEEEC" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11.5, fill: '#6B6B68' }}
          axisLine={{ stroke: '#E5E5E2' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11.5, fill: '#6B6B68' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
          width={44}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="income" stroke="#2D5A27" strokeWidth={2} fill="url(#incomeFill)" />
        <Area type="monotone" dataKey="expenses" stroke="#1A365D" strokeWidth={2} fill="url(#expenseFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
