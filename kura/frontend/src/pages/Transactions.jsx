import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, ArrowLeftRight } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/shared/Modal'
import TransactionForm from '../components/shared/TransactionForm'
import EmptyState from '../components/shared/EmptyState'
import BackButton from '../components/shared/BackButton'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadCategories = useCallback(() => {
    api.get('/categories').then(({ data }) => setCategories(data))
  }, [])

  const loadTransactions = useCallback(() => {
    setLoading(true)
    api.get('/transactions', { params: { page, size: 15, categoryId: categoryFilter || undefined } })
      .then(({ data }) => {
        setTransactions(data.content)
        setTotalPages(data.totalPages)
      })
      .finally(() => setLoading(false))
  }, [page, categoryFilter])

  useEffect(() => { loadCategories() }, [loadCategories])
  useEffect(() => { loadTransactions() }, [loadTransactions])

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (t) => { setEditing(t); setModalOpen(true) }

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (editing) {
        await api.put(`/transactions/${editing.id}`, payload)
      } else {
        await api.post('/transactions', payload)
      }
      setModalOpen(false)
      loadTransactions()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    await api.delete(`/transactions/${id}`)
    loadTransactions()
  }

  return (
    <div>
      <BackButton />
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-display">Transactions</h1>
          <p className="text-muted mt-1">Every dollar in, every dollar out.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add transaction
        </button>
      </div>

      <div className="panel">
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <select
            className="select"
            style={{ width: 220 }}
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(0) }}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions yet"
            description="Add one manually, or import a CSV from the Import page to get started fast."
            action={<button className="btn btn-primary btn-sm" onClick={openCreate}>Add transaction</button>}
          />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ width: 90 }}></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{formatDate(t.transactionDate)}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{t.description || t.merchant || '—'}</div>
                    {t.merchant && t.description && (
                      <div className="text-muted" style={{ fontSize: 12 }}>{t.merchant}</div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-neutral">
                      <span className="badge-dot" style={{ background: t.categoryColor }} />
                      {t.categoryName}
                    </span>
                  </td>
                  <td
                    className="text-mono-num"
                    style={{ textAlign: 'right', fontWeight: 600, color: t.type === 'INCOME' ? 'var(--color-positive)' : 'var(--color-text)' }}
                  >
                    {t.type === 'INCOME' ? '+' : '−'}{formatCurrency(t.amount)}
                  </td>
                  <td>
                    <div className="flex gap-1" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: 6 }} onClick={() => openEdit(t)}>
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-danger-text btn-sm" style={{ padding: 6 }} onClick={() => handleDelete(t.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center" style={{ padding: '14px 20px', borderTop: '1px solid var(--color-border)' }}>
            <button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span className="text-muted" style={{ fontSize: 12.5 }}>Page {page + 1} of {totalPages}</span>
            <button className="btn btn-secondary btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit transaction' : 'Add transaction'} onClose={() => setModalOpen(false)}>
          <TransactionForm
            categories={categories}
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  )
}
