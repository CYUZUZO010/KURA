import { useState } from 'react'

export default function BudgetForm({ categories, month, year, onSubmit, onCancel, submitting }) {
  const [categoryId, setCategoryId] = useState('')
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [error, setError] = useState(null)

  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!categoryId) { setError('Choose a category.'); return }
    if (!monthlyLimit || Number(monthlyLimit) <= 0) { setError('Enter a limit greater than zero.'); return }

    try {
      await onSubmit({
        categoryId: Number(categoryId),
        monthlyLimit: Number(monthlyLimit),
        periodMonth: month,
        periodYear: year,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this budget.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-4">
      <div className="field">
        <label>Category</label>
        <select className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} autoFocus>
          <option value="">Choose a category</option>
          {expenseCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Monthly limit</label>
        <input
          className="input"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={monthlyLimit}
          onChange={(e) => setMonthlyLimit(e.target.value)}
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
          {submitting ? 'Saving…' : 'Save budget'}
        </button>
      </div>
    </form>
  )
}
