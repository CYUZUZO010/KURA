import { useState } from 'react'

const TODAY = new Date().toISOString().slice(0, 10)

export default function TransactionForm({ categories, initial, onSubmit, onCancel, submitting }) {
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [type, setType] = useState(initial?.type ?? 'EXPENSE')
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [merchant, setMerchant] = useState(initial?.merchant ?? '')
  const [transactionDate, setTransactionDate] = useState(initial?.transactionDate ?? TODAY)
  const [error, setError] = useState(null)

  const filteredCategories = categories.filter((c) => c.type === type)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!amount || Number(amount) <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }
    try {
      await onSubmit({
        amount: Number(amount),
        type,
        categoryId: categoryId ? Number(categoryId) : null,
        description: description || null,
        merchant: merchant || null,
        transactionDate,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong saving this transaction.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-sm"
          style={{
            flex: 1,
            background: type === 'EXPENSE' ? 'var(--color-negative-tint)' : 'var(--color-surface)',
            color: type === 'EXPENSE' ? 'var(--color-negative)' : 'var(--color-text-muted)',
            border: '1px solid ' + (type === 'EXPENSE' ? 'var(--color-negative)' : 'var(--color-border-strong)'),
          }}
          onClick={() => { setType('EXPENSE'); setCategoryId('') }}
        >
          Expense
        </button>
        <button
          type="button"
          className="btn btn-sm"
          style={{
            flex: 1,
            background: type === 'INCOME' ? 'var(--color-positive-tint)' : 'var(--color-surface)',
            color: type === 'INCOME' ? 'var(--color-positive)' : 'var(--color-text-muted)',
            border: '1px solid ' + (type === 'INCOME' ? 'var(--color-positive)' : 'var(--color-border-strong)'),
          }}
          onClick={() => { setType('INCOME'); setCategoryId('') }}
        >
          Income
        </button>
      </div>

      <div className="field">
        <label>Amount</label>
        <input
          className="input"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div className="field">
        <label>Category</label>
        <select className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Uncategorized</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Date</label>
        <input
          className="input"
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label>Description</label>
        <input
          className="input"
          type="text"
          placeholder="e.g. Weekly grocery run"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Merchant (optional)</label>
        <input
          className="input"
          type="text"
          placeholder="e.g. Whole Foods"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
        />
      </div>

      {error && (
        <div style={{ background: 'var(--color-negative-tint)', color: 'var(--color-negative)', padding: '10px 12px', borderRadius: 4, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}
