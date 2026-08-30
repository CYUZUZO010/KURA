import { useEffect, useState, useCallback } from 'react'
import { Plus, Repeat, Ban } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/shared/Modal'
import RecurringForm from '../components/shared/RecurringForm'
import EmptyState from '../components/shared/EmptyState'
import BackButton from '../components/shared/BackButton'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const FREQUENCY_LABEL = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  BIWEEKLY: 'Every 2 weeks',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
}

export default function Recurring() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.get('/recurring-transactions'),
      api.get('/categories'),
    ]).then(([r, c]) => {
      setItems(r.data)
      setCategories(c.data)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await api.post('/recurring-transactions', payload)
      setModalOpen(false)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async (id) => {
    if (!confirm('Stop this recurring transaction? Past entries stay in your history.')) return
    await api.delete(`/recurring-transactions/${id}`)
    load()
  }

  return (
    <div>
      <BackButton />
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-display">Recurring transactions</h1>
          <p className="text-muted mt-1">Rent, subscriptions, salary — set once, post automatically.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> New recurring item
        </button>
      </div>

      <div className="panel">
        {loading ? (
          <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Repeat}
            title="No recurring transactions yet"
            description="Add rent, a subscription, or your salary and it will post automatically on schedule."
            action={<button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>New recurring item</button>}
          />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Frequency</th>
                <th>Next run</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th>Status</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.description || r.categoryName}</td>
                  <td className="text-muted">{FREQUENCY_LABEL[r.frequency]}</td>
                  <td className="text-muted">{r.isActive ? formatDate(r.nextRunDate) : '—'}</td>
                  <td
                    className="text-mono-num"
                    style={{ textAlign: 'right', fontWeight: 600, color: r.type === 'INCOME' ? 'var(--color-positive)' : 'var(--color-text)' }}
                  >
                    {r.type === 'INCOME' ? '+' : '−'}{formatCurrency(r.amount)}
                  </td>
                  <td>
                    <span className={`badge ${r.isActive ? 'badge-positive' : 'badge-neutral'}`}>
                      {r.isActive ? 'Active' : 'Stopped'}
                    </span>
                  </td>
                  <td>
                    {r.isActive && (
                      <button className="btn btn-danger-text btn-sm" style={{ padding: 6 }} onClick={() => handleDeactivate(r.id)} title="Stop">
                        <Ban size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title="New recurring transaction" onClose={() => setModalOpen(false)}>
          <RecurringForm
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  )
}
