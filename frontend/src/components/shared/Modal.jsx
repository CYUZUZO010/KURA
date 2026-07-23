import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, width = 440 }) {
  return (
    <div style={overlayStyle} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ ...modalStyle, width }}>
        <div className="flex justify-between items-center" style={{ padding: '18px 22px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-heading">{title}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: 6 }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(26, 26, 26, 0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: 20,
}

const modalStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E5E2',
  borderRadius: 4,
  maxHeight: '88vh',
  overflowY: 'auto',
}
