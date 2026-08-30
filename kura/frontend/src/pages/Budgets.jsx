import { useEffect, useState, useCallback } from 'react'
import { Plus, ChevronLeft, ChevronRight, Trash2, PieChart } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/shared/Modal'
import BudgetForm from '../components/shared/BudgetForm'
import EmptyState from '../components/shared/EmptyState'
import BackButton from '../components/shared/BackButton'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function Budgets() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.get('/budgets', { params: { month, year } }),
      api.get('/categories'),
    ]).then(([b, c]) => {
      setBudgets(b.data)
      setCategories(c.data)
    }).finally(() => setLoading(false))
  }, [month, year])

  useEffect(() => { load() }, [load])

  const shiftMonth = (delta) => {
    let m = month + delta
    let y = year
    if (m < 1) { m = 12; y -= 1 }
    if (m > 12) { m = 1; y += 1 }
    setMonth(m)
    setYear(y)
  }

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await api.post('/budgets', payload)
      setModalOpen(false)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this budget?')) return
    await api.delete(`/budgets/${id}`)
    load()
  }

  return (
    <div>
      <BackButton />
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-display">Budgets</h1>
          <p className="text-muted mt-1">Set a monthly limit per category and watch the pace.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 panel" style={{ padding: '6px 8px' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => shiftMonth(-1)}><ChevronLeft size={16} /></button>
            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 120, textAlign: 'center' }}>{monthLabel}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => shiftMonth(1)}><ChevronRight size={16} /></button>
          </div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> New budget
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-muted" style={{ padding: 40 }}>Loading…</div>
      ) : budgets.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon={PieChart}
            title="No budgets set for this month"
            description="Create a budget for any expense category to track how close you are to your limit."
            action={<button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>New budget</button>}
          />
        </div>
      ) : (
        <div className="grid-3">
          {budgets.map((b) => {
            const overBudget = b.percentUsed >= 100
            const nearLimit = b.percentUsed >= 80 && b.percentUsed < 100
            const barColor = overBudget ? 'var(--color-negative)' : nearLimit ? 'var(--color-warning)' : 'var(--color-positive)'
            const badgeClass = overBudget ? 'badge-negative' : nearLimit ? 'badge-warning' : 'badge-positive'

            return (
              <div key={b.id} className="panel panel-padded">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: b.categoryColor }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{b.categoryName}</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ padding: 5 }} onClick={() => handleDelete(b.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="text-mono-num" style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>
                  {formatCurrency(b.spent)}
                  <span className="text-muted" style={{ fontSize: 14, fontWeight: 500 }}> / {formatCurrency(b.monthlyLimit)}</span>
                </div>

                <div style={{ height: 6, background: 'var(--color-surface-sunken)', borderRadius: 2, overflow: 'hidden', margin: '10px 0' }}>
                  <div style={{ height: '100%', width: `${Math.min(b.percentUsed, 100)}%`, background: barColor, borderRadius: 2 }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className={`badge ${badgeClass}`}>
                    {overBudget ? 'Over budget' : nearLimit ? 'Near limit' : 'On track'}
                  </span>
                  <span className="text-muted" style={{ fontSize: 12.5 }}>
                    {formatCurrency(Math.max(b.remaining, 0))} left
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <Modal title="New budget" onClose={() => setModalOpen(false)}>
          <BudgetForm
            categories={categories}
            month={month}
            year={year}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  )
}
