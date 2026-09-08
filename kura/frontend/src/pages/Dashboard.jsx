import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../api/axios'
import StatCard from '../components/shared/StatCard'
import TrendChart from '../components/charts/TrendChart'
import CategoryBreakdownChart from '../components/charts/CategoryBreakdownChart'
import EmptyState from '../components/shared/EmptyState'
import BackButton from '../components/shared/BackButton'
import { PieChart } from 'lucide-react'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function Dashboard() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const fetchDashboard = () => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api.get('/analytics/dashboard', { params: { month, year } })
      .then(({ data }) => { if (!cancelled) setSummary(data) })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Unable to load dashboard data. Please check your backend connection.')
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }

  useEffect(() => {
    const cleanup = fetchDashboard()
    return cleanup
  }, [month, year])

  const shiftMonth = (delta) => {
    let m = month + delta
    let y = year
    if (m < 1) { m = 12; y -= 1 }
    if (m > 12) { m = 1; y += 1 }
    setMonth(m)
    setYear(y)
  }

  return (
    <div>
      <BackButton />
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-display">Dashboard</h1>
          <p className="text-muted mt-1">Your finances at a glance.</p>
        </div>
        <div className="flex items-center gap-2 panel" style={{ padding: '6px 8px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => shiftMonth(-1)}><ChevronLeft size={16} /></button>
          <span style={{ fontSize: 13, fontWeight: 600, minWidth: 120, textAlign: 'center' }}>{monthLabel}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => shiftMonth(1)}><ChevronRight size={16} /></button>
        </div>
      </div>

      {loading ? (
        <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : error ? (
        <div className="panel panel-padded flex items-center justify-between" style={{ padding: 24 }}>
          <div className="text-muted">{error}</div>
          <button className="btn btn-secondary btn-sm" onClick={fetchDashboard}>Retry</button>
        </div>
      ) : !summary ? (
        <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>No summary available.</div>
      ) : (
        <>
          <div className="grid-3 mb-5">
            <StatCard label="Income" value={summary.totalIncome} tone="positive" />
            <StatCard label="Expenses" value={summary.totalExpenses} tone="negative" />
            <StatCard
              label="Net savings"
              value={summary.netSavings}
              tone={summary.netSavings >= 0 ? 'positive' : 'negative'}
              sublabel={`${summary.savingsRate}% savings rate`}
            />
          </div>

          <div className="grid-2 mb-5">
            <div className="panel panel-padded">
              <h2 className="text-heading mb-4">Income vs. expenses — last 6 months</h2>
              <TrendChart data={summary.monthlyTrend} />
            </div>
            <div className="panel panel-padded">
              <h2 className="text-heading mb-4">Spending by category</h2>
              <CategoryBreakdownChart data={summary.categoryBreakdown} />
            </div>
          </div>

          <div className="panel panel-padded">
            <h2 className="text-heading mb-4">Budget status this month</h2>
            {summary.budgetStatus.length === 0 ? (
              <EmptyState
                icon={PieChart}
                title="No budgets set for this month"
                description="Set a monthly limit per category on the Budgets page to track how you're pacing."
              />
            ) : (
              <div className="grid-2" style={{ gap: 16 }}>
                {summary.budgetStatus.map((b) => (
                  <BudgetMiniRow key={b.id} budget={b} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function BudgetMiniRow({ budget }) {
  const overBudget = budget.percentUsed >= 100
  const nearLimit = budget.percentUsed >= 80 && budget.percentUsed < 100
  const barColor = overBudget ? 'var(--color-negative)' : nearLimit ? 'var(--color-warning)' : 'var(--color-positive)'

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span style={{ width: 7, height: 7, borderRadius: 2, background: budget.categoryColor }} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>{budget.categoryName}</span>
        </div>
        <span className="text-mono-num text-muted" style={{ fontSize: 12.5 }}>
          {formatCurrency(budget.spent)} / {formatCurrency(budget.monthlyLimit)}
        </span>
      </div>
      <div style={{ height: 6, background: 'var(--color-surface-sunken)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(budget.percentUsed, 100)}%`, background: barColor, borderRadius: 2 }} />
      </div>
    </div>
  )
}
