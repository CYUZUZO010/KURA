import { useState, useRef } from 'react'
import { UploadCloud, CheckCircle2, FileText } from 'lucide-react'
import BackButton from '../components/shared/BackButton'
import api from '../api/axios'

export default function Import() {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a .csv file.')
      return
    }
    setError(null)
    setResult(null)
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const { data } = await api.post('/import/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not import that file. Check the format and try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <BackButton />
      <div className="mb-5">
        <h1 className="text-display">Import transactions</h1>
        <p className="text-muted mt-1">Upload a bank or card statement export and we'll parse it into transactions.</p>
      </div>

      <div
        className="panel"
        style={{
          padding: '56px 24px',
          textAlign: 'center',
          borderStyle: dragging ? 'dashed' : 'solid',
          borderColor: dragging ? 'var(--color-accent)' : 'var(--color-border)',
          background: dragging ? 'var(--color-accent-tint)' : 'var(--color-surface)',
          cursor: 'pointer',
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div style={{
          width: 44, height: 44, borderRadius: 4, background: 'var(--color-surface-sunken)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          color: 'var(--color-accent)',
        }}>
          <UploadCloud size={22} strokeWidth={1.6} />
        </div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
          {uploading ? 'Uploading…' : 'Drop your CSV here, or click to browse'}
        </div>
        <p className="text-muted" style={{ fontSize: 13, maxWidth: 420, margin: '0 auto' }}>
          Expects columns for <strong>date</strong> and <strong>amount</strong> — plus optional
          <strong> description</strong> and <strong> merchant</strong>. Negative amounts are read as expenses,
          positive as income.
        </p>
      </div>

      {error && (
        <div className="mt-4" style={{ background: 'var(--color-negative-tint)', color: 'var(--color-negative)', padding: '12px 16px', borderRadius: 4, fontSize: 13.5 }}>
          {error}
        </div>
      )}

      {result && (
        <div className="panel panel-padded mt-4">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 size={20} color="var(--color-positive)" />
            <div>
              <div style={{ fontWeight: 600 }}>Import complete</div>
              <div className="text-muted" style={{ fontSize: 12.5 }}>{result.fileName}</div>
            </div>
          </div>
          <div className="grid-2">
            <div style={{ padding: '12px 16px', background: 'var(--color-positive-tint)', borderRadius: 4 }}>
              <div className="text-label" style={{ color: 'var(--color-positive)' }}>Rows imported</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-positive)' }}>{result.rowsImported}</div>
            </div>
            <div style={{ padding: '12px 16px', background: 'var(--color-surface-sunken)', borderRadius: 4 }}>
              <div className="text-label">Rows skipped</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{result.rowsSkipped}</div>
            </div>
          </div>
        </div>
      )}

      <div className="panel panel-padded mt-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} color="var(--color-text-muted)" />
          <h2 className="text-heading" style={{ fontSize: 14 }}>Example CSV format</h2>
        </div>
        <pre style={{
          background: 'var(--color-surface-sunken)',
          padding: '14px 16px',
          borderRadius: 4,
          fontSize: 12.5,
          overflowX: 'auto',
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        }}>
{`date,description,amount,merchant
2026-07-01,Grocery run,-84.32,Whole Foods
2026-07-02,Paycheck,2400.00,Acme Corp
2026-07-03,Coffee,-5.75,Blue Bottle`}
        </pre>
      </div>
    </div>
  )
}
